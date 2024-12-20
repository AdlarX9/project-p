<?php

namespace App\MessageHandler;

use App\Message\RedisStreamMessage;
use App\Repository\UserRepository;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;
use Symfony\Contracts\Cache\CacheInterface;
use Redis;

#[AsMessageHandler]
final class RedisStreamMessageHandler
{
    private $cache;
    private $redis;
    private $userRepository;

    public function __construct(CacheInterface $cache, UserRepository $userRepository) {
        $this->redis = new Redis();
        $this->redis->connect('127.0.0.1', 6379);
        $this->cache = $cache;
        $this->userRepository = $userRepository;
    }

    public function __invoke(RedisStreamMessage $message): void {
        // Implémenter la logique de matchmaking
        $receivedData = $message->getData();
        $matchedUser = null;
        $waitingUsers = $this->redis->xReadGroup('matchmaking_group', '0', ['messages' => '>'], 100);
        if (is_object($waitingUsers) && isset($waitingUsers->length) && count($waitingUsers) > 0) {
            foreach ($waitingUsers as $id => $data) {
                if (abs($data['money'] - $receivedData['money']) < 5000) {
                    $matchedUser = $this->userRepository->findUserByUsername($data['username']);
                    break;
                }
            }
        }

        // Si un utilisateur est matché, on récupère les données et on les stocke dans le cache
        if ($matchedUser) {
            $userData = $this->cache->get($matchedUser->getUsername(), function () use ($matchedUser) {
                return $this->userRepository->findOneBy(['username' => $matchedUser->getUsername()])->toArray();
            });
            // Envoyer les données du cache au destinataire du message

        } else {  // Si l'utilisateur n'est pas matché, on l'ajoute à la file d'attente
            $this->redis->xAdd('messages', '*', $message->getData());
        }
    }
}
