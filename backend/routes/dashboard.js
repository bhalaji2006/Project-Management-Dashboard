const express = require('express');
const { readCollection } = require('../utils/db');

const router = express.Router();

// GET /api/dashboard/stats - overview stats for the logged-in user
router.get('/stats', (req, res) => {
  const projects = readCollection('projects').filter((p) => p.ownerId === req.user.id);
  const projectIds = new Set(projects.map((p) => p.id));
  const tasks = readCollection('tasks').filter((t) => projectIds.has(t.projectId));

  const totalProjects = projects.length;
  const activeProjects = projects.filter((p) => p.status === 'Active').length;
  const completedProjects = projects.filter((p) => p.status === 'Completed').length;

  const totalTasks = tasks.length;
  const todoTasks = tasks.filter((t) => t.status === 'To Do').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'In Progress').length;
  const doneTasks = tasks.filter((t) => t.status === 'Done').length;

  const now = new Date();
  const overdueTasks = tasks.filter(
    (t) => t.dueDate && new Date(t.dueDate) < now && t.status !== 'Done'
  ).length;

  res.json({
    totalProjects,
    activeProjects,
    completedProjects,
    totalTasks,
    todoTasks,
    inProgressTasks,
    doneTasks,
    overdueTasks,
  });
});

module.exports = router;
