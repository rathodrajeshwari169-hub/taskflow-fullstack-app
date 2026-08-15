const BASE_URL = 'const BASE_URL = 'https://taskflow-fullstack-app-h5r9.onrender.com/api';

async function request(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return null;

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || 'Something went wrong');
  }

  return data;
}

export const api = {
  signup: (email, password) => request('/auth/signup', { method: 'POST', body: { email, password } }),
  login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password } }),
  getTasks: (token, status) => request(`/tasks${status ? `?status=${status}` : ''}`, { token }),
  createTask: (token, title, description) => request('/tasks', { method: 'POST', body: { title, description }, token }),
  updateTask: (token, id, updates) => request(`/tasks/${id}`, { method: 'PUT', body: updates, token }),
  deleteTask: (token, id) => request(`/tasks/${id}`, { method: 'DELETE', token }),
};
