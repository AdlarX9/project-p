<?php

namespace App\Controller;

use App\Entity\Conversation;
use App\Entity\Message;
use App\Repository\ConversationRepository;
use App\Repository\MessageRepository;
use App\Repository\UserRepository;
use App\Utils\Functions;
use Doctrine\ORM\EntityManagerInterface;
use JMS\Serializer\SerializationContext;
use JMS\Serializer\SerializerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mercure\PublisherInterface;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/friends')]
class FriendsController extends AbstractController
{
	#[Route('/search', name: 'search_for_friends', methods: ['GET'])]
	public function searchForFriends(SerializerInterface $serializer, Request $request, UserRepository $userRepository) : JsonResponse {
		$searchTerm = $request->query->get('username', '');
		$page = $request->query->getInt('page', 1);
		$limit = $request->query->getInt('limit', 3);

		$friendsList = $userRepository->searchUsersByUsername($searchTerm, $page, $limit);

		$context = SerializationContext::create()->setGroups(["getFriend"]);
		$friendsListSerialized = $serializer->serialize($friendsList, 'json', $context);

		return new JsonResponse($friendsListSerialized, Response::HTTP_OK, [], true);
	}


	#[Route('/add', name: 'add_friend', methods: ['POST'])]
	public function addFriend(
			UserRepository $userRepository,
			ConversationRepository $conversationRepository,
			Request $request,
			EntityManagerInterface $entityManager,
			SerializerInterface $serializer,
			PublisherInterface $publisher
		): JsonResponse {

		$me = $this->getUser();
		$content = $request->toArray();
		$idFriend = $content['idFriend'];

		$newFriend = $userRepository->find($idFriend);
		if (!$newFriend) {
			return new JsonResponse(['status' => 'Friend not found'], Response::HTTP_NOT_FOUND);
		}

		// Ajouter un lien d'amitié entre les deux utilisateurs
		$me->addFriend($newFriend);
		$newFriend->addFriend($me);
		$entityManager->persist($me);
		$entityManager->persist($newFriend);

		// Créer une nouvelle discussion
		if ($conversationRepository->findConversationBetweenTwoUsers($me, $newFriend) == null) {
			$conversation = new Conversation();
			$conversation->addUser($me);
			$conversation->addUser($newFriend);
			$entityManager->persist($conversation);
		}

		$entityManager->flush();

		$context = SerializationContext::create()->setGroups(['getFriend']);
		$jsonFriend = $serializer->serialize($newFriend, 'json', $context);

		Functions::postNotification($publisher, $entityManager, $me, 'friends', "You added {$newFriend->getUsername()} as a friend");
		Functions::postNotification($publisher, $entityManager, $newFriend, 'friends', "{$me->getUsername()} added you as a friend", 'addFriend', $newFriend->getUsername());
		return new JsonResponse($jsonFriend, Response::HTTP_OK, [], true);
	}


	#[Route('/remove', name: 'remove_friend', methods: ['DELETE'])]
	public function removeFriend(
		UserRepository $userRepository,
		Request $request,
		EntityManagerInterface $entityManager,
		SerializerInterface $serializer,
		PublisherInterface $publisher
	): JsonResponse {

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

		Functions::postNotification($publisher, $entityManager, $me, 'friends', "You removed {$friend->getUsername()} from your friends");
		Functions::postNotification($publisher, $entityManager, $friend, 'friends', "{$me->getUsername()} removed you from his friends", 'removeFriend', $friend->getId());
		return new JsonResponse($jsonFriend, Response::HTTP_OK, [], true);
	}


	#[Route('/get/{friendUsername}', name: 'get_friend_data', methods: ['GET'])]
	public function getFriendData(
		UserRepository $userRepository,
		SerializerInterface $serializer,
		$friendUsername
	): JsonResponse {
		$friend = $userRepository->getUserByUsername($friendUsername);
		$context = SerializationContext::create()->setGroups(['getFriend']);
		$jsonUser = $serializer->serialize($friend, 'json', $context);
		return new JsonResponse($jsonUser, Response::HTTP_OK, [], true);
	}


	#[Route('/send_message/{friendUsername}', name: 'send_message', methods: ['POST'])]
	public function sendMessage(
		UserRepository $userRepository,
		ConversationRepository $conversationRepository,
		Request $request,
		EntityManagerInterface $entityManager,
		PublisherInterface $publisher,
		SerializerInterface $serializer,
		$friendUsername
	): JsonResponse {
		$me = $this->getUser();
		$messageContent = $request->toArray()['message'];
		$friend = $userRepository->getUserByUsername($friendUsername);

		if (!$friend) {
			return new JsonResponse(['status' => 'Friend not found'], Response::HTTP_NOT_FOUND);
		}

		// Créer le nouveau message
		$conversation = $conversationRepository->findConversationBetweenTwoUsers($me, $friend);
		$newMessage = new Message();
		$newMessage->setSender($me);
		$newMessage->setConversation($conversation);
		$newMessage->setContent($messageContent);
		$newMessage->setTimestamp(new \DateTime('now', new \DateTimeZone('UTC')));
		$newMessage->setSeen(false);

		// Enregistrer le message dans la base de donnée
		$entityManager->persist($newMessage);
		$entityManager->flush();

		$context = SerializationContext::create()->setGroups(['getMessage']);
		$jsonMessage = $serializer->serialize($newMessage, 'json', $context);

		// Communiquer avec le frontend
		Functions::postNotification($publisher, $entityManager, $friend, $me->getUsername(), $messageContent, 'receiveMessage', [$me->getUsername()]);
		Functions::sendMessageUpdate($publisher, $friend, json_decode($jsonMessage, true), 'receive');
		return new JsonResponse($jsonMessage, Response::HTTP_OK, [], true);
	}


