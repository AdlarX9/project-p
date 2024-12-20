<?php

namespace App\MessageHandler;

use App\Message\CacheMessage;
use Symfony\Contracts\Cache\CacheInterface;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
class CacheMessageHandler
{
    private $cache;

    public function __construct(CacheInterface $cache)
    {
        $this->cache = $cache;
    }

    public function __invoke(CacheMessage $message)
    {
        // Utilisation de Redis pour ajouter un élément au cache
        $cacheItem = $this->cache->getItem($message->getKey());

        if (!$cacheItem->isHit()) {
            // Si l'élément n'existe pas dans le cache, nous l'ajoutons
            $cacheItem->set($message->getData());
            $this->cache->save($cacheItem);
        }

        // Optionnellement, retournez une réponse ou loggez l'action
    }
}