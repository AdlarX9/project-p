<?php

namespace App\Command;

use App\Repository\LoanRepository;
use App\Service\BankManager;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

#[AsCommand(
    name: 'app:loan:repay',
    description: "Remboursement d'un prêt"
)]
class RepayLoanCommand extends Command
{
    public function __construct(
        private LoanRepository $loanRepository,
        private BankManager $bankManager,
		private EntityManagerInterface $entityManager
    ) {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this->addArgument('loanId', InputArgument::REQUIRED, 'the loan ID');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $loanId = $input->getArgument('loanId');
        $loan = $this->loanRepository->find($loanId);

        if (!$loan) {
            $output->writeln("Loan not found");
            return Command::FAILURE;
        }

        $amount = $loan->repay();
        $this->bankManager->transferToBank($loan->getPoor(), $loan->getBank(), $amount);

		if ($loan->mustDisappear()) {
			$this->entityManager->remove($loan);
			$this->entityManager->flush();
		}

        $output->writeln("Repayment of {$amount}€ for loan #{$loan->getId()} completed.");
        return Command::SUCCESS;
    }
}
