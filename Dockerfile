# Dockerfile for Laravel Application (PHP-FPM + Nginx)
FROM php:8.2-fpm

# Set working directory
WORKDIR /var/www/html

# Install system dependencies including nginx
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libzip-dev \
    libicu-dev \
    nginx \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip intl opcache \
    && docker-php-ext-enable opcache \
    && rm -rf /var/lib/apt/lists/*

# Copy PHP-FPM pool configuration
COPY php/www.conf /usr/local/etc/php-fpm.d/www.conf

# Copy nginx configuration
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Remove default nginx site if it exists
RUN rm -f /etc/nginx/sites-enabled/default

# Copy startup script
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy composer files first for better layer caching
COPY composer.json composer.lock ./

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist --no-scripts

# Copy application files
COPY . /var/www/html

# Set proper permissions
RUN mkdir -p /var/www/html/storage/framework/{cache,sessions,views} \
    && mkdir -p /var/www/html/storage/logs \
    && mkdir -p /var/www/html/bootstrap/cache \
    && chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html \
    && chmod -R 775 /var/www/html/storage \
    && chmod -R 775 /var/www/html/bootstrap/cache

# Optimize composer autoloader (this doesn't require .env)
RUN composer dump-autoload --optimize --classmap-authoritative || true

# Expose port 80 for HTTP
EXPOSE 80

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost/health || exit 1

# Use custom entrypoint to start both nginx and PHP-FPM
ENTRYPOINT ["docker-entrypoint.sh"]
