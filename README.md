# Project Management Dashboard

| Intern ID | Full Name | No. of Weeks | Project Name | Project Scope |
|---|---|---|---|---|
| CITS9146 | Kuddigana venkatbhalaji | 8 Weeks | Project Management Dashboard | Full-stack project management platform covering user authentication, project creation and tracking, task management with a Kanban board (To Do / In Progress / Done), task priority and assignee tracking, due dates, project progress visualization, and a real-time dashboard with aggregate project and task statistics. |

A full-stack Project Management Dashboard.

## Structure

- `backend/` — Node.js + Express API (JSON-file database, JWT auth). See its README for the full API reference.
- `frontend/` — React + Vite frontend. See its README for a feature tour.

## Quick start

Open this folder in VS Code, then use two terminals:

**Terminal 1 — backend:**
```bash
cd backend
npm install
copy .env.example .env    # (use `cp` instead of `copy` on macOS/Linux)
npm run dev
```
Runs at http://localhost:5000

**Terminal 2 — frontend:**
```bash
cd frontend
npm install
copy .env.example .env    # (use `cp` instead of `copy` on macOS/Linux)
npm run dev
```
Runs at http://localhost:5173

Open http://localhost:5173 in your browser. Both terminals need to stay running.

## Features

- Authentication (signup / login with JWT-protected routes)
- Project creation, editing, and deletion with status (Active / On Hold / Completed)
- Task management with a 3-column Kanban board (To Do / In Progress / Done)
- Task priority levels, assignee names, and due dates
- Per-project progress bars based on completed vs. total tasks
- Dashboard overview with live stats: total/active projects, total tasks, and overdue tasks
- Overdue task detection based on due date and status
