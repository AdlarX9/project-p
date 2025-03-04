<?php

namespace App\Controller;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/settings')]
final class SettingsController extends AbstractController
{
    #[Route('/edit/:param', name: 'editSettings', methods: ['PUT'])]
    public function editSettings(string $param, Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $user = $this->getUser();
        $settings = $user->getSettings();
        $value = $request->toArray()['value'];
        $settings[$param] = $value;
        $user->setSettings($settings);
        $entityManager->persist($user);
        $entityManager->flush();
        return new JsonResponse([], Response::HTTP_NO_CONTENT, [], true);
    }
}
