<?php

namespace App\Entity;

use App\Repository\LoanRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation\Groups;
use Symfony\Component\Scheduler\RecurringMessage;
use Symfony\Component\Scheduler\Scheduler;
use Symfony\Component\Scheduler\Trigger\CronExpressionTrigger;
use \Symfony\Component\Scheduler\Message\CommandMessage;

#[ORM\Entity(repositoryClass: LoanRepository::class)]
class Loan
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['getBank', 'getPublicBank'])]
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
    private ?Bank $bank = null;

    #[ORM\Column]
    #[Groups(['getBank'])]
    private ?float $interestRate = null;

    public function getInterval(): int {
        return 604_800_000; // 1 week in milliseconds
    }

    public function getWeeklyRepayment(): int {
        $repayment = $this->amount * $this->interestRate / 100 / (1 - (1 + $this->interestRate / 100) ** -$this->getDuration());
        $repayment = (int) round($repayment);
        return $repayment;
    }

    public function getDuration(): int {
        $seconds = $this->deadline->getTimestamp() - $this->start->getTimestamp();
        $weeks = $seconds / (7 * 24 * 60 * 60); // 1 week = 604800 seconds
        $weeksInt = (int) round($weeks);
        return $weeksInt;
    }

    private function getWeeksLeft(): int {
        $now = new \DateTimeImmutable();
        $seconds = $this->deadline->getTimestamp() - $now->getTimestamp();
        $weeks = $seconds / (7 * 24 * 60 * 60); // 1 week = 604800 seconds
        $weeksInt = (int) round($weeks);
        return $weeksInt;
    }

    public function mustDisappear(): bool
    {
        return $this->getWeeksLeft() == 0;
    }

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

    public function getBank(): ?Bank
    {
        return $this->bank;
    }

    public function setBank(?Bank $bank): static
    {
        $this->bank = $bank;

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
