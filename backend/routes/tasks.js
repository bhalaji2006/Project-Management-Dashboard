const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { readCollection, writeCollection } = require('../utils/db');

const router = express.Router();

function projectBelongsToUser(projectId, userId) {
  const projects = readCollection('projects');
  return projects.some((p) => p.id === projectId && p.ownerId === userId);
}

// GET /api/tasks/project/:projectId - all tasks for a project
router.get('/project/:projectId', (req, res) => {
  if (!projectBelongsToUser(req.params.projectId, req.user.id)) {
    return res.status(404).json({ message: 'Project not found.' });
  }
  const tasks = readCollection('tasks').filter((t) => t.projectId === req.params.projectId);
  res.json(tasks);
});

// POST /api/tasks/project/:projectId - create a task
router.post('/project/:projectId', (req, res) => {
  const { projectId } = req.params;
  if (!projectBelongsToUser(projectId, req.user.id)) {
    return res.status(404).json({ message: 'Project not found.' });
  }

  const { title, description, status, priority, assignee, dueDate } = req.body;
  if (!title) {
    return res.status(400).json({ message: 'Task title is required.' });
  }

  const tasks = readCollection('tasks');
  const newTask = {
    id: uuidv4(),
    projectId,
    title,
    description: description || '',
    status: status || 'To Do',
    priority: priority || 'Medium',
    assignee: assignee || '',
    dueDate: dueDate || null,
    createdAt: new Date().toISOString(),
  };

  tasks.push(newTask);
  writeCollection('tasks', tasks);
  res.status(201).json(newTask);
});

// PUT /api/tasks/:id - update a task (status change, edits, etc.)
router.put('/:id', (req, res) => {
  const tasks = readCollection('tasks');
  const idx = tasks.findIndex((t) => t.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ message: 'Task not found.' });
  }
  if (!projectBelongsToUser(tasks[idx].projectId, req.user.id)) {
    return res.status(403).json({ message: 'Not authorized to modify this task.' });
  }

  const { title, description, status, priority, assignee, dueDate } = req.body;
  tasks[idx] = {
    ...tasks[idx],
    title: title ?? tasks[idx].title,
    description: description ?? tasks[idx].description,
    status: status ?? tasks[idx].status,
    priority: priority ?? tasks[idx].priority,
    assignee: assignee ?? tasks[idx].assignee,
    dueDate: dueDate ?? tasks[idx].dueDate,
    updatedAt: new Date().toISOString(),
  };

  writeCollection('tasks', tasks);
  res.json(tasks[idx]);
});

// DELETE /api/tasks/:id
router.delete('/:id', (req, res) => {
  const tasks = readCollection('tasks');
  const task = tasks.find((t) => t.id === req.params.id);
  if (!task) {
    return res.status(404).json({ message: 'Task not found.' });
  }
  if (!projectBelongsToUser(task.projectId, req.user.id)) {
    return res.status(403).json({ message: 'Not authorized to delete this task.' });
  }

  const remaining = tasks.filter((t) => t.id !== req.params.id);
  writeCollection('tasks', remaining);
  res.json({ message: 'Task deleted successfully.' });
});

module.exports = router;
