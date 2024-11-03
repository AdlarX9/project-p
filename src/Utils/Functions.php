<?php

namespace App\Utils;

use App\Entity\Notification;
use Symfony\Component\Mercure\Update;

class Functions {
	public static function postNotification($publisher, $entityManager, $user, $title, $message): void {
        $currentDateTime = new \DateTime();

        $notification = new Notification();
        $notification->setTarget($user);
        $notification->setTitle($title);
        $notification->setMessage($message);
        $notification->setTimestamp($currentDateTime);
        $entityManager->persist($notification);
		$entityManager->flush();

        $dateString = $currentDateTime->format('Y-m-d\TH:i:sP');
        $data = [
            'message' => $message,
            'title' => $title,
            'timestamp' => $dateString,
            'id' => $notification->getId()
        ];
        $jsonData = json_encode($data);
        $update = new Update("http://localhost:3000/" . $user->getUsername(), $jsonData);
        $publisher($update);
	}
}