<?php

namespace App\Service;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Contracts\Cache\CacheInterface;

class BankManager{
	private int $money = 0;

    public function __construct(
		private CacheInterface $cache,
		private EntityManagerInterface $entityManager
	) {}

	public function transfer(User $sender, User $receiver, int $amount): bool {
		if ($sender->getMoney() < $amount) {
			return false;
		}

		$sender->setMoney($sender->getMoney() - $amount);
		$receiver->setMoney($receiver->getMoney() + $amount);

		$this->entityManager->persist($sender);
		$this->entityManager->persist($receiver);
		$this->entityManager->flush();

		return true;
	}

	public function getMoney(): int {
		return $this->money;
	}
}
