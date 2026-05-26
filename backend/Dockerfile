FROM php:8.2-cli

RUN apt-get update && apt-get install -y \
    git \
    unzip \
    curl \
    zip \
    libzip-dev \
    pkg-config \
    libssl-dev \
    openssl

RUN docker-php-ext-install zip

# MongoDB Extension
RUN pecl install mongodb-1.21.0 \
    && docker-php-ext-enable mongodb

# Enable OpenSSL + sockets
RUN docker-php-ext-install sockets

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app

COPY . .

RUN composer install --no-dev --optimize-autoloader

RUN chmod -R 775 storage bootstrap/cache

EXPOSE 10000

CMD php artisan serve --host=0.0.0.0 --port=10000