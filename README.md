# Project P

## Présentation

*Project P* est une plateforme où le but est de **posséder le plus d'argent possible** par tous les moyens fournis.

C'est une **interface web** encapsulé dans *Docker*, ce projet utilise *React* et toutes ses bibliothèques associées comme *React Cookie*, *React Three*, *React Tanstack Query* ou encore *React Router Dom*. Il y a aussi *Webpack*, *Framer Motion*, *Nginx*, *Symfony*, *Mercure*, *Redis* et *PostgreSQL*.

Il vous est possible de **créer un compte**, **ajouter des amis** et **discuter** avec eux, leur faire des **virements bancaires** (monnaie virtuelle) et vous pouvez **acheter des items** dans la boutique afin de **personnaliser** votre avatar (un cube) !

## Lancer le projet

Ce projet utilise *Docker* et uniquement *Docker* pour être lancé.

Il n'est pas déployé. Donc pour utiliser cette plateforme, veuillez suivre les instructions suivantes :

- Installez [*Docker*](https://www.docker.com/products/docker-desktop/) sur votre machine.

- Ouvrez un *terminal* et clonez le projet sur votre machine :
```
git clone https://github.com/AdlarX9/Project-P.git
```

- Rendez-vous dans le répertoire racine du projet :
```
cd project-p
```

- Copiez le fichier d'environnement .env.sample et collez-le dans le fichier .env :
```
cp .env.sample .env
```

- Lancez l'application avec Docker :
```
docker compose up
```

- Attendez que tout se lance correctement et rendez-vous sur `https://localhost` (où tout autre adresse configurée dans le fichier `.env`) pour commencer à utiliser l'application.

Remarque : l'application générera plein de fichiers automatiquement nécessaires à son fonctionnement, merci de ne pas y toucher.

## Exemples

> ![main](examples/main.png)
> *La page principale*

> ![login](examples/login.png)
> *Le formulaire pour se connecter à son compte*

> ![friends](examples/friends.png)
> *Le menu de gestation de ses amis*

> ![chat](examples/chat.png)
> *L'interface du chat*

> ![locker](examples/locker.png)
> *Son casier*

> ![shop](examples/shop.png)
> *La boutique en ligne*

> ![view_item](examples/view_item.png)
> *La prévisualisatoin d'un item dans la boutique*

> ![settings](examples/settings.png)
> *Le menu des réglages*

> ![transfer](examples/transfer.png)
> *Le menu pour effectuer des virements bancaires*
