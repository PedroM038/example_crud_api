# Backend API

REST API built with Django and Django REST Framework.

## Tech Stack

- Python 3.12
- Django 4.2.7
- Django REST Framework 3.14.0
- PostgreSQL
- Celery 5.3.4
- Redis

## Setup

```bash
chmod +x setup.sh
./setup.sh
```

This script will build containers, start services, and run migrations.

## API Endpoints

### Person CRUD

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/persons/` | List all persons |
| POST | `/api/persons/` | Create person |
| GET | `/api/persons/{id}/` | Get person |
| PATCH | `/api/persons/{id}/` | Update person |
| DELETE | `/api/persons/{id}/` | Delete person |

#### Filtering

- `?created_date__gte=2024-01-01`
- `?created_date__lte=2024-12-31`
- `?modified_date__gte=2024-01-01`
- `?modified_date__lte=2024-12-31`

### Async Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/long-task/` | Start long-running task |
| GET | `/api/long-task/{task_id}/` | Check task status |
| POST | `/api/statistics/` | Calculate statistics |

### API Documentation

| Endpoint | Description |
|----------|-------------|
| `/api/schema/` | OpenAPI schema |
| `/api/docs/` | Swagger UI |

## Project Structure

```
backend/
├── app/
│   ├── models.py       # Person model
│   ├── serializers.py  # DRF serializers
│   ├── views.py        # API views
│   ├── urls.py         # URL routing
│   └── tasks.py        # Celery tasks
├── config/
│   ├── settings.py     # Django settings
│   ├── urls.py         # Root URLs
│   └── celery.py       # Celery config
├── docker-compose.yml
├── Dockerfile
└── requirements.txt
```
