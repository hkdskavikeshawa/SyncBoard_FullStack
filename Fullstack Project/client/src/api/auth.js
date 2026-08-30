const API_BASE_URL = 'http://localhost:5000/api';

const getHeaders = (token) => {
  const headers = { 'Content-Type': 'application/json' };
  const authToken = token || localStorage.getItem('token');
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  return headers;
};

export async function login(email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Invalid email or password');
  }

  return data;
}

export async function register(name, email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Registration failed');
  }

  return data;
}

export function getCurrentUser(token) {
  const authToken = token || localStorage.getItem('token');
  if (!authToken) return null;
  try {
    const payload = JSON.parse(atob(authToken.split('.')[1]));
    if (payload.exp && payload.exp * 1000 < Date.now()) return null; // Expired
    return { id: payload.id, email: payload.email, name: payload.name };
  } catch (e) {
    return null;
  }
}

export async function getUserByEmail(email) {
  const response = await fetch(`${API_BASE_URL}/auth/user?email=${encodeURIComponent(email)}`, {
    headers: getHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'User not found');
  }

  return data;
}
