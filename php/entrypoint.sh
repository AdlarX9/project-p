#!/bin/sh
set -e

cd /usr/local/project-p/symfony-api/
cp ./.env ./backend
cd backend

# Vérification si l'argument commence par un tiret, alors exécute php-fpm
if [ "${1#-}" != "$1" ]; then
    set -- php-fpm "$@"
fi

# Si l'argument est php-fpm ou bin/console, exécute les commandes d'installation
if [ "$1" = "php-fpm" ] || [ "$1" = "bin/console" ] || [ "$1" = "php" ]; then
    # Installation des dépendances via Composer
    composer install --prefer-dist --no-progress --no-interaction
    # Installation des assets
    bin/console assets:install --no-interaction

    # Création de la clé JWT si elle n'existe pas
    if [ ! -f "config/jwt/private.pem" ] || [ ! -f "config/jwt/public.pem" ]; then
        php bin/console lexik:jwt:generate-keypair
    else
        echo "JWT keys already exist, skipping generation."
    fi

    bin/console doctrine:schema:update --force

    # Attente que PostgreSQL soit prêt
    until bin/console doctrine:query:sql "select 1" >/dev/null 2>&1; do
        (>&2 echo "Waiting for PostgreSQL to be ready...")
        sleep 1
    done

fi

# Exécution de la commande passée en argument
exec "$@"
