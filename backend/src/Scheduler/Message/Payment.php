<?php

namespace App\Scheduler\Message;

use App\Entity\Loan;

class Payment
{
    public function __construct(private Loan $loan) {}

    public function getLoan(): Loan
    {
        return $this->loan;
    }
}
