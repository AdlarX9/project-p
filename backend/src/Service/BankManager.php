<?php

namespace App\Service;

use App\Entity\Bank;
use App\Entity\User;
use App\Repository\BankRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Contracts\Cache\CacheInterface;

class BankManager{
	private Bank $centralBank;

    public function __construct(
		private CacheInterface $cache,
		private EntityManagerInterface $entityManager,
		private BankRepository $bankRepository,
		private AdminManager $adminManager
	) {
		$this->createCentralBank();
	}

	private function createCentralBank(): void {
		if ($this->bankRepository->searchByName('Central Bank') === null) {
			$this->centralBank = new Bank();
			$this->centralBank->setMoney(0);
			$this->centralBank->setName('Central Bank');
			$this->adminManager->getAdmin()->addBank($this->centralBank);
			$this->entityManager->persist($this->centralBank);
			$this->entityManager->persist($this->adminManager->getAdmin());
			$this->entityManager->flush();
		} else {
			$this->centralBank = $this->bankRepository->searchByName('Central Bank');
		}
	}

	public function getCentralBank(): Bank {
		return $this->centralBank;
	}

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
}
