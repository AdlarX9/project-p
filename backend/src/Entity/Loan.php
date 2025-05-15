<?php

namespace App\Entity;

use App\Repository\LoanRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: LoanRepository::class)]
class Loan
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['getBank'])]
    private ?int $id = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['getBank'])]
    private ?\DateTimeInterface $start = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['getBank'])]
    private ?\DateTimeInterface $deadline = null;

    #[ORM\Column]
    #[Groups(['getBank'])]
    private ?int $amount = null;

    #[ORM\Column]
    #[Groups(['getBank'])]
    private ?int $repaid = null;

    #[ORM\ManyToOne(inversedBy: 'loans')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['getBank'])]
    private ?User $poor = null;

    #[ORM\ManyToOne(inversedBy: 'loans')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Bank $relation = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getStart(): ?\DateTimeInterface
    {
        return $this->start;
    }

    public function setStart(\DateTimeInterface $start): static
    {
        $this->start = $start;

        return $this;
    }

    public function getDeadline(): ?\DateTimeInterface
    {
        return $this->deadline;
    }

    public function setDeadline(\DateTimeInterface $deadline): static
    {
        $this->deadline = $deadline;

        return $this;
    }

    public function getAmount(): ?int
    {
        return $this->amount;
    }

    public function setAmount(int $amount): static
    {
        $this->amount = $amount;

        return $this;
    }

    public function getRepaid(): ?int
    {
        return $this->repaid;
    }

    public function setRepaid(int $repaid): static
    {
        $this->repaid = $repaid;

        return $this;
    }

    public function getPoor(): ?User
    {
        return $this->poor;
    }

    public function setPoor(?User $poor): static
    {
        $this->poor = $poor;

        return $this;
    }

    public function getRelation(): ?Bank
    {
        return $this->relation;
    }

    public function setRelation(?Bank $relation): static
    {
        $this->relation = $relation;

        return $this;
    }
}
