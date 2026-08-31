const API_BASE_URL = 'http://localhost:5000/api';

const getHeaders = () => {
  const headers = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export async function getNotifications() {
  const token = localStorage.getItem('token');
  if (!token) return [];
  const response = await fetch(`${API_BASE_URL}/notifications`, {
    headers: getHeaders(),
  });
  if (!response.ok) {
    return [];
  }
  return response.json();
}

export async function markNotificationsAsRead() {
  const response = await fetch(`${API_BASE_URL}/notifications/read`, {
    method: 'PUT',
    headers: getHeaders(),
  });
  if (!response.ok) return { success: false };
  return response.json();
}

export async function clearNotifications() {
  const response = await fetch(`${API_BASE_URL}/notifications`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  if (!response.ok) return { success: false };
  return response.json();
}
