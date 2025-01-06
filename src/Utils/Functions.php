<?php

namespace App\Utils;

use App\Entity\Notification;
use App\Entity\User;
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
            'id' => $notification->getId(),
            'type' => 'notification'
        ];
        $jsonData = json_encode($data);
        $update = new Update("http://localhost:3000/" . $user->getUsername() . '/notifications', $jsonData);
        $publisher($update);
	}

    public static function sendMatchmakingUpdate($mercureHub, $username, $message, $messageId = ''): void {
        $update = [
            'message' => $message,
            'type' => 'matchmakingUpdate',
            'messageId' => $messageId
        ];
        $jsonUpdate = json_encode($update);
        $update = new Update("http://localhost:3000/" . $username . '/matchmaking_update', $jsonUpdate);
        $mercureHub($update);
	}

    public static function initializeGame(User $user1, User $user2, $mercureHub): bool {
        // Envoyer les notifications de connexions
        Functions::sendMatchmakingUpdate($mercureHub, $user1->getUsername(), 'connecting');
        Functions::sendMatchmakingUpdate($mercureHub, $user2->getUsername(), 'connecting');

        // Créer une partie, les envoyer dedans, initialiser les connexions webrtc, signaler tout le bordel, etc...
        // je sais pas comment faire

        return true;
    }
}
