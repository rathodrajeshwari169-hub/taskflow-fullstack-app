const express = require('express');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// All routes below require a valid JWT
router.use(requireAuth);

// GET /api/tasks - list all tasks for the logged-in user (optional ?status= filter)
router.get('/', (req, res) => {
  const { status } = req.query;

  let tasks;
  if (status) {
    tasks = db
      .prepare('SELECT * FROM tasks WHERE user_id = ? AND status = ? ORDER BY created_at DESC')
      .all(req.userId, status);
  } else {
    tasks = db
      .prepare('SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC')
      .all(req.userId);
  }

  res.json(tasks);
});

// POST /api/tasks - create a task
router.post('/', (req, res) => {
  const { title, description } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const result = db
    .prepare('INSERT INTO tasks (user_id, title, description) VALUES (?, ?, ?)')
    .run(req.userId, title.trim(), description || '');

  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(task);
});

// PUT /api/tasks/:id - update a task (title, description, status)
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;

  const task = db.prepare('SELECT * FROM tasks WHERE id = ? AND user_id = ?').get(id, req.userId);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  db.prepare('UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?').run(
    title !== undefined ? title : task.title,
    description !== undefined ? description : task.description,
    status !== undefined ? status : task.status,
    id
  );

  const updated = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  res.json(updated);
});

// DELETE /api/tasks/:id
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  const task = db.prepare('SELECT * FROM tasks WHERE id = ? AND user_id = ?').get(id, req.userId);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
  res.status(204).send();
});

module.exports = router;
