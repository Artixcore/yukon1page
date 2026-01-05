#!/bin/bash

# Laravel Application Setup Script for Ubuntu 22.04
# This script installs all required dependencies and sets up the Laravel application

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    error "Please run as root (use sudo)"
    exit 1
fi

# Check Ubuntu version
if [ ! -f /etc/os-release ]; then
    error "Cannot detect Ubuntu version"
    exit 1
fi

. /etc/os-release
if [ "$ID" != "ubuntu" ] || [ "$VERSION_ID" != "22.04" ]; then
    warning "This script is designed for Ubuntu 22.04. Current: $ID $VERSION_ID"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

log "Starting Laravel application setup..."

# Update system packages
log "Updating system packages..."
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get upgrade -y -qq

# Install basic utilities
log "Installing basic utilities..."
apt-get install -y -qq \
    software-properties-common \
    apt-transport-https \
    ca-certificates \
    curl \
    wget \
    gnupg \
    lsb-release \
    git \
    unzip \
    zip \
    nano \
    htop \
    ufw

# Install PHP 8.1+
log "Installing PHP 8.1 and extensions..."
add-apt-repository -y ppa:ondrej/php > /dev/null 2>&1
apt-get update -qq
apt-get install -y -qq \
    php8.1 \
    php8.1-fpm \
    php8.1-cli \
    php8.1-common \
    php8.1-mysql \
    php8.1-zip \
    php8.1-gd \
    php8.1-mbstring \
    php8.1-curl \
    php8.1-xml \
    php8.1-bcmath \
    php8.1-intl \
    php8.1-opcache \
    php8.1-readline

# Configure PHP
log "Configuring PHP..."
sed -i 's/;cgi.fix_pathinfo=1/cgi.fix_pathinfo=0/' /etc/php/8.1/fpm/php.ini
sed -i 's/upload_max_filesize = 2M/upload_max_filesize = 40M/' /etc/php/8.1/fpm/php.ini
sed -i 's/post_max_size = 8M/post_max_size = 40M/' /etc/php/8.1/fpm/php.ini
sed -i 's/memory_limit = 128M/memory_limit = 256M/' /etc/php/8.1/fpm/php.ini

# Install Composer
log "Installing Composer..."
if [ ! -f /usr/local/bin/composer ]; then
    curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
    chmod +x /usr/local/bin/composer
fi

# Install Node.js (LTS version)
log "Installing Node.js..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - > /dev/null 2>&1
    apt-get install -y -qq nodejs
fi

# Install MySQL Server
log "Installing MySQL Server..."
if ! command -v mysql &> /dev/null; then
    debconf-set-selections <<< "mysql-server mysql-server/root_password password root"
    debconf-set-selections <<< "mysql-server mysql-server/root_password_again password root"
    apt-get install -y -qq mysql-server mysql-client
    systemctl enable mysql
    systemctl start mysql
fi

# Install Docker
log "Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg > /dev/null 2>&1
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
    apt-get update -qq
    apt-get install -y -qq docker-ce docker-ce-cli containerd.io docker-compose-plugin
    systemctl enable docker
    systemctl start docker
    usermod -aG docker $SUDO_USER 2>/dev/null || true
fi

# Install Docker Compose (standalone)
log "Installing Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE_VERSION=$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep 'tag_name' | cut -d\" -f4)
    curl -L "https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
fi

# Install Nginx
log "Installing Nginx..."
if ! command -v nginx &> /dev/null; then
    apt-get install -y -qq nginx
    systemctl enable nginx
fi

# Get current directory (should be project root)
PROJECT_DIR=$(pwd)
if [ ! -f "$PROJECT_DIR/composer.json" ]; then
    error "composer.json not found. Please run this script from the project root directory."
    exit 1
fi

log "Project directory: $PROJECT_DIR"

# Set up Laravel application
log "Setting up Laravel application..."

# Copy .env.example to .env if .env doesn't exist
if [ ! -f .env ]; then
    if [ -f .env.example ]; then
        log "Creating .env file from .env.example..."
        cp .env.example .env
    else
        warning ".env.example not found. Creating basic .env file..."
        cat > .env << EOF
APP_NAME="Yukon Lifestyle"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost

