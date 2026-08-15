# TaskFlow — Full-Stack Task Manager

A full-stack task management web application with authentication. Users can sign up, log in, and create, edit, delete, and filter their own tasks.

**Live app:** https://taskflow-fullstack-app-iota.vercel.app
**Backend API:** https://taskflow-fullstack-app-h5r9.onrender.com

> Note: the backend is hosted on Render's free tier, which spins down after inactivity. The first request after idle time can take 30–60 seconds to respond while it wakes up.

**Stack:** React (Vite) · Node.js/Express · SQLite · JWT auth · bcrypt

## Features

- Sign up / log in with hashed passwords (bcrypt) and JWT tokens
- Protected API routes — only logged-in users can see or modify their own tasks
- Full CRUD: create, read, update, delete tasks
- Toggle task status (pending/done), inline editing
- Filter tasks by status
- Clean, responsive UI

## Project structure

taskapp/
├── backend/
│ ├── server.js # Express app entry point
│ ├── db.js # SQLite setup + schema
│ ├── middleware/auth.js # JWT verification middleware
│ └── routes/
│ ├── auth.js # /api/auth/signup, /api/auth/login
│ └── tasks.js # /api/tasks CRUD (protected)
└── frontend/
└── src/
├── api/client.js # fetch wrapper for the backend
├── context/AuthContext.jsx
├── components/
│ ├── ProtectedRoute.jsx
│ └── TaskItem.jsx
├── pages/
│ ├── Login.jsx
│ ├── Signup.jsx
│ └── Dashboard.jsx
└── App.jsx


## Running locally

### 1. Backend

```bash
cd backend
npm install
npm start
```

Runs on `http://localhost:5000`. Uses SQLite (`data.sqlite`, created automatically — no external database needed). Copy `.env.example` to `.env` and fill in a `JWT_SECRET` before running.

### 2. Frontend

In a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:5173`. Open that URL, sign up, and start adding tasks.

> If you're running the frontend locally against your own local backend, update `BASE_URL` in `frontend/src/api/client.js` to `http://localhost:5000/api`.

## How the auth flow works

1. User signs up → password is hashed with bcrypt → stored in SQLite → server returns a signed JWT.
2. Frontend stores the JWT in `sessionStorage` and attaches it as `Authorization: Bearer <token>` on every task request.
3. Backend middleware (`middleware/auth.js`) verifies the JWT on every `/api/tasks` route and rejects requests without a valid token.
4. Every task query is scoped to `user_id`, so users can only ever see or modify their own tasks.

## Deployment

- **Backend** deployed on [Render](https://render.com) as a Node web service (root directory: `backend`, build command: `npm install`, start command: `npm start`).
- **Frontend** deployed on [Vercel](https://vercel.com) as a Vite app (root directory: `frontend`).
- `JWT_SECRET` is set as an environment variable on Render, not committed to the repo.

## Ideas to extend this

- Swap SQLite for MongoDB or PostgreSQL (the route logic barely changes)
- Add refresh tokens / httpOnly cookies instead of sessionStorage for stronger security
- Add due dates, tags, or drag-and-drop reordering
- Add pagination for large task lists
- Write tests (Jest + Supertest for backend, React Testing Library for frontend)

## Notes on security in this build

This is a learning/portfolio project, so a couple of shortcuts were made intentionally simple:
- JWT is stored in `sessionStorage` rather than an httpOnly cookie — simpler to build, but in production an httpOnly cookie is safer against XSS.
- Always use a long, random `JWT_SECRET` in production and never commit `.env` to git.
