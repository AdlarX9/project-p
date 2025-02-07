<?php
    // src\DataFixtures\AppFixtures.php
 
namespace App\DataFixtures;

use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AppFixtures extends Fixture
{
    private $userPasswordHasher;
    
    public function __construct(UserPasswordHasherInterface $userPasswordHasher)
    {
        $this->userPasswordHasher = $userPasswordHasher;
    }

    public function load(ObjectManager $manager): void
    {
        // Création d'un user "normal"
        $user = new User();
        $user->setUsername("first");
        $user->setRoles(["ROLE_USER"]);
        $user->setPassword($this->userPasswordHasher->hashPassword($user, "pass"));
        $user->setMoney("1050");
        $manager->persist($user);

        // Création d'un user admin
        $userAdmin = new User();
        $userAdmin->setUsername("admin");
        $userAdmin->setRoles(["ROLE_ADMIN"]);
        $userAdmin->setPassword($this->userPasswordHasher->hashPassword($userAdmin, "pass"));
        $userAdmin->setMoney("10050");
        $manager->persist($userAdmin);

        for ($i = 0; $i < 100; $i++) {
            $user = new User();
            $user->setUsername("user$i");
            $user->setRoles(["ROLE_USER"]);
            $user->setPassword($this->userPasswordHasher->hashPassword($user, "pass"));
            $user->setMoney(rand(0, 10000));
            $manager->persist($user);
        }

        $manager->flush();
    }
}