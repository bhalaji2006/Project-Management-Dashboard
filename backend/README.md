# PM Dashboard — Backend

Node.js + Express REST API for the Project Management Dashboard.
Data is stored in simple JSON files under `data/` — no database setup required.

## Setup (in VS Code terminal)

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

The API will run at **http://localhost:5000**. Health check: `GET http://localhost:5000/api/health`.

(`npm run dev` uses nodemon and auto-restarts on file changes. Use `npm start` for a plain run.)

## Environment variables (`.env`)

| Variable | Description | Default |
|---|---|---|
| PORT | Port the server listens on | 5000 |
| JWT_SECRET | Secret used to sign auth tokens — change this! | dev_secret |
| JWT_EXPIRES_IN | Token lifetime | 7d |

## API Overview

### Auth
- `POST /api/auth/register` — `{ name, email, password }` → `{ token, user }`
- `POST /api/auth/login` — `{ email, password }` → `{ token, user }`

All routes below require header `Authorization: Bearer <token>`.

### Projects
- `GET /api/projects` — list your projects (with task counts/progress)
- `POST /api/projects` — `{ name, description, status, dueDate }`
- `GET /api/projects/:id` — one project + its tasks
- `PUT /api/projects/:id` — update fields
- `DELETE /api/projects/:id` — delete project + its tasks

### Tasks
- `GET /api/tasks/project/:projectId` — list tasks for a project
- `POST /api/tasks/project/:projectId` — `{ title, description, status, priority, assignee, dueDate }`
- `PUT /api/tasks/:id` — update any field (e.g. just `{ status: "Done" }`)
- `DELETE /api/tasks/:id`

### Dashboard
- `GET /api/dashboard/stats` — aggregate counts for the logged-in user

## Data storage

`data/users.json`, `data/projects.json`, `data/tasks.json` are created automatically on first run.
Delete them any time to reset the app.
