# SitePulse - Demo to Real App Spec

## Stack target
- Frontend: Vite + React + TS (already exists)
- Backend: Node.js + Express (or Fastify) + SQLite (simple) + Prisma optional
- Run locally with one command (concurrently)

## Auth
- Unauthenticated users cannot access: /dashboard, /projects/:id, /billing, /settings
- Auth method: JWT in Authorization header (Bearer <token>)
- Frontend stores token in localStorage

## Data Models

User
- id (string)
- email (string, unique)
- passwordHash (string)
- name (string)
- createdAt (string ISO)

Project
- id (string)
- ownerId (string -> User.id)
- name (string)
- url (string)
- createdAt (string ISO)

Membership
- id (string)
- projectId (string)
- userId (string)
- role ("owner" | "member")

Audit
- id (string)
- projectId (string)
- status ("queued" | "running" | "completed" | "failed")
- createdAt (string ISO)
- completedAt (string ISO | null)
- scores: { performance, seo, accessibility, bestPractices } (number 0-100)
- issues: [{ id, severity, title, page, recommendation }]

## Behavior

### Create Project
- Owner creates a project -> owner membership is created automatically

### Run Audit (async simulation)
- POST /api/projects/:id/audits -> creates audit with status=queued
- backend simulates progress:
  - queued -> running (after ~1s)
  - running -> completed (after ~2s) with generated scores/issues
- Frontend shows status updates (poll audit status or refetch project detail)

## Frontend wiring expectation
- Replace all mock data with API calls
- Errors show toast + page error banner
