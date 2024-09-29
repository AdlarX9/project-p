<?php

namespace App\Controller;

use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use JMS\Serializer\SerializationContext;
use JMS\Serializer\SerializerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/friends')]
class FriendsController extends AbstractController
{
	#[Route('/search', name: 'search_for_friends', methods: ['GET'])]
	public function search_for_friends(SerializerInterface $serializer, Request $request, UserRepository $userRepository) : JsonResponse {
		$searchTerm = $request->query->get('username', '');
		$page = $request->query->getInt('page', 1);
		$limit = $request->query->getInt('limit', 3);

		$friendsList = $userRepository->searchUsersByUsername($searchTerm, $page, $limit);

		$context = SerializationContext::create()->setGroups(["getFriend"]);
		$friendsListSerialized = $serializer->serialize($friendsList, 'json', $context);

		return new JsonResponse($friendsListSerialized, Response::HTTP_OK, [], true);
	}


	#[Route('/add', name: 'add_friend', methods: ['POST'])]
	public function add_friend(
			UserRepository $userRepository,
			Request $request,
			EntityManagerInterface $entityManager,
			SerializerInterface $serializer
		): JsonResponse {

		$me = $this->getUser();
		$content = $request->toArray();
		$idFriend = $content['idFriend'];
		
		$newFriend = $userRepository->find($idFriend);
		if (!$newFriend) {
			return new JsonResponse(['status' => 'Friend not found'], Response::HTTP_NOT_FOUND);
		}

		$me->addFriend($newFriend);
		$newFriend->addFriend($me);
		$entityManager->persist($me);
		$entityManager->persist($newFriend);
		$entityManager->flush();

		$context = SerializationContext::create()->setGroups(['getFriend']);
		$jsonFriend = $serializer->serialize($newFriend, 'json', $context);

		return new JsonResponse($jsonFriend, Response::HTTP_OK, [], true);
	}

	#[Route('/remove', name: 'remove_friend', methods: ['DELETE'])]
	public function remove_friend(UserRepository $userRepository, Request $request, EntityManagerInterface $entityManager, SerializerInterface $serializer): JsonResponse {
		$me = $this->getUser();
		$content = $request->toArray();
		$idFriend = $content['idFriend'];

		$friend = $userRepository->find($idFriend);
		if (!$friend) {
			return new JsonResponse(['status' => 'Friend not found'], Response::HTTP_NOT_FOUND);
		}

		$context = SerializationContext::create()->setGroups(['getUser']);
		$jsonFriend = $serializer->serialize($friend, 'json', $context);

		$me->removeFriend($friend);
		$friend->removeFriend($me);
		$entityManager->persist($me);
		$entityManager->persist($friend);
		$entityManager->flush();

		return new JsonResponse($jsonFriend, Response::HTTP_OK, [], true);
	}
}
