<?php

namespace App\Controller;

use JMS\Serializer\SerializationContext;
use JMS\Serializer\SerializerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/profile')]
final class ProfileController extends AbstractController
{
    #[Route('/get', name: 'getProfile', methods: ['GET'])]
    public function getProfile(SerializerInterface $serializer): JsonResponse {
        $user = $this->getUser();

        $context = SerializationContext::create()->setGroups(['getProfile']);

        $jsonProfile = $serializer->serialize($user, 'json', $context);
        return new JsonResponse($jsonProfile, Response::HTTP_OK, [], true);
    }
}
