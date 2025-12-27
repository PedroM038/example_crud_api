# Frontend

React application for the Person CRUD API.

## Tech Stack

- React 18
- Bootstrap 5
- Fetch API

## Setup

```bash
npm install
npm start
```

## Docker

```bash
docker compose up --build
```

## Environment Variables

Create a `.env` file:

```
REACT_APP_API_BASE_URL=http://localhost:8001/api
```

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── api.js              # API communication module
│   ├── App.js              # Main component
│   ├── index.js            # Entry point
│   ├── styles.css          # Global styles
│   └── components/
│       ├── DateFilter.js       # Date filter component
│       ├── LongTaskPanel.js    # Async task panel
│       ├── PersonForm.js       # Create/edit form
│       ├── PersonList.js       # Person list display
│       └── StatisticsPanel.js  # Statistics calculator
├── .env
├── package.json
├── Dockerfile
└── docker-compose.yml
```

## Features

- Person CRUD operations
- Date filtering (created/modified)
- Pagination
- Async task monitoring
- Statistics calculation (mean, std deviation)
