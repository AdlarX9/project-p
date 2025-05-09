<?php

namespace App\Service;

use Symfony\Contracts\Cache\CacheInterface;

class GameManager{
	private array $games = [];
	private int $timeout = 300;

    public function __construct(
		private CacheInterface $cache
	) {}
}
