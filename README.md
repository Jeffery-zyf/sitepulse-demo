# SitePulse Demo

This repo contains a Vite + React frontend and an Express + SQLite backend for the SitePulse demo app.

## Requirements

- Node.js 18+
- npm

## Getting started

1. Install dependencies:

```bash
npm install
```

2. Start the frontend and backend together:

```bash
npm run dev:all
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3001

The SQLite database is stored at `backend/data/sitepulse.db` and is initialized from `db.sql` on server start.

## Configuration

If you need to change the backend URL for the frontend, set:

```bash
VITE_API_URL=http://localhost:3001
```

## Authentication

Use the backend API to register and login:

- `POST /api/auth/register`
- `POST /api/auth/login`

Both return a JWT token that the frontend stores in `localStorage`.
