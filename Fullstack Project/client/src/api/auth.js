const DELAY = 500;
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

// Mock database for users stored in localStorage to persist across tabs
const getUsers = () => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  if (users.length === 0) {
    // Seed a default demo user
    const demoUser = { id: 'u1', name: 'Demo User', email: 'demo@example.com', password: 'password123' };
    users.push(demoUser);
    localStorage.setItem('users', JSON.stringify(users));
  }
  return users;
};
const saveUsers = (users) => localStorage.setItem('users', JSON.stringify(users));

export async function login(email, password) {
  await sleep(DELAY);
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Generate a mock JWT
  const token = btoa(JSON.stringify({ id: user.id, email: user.email, name: user.name, exp: Date.now() + 86400000 }));
  
  return {
    user: { id: user.id, email: user.email, name: user.name },
    token
  };
}

export async function register(name, email, password) {
  await sleep(DELAY);
  const users = getUsers();
  
  if (users.some(u => u.email === email)) {
    throw new Error('User with this email already exists');
  }

  const newUser = {
    id: crypto.randomUUID(),
    name,
    email,
    password // Storing plaintext only because this is a mock frontend-only system!
  };

  users.push(newUser);
  saveUsers(users);

  const token = btoa(JSON.stringify({ id: newUser.id, email: newUser.email, name: newUser.name, exp: Date.now() + 86400000 }));

  return {
    user: { id: newUser.id, email: newUser.email, name: newUser.name },
    token
  };
}

export function getCurrentUser(token) {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token));
    if (payload.exp < Date.now()) return null; // Expired
    return { id: payload.id, email: payload.email, name: payload.name };
  } catch (e) {
    return null;
  }
}
