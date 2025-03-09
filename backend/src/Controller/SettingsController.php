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
    #[Route('/get', name: 'getSettings', methods: ['GET'])]
    public function getSettings(): JsonResponse
    {
        $user = $this->getUser();
        $settings = $user->getSettings();
        return new JsonResponse($settings, Response::HTTP_OK, [], false);
    }



    #[Route('/delete/{param}', name: 'deleteSetting', methods: ['DELETE'])]
    public function deleteSetting($param, EntityManagerInterface $entityManager): JsonResponse
    {
        $user = $this->getUser();
        $settings = $user->getSettings();

        if (array_key_exists($param, $settings)) {
            unset($settings[$param]);
            $user->setSettings($settings);
            $entityManager->persist($user);
            $entityManager->flush();
            return new JsonResponse(["message" => "setting deleted successfully"], Response::HTTP_NO_CONTENT);
        } else {
            return new JsonResponse(["message" => "setting not found"], Response::HTTP_NOT_FOUND);
        }
    }



    #[Route('/edit/{param}', name: 'editSettings', methods: ['PUT'])]
    public function editSettings(string $param, Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $user = $this->getUser();
        $settings = $user->getSettings();

        $data = $request->toArray();
        $value = $data['value'];

        $settings[$param] = $value;
        $user->setSettings($settings);

        $entityManager->persist($user);
        $entityManager->flush();
        return new JsonResponse(["message" => "settings updated successfully"], Response::HTTP_OK, [], false);
    }
}
