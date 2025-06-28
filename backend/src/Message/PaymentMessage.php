<?php

namespace App\Message;

final class PaymentMessage
{
    public function __construct(private readonly int $loanId) {}

    public function getLoanId(): int {
        return $this->loanId;
    }
}
