# Example CRUD API

Full-stack application with Django REST Framework backend and React frontend.

## Tech Stack

**Backend:** Python, Django 4.2, Django REST Framework, PostgreSQL, Celery, Redis

**Frontend:** React 18, Bootstrap 5

## Architecture

```mermaid
flowchart LR
    subgraph Frontend
        React[React App]
    end
    
    subgraph Backend
        Django[Django API]
        Celery[Celery Worker]
    end
    
    subgraph Data
        PostgreSQL[(PostgreSQL)]
        Redis[(Redis)]
    end
    
    React -->|HTTP| Django
    Django -->|ORM| PostgreSQL
    Django -->|Queue Task| Redis
    Redis -->|Consume| Celery
    Celery -->|Store Result| Redis
    Celery -->|Read/Write| PostgreSQL
```

### Async Task Flow

```mermaid
sequenceDiagram
    participant F as Frontend
    participant A as Django API
    participant R as Redis
    participant C as Celery Worker

    F->>A: POST /api/statistics/
    A->>R: task.delay()
    A-->>F: 202 {task_id}
    
    C->>R: Get task
    C->>C: Process
    C->>R: Store result
    
    loop Polling
        F->>A: GET /api/tasks/{id}/status/
        A->>R: Get result
        A-->>F: {state, result}
    end
```

## Project Structure

```
example_crud_api/
├── backend/
│   ├── app/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   └── tasks.py
│   ├── config/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── celery.py
│   ├── docker-compose.yml
│   ├── Dockerfile
│   ├── requirements.txt
│   └── setup.sh
├── frontend/
│   ├── src/
│   │   ├── api.js
│   │   ├── App.js
│   │   └── components/
│   │       ├── DateFilter.js
│   │       ├── LongTaskPanel.js
│   │       ├── PersonForm.js
│   │       ├── PersonList.js
│   │       └── StatisticsPanel.js
│   ├── docker-compose.yml
│   ├── Dockerfile
│   └── package.json
└── documentation/
```

## Quick Start

### Backend

```bash
cd backend
chmod +x setup.sh
./setup.sh
```

### Frontend

```bash
cd frontend
npm install
npm start
```

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `/api/persons/` | Person CRUD |
| `/api/long-task/` | Start async task |
| `/api/long-task/{id}/` | Check task status |
| `/api/statistics/` | Calculate statistics |
| `/api/docs/` | Swagger documentation |
| `/admin/` | Django admin |

## Features

- Person CRUD with pagination
- Date filtering (created/modified)
- Long-running async tasks with Celery
- Statistics calculation (mean, std deviation)
- Task status polling

## Configuration

Update `.env` files in backend and frontend directories to match your setup.

Default ports:
- Backend: `8001`
- Frontend: `3000`
- PostgreSQL: `5432`
- Redis: `6380`

