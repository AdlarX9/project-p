<?php

namespace App\Repository;

use App\Entity\Message;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Message>
 */
class MessageRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Message::class);
    }

       public function findById(int $id): ?Message
       {
           return $this->createQueryBuilder('m')
               ->andWhere('m.id = :id')
               ->setParameter('id', $id)
               ->getQuery()
               ->getOneOrNullResult()
           ;
       }
}
