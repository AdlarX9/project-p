<?php

namespace App\Repository;

use App\Entity\Conversation;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Conversation>
 */
class ConversationRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Conversation::class);
    }

    public function findConversationBetweenTwoUsers(User $user1, User $user2): ?Conversation {
        return $this->createQueryBuilder('c')
            ->join('c.users', 'u')
            ->where(':user1 MEMBER OF c.users')
            ->andWhere(':user2 MEMBER OF c.users')
            ->setParameter('user1', $user1)
            ->setParameter('user2', $user2)
            ->groupBy('c.id')
            ->having('COUNT(u) = 2') // Vérifie qu'il n'y a que 2 utilisateurs
            ->getQuery()
            ->getOneOrNullResult();
    }
}
