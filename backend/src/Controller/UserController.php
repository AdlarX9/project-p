<?php

namespace App\Controller;

use App\Repository\NotificationRepository;
use App\Repository\UserRepository;
use App\Utils\Functions;
use Doctrine\ORM\EntityManagerInterface;
use JMS\Serializer\SerializationContext;
use JMS\Serializer\SerializerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mercure\PublisherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/user')]
#[IsGranted('ROLE_USER', message: 'You are not authorized to access this feature.')]
class UserController extends AbstractController
{
    #[Route('/me', name: 'get_one_user', methods: ['GET'])]
    public function getOneUser(SerializerInterface $serializer): JsonResponse {
        $user = $this->getUser();
        $context = SerializationContext::create()->setGroups(['getUser']);
        $jsonUser = $serializer->serialize($user, 'json', $context);
        return new JsonResponse($jsonUser, Response::HTTP_OK, [], true);
    }



    #[Route('/me', name: 'delete_one_user', methods: ['DELETE'])]
    public function deleteOneUser(EntityManagerInterface $entityManager): JsonResponse {
        $user = $this->getUser();
        $entityManager->remove($user);
        $entityManager->flush();
        return new JsonResponse(['message' => 'Utilisateur supprimé avec succès!'], Response::HTTP_NO_CONTENT);
    }



    #[Route('/percentage', name: 'get_percentage', methods: ['GET'])]
    public function getPercentage(UserRepository $userRepository): JsonResponse {
        $user = $this->getUser();
        if (!$user) {
            return new JsonResponse(['error' => 'User not authenticated'], Response::HTTP_UNAUTHORIZED);
        }
        $userMoney = $user->getMoney();
        $totalUsers = $userRepository->count([]);

        $usersWithLessMoney = $userRepository->createQueryBuilder('u')
            ->select('COUNT(u.id)')
            ->where('u.money < :userMoney')
            ->setParameter('userMoney', $userMoney)
            ->getQuery()
            ->getSingleScalarResult();

        if ($totalUsers > 0) {
            $percentage = ($usersWithLessMoney / ($totalUsers - 1)) * 100;
        } else {
            $percentage = 0;
        }

        // Retourne le pourcentage en JSON
        return new JsonResponse([
            'percentage' => $percentage
        ], Response::HTTP_OK);
    }



    #[Route('/transfer', name: 'transfer', methods: ['PATCH'])]
    public function transfer(
        Request $request,
        UserRepository $userRepository,
        EntityManagerInterface $entityManager,
        SerializerInterface $serializer,
        PublisherInterface $publisher
    ): JsonResponse {
        $user = $this->getUser();

        $data = json_decode($request->getContent(), true);

        if (!isset($data['idFriend'], $data['amount'])) {
            return new JsonResponse(['error' => 'Invalid request data'], 400);
        }

        $idFriend = $data['idFriend'];
        $amount = (float) $data['amount'];

        if ($amount <= 0) {
            return new JsonResponse(['error' => 'Amount must be greater than zero'], 400);
        }

        $friend = $userRepository->find($idFriend);
        if (!$friend) {
            return new JsonResponse(['error' => 'Friend not found'], 404);
        }

        if ($user->getMoney() < $amount) {
            return new JsonResponse(['error' => 'Insufficient funds'], 400);
        }

        $user->setMoney($user->getMoney() - $amount);
        $friend->setMoney($friend->getMoney() + $amount);
        
        $context = SerializationContext::create()->setGroups(['getUser']);
        $jsonUser = $serializer->serialize($user, 'json', $context);

        $entityManager->persist($user);
        $entityManager->persist($friend);
        $entityManager->flush();
        Functions::postNotification($publisher, $entityManager, $user, 'transfer', "You transfered \${$amount} to {$friend->getUsername()}");
        Functions::postNotification($publisher, $entityManager, $friend, $user->getUsername(), "You received \${$amount} from {$friend->getUsername()}");
        return new JsonResponse($jsonUser, 200, [], true);
    }



