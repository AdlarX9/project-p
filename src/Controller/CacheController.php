<?php

namespace App\Controller;

use App\Message\RedisStreamMessage;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\Process\Process;
use Symfony\Component\Routing\Annotation\Route;

#[Route("/api/queue")]
class CacheController extends AbstractController
{
    private $bus;
    private $logger;

    public function __construct(MessageBusInterface $bus, LoggerInterface $logger)
    {
        $this->bus = $bus;
        $this->logger = $logger;
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
}