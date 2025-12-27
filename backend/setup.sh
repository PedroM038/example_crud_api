#!/bin/bash

# Build containers
docker compose build

# Start services
docker compose up -d

# Create migrations
docker compose exec web python manage.py makemigrations

# Apply migrations
docker compose exec web python manage.py migrate

# Create superuser (optional)
docker compose exec web python manage.py createsuperuser