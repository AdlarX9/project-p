<?php

namespace App\Repository;

use App\Entity\Bank;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Bank>
 */
class BankRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Bank::class);
    }

    public function searchByName(string $name): ?Bank
    {
        return $this->createQueryBuilder('b')
           ->andWhere('b.name = :name')
           ->setParameter('name', $name)
           ->getQuery()
           ->getOneOrNullResult()
       ;
    }

    public function searchByNamePagination(string $name, int $offset, int $limit): array {
        return $this->createQueryBuilder('b')
            ->where('LOWER(b.name) LIKE :query')
            ->setParameter('query', '%' . strtolower($name) . '%')
            ->setFirstResult($offset)
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult()
        ;
    }
}
