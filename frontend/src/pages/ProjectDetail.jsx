import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

const COLUMNS = ['To Do', 'In Progress', 'Done'];
const PRIORITIES = ['Low', 'Medium', 'High'];

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'To Do',
    priority: 'Medium',
    assignee: '',
    dueDate: '',
  });

  async function loadProject() {
    setLoading(true);
    try {
      const res = await api.get(`/projects/${id}`);
      setProject(res.data);
      setTasks(res.data.tasks);
    } catch (err) {
      console.error(err);
      navigate('/');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  function openNewTaskModal() {
    setEditingTask(null);
    setForm({ title: '', description: '', status: 'To Do', priority: 'Medium', assignee: '', dueDate: '' });
    setError('');
    setShowModal(true);
  }

  function openEditTaskModal(task) {
    setEditingTask(task);
    setForm({
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      assignee: task.assignee || '',
      dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
    });
    setError('');
    setShowModal(true);
  }

  async function handleSaveTask(e) {
    e.preventDefault();
    setError('');
    if (!form.title.trim()) {
      setError('Task title is required.');
      return;
    }
    try {
      if (editingTask) {
        await api.put(`/tasks/${editingTask.id}`, form);
      } else {
        await api.post(`/tasks/project/${id}`, form);
      }
      setShowModal(false);
      loadProject();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save task.');
    }
  }

  async function handleDeleteTask(taskId) {
    if (!confirm('Delete this task?')) return;
    await api.delete(`/tasks/${taskId}`);
    loadProject();
  }

  async function handleStatusChange(task, newStatus) {
    await api.put(`/tasks/${task.id}`, { status: newStatus });
    loadProject();
  }

  if (loading) return <div className="page-container">Loading project...</div>;
  if (!project) return null;

  return (
    <div className="page-container">
      <button className="btn btn-ghost back-link" onClick={() => navigate('/')}>
        ← Back to Dashboard
      </button>

      <div className="page-header">
        <div>
          <h1>{project.name}</h1>
          <p className="project-detail-desc">{project.description}</p>
        </div>
        <button className="btn btn-primary" onClick={openNewTaskModal}>
          + New Task
        </button>
      </div>

      <div className="kanban-board">
        {COLUMNS.map((col) => (
          <div className="kanban-column" key={col}>
            <div className="kanban-column-header">
              <h3>{col}</h3>
              <span className="kanban-count">
                {tasks.filter((t) => t.status === col).length}
              </span>
            </div>
            <div className="kanban-column-body">
              {tasks
                .filter((t) => t.status === col)
                .map((task) => (
                  <div className="task-card" key={task.id}>
                    <div className="task-card-top">
                      <span className={`priority-dot priority-${task.priority.toLowerCase()}`} />
                      <span className="task-priority-label">{task.priority}</span>
                      <button
                        className="icon-btn"
                        title="Delete task"
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        ✕
                      </button>
                    </div>
                    <p className="task-title" onClick={() => openEditTaskModal(task)}>
                      {task.title}
                    </p>
                    {task.description && <p className="task-desc">{task.description}</p>}
                    <div className="task-meta">
                      {task.assignee && <span>👤 {task.assignee}</span>}
                      {task.dueDate && <span>📅 {new Date(task.dueDate).toLocaleDateString()}</span>}
                    </div>
                    <select
                      className="task-status-select"
                      value={task.status}
                      onChange={(e) => handleStatusChange(task, e.target.value)}
                    >
                      {COLUMNS.map((c) => (
                        <option key={c} value={c}>
                          Move to: {c}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <form className="modal-card" onClick={(e) => e.stopPropagation()} onSubmit={handleSaveTask}>
            <h2>{editingTask ? 'Edit Task' : 'New Task'}</h2>
            {error && <div className="alert alert-error">{error}</div>}

            <label>Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Design homepage mockup"
              required
            />

            <label>Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
            />

            <div className="form-row">
              <div>
                <label>Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  {COLUMNS.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label>Priority</label>
                <select
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value })}
                >
                  {PRIORITIES.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div>
                <label>Assignee</label>
                <input
                  type="text"
                  value={form.assignee}
                  onChange={(e) => setForm({ ...form, assignee: e.target.value })}
                  placeholder="Name"
                />
              </div>
              <div>
                <label>Due date</label>
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                />
              </div>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {editingTask ? 'Save Changes' : 'Create Task'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
