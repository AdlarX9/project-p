<?php

namespace App\Service;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Contracts\Cache\CacheInterface;

class AdminManager{
	private User $admin;

    public function __construct(
		private CacheInterface $cache,
		private EntityManagerInterface $entityManager,
		private UserRepository $userRepository
	) {
		$this->createAdmin();
	}

	public function createAdmin(): void {
		if ($this->userRepository->getUserByUsername('admin') === null) {
			$this->admin = new User();
			$this->admin->setUsername('admin');
			$this->admin->setPassword($_ENV['ADMIN_PASSWORD']);
			$this->admin->setMoney(1_000_000);
			$this->admin->setRoles(['ROLE_ADMIN', 'ROLE_USER']);
			$this->entityManager->persist($this->admin);
			$this->entityManager->flush();
		} else {
			$this->admin = $this->userRepository->getUserByUsername('admin');
		}
	}

	public function getAdmin(): User {
		return $this->admin;
	}
}
