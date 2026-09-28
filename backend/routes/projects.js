const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { readCollection, writeCollection } = require('../utils/db');

const router = express.Router();

// GET /api/projects - all projects owned by the logged-in user
router.get('/', (req, res) => {
  const projects = readCollection('projects').filter((p) => p.ownerId === req.user.id);
  const tasks = readCollection('tasks');

  const withStats = projects.map((p) => {
    const projectTasks = tasks.filter((t) => t.projectId === p.id);
    const total = projectTasks.length;
    const done = projectTasks.filter((t) => t.status === 'Done').length;
    return {
      ...p,
      taskCount: total,
      doneCount: done,
      progress: total === 0 ? 0 : Math.round((done / total) * 100),
    };
  });

  res.json(withStats);
});

// POST /api/projects - create a new project
router.post('/', (req, res) => {
  const { name, description, status, dueDate } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'Project name is required.' });
  }

  const projects = readCollection('projects');
  const newProject = {
    id: uuidv4(),
    ownerId: req.user.id,
    name,
    description: description || '',
    status: status || 'Active',
    dueDate: dueDate || null,
    createdAt: new Date().toISOString(),
  };

  projects.push(newProject);
  writeCollection('projects', projects);
  res.status(201).json(newProject);
});

// GET /api/projects/:id - single project (with tasks)
router.get('/:id', (req, res) => {
  const projects = readCollection('projects');
  const project = projects.find((p) => p.id === req.params.id && p.ownerId === req.user.id);
  if (!project) {
    return res.status(404).json({ message: 'Project not found.' });
  }
  const tasks = readCollection('tasks').filter((t) => t.projectId === project.id);
  res.json({ ...project, tasks });
});

// PUT /api/projects/:id - update project
router.put('/:id', (req, res) => {
  const projects = readCollection('projects');
  const idx = projects.findIndex((p) => p.id === req.params.id && p.ownerId === req.user.id);
  if (idx === -1) {
    return res.status(404).json({ message: 'Project not found.' });
  }

  const { name, description, status, dueDate } = req.body;
  projects[idx] = {
    ...projects[idx],
    name: name ?? projects[idx].name,
    description: description ?? projects[idx].description,
    status: status ?? projects[idx].status,
    dueDate: dueDate ?? projects[idx].dueDate,
    updatedAt: new Date().toISOString(),
  };

  writeCollection('projects', projects);
  res.json(projects[idx]);
});

// DELETE /api/projects/:id - delete project and its tasks
router.delete('/:id', (req, res) => {
  const projects = readCollection('projects');
  const project = projects.find((p) => p.id === req.params.id && p.ownerId === req.user.id);
  if (!project) {
    return res.status(404).json({ message: 'Project not found.' });
  }

  const remainingProjects = projects.filter((p) => p.id !== req.params.id);
  writeCollection('projects', remainingProjects);

  const tasks = readCollection('tasks').filter((t) => t.projectId !== req.params.id);
  writeCollection('tasks', tasks);

  res.json({ message: 'Project deleted successfully.' });
});

module.exports = router;
