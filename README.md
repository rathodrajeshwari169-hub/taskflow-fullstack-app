# TaskFlow — Full-Stack Task Manager

A full-stack task/notes app with authentication, built as a resume/portfolio project.

**Stack:** React (Vite) · Node.js/Express · SQLite · JWT auth · bcrypt

## Features

- Sign up / log in with hashed passwords (bcrypt) and JWT tokens
- Protected API routes — only logged-in users can see or modify their own tasks
- Full CRUD: create, read, update, delete tasks
- Toggle task status (pending/done), inline editing
- Filter tasks by status
- Clean, responsive UI

## Project structure

```
taskapp/
├── backend/
│   ├── server.js          # Express app entry point
│   ├── db.js               # SQLite setup + schema
│   ├── middleware/auth.js  # JWT verification middleware
│   └── routes/
│       ├── auth.js         # /api/auth/signup, /api/auth/login
│       └── tasks.js        # /api/tasks CRUD (protected)
└── frontend/
    └── src/
        ├── api/client.js         # fetch wrapper for the backend
        ├── context/AuthContext.jsx
        ├── components/
        │   ├── ProtectedRoute.jsx
        │   └── TaskItem.jsx
        ├── pages/
        │   ├── Login.jsx
        │   ├── Signup.jsx
        │   └── Dashboard.jsx
        └── App.jsx
```

## Running locally

### 1. Backend

```bash
cd backend
npm install
npm start
```

Runs on `http://localhost:5000`. Uses SQLite (`data.sqlite`, created automatically — no external database needed).

### 2. Frontend

In a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:5173`. Open that URL, sign up, and start adding tasks.

## How the auth flow works

1. User signs up → password is hashed with bcrypt → stored in SQLite → server returns a signed JWT.
2. Frontend stores the JWT in `sessionStorage` and attaches it as `Authorization: Bearer <token>` on every task request.
3. Backend middleware (`middleware/auth.js`) verifies the JWT on every `/api/tasks` route and rejects requests without a valid token.
4. Every task query is scoped to `user_id`, so users can only ever see or modify their own tasks.

## Ideas to extend this (good for a "what I'd add next" resume talking point)

- Swap SQLite for MongoDB or PostgreSQL (the route logic barely changes)
- Add refresh tokens / httpOnly cookies instead of sessionStorage for stronger security
- Add due dates, tags, or drag-and-drop reordering
- Add pagination for large task lists
- Deploy: backend to Render/Railway, frontend to Vercel/Netlify
- Write tests (Jest + Supertest for backend, React Testing Library for frontend)

## Notes on security in this build

This is a learning/portfolio project, so a couple of shortcuts were made intentionally simple:
- JWT is stored in `sessionStorage` rather than an httpOnly cookie — simpler to build, but in production an httpOnly cookie is safer against XSS.
- The JWT secret in `.env` is a placeholder — always use a long, random secret in production and never commit `.env` to git.
