<?php

namespace App\Service;

use App\Utils\Functions;
use App\Entity\User;
use Symfony\Component\Mercure\PublisherInterface;
use Symfony\Contracts\Cache\CacheInterface;
use Symfony\Contracts\Cache\ItemInterface;

class GameManager
{
    private int $timeout = 300;
    private string $prefix = 'game-';

    public function __construct(
        private CacheInterface $cache,
        private PublisherInterface $mercurePublisher,
        private BankManager $bankManager
    ) {}

    public function initializeGame(User $user1, User $user2): bool
    {
        // Créer la partie
        $gameId = $this->createGame($user1, $user2);

        // Envoyer les notifications de connexions
        Functions::sendMatchmakingUpdate(
            $this->mercurePublisher,
            $user1->getUsername(),
            'connecting',
            '',
            'caller',
            $user2->getUsername(),
            $gameId
        );

        Functions::sendMatchmakingUpdate(
            $this->mercurePublisher,
            $user2->getUsername(),
            'connecting',
            '',
            'receiver',
            $user1->getUsername(),
            $gameId
        );

        return true;
    }

    public function createGame(User $user1, User $user2): string
    {
        $gameId = $this->generateGameId($user1, $user2);
        $gameData = [
            'user1' => $user1->getUsername(),
            'user2' => $user2->getUsername(),
            'startTime' => time(),
        ];

        $this->cache->delete($this->prefix . $gameId); // Remove if exists for freshness
        $this->cache->get($this->prefix . $gameId, function (ItemInterface $item) use ($gameData): string {
            $item->expiresAfter($this->timeout + 30); // for safety
            $item->set(json_encode($gameData));
            return $item->get();
        });

        // Ajouter l'id à la liste des games
        $this->addGameId($gameId);

        return $gameId;
    }

    private function generateGameId(User $user1, User $user2): string
    {
        return md5($user1->getUsername() . $user2->getUsername() . time());
    }

    public function isGameExpired(string $gameId): bool
    {
        $game = $this->getGame($gameId);

        if ($game === null) {
            return true; // Game does not exist, consider it expired
        }

        $startTime = $game['startTime'];
        if ($this->timeout - (time() - $startTime) <= 0) {
            $this->expireGame($gameId);
            return true;
        }
        return false;
    }

    public function getGame(string $gameId): ?array
    {
        return json_decode($this->cache->get($this->prefix . $gameId, function () {
            return null;
        }), true);
    }

    public function getGameReceiver(string $gameId, User $user): ?string
    {
        $game = $this->getGame($gameId);
        if ($game) {
            if ($game['user1'] === $user->getUsername()) {
                return $game['user2'];
            } elseif ($game['user2'] === $user->getUsername()) {
                return $game['user1'];
            }
        }
        return null; // User is not part of the game
    }

    public function expireGame(string $gameId): void
    {
        $game = $this->getGame($gameId);
        if ($game) {
            Functions::sendMatchmakingUpdate(
                $this->mercurePublisher,
                $game['user1'],
                'nothing'
            );
            Functions::sendMatchmakingUpdate(
                $this->mercurePublisher,
                $game['user2'],
                'nothing'
            );
            $this->cache->delete($this->prefix . $gameId);
            $this->removeGameId($gameId);
        }
    }

    public function getGameIds(): array
    {
        return $this->cache->get($this->prefix . 'ids', function () {
            return [];
        });
    }

    private function addGameId(string $gameId): void
    {
        $ids = $this->getGameIds();
        $ids[] = $gameId;
        $this->cache->delete($this->prefix . 'ids');
        $this->cache->get($this->prefix . 'ids', function () use ($ids) {
            return $ids;
        });
    }

    private function removeGameId(string $gameId): void
    {
        $ids = $this->getGameIds();
        $newIds = array_filter($ids, fn($id) => $id !== $gameId);
        $this->cache->delete($this->prefix . 'ids');
        $this->cache->get($this->prefix . 'ids', function () use ($newIds) {
            return $newIds;
        });
    }
}