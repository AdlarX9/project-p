<?php

namespace App\Scheduler;

use App\Scheduler\Message\Payment;
use Symfony\Component\Scheduler\Attribute\AsSchedule;
use Symfony\Component\Scheduler\RecurringMessage;
use Symfony\Component\Scheduler\Schedule;
use Symfony\Component\Scheduler\ScheduleProviderInterface;

#[AsSchedule]
class PaymentProvider implements ScheduleProviderInterface
{
	private ?Schedule $schedule = null;

    public function getSchedule(): Schedule
    {
        $from = new \DateTimeImmutable('2023-01-01 13:47', new \DateTimeZone('Europe/Paris'));
		$until = '2023-06-12';

		return $this->schedule ??= (new Schedule())
			->with(RecurringMessage::every('first Monday of next month', new Payment(), $from, $until));
	}
}