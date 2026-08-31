const API_BASE_URL = 'http://localhost:5000/api';

export class NotFoundError extends Error {}

let FAIL_NEXT = false;
export function simulateNextFailure() { FAIL_NEXT = true; }

const getHeaders = () => {
  const headers = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

async function handleResponse(response) {
  if (FAIL_NEXT) {
    FAIL_NEXT = false;
    throw new Error('Network request failed');
  }

  const data = await response.json();
  if (!response.ok) {
    if (response.status === 404) {
      throw new NotFoundError(data.message || 'Resource not found');
    }
    throw new Error(data.message || 'API request failed');
  }
  return data;
}

/* ---------------- Tasks ---------------- */

export async function getTasks(boardId) {
  const response = await fetch(`${API_BASE_URL}/tasks?boardId=${boardId}`, {
    headers: getHeaders(),
  });
  return handleResponse(response);
}

export async function getTaskById(id) {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    headers: getHeaders(),
  });
  return handleResponse(response);
}

export async function createTask(input) {
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(input),
  });
  return handleResponse(response);
}

export async function updateTask(id, patch) {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(patch),
  });
  return handleResponse(response);
}

export async function deleteTask(id) {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return handleResponse(response);
}

/* ---------------- Columns ---------------- */

export async function getColumns(boardId) {
  const response = await fetch(`${API_BASE_URL}/columns?boardId=${boardId}`, {
    headers: getHeaders(),
  });
  return handleResponse(response);
}

export async function createColumn(boardId, name) {
  const response = await fetch(`${API_BASE_URL}/columns`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ boardId, name }),
  });
  return handleResponse(response);
}

export async function updateColumn(id, patch) {
  const response = await fetch(`${API_BASE_URL}/columns/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(patch),
  });
  return handleResponse(response);
}

export async function deleteColumn(id) {
  const response = await fetch(`${API_BASE_URL}/columns/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return handleResponse(response);
}

/* ---------------- Boards ---------------- */

export async function getBoards() {
  const response = await fetch(`${API_BASE_URL}/boards`, {
    headers: getHeaders(),
  });
  return handleResponse(response);
}

export async function createBoard(name) {
  const response = await fetch(`${API_BASE_URL}/boards`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ name }),
  });
  return handleResponse(response);
}

export async function updateBoard(id, patch) {
  const response = await fetch(`${API_BASE_URL}/boards/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(patch),
  });
  return handleResponse(response);
}

export async function deleteBoard(id) {
  const response = await fetch(`${API_BASE_URL}/boards/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return handleResponse(response);
}

export async function inviteUserByEmail(boardId, email) {
  const response = await fetch(`${API_BASE_URL}/boards/${boardId}/invite`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ email }),
  });
  return handleResponse(response);
}

/* ---------------- Members ---------------- */

export async function getMembers() {
  const response = await fetch(`${API_BASE_URL}/members`, {
    headers: getHeaders(),
  });
  return handleResponse(response);
}

/* ---------------- Comments ---------------- */

export async function getComments(taskId) {
  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/comments`, {
    headers: getHeaders(),
  });
  return handleResponse(response);
}

export async function addComment(taskId, { text, authorId, authorName }) {
  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/comments`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ text, authorId, authorName }),
  });
  return handleResponse(response);
}

