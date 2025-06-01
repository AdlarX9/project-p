<?php

namespace App\Scheduler\Handler;

use App\Scheduler\Message\Payment;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
class PaymentHandler
{
    public function __invoke(Payment $payment): void
    {
        // ... do some work to process the payment
    }
}