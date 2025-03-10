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

	public function isItem(string $item): bool {
        return in_array($item, $this->getShop());
    }
}
