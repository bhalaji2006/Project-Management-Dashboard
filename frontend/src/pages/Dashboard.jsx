import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import StatCard from '../components/StatCard';

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', status: 'Active', dueDate: '' });
  const [error, setError] = useState('');

  async function loadData() {
    setLoading(true);
    try {
      const [projectsRes, statsRes] = await Promise.all([
        api.get('/projects'),
        api.get('/dashboard/stats'),
      ]);
      setProjects(projectsRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleCreateProject(e) {
    e.preventDefault();
    setError('');
    if (!form.name.trim()) {
      setError('Project name is required.');
      return;
    }
    try {
      await api.post('/projects', form);
      setShowModal(false);
      setForm({ name: '', description: '', status: 'Active', dueDate: '' });
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create project.');
    }
  }

  async function handleDeleteProject(id) {
    if (!confirm('Delete this project and all of its tasks?')) return;
    await api.delete(`/projects/${id}`);
    loadData();
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Dashboard</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + New Project
        </button>
      </div>

      {stats && (
        <div className="stats-grid">
          <StatCard label="Total Projects" value={stats.totalProjects} accent="blue" />
          <StatCard label="Active Projects" value={stats.activeProjects} accent="green" />
          <StatCard label="Total Tasks" value={stats.totalTasks} accent="purple" />
          <StatCard label="Overdue Tasks" value={stats.overdueTasks} accent="red" />
        </div>
      )}

      <h2 className="section-title">Your Projects</h2>

      {loading ? (
        <p>Loading projects...</p>
      ) : projects.length === 0 ? (
        <div className="empty-state">
          <p>You don't have any projects yet.</p>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            Create your first project
          </button>
        </div>
      ) : (
        <div className="project-grid">
          {projects.map((p) => (
            <div key={p.id} className="project-card">
              <div className="project-card-header">
                <span className={`badge badge-${p.status.toLowerCase().replace(' ', '-')}`}>
                  {p.status}
                </span>
                <button
                  className="icon-btn"
                  title="Delete project"
                  onClick={() => handleDeleteProject(p.id)}
                >
                  ✕
                </button>
              </div>
              <Link to={`/projects/${p.id}`} className="project-card-title">
                {p.name}
              </Link>
              <p className="project-card-desc">{p.description || 'No description'}</p>
              <div className="progress-bar">
                <div className="progress-bar-fill" style={{ width: `${p.progress}%` }} />
              </div>
              <div className="project-card-footer">
                <span>{p.doneCount}/{p.taskCount} tasks done</span>
                {p.dueDate && <span>Due {new Date(p.dueDate).toLocaleDateString()}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <form
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleCreateProject}
          >
            <h2>New Project</h2>
            {error && <div className="alert alert-error">{error}</div>}

            <label>Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Website Redesign"
              required
            />

            <label>Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="What is this project about?"
              rows={3}
            />

            <label>Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option>Active</option>
              <option>On Hold</option>
              <option>Completed</option>
            </select>

            <label>Due date</label>
            <input
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            />

            <div className="modal-actions">
              <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Create Project
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
