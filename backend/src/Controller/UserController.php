<?php

namespace App\Controller;

use App\Repository\NotificationRepository;
use App\Utils\Functions;
use Doctrine\ORM\EntityManagerInterface;
use Gesdinet\JWTRefreshTokenBundle\Model\RefreshTokenManagerInterface;
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



    #[Route('/logout', name: 'logout', methods: ['DELETE'])]
    public function logout(
        RefreshTokenManagerInterface $refreshTokenManager,
        Request $request
    ): JsonResponse {
        $refreshToken = $request->toArray()['refresh_token'];

        if (!$refreshToken) {
            return new JsonResponse(['message' => 'No refresh token provided'], Response::HTTP_BAD_REQUEST);
        }

        $storedToken = $refreshTokenManager->get($refreshToken);

        if (!$storedToken || !$storedToken->isValid()) {
            return new JsonResponse(['message' => 'invalid refresh token'], Response::HTTP_NOT_FOUND);
        }

        $refreshTokenManager->delete($storedToken);

        return new JsonResponse(['message' => 'Déconnexion réussie'], Response::HTTP_NO_CONTENT);
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
