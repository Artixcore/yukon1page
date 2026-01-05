#!/bin/bash
set -e

# Start PHP-FPM in background
php-fpm -D

# Wait a moment for PHP-FPM to start
sleep 2

# Start nginx in foreground
exec nginx -g "daemon off;"
