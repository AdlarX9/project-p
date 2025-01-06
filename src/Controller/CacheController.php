<?php

namespace App\Controller;

use App\Message\RedisStreamMessage;
use Psr\Log\LoggerInterface;
use Redis;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Contracts\Cache\CacheInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\Routing\Annotation\Route;

#[Route("/api/queue")]
class CacheController extends AbstractController
{
    private $bus;
    private $logger;
    private $cache;
    private $redis;

    public function __construct(MessageBusInterface $bus, LoggerInterface $logger, CacheInterface $cache)
    {
        $this->bus = $bus;
        $this->logger = $logger;
        $this->cache = $cache;
        $this->redis = new Redis();
        $this->redis->connect('127.0.0.1', 6379);
    }

    #[Route("/add", "add_user_to_queue", methods: ["POST"])]
    public function addToCache(): JsonResponse
    {
        $user = $this->getUser();
        $data = [
            'connection_time' => (new \DateTime())->format('Y-m-d\TH:i:sP'),
            'money' => $user->getMoney(),
            'username' => $user->getUsername()
        ];
        $this->bus->dispatch(new RedisStreamMessage($data));
        // $process = new Process(['php', 'bin/console', 'messenger:consume', 'cache_redis', '--time-limit', '1800']);

        return new JsonResponse(['message' => 'added stream successfully'], Response::HTTP_OK, [], false);
    }



    #[Route('/pong', name: 'pong', methods: ['POST'])]
    public function pong(): JsonResponse {
        // Décoder les données JSON envoyées dans la requête
        $user = $this->getUser();

        $this->cache->delete('pong_' . $user->getUsername());
        $this->cache->get('pong_' . $user->getUsername(), function () use ($user): bool { return true; });
        return new JsonResponse(['message' => 'pang'], Response::HTTP_OK, [], false);
    }



    #[Route('/cancel_play', name: 'cancelPlay', methods: ['DELETE'])]
    public function cancelPlay(Request $request): JsonResponse {
        // Décoder les données JSON envoyées dans la requête
        $data = json_decode($request->getContent(), true);
        $user = $this->getUser();
        $this->cache->delete('pong_' . $user->getUsername());
        $this->redis->xAck('matchmaking_stream', 'matchmaking_group', [$data['messageId']]);
        $this->redis->xDel('matchmaking_stream', [$data['messageId']]);
        return new JsonResponse(['message' => 'pang'], Response::HTTP_OK, [], false);
    }
}
