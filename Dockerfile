# Nginx config
FROM nginx:latest AS reverse-proxy
WORKDIR /usr/local/project-p/reverse-proxy
RUN rm -f /etc/nginx/conf.d/default.conf

# Générer le certificat avec mkcert
RUN apt-get update
RUN apt-get install -y curl
RUN apt-get install -y lsb-release
RUN apt-get install -y ca-certificates
RUN apt-get install -y gnupg2 --fix-missing
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
RUN apt-get install -y nodejs
RUN npm install -g mkcert
ARG DOMAIN_NAME
ENV DOMAIN_NAME=${DOMAIN_NAME}

# Configurer SSL et génération de tickets
RUN openssl rand -out /etc/nginx/ticket.key 48
RUN mkdir -p /etc/nginx/ssl
RUN openssl dhparam -dsaparam -out /etc/nginx/ssl/dhparam4.pem 4096
COPY ./nginx/nginx.conf ./nginx/nginx.sh ./
RUN chmod +x ./nginx.sh

EXPOSE 83
CMD ["sh", "./nginx.sh"]


# Peer Server build
FROM node:20 AS peerjs-server
WORKDIR /usr/local/project-p/peerjs-server
RUN npm install peer -g
EXPOSE 2021
CMD ["peerjs", "--port", "2021", "--key", "peerjs", "--path", "/peer-server", "--allow-discovery", "--cors", "${DOMAIN_NAME}"]


# Coturn config
FROM coturn/coturn:latest
ENV TURN_SECRET=${TURN_SECRET}
ENV REALM=${REALM}
COPY turnserver.conf /etc/coturn/turnserver.conf
EXPOSE 3478 5349 49152-65535/udp
CMD ["turnserver", "-c", "/etc/coturn/turnserver.conf", "--verbose"]


# Adding the probe to php fpm
FROM php:8.4-fpm
RUN version=$(php -r "echo PHP_MAJOR_VERSION.PHP_MINOR_VERSION.(PHP_ZTS ? '-zts' : '');") \
&& architecture=$(uname -m) \
&& curl -A "Docker" -o /tmp/blackfire-probe.tar.gz -D - -L -s https://blackfire.io/api/v1/releases/probe/php/linux/$architecture/$version \
&& mkdir -p /tmp/blackfire \
&& tar zxpf /tmp/blackfire-probe.tar.gz -C /tmp/blackfire \
&& mv /tmp/blackfire/blackfire-*.so $(php -r "echo ini_get ('extension_dir');")/blackfire.so \
&& printf "extension=blackfire.so\nblackfire.agent_socket=tcp://blackfire:8307\n" > $PHP_INI_DIR/conf.d/blackfire.ini \
&& rm -rf /tmp/blackfire /tmp/blackfire-probe.tar.gz


# Symfony API build
FROM php:8.3-fpm-alpine AS symfony-api

RUN set -eux; \
    apk update; \
    echo "http://dl-cdn.alpinelinux.org/alpine/latest-stable/main" > /etc/apk/repositories; \
    echo "http://dl-cdn.alpinelinux.org/alpine/latest-stable/community" >> /etc/apk/repositories; \
    apk add --no-cache --virtual .build-deps \
        autoconf \
        g++ \
        make \
        postgresql-dev \
        fcgi \
        linux-headers; \
    \
    docker-php-source extract; \
    docker-php-ext-install pgsql pdo_pgsql; \
    \
    apk add --no-cache icu-libs icu redis; \
    docker-php-ext-install intl; \
    \
    apk add --no-cache php-pear; \
    pecl install apcu xdebug redis; \
    docker-php-ext-enable apcu opcache xdebug redis; \
    \
    runDeps="$( \
        scanelf --needed --nobanner --format '%n#p' --recursive /usr/local/lib/php/extensions \
        | tr ',' '\n' \
        | sort -u \
        | awk 'system("[ -e /usr/local/lib/" $1 " ]") == 0 { next } { print "so:" $1 }' \
    )"; \
    apk add --no-cache --virtual .app-phpexts-rundeps $runDeps; \
    \
    pecl clear-cache; \
    docker-php-source delete; \
    rm -rf /tmp/pear /var/cache/apk/*

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
COPY ./php/php.ini $PHP_INI_DIR/conf.d/php.ini
COPY ./php/php-cli.ini $PHP_INI_DIR/conf.d/php-cli.ini

ENV COMPOSER_ALLOW_SUPERUSER=1
RUN ser -eux; \
composer global require "hirak/prestissimo:^0.3" --prefer-dist --no-progress --no-suggest --classmap-authoritative; \
composer clear-cache

WORKDIR /usr/local/project-p/symfony-api
COPY ./.env ./
COPY ./backend ./

RUN set -eux; \
    composer install --prefer-dist --no-autoloader --no-scripts --no-progress --no-suggest; \
    composer clear-cache

RUN set -eux; \
    mkdir -p var/cache var/log \
    && composer dump-autoload --classmap-authoritative

COPY ./php/entrypoint.sh /usr/local/bin/symfony-api-entrypoint
RUN chmod +x /usr/local/bin/symfony-api-entrypoint

EXPOSE 9000

ENTRYPOINT ["symfony-api-entrypoint"]
CMD ["php", "-S", "0.0.0.0:9000", "-t", "public"]


# Frontend config
FROM node:20 AS frontend
WORKDIR /usr/local/project-p/frontend
RUN npm install -g pnpm mkcert
ARG DOMAIN_NAME
ENV DOMAIN_NAME=${DOMAIN_NAME}
COPY ./frontend/entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh
EXPOSE 3000
CMD ["sh", "./entrypoint.sh"]
