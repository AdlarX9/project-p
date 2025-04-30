<?php

namespace App\Controller;

use App\Entity\Locker;
use App\Service\ShopManager;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
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



    #[Route('/buy_item', name: 'buyItem', methods: ['POST'])]
    public function buyItem(ShopManager $shopManager, Request $request, EntityManagerInterface $entityManager): JsonResponse {
        $user = $this->getUser();
        $item = $request->toArray();

        if (!$shopManager->isItem($item)) {
            return new JsonResponse(['error' => 'Item not found in the shop'], Response::HTTP_NOT_FOUND, [], false);
        }

        if ($user->getMoney() < $shopManager->getPrice($item['rarity'])) {
            return new JsonResponse(['error' => 'Not enough money'], Response::HTTP_FORBIDDEN, [], false);
        }

        $user->createLocker();
        $locker = $user->getLocker();

        if (!$user->getLocker()->hasItem($item)) {
            $user->setMoney($user->getMoney() - $shopManager->getPrice($item['rarity']));
            $colors = $user->getLocker()->getColors();
            $colors[] = $item;
            $user->getLocker()->setColors($colors);
        }

        $entityManager->persist($user);
        $entityManager->persist($locker);
        $entityManager->flush();

        return new JsonResponse($item, Response::HTTP_OK, [], false);
    }
}
