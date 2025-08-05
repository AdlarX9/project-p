<?php

namespace App\Controller;

use App\Enum\GenderEnum;
use Doctrine\ORM\EntityManagerInterface;
use JMS\Serializer\SerializationContext;
use JMS\Serializer\SerializerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
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

        $profile = json_decode($jsonProfile, true);
        $profile['gender'] = $user->getGenderValue();
        $jsonProfile = json_encode($profile);

        return new JsonResponse($jsonProfile, Response::HTTP_OK, [], true);
    }



    #[Route('/set_color', name: 'setColor', methods: ['PUT'])]
    public function setColor(EntityManagerInterface $entityManager, Request $request): JsonResponse {
        $user = $this->getUser();
        $content = $request->toArray();
        $color = $content['color'];

        $user->createLocker();
        $locker = $user->getLocker();

        $jsonResponse = null;
        if (!$locker->hasColorContent($color)) {
            $jsonResponse = new JsonResponse(["message" => "Color not owned"], Response::HTTP_FORBIDDEN, [], false);
        } else {
            $locker->setColor($color);
            $jsonResponse = new JsonResponse([], Response::HTTP_NO_CONTENT, [], false);
        }

        $entityManager->persist($user);
        $entityManager->persist($locker);
        $entityManager->flush();

        return $jsonResponse;
    }



    #[Route('/set_links', name: 'setLinks', methods: ['PUT'])]
    public function setLinks(EntityManagerInterface $entityManager, Request $request): JsonResponse {
        $user = $this->getUser();
        $content = $request->toArray();
        $links = $content['links'];

        $user->setLinks($links);
        $entityManager->persist($user);
        $entityManager->flush();

        return new JsonResponse([], Response::HTTP_NO_CONTENT);
    }



    #[Route('/set_gender_email', name: 'setGenderEmail', methods: ['PUT'])]
    public function setGenderEmail(EntityManagerInterface $entityManager, Request $request): JsonResponse {
        $user = $this->getUser();
        $content = $request->toArray();
        $gender = $content['gender'];
        $email = $content['email'];

        $user->setGender(GenderEnum::fromValue($gender));
        $user->setEmail($email);
        $entityManager->persist($user);
        $entityManager->flush();

        return new JsonResponse([], Response::HTTP_NO_CONTENT);
    }
}
