import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cryptoRandomUUID } from '../utils/idGenerator.js';
import { store } from '../data/store.js';

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    process.env.JWT_SECRET || 'syncboard_super_secret_key_2026',
    { expiresIn: '30d' }
  );
};

export const registerUser = (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  const userExists = store.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (userExists) {
    return res.status(400).json({ message: 'User with this email already exists' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = {
    id: cryptoRandomUUID(),
    name,
    email,
    password: hashedPassword,
  };

  store.users.push(newUser);
  store.members.push({ id: newUser.id, name: newUser.name, email: newUser.email });

  const token = generateToken(newUser);
  res.status(201).json({
    user: { id: newUser.id, name: newUser.name, email: newUser.email },
    token,
  });
};

export const loginUser = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  const user = store.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = generateToken(user);
  res.json({
    user: { id: user.id, name: user.name, email: user.email },
    token,
  });
};

export const getMe = (req, res) => {
  const user = store.users.find((u) => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json({ user: { id: user.id, name: user.name, email: user.email } });
};

export const getUserByEmail = (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ message: 'Email query param required' });
  }
  const user = store.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json({ id: user.id, name: user.name, email: user.email });
};
