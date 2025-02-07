<?php

namespace App\MessageHandler;

use App\Message\RedisStreamMessage;
use App\Repository\UserRepository;
use App\Utils\Functions;
use Psr\Log\LoggerInterface;
use Symfony\Component\Mercure\PublisherInterface;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;
use Symfony\Contracts\Cache\CacheInterface;
use Redis;
use Symfony\Contracts\Cache\ItemInterface;

#[AsMessageHandler]
final class RedisStreamMessageHandler
{
    private $cache;
    private $redis;
    private $userRepository;
    private $mercureHub;
    private $logger;

    public function __construct(CacheInterface $cacheRedis, UserRepository $userRepository, PublisherInterface $mercureHub, LoggerInterface $logger) {
        $this->redis = new Redis();
        $this->redis->connect('redis', 6379);
        $this->cache = $cacheRedis;
        $this->userRepository = $userRepository;
        $this->mercureHub = $mercureHub;
        $this->logger = $logger;
    }

    public function __invoke(RedisStreamMessage $message): void {
        // Récupérer les données du message
        $receivedData = $message->getData();
        $receivedUser = $this->userRepository->findOneBy(['username' => $receivedData['username']]);
        $matchedUser = null;

        // Lire les utilisateurs en attente dans Redis
        $waitingUsers = $this->redis->xRead(['matchmaking_stream' => '0'], null, 100);
        $this->logger->info(print_r($waitingUsers, true));

        // Vérifier si des utilisateurs sont disponibles pour une partie
        if (is_array($waitingUsers) && count($waitingUsers) > 0) {
            foreach ($waitingUsers['matchmaking_stream'] as $id => $data) {
                // Condition de matching basée sur la différence d'argent
                if (abs($data['money'] - $receivedData['money']) < 5000) {
                    $matchedUser = $this->userRepository->findOneBy(['username' => $data['username']]);
                    $matchedId = $id;
                    $this->logger->info('found matching user ' . $matchedUser->getUsername() . ' of timestamp ' . $data['connection_time']);
                    break;
                }
            }
        }

        // Si un utilisateur est matché, on le stocke dans le cache et on attend un pong de sa part
        if ($matchedUser) {
            $attempts = 0;
            $maxAttempts = 5;
            $interval = 1;
            while ($attempts < $maxAttempts) {
                $isMatchedUserThere = $this->cache->get('pong_' . $matchedUser->getUsername(), function (ItemInterface $item) use ($matchedUser, $maxAttempts, $interval): bool {
                    $item->expiresAfter($maxAttempts * $interval);
                    $this->logger->info('adding matched user to cache, send ping.');
                    Functions::sendMatchmakingUpdate($this->mercureHub, $matchedUser->getUsername(), 'ping');
                    return false;
                });

                $isReceivedUserThere = $this->cache->get('pong_' . $receivedData['username'], function (ItemInterface $item) use ($receivedData, $maxAttempts, $interval): bool {
                    $item->expiresAfter($maxAttempts * $interval);
                    $this->logger->info('adding received user to cache, send ping.');
                    Functions::sendMatchmakingUpdate($this->mercureHub, $receivedData['username'], 'ping');
                    return false;
                });

                // Si les deux utilisateurs sont là, on initie la partie
                $this->logger->info('isMatchedUserThere : ' . ($isMatchedUserThere ? 'true' : 'false') . ' | isReceivedUserThere : ' . ($isReceivedUserThere ? 'true' : 'false'));
                if ($isMatchedUserThere && $isReceivedUserThere) {
                    $this->redis->xAck('matchmaking_stream', 'matchmaking_group', [$matchedId]);
                    $this->redis->xDel('matchmaking_stream', [$matchedId]);
                    $this->logger->info('delete message ' . $matchedId . 'from redis matchmaking_stream');
                    Functions::initializeGame($receivedUser, $matchedUser, $this->mercureHub);
                    break;
                }

                $attempts++;
                sleep($interval); // Attendre 1 seconde entre chaque essai
            }
        } else {
            // Si l'utilisateur n'est pas matché, on l'ajoute à la file d'attente Redis
            $messageId = $this->redis->xAdd('matchmaking_stream', '*', $message->getData());
            Functions::sendMatchmakingUpdate($this->mercureHub, $receivedData['username'], 'in_queue', $messageId);
        }
    }
}
