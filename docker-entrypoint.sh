#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to log messages
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1"
}

# Wait for database to be ready
wait_for_db() {
    if [ -z "$DB_HOST" ]; then
        DB_HOST="127.0.0.1"
    fi
    
    log "Waiting for database connection at $DB_HOST..."
    
    max_attempts=30
    attempt=0
    
    while [ $attempt -lt $max_attempts ]; do
        if php -r "
        try {
            \$pdo = new PDO('mysql:host=${DB_HOST};port=${DB_PORT:-3306}', '${DB_USERNAME}', '${DB_PASSWORD}');
            \$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            echo 'connected';
        } catch (PDOException \$e) {
            exit(1);
        }
        " 2>/dev/null; then
            log "Database connection established!"
            return 0
        fi
        
        attempt=$((attempt + 1))
        warn "Database connection attempt $attempt/$max_attempts failed. Retrying in 2 seconds..."
        sleep 2
    done
    
    error "Could not connect to database after $max_attempts attempts"
    return 1
}

# Initialize Laravel application
init_laravel() {
    log "Initializing Laravel application..."
    
    # Check if .env exists
    if [ ! -f .env ]; then
        warn ".env file not found. Skipping Laravel optimizations."
        return 0
    fi
    
    # Set proper permissions
    log "Setting permissions..."
    chown -R www-data:www-data /var/www/html
    chmod -R 755 /var/www/html
    chmod -R 775 /var/www/html/storage
    chmod -R 775 /var/www/html/bootstrap/cache
    
    # Wait for database if DB_HOST is set
    if [ ! -z "$DB_HOST" ] && [ "$DB_HOST" != "127.0.0.1" ]; then
        wait_for_db || warn "Database not available, continuing anyway..."
    fi
    
    # Run migrations (only if database is available)
    log "Running database migrations..."
    php artisan migrate --force --no-interaction || warn "Migrations failed or database not available"
    
    # Optimize Laravel for production
    log "Optimizing Laravel for production..."
    
    # Clear and cache config
    php artisan config:clear || true
    php artisan config:cache || warn "Config cache failed"
    
    # Clear and cache routes
    php artisan route:clear || true
    php artisan route:cache || warn "Route cache failed"
    
    # Clear and cache views
    php artisan view:clear || true
    php artisan view:cache || warn "View cache failed"
    
    # Discover packages
    php artisan package:discover --ansi || warn "Package discovery failed"
    
    # Optimize autoloader
    composer dump-autoload --optimize --classmap-authoritative || warn "Autoloader optimization failed"
    
    log "Laravel initialization complete!"
}

# Create health check file
create_health_check() {
    cat > /var/www/html/public/health.php << 'EOF'
<?php
http_response_code(200);
header('Content-Type: application/json');
echo json_encode([
    'status' => 'ok',
    'timestamp' => date('Y-m-d H:i:s'),
    'service' => 'yukon-lifestyle'
]);
EOF
    chown www-data:www-data /var/www/html/public/health.php
    log "Health check endpoint created at /health.php"
}

# Initialize Laravel
init_laravel

# Create health check endpoint
create_health_check

# Start PHP-FPM in background
log "Starting PHP-FPM..."
php-fpm -D

# Wait a moment for PHP-FPM to start
sleep 2

# Verify PHP-FPM is running
if ! pgrep -x "php-fpm" > /dev/null; then
    error "PHP-FPM failed to start"
    exit 1
fi

log "PHP-FPM started successfully"

# Start nginx in foreground
log "Starting Nginx..."
exec nginx -g "daemon off;"
