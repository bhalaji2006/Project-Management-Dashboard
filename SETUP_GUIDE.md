# Project Management Dashboard — Setup Guide

A full-stack app: React (Vite) frontend + Node/Express backend, with JWT login,
projects, and a drag-free Kanban board (To Do / In Progress / Done).
Data is stored in local JSON files — no database install needed.

## 1. Unzip both folders

Unzip `backend.zip` and `frontend.zip` into the same parent folder, e.g.:

```
pm-dashboard/
  backend/
  frontend/
```

Open that parent folder in VS Code (`File > Open Folder`).

## 2. Start the backend

Open a terminal in VS Code (`` Ctrl+` ``):

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

You should see: `PM Dashboard API listening on http://localhost:5000`

## 3. Start the frontend

Open a **second** terminal (`+` icon in the terminal panel):

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

You should see a local URL, typically **http://localhost:5173**. Open it in your browser.

## 4. Use the app

1. Click **Sign up**, create an account.
2. Click **+ New Project**, give it a name.
3. Open the project, click **+ New Task** to add tasks with priority, assignee, and due date.
4. Move tasks between **To Do / In Progress / Done** using the dropdown on each task card.
5. The Dashboard shows live stats: total/active projects, total tasks, overdue tasks.

## Notes

- Both `npm run dev` commands need to stay running in their own terminals while you use the app.
- On Windows, use `copy .env.example .env` instead of `cp .env.example .env`.
- To fully reset all data, stop the backend and delete the files inside `backend/data/`.
- For production, change `JWT_SECRET` in `backend/.env` to a long random string.

## Tech stack

- **Frontend:** React 18, Vite, React Router, Axios
- **Backend:** Node.js, Express, JWT (jsonwebtoken), bcryptjs, JSON-file storage