	#[Route('/delete_message/{messageId}', name: 'delete_message', methods: ['DELETE'])]
	public function deleteMessage(
		MessageRepository $messageRepository,
		EntityManagerInterface $entityManager,
		PublisherInterface $publisher,
		SerializerInterface $serializer,
		$messageId
	): JsonResponse {
		$me = $this->getUser();
		$message = $messageRepository->findById($messageId);
		$context = SerializationContext::create()->setGroups(['getMessage']);
		$jsonMessage = $serializer->serialize($message, 'json', $context);

		if ($message->getSender()->getId() != $me->getId()) {
			return new JsonResponse(['message' => 'You are not the author of this message'], Response::HTTP_FORBIDDEN);
		}

		$conversation = $message->getConversation();

		$users = $conversation->getUsers();

		$entityManager->remove($message);
		$entityManager->flush();

		foreach($users as $user) {
			if ($user->getId() != $me->getId()) {
				Functions::postNotification($publisher, $entityManager, $user, $me->getUsername(), $me->getUsername() . ' deleted its own message', 'deleteMessage', [$me->getUsername()]);
				Functions::sendMessageUpdate($publisher, $user, json_decode($jsonMessage, true), 'delete');
			}
		}

		return new JsonResponse(['status' => 'Message deleted'], Response::HTTP_OK, [], false);
	}


	#[Route('/get_conversation/{friendUsername}', name: 'get_conversation', methods: ['POST'])]
	public function getConversation(
		UserRepository $userRepository,
		ConversationRepository $conversationRepository,
		SerializerInterface $serializer,
		Request $request,
		$friendUsername
	): JsonResponse {
		$me = $this->getUser();
		$friend = $userRepository->getUserByUsername($friendUsername);


		if (!$friend) {
			return new JsonResponse(['status' => 'Friend not found'], Response::HTTP_NOT_FOUND);
		}

		$conversation = $conversationRepository->findConversationBetweenTwoUsers($me, $friend);
		if (!$conversation) {
			return new JsonResponse(['status' => 'Conversation not found'], Response::HTTP_NOT_FOUND);
		}

		$data = $request->toArray();
		$page = $data['page'];
		$limit = $data['limit'];
		$messages = $conversation->getMessagesWithPagination($page, $limit);

        $context = SerializationContext::create()->setGroups(['getMessage']);
		$jsonMessages = $serializer->serialize($messages, 'json', $context);
		return new JsonResponse($jsonMessages, Response::HTTP_OK, [], true);
	}


	#[Route('/saw_message/{messageId}', name: 'saw_message', methods: ['PUT'])]
	public function sawMessage(
        MessageRepository $messageRepository,
        EntityManagerInterface $entityManager,
        $messageId
    ): JsonResponse {
        $me = $this->getUser();
        $message = $messageRepository->findById($messageId);

        if ($message->getSender()->getId() == $me->getId()) {
            return new JsonResponse(['message' => 'You already have seen your own message. Or have you?'], Response::HTTP_FORBIDDEN);
        }

        $message->setSeen(true);
        $entityManager->persist($message);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Okay, you know this message now.'], Response::HTTP_OK, [], true);
    }


	#[Route('/saw_conversation/{friendUsername}', name: 'saw_conversation', methods: ['PUT'])]
	public function sawConversation(
		UserRepository $userRepository,
		ConversationRepository $conversationRepository,
        EntityManagerInterface $entityManager,
		Request $request,
		$friendUsername
	): JsonResponse {
		$me = $this->getUser();
		$friend = $userRepository->getUserByUsername($friendUsername);

		if (!$friend) {
			return new JsonResponse(['status' => 'Friend not found'], Response::HTTP_NOT_FOUND);
		}

		$conversation = $conversationRepository->findConversationBetweenTwoUsers($me, $friend);
		if (!$conversation) {
			return new JsonResponse(['status' => 'Conversation not found'], Response::HTTP_NOT_FOUND);
		}

		$page = $request->query->getInt('page', 1);
		$limit = $request->query->getInt('limit', 10);
		$messages = $conversation->getMessagesWithPagination($page, $limit);

		foreach($messages as $message) {
			if ($friend->getId() == $message->getSender()->getId() || !$message->getSeen()) {
				$message->setSeen(true);
				$entityManager->persist($message);
			}
		}

        $entityManager->flush();

		return new JsonResponse(['message' => 'Okay, you know everything about this conversation now.'], Response::HTTP_OK, [], true);
	}
}
