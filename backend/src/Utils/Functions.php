<?php

namespace App\Utils;

use App\Entity\Notification;
use App\Entity\User;
use Symfony\Component\Mercure\Update;

class Functions {
	public static function postNotification($mercurePublisher, $entityManager, $user, $title, $message, $action = '', $target = ''): void {
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
            'type' => 'notification',
            'action' => $action,
            'target' => $target
        ];
        $jsonData = json_encode($data);
        $update = new Update($_ENV['MAIN_URL'] . '/' . $user->getUsername() . '/notifications', $jsonData);
        $mercurePublisher($update);
	}

    public static function sendMatchmakingUpdate($mercurePublisher, $username, $message, $messageId = '', $role = '', $matchedUsername = ''): void {
        // $role = 'caller' ou 'receiver'

        $update = [
            'message' => $message,
            'type' => 'matchmakingUpdate',
            'messageId' => $messageId,
            'role' => $role,
            'matchedUsername' => $matchedUsername
        ];

        $jsonUpdate = json_encode($update);
        $update = new Update($_ENV['MAIN_URL'] . '/' . $username . '/matchmaking_update', $jsonUpdate);
        $mercurePublisher($update);
	}

    public static function usePeerIdCommunication($mercurePublisher, $username, $direction, $id = ''): void {
        // $direction = 'ask' ou 'send'

        $update = [
            'type' => $direction . 'Id'
        ];

        if (!empty($id)) {
            $update['id'] = $id;
        } elseif ($direction == 'send') {
            return;
        }

        $jsonUpdate = json_encode($update);
        $update = new Update($_ENV['MAIN_URL'] . '/' . $username . '/' . $direction . '_id', $jsonUpdate);
        $mercurePublisher($update);
	}

    public static function initializeGame(User $user1, User $user2, $mercurePublisher): bool {
        // Envoyer les notifications de connexions
        Functions::sendMatchmakingUpdate($mercurePublisher, $user1->getUsername(), 'connecting', '', 'caller', $user2->getUsername());
        Functions::sendMatchmakingUpdate($mercurePublisher, $user2->getUsername(), 'connecting', '', 'receiver', $user1->getUsername());

        return true;
    }

    public static function sendMessageUpdate($mercurePublisher, $user, $message, $action): void  {
        // $action = 'receive' ou 'delete'

        $data = [
            'message' => $message,
            'action' => $action,
            'type' => 'messageUpdate'
        ];

        $jsonData = json_encode($data);
        $update = new Update($_ENV['MAIN_URL'] . '/' . $user->getUsername() . '/chat' . '/' . $message['sender']['username'], $jsonData);
        $mercurePublisher($update);
	}
}
