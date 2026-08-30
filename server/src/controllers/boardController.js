import { store } from '../data/store.js';
import { cryptoRandomUUID } from '../utils/idGenerator.js';
import { sendInviteEmail } from '../utils/emailService.js';
import { createNotification, notifyBoardMembers } from './notificationController.js';

export const getBoards = (req, res) => {
  const userId = req.user.id;
  const userBoards = store.boards.filter(
    (b) => b.ownerId === userId || (b.invitedMembers && b.invitedMembers.includes(userId))
  );
  res.json(userBoards);
};

export const createBoard = (req, res) => {
  const { name } = req.body;
  const ownerId = req.user.id;

  if (!name) {
    return res.status(400).json({ message: 'Board name is required' });
  }

  const defaultMockMembers = Array.from(new Set(['u1', 'u2', 'u3', ownerId]));

  const newBoard = {
    id: cryptoRandomUUID(),
    name,
    ownerId,
    invitedMembers: defaultMockMembers
  };

  store.boards.push(newBoard);

  // Add default columns for the new board
  const defaultCols = ['To Do', 'In Progress', 'Done'];
  defaultCols.forEach((colName, index) => {
    store.columns.push({
      id: cryptoRandomUUID(),
      boardId: newBoard.id,
      name: colName,
      order: index + 1
    });
  });

  // Create notification for board owner
  createNotification({
    userId: ownerId,
    message: `You created board "${newBoard.name}"`,
    actor: req.user?.name || 'You'
  });

  res.status(201).json(newBoard);
};

export const updateBoard = (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const board = store.boards.find((b) => b.id === id);
  if (!board) {
    return res.status(404).json({ message: 'Board not found' });
  }

  if (name !== undefined) board.name = name;

  res.json(board);
};

export const deleteBoard = (req, res) => {
  const { id } = req.params;

  const index = store.boards.findIndex((b) => b.id === id);
  if (index === -1) {
    return res.status(404).json({ message: 'Board not found' });
  }

  store.boards.splice(index, 1);
  // Cascade clean columns and tasks for this board
  store.columns = store.columns.filter((c) => c.boardId !== id);
  store.tasks = store.tasks.filter((t) => t.boardId !== id);

  res.json({ message: 'Board deleted successfully', id });
};

export const inviteMemberToBoard = async (req, res) => {
  const { id } = req.params;
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'User email is required' });
  }

  const board = store.boards.find((b) => b.id === id);
  if (!board) {
    return res.status(404).json({ message: 'Board not found' });
  }

  const user = store.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (board.ownerId === user.id) {
    return res.status(400).json({ message: 'User is already the owner of this board' });
  }

  board.invitedMembers = board.invitedMembers || [];
  if (board.invitedMembers.includes(user.id)) {
    return res.status(400).json({ message: 'User is already invited to this board' });
  }

  board.invitedMembers.push(user.id);

  const inviterName = req.user?.name || 'A teammate';

  // Notify all board participants/collaborators
  notifyBoardMembers({
    boardId: board.id,
    actorId: req.user?.id,
    actorName: inviterName,
    actionMessage: `invited ${user.name || user.email} to join board "${board.name}"`,
    excludeUserIds: [user.id]
  });

  // Specific notification for the newly invited user
  createNotification({
    userId: user.id,
    message: `${inviterName} invited you to join board "${board.name}"`,
    actor: inviterName
  });

  // Send invitation email in background
  sendInviteEmail({
    toEmail: user.email,
    inviterName: inviterName,
    boardName: board.name,
  }).catch((err) => console.error('Error sending invite email:', err));

  res.json(board);
};


