<?php

namespace App\Controller;

use App\Entity\Bank;
use App\Entity\Loan;
use App\Entity\LoanRequest;
use App\Repository\BankRepository;
use App\Repository\LoanRepository;
use App\Repository\LoanRequestRepository;
use App\Repository\UserRepository;
use App\Service\BankManager;
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

#[Route('/api/bank')]
final class BankController extends AbstractController
{
    #[Route('/transfer', name: 'transfer', methods: ['PATCH'])]
    public function transfer(
        Request $request,
        UserRepository $userRepository,
        EntityManagerInterface $entityManager,
        SerializerInterface $serializer,
        PublisherInterface $publisher,
        BankManager $bankManager
    ): JsonResponse {
        $user = $this->getUser();

        $data = json_decode($request->getContent(), true);

        if (!isset($data['idFriend'], $data['amount'])) {
            return new JsonResponse(['error' => 'Invalid request data'], 400);
        }

        $idFriend = $data['idFriend'];
        $amount = (float) $data['amount'];

        if ($amount <= 0) {
            return new JsonResponse(['error' => 'Amount must be greater than zero'], 400);
        }

        if ($user->getId() === $idFriend) {
            return new JsonResponse(['error' => 'You cannot transfer money to yourself'], 400);
        }

        $friend = $userRepository->find($idFriend);
        if (!$friend) {
            return new JsonResponse(['error' => 'Friend not found'], 404);
        }

        if ($user->getMoney() < $amount) {
            return new JsonResponse(['error' => 'Insufficient funds'], 400);
        }

        $bankManager->transfer($user, $friend, $amount);

        $context = SerializationContext::create()->setGroups(['getUser']);
        $jsonUser = $serializer->serialize($user, 'json', $context);

        Functions::postNotification($publisher, $entityManager, $user, 'transfer', "You transfered \${$amount} to {$friend->getUsername()}");
        Functions::postNotification($publisher, $entityManager, $friend, $user->getUsername(), "You received \${$amount} from {$friend->getUsername()}");
        return new JsonResponse($jsonUser, 200, [], true);
    }



    #[Route('/percentage', name: 'get_percentage', methods: ['GET'])]
    public function getPercentage(UserRepository $userRepository): JsonResponse {
        $user = $this->getUser();
        if (!$user) {
            return new JsonResponse(['error' => 'User not authenticated'], Response::HTTP_UNAUTHORIZED);
        }
        $userMoney = $user->getMoney();
        $totalUsers = $userRepository->count([]);

        $usersWithLessMoney = $userRepository->createQueryBuilder('u')
            ->select('COUNT(u.id)')
            ->where('u.money < :userMoney')
            ->setParameter('userMoney', $userMoney)
            ->getQuery()
            ->getSingleScalarResult();

        if ($totalUsers > 0) {
            $percentage = ($usersWithLessMoney / ($totalUsers - 1)) * 100;
        } else {
            $percentage = 0;
        }

        // Retourne le pourcentage en JSON
        return new JsonResponse([
            'percentage' => $percentage
        ], Response::HTTP_OK);
    }



    #[Route('/create_bank', name: 'create_bank', methods: ['POST'])]
    public function createBank(Request $request, EntityManagerInterface $entityManager): JsonResponse {
        $user = $this->getUser();

        $data = $request->toArray();
        $bankName = $data['bankName'];
        if (empty($bankName)) {
            return new JsonResponse(['error' => 'Bank name cannot be empty'], Response::HTTP_BAD_REQUEST);
        }

        $bank = new Bank();
        $bank->setName($bankName);
        $bank->setMoney(0);
        $user->addBank($bank);
        $entityManager->persist($user);
        $entityManager->persist($bank);
        $entityManager->flush();

        return new JsonResponse([], Response::HTTP_CREATED);
    }



    #[Route('/get', name: 'get_banks', methods: ['GET'])]
    public function getBanks(SerializerInterface $serializer): JsonResponse {
        $user = $this->getUser();

        $context = SerializationContext::create()->setGroups(['getBank']);
        $jsonUser = $serializer->serialize($user, 'json', $context);
        return new JsonResponse($jsonUser, Response::HTTP_OK, [], true);
    }