    #[Route('/getNotifications', name: 'getNotifications', methods: ['GET'])]
    public function getNotifications(NotificationRepository $notificationRepository, SerializerInterface $serializer): JsonResponse {
        $user = $this->getUser();
        $notificationsList = $notificationRepository->findByUser($user);
        $context = SerializationContext::create()->setGroups(["getNotification"]);
        $notificationsListSerialized = $serializer->serialize($notificationsList, 'json', $context);
        return new JsonResponse($notificationsListSerialized, Response::HTTP_OK, [], true);
    }



    #[Route('/deleteNotification/{id}', name: 'deleteNotification', methods: ['DELETE'])]
    public function deleteNotification(
        int $id,
        NotificationRepository $notificationRepository,
        EntityManagerInterface $entityManager,
        LoggerInterface $logger
    ): JsonResponse {
        // Rechercher la notification par ID
        $notification = $notificationRepository->find($id);

        // Vérifier si la notification existe
        if (!$notification) {
            $logger->info("Notification with ID $id not found.");
            return new JsonResponse(['error' => 'Notification not found'], Response::HTTP_NOT_FOUND);
        }

        // Log de l'ID de la notification trouvée
        $logger->info("Deleting notification with ID: " . $notification->getId());

        // Vérifier si l'utilisateur est autorisé à supprimer cette notification
        $user = $this->getUser();
        if ($notification->getTarget() !== $user) {
            return new JsonResponse(['error' => 'You are not authorized to delete this notification'], Response::HTTP_FORBIDDEN);
        }

        // Suppression de la notification
        $entityManager->remove($notification);
        $entityManager->flush();

        // Retourner une réponse avec l'ID supprimé et code HTTP_OK
        return new JsonResponse(['id' => $id], Response::HTTP_OK);
    }



    #[Route('/emptyNotifications', name: 'emptyNotifications', methods: ['DELETE'])]
    public function emptyNotifications(NotificationRepository $notificationRepository, EntityManagerInterface $entityManager): JsonResponse {
        // Récupérer toutes les notifications de l'utilisateur
        $user = $this->getUser();
        $notificationsList = $notificationRepository->findByUser($user);

        // Vérifier si il y a des notifications
        if (empty($notificationsList)) {
            return new JsonResponse(['message' => 'No notifications found'], Response::HTTP_NO_CONTENT);
        }

        // Supprimer toutes les notifications
        foreach ($notificationsList as $notification) {
            $entityManager->remove($notification);
        }

        // Enregistrer les modifications et retourner une réponse avec un message et code HTTP_NO_CONTENT
        $entityManager->flush();
        return new JsonResponse(['message' => 'All notifications deleted'], Response::HTTP_NO_CONTENT);
    }



    #[Route('/peer/ask_id', name: 'peerAskId', methods: ['POST'])]
    public function peerAskId(Request $request, PublisherInterface $publisher): JsonResponse {
        $data = json_decode($request->getContent(), true);
        Functions::usePeerIdCommunication($publisher, $data['peerUsername'], 'ask');
        return new JsonResponse(['message' => 'Peer asked successfully!'], Response::HTTP_NO_CONTENT);
    }


    #[Route('/peer/send_id', name: 'peerSendId', methods: ['POST'])]
    public function peerSendId(Request $request, PublisherInterface $publisher): JsonResponse {
        $data = json_decode($request->getContent(), true);
        Functions::usePeerIdCommunication($publisher, $data['peerUsername'], 'send', $data['id']);
        return new JsonResponse(['message' => 'PeerId sent successfully!'], Response::HTTP_NO_CONTENT);
    }


    #[Route('/peer/switch_chat', name: 'switchChat', methods: ['POST'])]
    public function switchChat(Request $request, PublisherInterface $publisher): JsonResponse {
        $data = json_decode($request->getContent(), true);
        Functions::sendMatchmakingUpdate($publisher, $data['peerUsername'], 'send', $data['id']);
        return new JsonResponse(['message' => 'PeerId sent successfully!'], Response::HTTP_NO_CONTENT);
    }
}
