import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { TaskItem } from '../components/TaskItem';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'done', label: 'Done' },
];

export default function Dashboard() {
  const { token, user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      const status = filter === 'all' ? undefined : filter;
      const data = await api.getTasks(token, status);
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, filter]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  async function handleCreate(e) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    try {
      const task = await api.createTask(token, newTitle.trim(), newDesc.trim());
      setNewTitle('');
      setNewDesc('');
      if (filter === 'all' || filter === 'pending') {
        setTasks((prev) => [task, ...prev]);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleToggle(task) {
    const nextStatus = task.status === 'done' ? 'pending' : 'done';
    try {
      const updated = await api.updateTask(token, task.id, { status: nextStatus });
      setTasks((prev) =>
        filter === 'all'
          ? prev.map((t) => (t.id === task.id ? updated : t))
          : prev.filter((t) => t.id !== task.id).concat(updated.status === filter ? [updated] : [])
      );
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleEdit(id, updates) {
    try {
      const updated = await api.updateTask(token, id, updates);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    try {
      await api.deleteTask(token, id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Your Tasks</h1>
          <p className="user-email">{user?.email}</p>
        </div>
        <button className="btn-small" onClick={logout}>Log out</button>
      </header>

      {error && <div className="error-banner">{error}</div>}

      <form className="new-task-form" onSubmit={handleCreate}>
        <input
          placeholder="What needs doing?"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <input
          placeholder="Description (optional)"
          value={newDesc}
          onChange={(e) => setNewDesc(e.target.value)}
        />
        <button type="submit" className="btn-primary">Add task</button>
      </form>

      <div className="filter-bar">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            className={`filter-btn ${filter === f.key ? 'filter-btn--active' : ''}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="empty-state">Loading…</p>
      ) : tasks.length === 0 ? (
        <p className="empty-state">No tasks here yet.</p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={handleToggle}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