    #[Route('/request_loan', name: 'requestLoan', methods: ['POST'])]
    public function requestLoan(
        Request $request,
        EntityManagerInterface $entityManager,
        BankRepository $bankRepository,
        PublisherInterface $publisher
    ): JsonResponse {
        $user = $this->getUser();
        $data = $request->toArray();

        $bankId = (int) $data['bankId'];
        $amount = (int) $data['amount'];
        $duration = (int) $data['duration'];
        $request = (string) $data['request'];
        $interestRate = (float) $data['interestRate'];
        $bank = $bankRepository->find($bankId);

        if ($amount <= 0) {
            return new JsonResponse(['message' => 'Amount must be greater than zero'], 400);
        }
        if (!$bank) {
            return new JsonResponse(['message' => 'Bank not found'], 404);
        }

        $loanRequest = new LoanRequest();
        $bank->addLoanRequest($loanRequest);
        $user->addLoanRequest($loanRequest);
        $loanRequest->setAmount($amount);
        $loanRequest->setDuration($duration);
        $loanRequest->setInterestRate($interestRate);
        $loanRequest->setRequest($request);

        $entityManager->persist($loanRequest);
        $entityManager->persist($bank);
        $entityManager->flush();

        Functions::postNotification($publisher, $entityManager, $bank->getOwner(), 'Loan Request', "You received a loan request from {$user->getUsername()}");

        Functions::postNotification($publisher, $entityManager, $user, 'Loan Request', "You successfully sent a loan request to {$bank->getOwner()->getUsername()}");

        return new JsonResponse(['status' => 'success'], Response::HTTP_CREATED);
    }



    #[Route('/accept_loan', name: 'acceptLoan', methods: ['POST'])]
    public function acceptLoan(
        Request $request,
        EntityManagerInterface $entityManager,
        LoanRequestRepository $loanRequestRepository,
        BankRepository $bankRepository
    ): JsonResponse {
        $user = $this->getUser();
        $data = $request->toArray();

        $loanRequestId = $data['loanRequestId'];
        $interestRate = $data['interestRate'];
        $loanRequest = $loanRequestRepository->find($loanRequestId);

        if ($interestRate > $loanRequest->getInterestRate()) {
            return new JsonResponse(['error' => 'Interest rate cannot be higher than the requested one'], 400);
        }

        $loan = new Loan();
        $loanRequest->getBank()->addLoan($loan);
        $user->addLoan($loan);
        $loan->setStart(new \DateTime());
        $loan->setDeadline($loanRequest->getDuration());
        $loan->setAmount($loanRequest->getAmount());
        $loan->setRepaid(0);
        $loan->setInterestRate($interestRate);

        $entityManager->persist($loan);
        $entityManager->persist($loan->getBank());
        $entityManager->persist($user);
        $entityManager->remove($loanRequest);
        $entityManager->flush();

        return new JsonResponse([], Response::HTTP_NO_CONTENT);
    }



    #[Route('/search', name: 'search_banks', methods: ['GET'])]
    public function searchBanks(
        Request $request,
        BankRepository $bankRepository,
        SerializerInterface $serializer
    ): JsonResponse {
        $name = $request->query->get('name', '');
        $page = max(1, (int)$request->query->get('page', 1));
        $limit = max(1, min(50, (int)$request->query->get('limit', 10)));
        $offset = ($page - 1) * $limit;

        $banks = $bankRepository->searchByNamePagination($name, $offset, $limit);

        $context = SerializationContext::create()->setGroups(['getBank']);
        $jsonBanks = $serializer->serialize($banks, 'json', $context);

        return new JsonResponse($jsonBanks, Response::HTTP_OK, [], true);
    }



    #[Route('/{bankId}', name: 'get_bank', methods: ['GET'])]
    public function getBank(
        int $bankId,
        BankRepository $bankRepository,
        SerializerInterface $serializer
    ): JsonResponse {
        $bank = $bankRepository->find($bankId);
        if (!$bank) {
            return new JsonResponse(['error' => 'Bank not found'], Response::HTTP_NOT_FOUND);
        }

        $context = SerializationContext::create()->setGroups(['getPublicBank']);
        $jsonBank = $serializer->serialize($bank, 'json', $context);
        
        return new JsonResponse($jsonBank, Response::HTTP_OK, [], true);
    }



    #[Route('/{bankId}/change_name', name: 'change_bank_name', methods: ['PUT'])]
    public function changeBankName(
        Request $request,
        int $bankId,
        BankRepository $bankRepository,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $user = $this->getUser();
        $data = json_decode($request->getContent(), true);

        if (!isset($data['name'])) {
            return new JsonResponse(['message' => 'Invalid name'], 400);
        }

        $bank = $bankRepository->find($bankId);
        if (!$bank) {
            return new JsonResponse(['message' => 'Bank not found'], 404);
        }

        if ($bank->getOwner() !== $user) {
            return new JsonResponse(['message' => 'You are not the owner of this bank'], 403);
        }

        $bank->setName($data['name']);
        $entityManager->persist($bank);
        $entityManager->flush();

        return new JsonResponse(['status' => 'success', 'bankId' => $bank->getId(), 'name' => $bank->getName()], Response::HTTP_NO_CONTENT);
    }
}
