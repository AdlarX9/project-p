<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Gesdinet\JWTRefreshTokenBundle\Model\RefreshTokenManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/public')]
class PublicController extends AbstractController
{
    private RefreshTokenManagerInterface $refreshTokenManager;
    private JWTTokenManagerInterface $jwtManager;
    private UserProviderInterface $userProvider;

    public function __construct(
        RefreshTokenManagerInterface $refreshTokenManager,
        JWTTokenManagerInterface $jwtManager,
        UserProviderInterface $userProvider
    ) {
        $this->refreshTokenManager = $refreshTokenManager;
        $this->jwtManager = $jwtManager;
        $this->userProvider = $userProvider;
    }
    
    #[Route('/signup', name: 'create_user', methods: ['POST'])]
    public function createUser(
        Request $request,
        EntityManagerInterface $entityManager, 
        UserPasswordHasherInterface $passwordHasher, 
        ValidatorInterface $validator,
        JWTTokenManagerInterface $JWTManager
    ): JsonResponse {
        // Obtenir les données JSON envoyées dans la requête
        $data = json_decode($request->getContent(), true);

        // Créer un nouvel utilisateur
        $user = new User();
        $user->setUsername($data['username'] ?? null);

        // Hachage du mot de passe
        $hashedPassword = $passwordHasher->hashPassword($user, $data['password']);
        $user->setPassword($hashedPassword);

        $user->setMoney("999");
        $user->setSettings([]);

        // Valider l'utilisateur
        $errors = $validator->validate($user);
        if (count($errors) > 0) {
            $errorsString = (string) $errors;
            return new JsonResponse(['error' => $errorsString], Response::HTTP_BAD_REQUEST);
        }

        // Persister et enregistrer l'utilisateur en base de données
        $entityManager->persist($user);
        $entityManager->flush();

        // Générer le token JWT pour l'utilisateur nouvellement créé
        $token = $JWTManager->create($user);

        // Retourner le token JWT avec un message de succès
        return new JsonResponse([
            'message' => 'Utilisateur créé avec succès!',
            'token' => $token
        ], Response::HTTP_CREATED);
    }



    public function refresh(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $refreshToken = $data['refresh_token'] ?? null;

        if (!$refreshToken) {
            return new JsonResponse(['message' => 'Refresh token missing'], Response::HTTP_BAD_REQUEST);
        }

        // Récupération du refresh token dans la base
        $refreshTokenEntity = $this->refreshTokenManager->get($refreshToken);

        if (!$refreshTokenEntity || !$refreshTokenEntity->isValid()) {
            return new JsonResponse(['message' => 'Invalid or expired refresh token'], Response::HTTP_UNAUTHORIZED);
        }

        // Récupération de l'utilisateur via son username
        $username = $refreshTokenEntity->getUsername();
        $user = $this->userProvider->loadUserByIdentifier($username);

        if (!$user instanceof UserInterface) {
            return new JsonResponse(['message' => 'User not found'], Response::HTTP_UNAUTHORIZED);
        }

        // Génération du nouveau token JWT
        $newJwtToken = $this->jwtManager->create($user);

        return new JsonResponse([
            'token' => $newJwtToken
        ]);
    }
}