LOG_CHANNEL=stack
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=debug

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=yukon_lifestyle
DB_USERNAME=root
DB_PASSWORD=root

BROADCAST_DRIVER=log
CACHE_DRIVER=file
FILESYSTEM_DISK=local
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
SESSION_LIFETIME=120

MEMCACHED_HOST=127.0.0.1

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=smtp
MAIL_HOST=mailpit
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="hello@example.com"
MAIL_FROM_NAME="${APP_NAME}"

TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
TURNSTILE_THEME=light
TURNSTILE_SIZE=normal
TURNSTILE_LANGUAGE=auto
EOF
    fi
fi

# Generate application key if not set
if ! grep -q "APP_KEY=base64:" .env 2>/dev/null; then
    log "Generating application key..."
    php artisan key:generate --force
fi

# Install Composer dependencies
log "Installing Composer dependencies..."
composer install --no-interaction --prefer-dist --optimize-autoloader

# Set proper permissions
log "Setting file permissions..."
chown -R www-data:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache
chmod -R 755 public

# Create database if it doesn't exist
DB_NAME=$(grep DB_DATABASE .env | cut -d '=' -f2 | tr -d ' ')
DB_USER=$(grep DB_USERNAME .env | cut -d '=' -f2 | tr -d ' ')
DB_PASS=$(grep DB_PASSWORD .env | cut -d '=' -f2 | tr -d ' ')

if [ -z "$DB_NAME" ]; then
    DB_NAME="yukon_lifestyle"
fi
if [ -z "$DB_USER" ]; then
    DB_USER="root"
fi
if [ -z "$DB_PASS" ]; then
    DB_PASS="root"
fi

log "Creating database '$DB_NAME' if it doesn't exist..."
mysql -u root -proot <<EOF
CREATE DATABASE IF NOT EXISTS \`$DB_NAME\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASS';
GRANT ALL PRIVILEGES ON \`$DB_NAME\`.* TO '$DB_USER'@'localhost';
FLUSH PRIVILEGES;
EOF

# Run migrations
log "Running database migrations..."
php artisan migrate --force

# Run seeders
log "Running database seeders..."
php artisan db:seed --class=AdminUserSeeder --force

# Clear and cache config
log "Optimizing Laravel..."
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Configure Nginx
log "Configuring Nginx..."
NGINX_CONF="/etc/nginx/sites-available/yukon"
NGINX_ENABLED="/etc/nginx/sites-enabled/yukon"

cat > "$NGINX_CONF" <<EOF
server {
    listen 80;
    server_name _;
    root $PROJECT_DIR/public;
    index index.php index.html;

    charset utf-8;

    access_log /var/log/nginx/yukon_access.log;
    error_log /var/log/nginx/yukon_error.log;

    location / {
        try_files \$uri \$uri/ /index.php?\$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
        fastcgi_param SCRIPT_FILENAME \$realpath_root\$fastcgi_script_name;
        include fastcgi_params;
        fastcgi_hide_header X-Powered-By;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
EOF

# Enable site
ln -sf "$NGINX_CONF" "$NGINX_ENABLED"
rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
nginx -t

# Restart services
log "Restarting services..."
systemctl restart php8.1-fpm
systemctl restart nginx
systemctl restart mysql

# Configure firewall (optional)
log "Configuring firewall..."
ufw --force enable
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp

# Display completion message
log "Setup completed successfully!"
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Laravel Application Setup Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Services installed:"
echo "  ✓ PHP 8.1 with required extensions"
echo "  ✓ Composer"
echo "  ✓ Node.js $(node --version)"
echo "  ✓ MySQL Server"
echo "  ✓ Docker & Docker Compose"
echo "  ✓ Nginx"
echo ""
echo "Application URL: http://$(hostname -I | awk '{print $1}')"
echo ""
echo "Admin Panel: http://$(hostname -I | awk '{print $1}')/admin/login"
echo "Admin Email: admin@yu.com"
echo "Admin Password: Asw@@11@@22@@33##"
echo ""
echo "Next steps:"
echo "  1. Update .env file with your configuration"
echo "  2. Configure your domain in Nginx if needed"
echo "  3. Set up SSL certificate (Let's Encrypt) for production"
echo ""
log "Setup script finished!"
