# PM Dashboard — Frontend

React (Vite) single-page app for the Project Management Dashboard.

## Setup (in VS Code terminal)

Make sure the backend is running first (see backend/README.md), then:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Open **http://localhost:5173** in your browser.

## Environment variables (`.env`)

| Variable | Description | Default |
|---|---|---|
| VITE_API_URL | Base URL of the backend API | http://localhost:5000/api |

## Pages

- `/register`, `/login` — auth
- `/` — dashboard: stats + project cards, create/delete projects
- `/projects/:id` — Kanban board (To Do / In Progress / Done) for a project's tasks; create, edit, move, and delete tasks

## Build for production

```bash
npm run build
npm run preview
```
