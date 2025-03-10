<?php

namespace App\Controller;

use Doctrine\ORM\EntityManagerInterface;
use Gesdinet\JWTRefreshTokenBundle\Model\RefreshTokenManagerInterface;
use JMS\Serializer\SerializationContext;
use JMS\Serializer\SerializerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
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
}
