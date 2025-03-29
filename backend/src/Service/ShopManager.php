<?php

namespace App\Service;

use Psr\Cache\CacheItemInterface;
use Symfony\Contracts\Cache\CacheInterface;

class ShopManager{
	private array $items;

	public function __construct(
		private CacheInterface $cache
	) {
		$this->items = [];
	}

	private function getNewColor(): array {
		$hexa = '0123456789abcdef';
		$color = '';
		for ($i = 0; $i < 6; $i++) {
			$color .= $hexa[rand(0, 15)];
		}
		$rarity = rand(1, 4);
		return  [
			'type' => 'color',
			'rarity' => $rarity,
			'content' => $color
		];
	}

	public function getShop() {
		return $this->cache->get('shop', function (CacheItemInterface $item) {
			$item->expiresAfter(30);
			$this->items = [];

			for ($i = 0; $i < 6; $i++) {
				$this->items[] = $this->getNewColor();
			}

			return $this->items;
		});
	}

	public function getPrice(int $rarity): int {
		switch ($rarity) {
			case 1:
				return 400;
			case 2:
				return 800;
			case 3:
				return 1500;
			case 4:
				return 2000;
			default:
				return 1e100;
		}
	}

	public function isItem(array $searchedItem): bool {
		foreach ($this->getShop() as $item) {
			if ($item['type'] === $searchedItem['type'] && $item['content'] === $searchedItem['content']) {
				return true;
			}
		}
		return false;
	}
}
