<?php

namespace App\Entity;

use App\Enum\GenderEnum;
use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation\Groups;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Attribute\MaxDepth;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]
#[ORM\UniqueConstraint(name: 'UNIQ_IDENTIFIER_USERNAME', fields: ['username'])]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['getUser', 'getMessage', 'getPublicBank', 'getPublicProfile', 'getFriend'])]
    private ?int $id = null;

    #[ORM\Column(length: 180)]
    #[Groups(['getUser', 'getMessage', 'getPublicBank', 'getPublicProfile', 'getFriend'])]
    private ?string $username = null;

    /**
     * @var list<string> The user roles
     */
    #[ORM\Column]
    private array $roles = [];

    /**
     * @var string The hashed password
     */
    #[ORM\Column]
    private ?string $password = null;

    /**
     * @var Collection<int, self>
     */
    #[ORM\ManyToMany(targetEntity: self::class, inversedBy: 'friends')]
    #[Groups(['getUser'])]
    #[MaxDepth(1)]
    private Collection $friends;

    #[ORM\Column(type: Types::BIGINT)]
    #[Groups(['getUser', 'getPublicProfile', 'getFriend'])]
    private ?string $money = null;

    /**
     * @var Collection<int, Notification>
     */
    #[ORM\OneToMany(targetEntity: Notification::class, mappedBy: 'target', orphanRemoval: true)]
    private Collection $notifications;

    /**
     * @var Collection<int, Message>
     */
    #[ORM\OneToMany(targetEntity: Message::class, mappedBy: 'sender', orphanRemoval: true)]
    private Collection $sent_messages;

    /**
     * @var Collection<int, Conversation>
     */
    #[ORM\ManyToMany(targetEntity: Conversation::class, mappedBy: 'users')]
    private Collection $conversations;

    #[ORM\Column]
    private array $settings = [];

    #[ORM\OneToOne(mappedBy: 'owner', cascade: ['persist', 'remove'])]
    #[Groups(['getProfile', 'getPublicProfile'])]
    private ?Locker $locker = null;

    /**
     * @var Collection<int, Bank>
     */
    #[ORM\OneToMany(targetEntity: Bank::class, mappedBy: 'owner')]
    #[Groups(['getBank', 'getUser', 'getPublicProfile'])]
    private Collection $banks;

    /**
     * @var Collection<int, Loan>
     */
    #[ORM\OneToMany(targetEntity: Loan::class, mappedBy: 'poor')]
    #[Groups(['getBank'])]
    private Collection $loans;

    /**
     * @var Collection<int, LoanRequest>
     */
    #[ORM\OneToMany(targetEntity: LoanRequest::class, mappedBy: 'applicant', orphanRemoval: true)]
    private Collection $loanRequests;

    #[ORM\Column(enumType: GenderEnum::class)]
    private ?GenderEnum $gender = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['getProfile', 'getPublicProfile'])]
    private ?string $email = null;

    #[ORM\Column(type: Types::SIMPLE_ARRAY, nullable: true)]
    #[Groups(['getPublicProfile', 'getProfile'])]
    private array $links = [];

    public function __construct()
    {
        $this->friends = new ArrayCollection();
        $this->notifications = new ArrayCollection();
        $this->messages = new ArrayCollection();
        $this->sent_messages = new ArrayCollection();
        $this->conversations = new ArrayCollection();
        $this->banks = new ArrayCollection();
        $this->loans = new ArrayCollection();
        $this->loanRequests = new ArrayCollection();
    }

    public function createLocker(): void {
        if (!$this->locker) {
            $this->locker = new Locker();
            $this->locker->setOwner($this);
            $this->locker->setColor('cd2fac');
            $this->locker->setColors([['content' => 'cd2fac', 'rarity' => 1, 'type' => 'color']]);
        }
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUsername(): string {
        return $this->getUserIdentifier();
    }

    public function setUsername(string $username): static
    {
        $this->username = $username;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->username;
    }

    /**
     * @see UserInterface
     *
     * @return list<string>
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    /**
     * @param list<string> $roles
     */
    public function setRoles(array $roles): static
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials(): void
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    /**
     * @return Collection<int, self>
     */
    public function getFriends(): Collection
    {
        return $this->friends;
    }

    public function addFriend(self $friend): static
    {
        if (!$this->friends->contains($friend)) {
            $this->friends->add($friend);
        }

        return $this;
    }

    public function removeFriend(self $friend): static
    {
        $this->friends->removeElement($friend);

        return $this;
    }

    public function getMoney(): ?string
    {
        return $this->money;
    }

    public function setMoney(string $money): static
    {
        $this->money = $money;

        return $this;
    }

    /**
     * @return Collection<int, Notification>
     */
    public function getNotifications(): Collection
    {
        return $this->notifications;
    }

    public function addNotification(Notification $notification): static
    {
        if (!$this->notifications->contains($notification)) {
            $this->notifications->add($notification);
            $notification->setTarget($this);
        }

        return $this;
    }

    public function removeNotification(Notification $notification): static
    {
        if ($this->notifications->removeElement($notification)) {
            // set the owning side to null (unless already changed)
            if ($notification->getTarget() === $this) {
                $notification->setTarget(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Message>
     */
    public function getSentMessages(): Collection
    {
        return $this->sent_messages;
    }

    public function addSentMessage(Message $sentMessage): static
    {
        if (!$this->sent_messages->contains($sentMessage)) {
            $this->sent_messages->add($sentMessage);
            $sentMessage->setSender($this);
        }

        return $this;
    }

    public function removeSentMessage(Message $sentMessage): static
    {
        if ($this->sent_messages->removeElement($sentMessage)) {
            // set the owning side to null (unless already changed)
            if ($sentMessage->getSender() === $this) {
                $sentMessage->setSender(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Conversation>
     */
    public function getConversations(): Collection
    {
        return $this->conversations;
    }

    public function addConversation(Conversation $conversation): static
    {
        if (!$this->conversations->contains($conversation)) {
            $this->conversations->add($conversation);
            $conversation->addUser($this);
        }

        return $this;
    }

    public function removeConversation(Conversation $conversation): static
    {
        if ($this->conversations->removeElement($conversation)) {
            $conversation->removeUser($this);
        }

        return $this;
    }

    public function getSettings(): array
    {
        return $this->settings;
    }

    public function setSettings(array $settings): static
    {
        $this->settings = $settings;

        return $this;
    }

    public function getLocker(): ?Locker
    {
        return $this->locker;
    }

    public function setLocker(Locker $locker): static
    {
        // set the owning side of the relation if necessary
        if ($locker->getOwner() !== $this) {
            $locker->setOwner($this);
        }

        $this->locker = $locker;

        return $this;
    }

    /**
     * @return Collection<int, Bank>
     */
    public function getBanks(): Collection
    {
        return $this->banks;
    }

    public function addBank(Bank $bank): static
    {
        if (!$this->banks->contains($bank)) {
            $this->banks->add($bank);
            $bank->setOwner($this);
        }

        return $this;
    }

    public function removeBank(Bank $bank): static
    {
        if ($this->banks->removeElement($bank)) {
            // set the owning side to null (unless already changed)
            if ($bank->getOwner() === $this) {
                $bank->setOwner(null);
            }
        }

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
            $loan->setPoor($this);
        }

        return $this;
    }

    public function removeLoan(Loan $loan): static
    {
        if ($this->loans->removeElement($loan)) {
            // set the owning side to null (unless already changed)
            if ($loan->getPoor() === $this) {
                $loan->setPoor(null);
            }
        }

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
            $loanRequest->setApplicant($this);
        }

        return $this;
    }

    public function removeLoanRequest(LoanRequest $loanRequest): static
    {
        if ($this->loanRequests->removeElement($loanRequest)) {
            // set the owning side to null (unless already changed)
            if ($loanRequest->getApplicant() === $this) {
                $loanRequest->setApplicant(null);
            }
        }

        return $this;
    }

    public function getGender(): ?GenderEnum
    {
        return $this->gender;
    }

    public function getGenderValue(): ?string {
        return $this->gender->getGender();
    }

    public function setGender(GenderEnum $gender): static
    {
        $this->gender = $gender;

        return $this;
    }
    public function setGenderValue(string $gender): static
    {
        $this->gender = GenderEnum::fromValue($gender);

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(?string $email): static
    {
        $this->email = $email;

        return $this;
    }

    public function getLinks(): array
    {
        return $this->links;
    }

    public function setLinks(array $links): static
    {
        $this->links = $links;

        return $this;
    }
}
