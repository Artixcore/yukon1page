#!/bin/bash

# Quick script to install Docker Compose standalone on Ubuntu

set -e

echo "Installing Docker Compose..."

# Get latest version
DOCKER_COMPOSE_VERSION=$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep 'tag_name' | cut -d\" -f4)

echo "Downloading Docker Compose ${DOCKER_COMPOSE_VERSION}..."

# Download and install
sudo curl -L "https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Make executable
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker-compose --version

echo "Docker Compose installed successfully!"
