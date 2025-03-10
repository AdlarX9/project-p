<?php

namespace App\Controller;

use App\Service\ShopManager;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/shop')]
final class ShopController extends AbstractController
{
    #[Route('/get_shop', name: 'getShop', methods: ['GET'])]
    public function getShop(ShopManager $shopManager): JsonResponse {
        $items = $shopManager->getShop();
        return new JsonResponse($items, Response::HTTP_OK, [], false);
    }



    #[Route('/buy/{item}', name: 'buyItem', methods: ['POST'])]
    public function buyItem(string $item, ShopManager $shopManager): JsonResponse {
        $user = $this->getUser();

        if (!$shopManager->isItem($item)) {
            return new JsonResponse(['error' => 'Item not found in the shop'], Response::HTTP_NOT_FOUND, [], false);
        }

        return new JsonResponse(['status' => 'Item bought'], Response::HTTP_OK, [], false);
    }
}
