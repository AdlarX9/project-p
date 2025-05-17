<?php

namespace App\Entity;

use App\Repository\LoanRequestRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: LoanRequestRepository::class)]
class LoanRequest
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['getBank'])]
    private ?int $id = null;

    #[ORM\Column(length: 1024)]
    #[Groups(['getBank'])]
    private ?string $request = null;

    #[ORM\ManyToOne(inversedBy: 'loanRequests')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Bank $bank = null;

    #[ORM\ManyToOne(inversedBy: 'loanRequests')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['getBank'])]
    private ?User $applicant = null;

    #[ORM\Column(type: Types::TIME_MUTABLE)]
    #[Groups(['getBank'])]
    private ?\DateTimeInterface $duration = null;

    #[ORM\Column]
    #[Groups(['getBank'])]
    private ?int $amount = null;

    #[ORM\Column]
    private ?float $interestRate = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getRequest(): ?string
    {
        return $this->request;
    }

    public function setRequest(string $request): static
    {
        $this->request = $request;

        return $this;
    }

    public function getBank(): ?Bank
    {
        return $this->bank;
    }

    public function setBank(?Bank $bank): static
    {
        $this->bank = $bank;

        return $this;
    }

    public function getApplicant(): ?User
    {
        return $this->applicant;
    }

    public function setApplicant(?User $applicant): static
    {
        $this->applicant = $applicant;

        return $this;
    }

    public function getDuration(): ?\DateTimeInterface
    {
        return $this->duration;
    }

    public function setDuration(\DateTimeInterface $duration): static
    {
        $this->duration = $duration;

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

    public function getInterestRate(): ?float
    {
        return $this->interestRate;
    }

    public function setInterestRate(float $interestRate): static
    {
        $this->interestRate = $interestRate;

        return $this;
    }
}
