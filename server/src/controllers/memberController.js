import { store } from '../data/store.js';

export const getMembers = (req, res) => {
  const membersList = store.users.map(u => ({ id: u.id, name: u.name, email: u.email }));
  res.json(membersList);
};

