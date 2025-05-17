<?php

namespace App\Entity;

use App\Repository\BankRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: BankRepository::class)]
class Bank
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['getUser', 'getBank'])]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'banks')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $owner = null;

    #[ORM\Column]
    #[Groups(['getBank'])]
    private ?int $money = null;

    /**
     * @var Collection<int, Loan>
     */
    #[ORM\OneToMany(targetEntity: Loan::class, mappedBy: 'bank')]
    #[Groups(['getBank'])]
    private Collection $loans;

    /**
     * @var Collection<int, BankLog>
     */
    #[ORM\OneToMany(targetEntity: BankLog::class, mappedBy: 'emitter')]
    private Collection $bankLogs;

    #[ORM\Column(length: 255)]
    #[Groups(['getBank'])]
    private ?string $name = null;

    /**
     * @var Collection<int, LoanRequest>
     */
    #[ORM\OneToMany(targetEntity: LoanRequest::class, mappedBy: 'bank', orphanRemoval: true)]
    private Collection $loanRequests;

    public function __construct()
    {
        $this->loans = new ArrayCollection();
        $this->bankLogs = new ArrayCollection();
        $this->loanRequests = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getOwner(): ?User
    {
        return $this->owner;
    }

    public function setOwner(?User $owner): static
    {
        $this->owner = $owner;

        return $this;
    }

    public function getMoney(): ?int
    {
        return $this->money;
    }

    public function setMoney(int $money): static
    {
        $this->money = $money;

        return $this;
    }

    /**
     * @return Collection<int, Loan>
     */
    public function getLoans(): Collection
    {
        return $this->loans;
    }

    public function addLoan(Loan $loan): static
    {
        if (!$this->loans->contains($loan)) {
            $this->loans->add($loan);
            $loan->setBank($this);
        }

        return $this;
    }

    public function removeLoan(Loan $loan): static
    {
        if ($this->loans->removeElement($loan)) {
            // set the owning side to null (unless already changed)
            if ($loan->getBank() === $this) {
                $loan->setBank(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, BankLog>
     */
    public function getBankLogs(): Collection
    {
        return $this->bankLogs;
    }

    public function addBankLog(BankLog $bankLog): static
    {
        if (!$this->bankLogs->contains($bankLog)) {
            $this->bankLogs->add($bankLog);
            $bankLog->setEmitter($this);
        }

        return $this;
    }

    public function removeBankLog(BankLog $bankLog): static
    {
        if ($this->bankLogs->removeElement($bankLog)) {
            // set the owning side to null (unless already changed)
            if ($bankLog->getEmitter() === $this) {
                $bankLog->setEmitter(null);
            }
        }

        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    /**
     * @return Collection<int, LoanRequest>
     */
    public function getLoanRequests(): Collection
    {
        return $this->loanRequests;
    }

    public function addLoanRequest(LoanRequest $loanRequest): static
    {
        if (!$this->loanRequests->contains($loanRequest)) {
            $this->loanRequests->add($loanRequest);
            $loanRequest->setBank($this);
        }

        return $this;
    }

    public function removeLoanRequest(LoanRequest $loanRequest): static
    {
        if ($this->loanRequests->removeElement($loanRequest)) {
            // set the owning side to null (unless already changed)
            if ($loanRequest->getBank() === $this) {
                $loanRequest->setBank(null);
            }
        }

        return $this;
    }
}
