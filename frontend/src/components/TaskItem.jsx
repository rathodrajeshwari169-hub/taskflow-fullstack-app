import { useState } from 'react';

export function TaskItem({ task, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');

  function saveEdit() {
    if (!title.trim()) return;
    onEdit(task.id, { title: title.trim(), description });
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <li className="task-item task-item--editing">
        <input
          className="edit-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
        />
        <textarea
          className="edit-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
          rows={2}
        />
        <div className="task-actions">
          <button className="btn-small btn-primary" onClick={saveEdit}>Save</button>
          <button className="btn-small" onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      </li>
    );
  }

  return (
    <li className={`task-item ${task.status === 'done' ? 'task-item--done' : ''}`}>
      <label className="task-checkbox">
        <input
          type="checkbox"
          checked={task.status === 'done'}
          onChange={() => onToggle(task)}
        />
        <span className="checkmark" />
      </label>

      <div className="task-body">
        <p className="task-title">{task.title}</p>
        {task.description && <p className="task-desc">{task.description}</p>}
      </div>

      <div className="task-actions">
        <button className="btn-small" onClick={() => setIsEditing(true)}>Edit</button>
        <button className="btn-small btn-danger" onClick={() => onDelete(task.id)}>Delete</button>
      </div>
    </li>
  );
}
