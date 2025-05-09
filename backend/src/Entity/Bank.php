<?php

namespace App\Entity;

use App\Repository\BankRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: BankRepository::class)]
class Bank
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'banks')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $owner = null;

    #[ORM\Column]
    private ?int $money = null;

    /**
     * @var Collection<int, Loan>
     */
    #[ORM\OneToMany(targetEntity: Loan::class, mappedBy: 'relation')]
    private Collection $loans;

    /**
     * @var Collection<int, BankLog>
     */
    #[ORM\OneToMany(targetEntity: BankLog::class, mappedBy: 'emitter')]
    private Collection $bankLogs;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    public function __construct()
    {
        $this->loans = new ArrayCollection();
        $this->bankLogs = new ArrayCollection();
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
            $loan->setRelation($this);
        }

        return $this;
    }

    public function removeLoan(Loan $loan): static
    {
        if ($this->loans->removeElement($loan)) {
            // set the owning side to null (unless already changed)
            if ($loan->getRelation() === $this) {
                $loan->setRelation(null);
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
}
