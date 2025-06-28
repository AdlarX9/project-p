<?php

namespace App\MessageHandler;

use App\Message\PaymentMessage;
use App\Repository\LoanRepository;
use App\Service\BankManager;
use Doctrine\ORM\EntityManagerInterface;
use Dom\Entity;
use Psr\Log\LoggerInterface;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\Messenger\Stamp\DelayStamp;

#[AsMessageHandler]
final class PaymentMessageHandler
{
    public function __construct(
		private BankManager $bankManager,
		private MessageBusInterface $bus,
		private LoggerInterface $logger,
		private LoanRepository $loanRepository,
		private EntityManagerInterface $entityManager
    ) {}

    public function __invoke(PaymentMessage $message): void {
		$loanId = $message->getLoanId();
		$loan = $this->loanRepository->find($loanId);

		$poor = $loan->getPoor();
		$bank = $loan->getBank();

		$repayment = $loan->getWeeklyRepayment();
		$this->bankManager->transferToBank($poor, $bank, $repayment);

		if ($loan->getWeeksLeft() > 0) {
			$this->bus->dispatch(new PaymentMessage($loanId), [new DelayStamp($loan->getInterval())]);
		} else {
			$this->entityManager->remove($loan);
			$this->entityManager->flush();
		}
    }
}
