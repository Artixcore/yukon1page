# Deployment Guide

This guide explains how to deploy the Yukon Lifestyle Laravel application using Docker or the setup script.

## Option 1: Using Docker Compose (Recommended for Development)

### Prerequisites
- Docker Engine 20.10+
- Docker Compose 2.0+ (or standalone docker-compose)

**If docker-compose is not installed, run:**
```bash
# Option 1: Install standalone docker-compose
sudo chmod +x install-docker-compose.sh
sudo ./install-docker-compose.sh

# Option 2: Use docker compose (plugin) - if Docker Compose plugin is installed
# Use 'docker compose' instead of 'docker-compose' in all commands
```

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd yukon1page
   ```

2. **Copy environment file**
   ```bash
   cp .env.example .env
   ```

3. **Update .env file**
   Edit `.env` and configure:
   - Database credentials
   - Mail settings
   - Turnstile CAPTCHA keys
   - APP_URL

4. **Build and start containers**
   ```bash
   docker-compose up -d --build
   ```

5. **Install dependencies**
   ```bash
   docker-compose exec app composer install
   ```

6. **Generate application key**
   ```bash
   docker-compose exec app php artisan key:generate
   ```

7. **Run migrations**
   ```bash
   docker-compose exec app php artisan migrate
   ```

8. **Seed admin user**
   ```bash
   docker-compose exec app php artisan db:seed --class=AdminUserSeeder
   ```

9. **Set permissions**
   ```bash
   docker-compose exec app chmod -R 775 storage bootstrap/cache
   ```

10. **Access the application**
    - Frontend: http://localhost
    - Admin Panel: http://localhost/admin/login
    - Admin Email: admin@yu.com
    - Admin Password: Asw@@11@@22@@33##

### Useful Docker Commands

**Note:** If you have Docker Compose plugin installed, use `docker compose` (without hyphen) instead of `docker-compose`.

```bash
# View logs
docker-compose logs -f
# OR: docker compose logs -f

# Stop containers
docker-compose down
# OR: docker compose down

# Restart containers
docker-compose restart
# OR: docker compose restart

# Execute commands in container
docker-compose exec app php artisan <command>
# OR: docker compose exec app php artisan <command>

# Access MySQL
docker-compose exec db mysql -u root -p
# OR: docker compose exec db mysql -u root -p
```

## Option 2: Using setup.sh (Bare Metal Ubuntu 22.04)

### Prerequisites
- Ubuntu 22.04 Server
- Root or sudo access
- Internet connection

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd yukon1page
   ```

2. **Make setup script executable**
   ```bash
   chmod +x setup.sh
   ```

3. **Run setup script**
   ```bash
   sudo ./setup.sh
   ```

The script will automatically:
- Install PHP 8.1+ with all required extensions
- Install Composer
- Install Node.js (LTS)
- Install MySQL Server
- Install Docker and Docker Compose
- Install and configure Nginx
- Set up Laravel application
- Run migrations and seeders
- Configure firewall

4. **Update .env file**
   After setup completes, edit `/path/to/project/.env` with your configuration:
   - Database credentials
   - Mail settings
   - Turnstile CAPTCHA keys
   - APP_URL

5. **Access the application**
   - Frontend: http://your-server-ip
   - Admin Panel: http://your-server-ip/admin/login

### Post-Setup Configuration

1. **Configure Nginx for your domain**
   Edit `/etc/nginx/sites-available/yukon`:
   ```nginx
   server_name your-domain.com www.your-domain.com;
   ```

2. **Set up SSL (Let's Encrypt)**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com -d www.your-domain.com
   ```

3. **Configure firewall**
   ```bash
   sudo ufw allow 'Nginx Full'
   sudo ufw enable
   ```

## Environment Variables

Key environment variables to configure in `.env`:

### Application
- `APP_NAME` - Application name
- `APP_ENV` - Environment (local, production)
- `APP_DEBUG` - Debug mode (false for production)
- `APP_URL` - Application URL

### Database
- `DB_CONNECTION` - Database driver (mysql)
- `DB_HOST` - Database host
- `DB_PORT` - Database port (3306)
- `DB_DATABASE` - Database name
- `DB_USERNAME` - Database username
- `DB_PASSWORD` - Database password

### Mail
- `MAIL_MAILER` - Mail driver (smtp, sendmail, etc.)
- `MAIL_HOST` - SMTP host
- `MAIL_PORT` - SMTP port
- `MAIL_USERNAME` - SMTP username
- `MAIL_PASSWORD` - SMTP password
- `MAIL_ENCRYPTION` - Encryption (tls, ssl)
- `MAIL_FROM_ADDRESS` - From email address
- `MAIL_FROM_NAME` - From name

### Cloudflare Turnstile
- `TURNSTILE_SITE_KEY` - Turnstile site key
- `TURNSTILE_SECRET_KEY` - Turnstile secret key
- `TURNSTILE_THEME` - Widget theme (light, dark, auto)
- `TURNSTILE_SIZE` - Widget size (normal, compact)
- `TURNSTILE_LANGUAGE` - Widget language (auto, bn, etc.)

## Production Checklist

- [ ] Set `APP_ENV=production`
- [ ] Set `APP_DEBUG=false`
- [ ] Generate strong `APP_KEY`
- [ ] Configure secure database credentials
- [ ] Set up SSL certificate
- [ ] Configure mail service
- [ ] Set up Cloudflare Turnstile keys
- [ ] Configure firewall rules
- [ ] Set up automated backups
- [ ] Configure log rotation
- [ ] Set up monitoring
- [ ] Optimize Laravel (cache config, routes, views)

## Troubleshooting

### Docker Issues
- **Port already in use**: Change `APP_PORT` in docker-compose.yml
- **Permission denied**: Check file permissions on storage and bootstrap/cache
- **Database connection failed**: Verify DB_HOST is set to `db` in docker-compose

### Setup Script Issues
- **MySQL root password**: Default is `root`, change in .env
- **Nginx not starting**: Check configuration with `nginx -t`
- **PHP-FPM not working**: Check service status `systemctl status php8.1-fpm`

## Support

For issues or questions, please check:
- Laravel Documentation: https://laravel.com/docs
- Docker Documentation: https://docs.docker.com
- Nginx Documentation: https://nginx.org/en/docs/
