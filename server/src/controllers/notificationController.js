import { store } from '../data/store.js';
import { cryptoRandomUUID } from '../utils/idGenerator.js';

export const createNotification = ({ userId, message, actor = 'System' }) => {
  if (!userId || !message) return null;
  const notif = {
    id: cryptoRandomUUID(),
    userId,
    message,
    actor,
    timestamp: new Date().toISOString(),
    read: false
  };
  store.notifications = store.notifications || [];
  store.notifications.unshift(notif);
  // Keep last 100 notifications total
  if (store.notifications.length > 100) {
    store.notifications = store.notifications.slice(0, 100);
  }
  return notif;
};

export const notifyBoardMembers = ({ boardId, actorId, actorName = 'A teammate', actionMessage, excludeUserIds = [] }) => {
  if (!boardId || !actionMessage) return;

  const board = store.boards.find(b => b.id === boardId);
  if (!board) return;

  // Strictly notify ONLY actual members/participants of this specific board (owner + invited members)
  const memberSet = new Set([board.ownerId, ...(board.invitedMembers || [])]);

  memberSet.forEach(userId => {
    if (!userId || excludeUserIds.includes(userId)) return;

    const isActor = userId === actorId;
    const finalMessage = isActor 
      ? `You ${actionMessage}` 
      : `${actorName} ${actionMessage}`;

    createNotification({
      userId,
      message: finalMessage,
      actor: isActor ? 'You' : actorName
    });
  });
};

export const getUserNotifications = (req, res) => {
  const userId = req.user.id;
  store.notifications = store.notifications || [];
  const userNotifs = store.notifications.filter(n => n.userId === userId);
  res.json(userNotifs);
};

export const markNotificationsRead = (req, res) => {
  const userId = req.user.id;
  store.notifications = store.notifications || [];
  store.notifications = store.notifications.map(n => {
    if (n.userId === userId) {
      return { ...n, read: true };
    }
    return n;
  });
  res.json({ message: 'All notifications marked as read' });
};

export const clearUserNotifications = (req, res) => {
  const userId = req.user.id;
  store.notifications = store.notifications || [];
  store.notifications = store.notifications.filter(n => n.userId !== userId);
  res.json({ message: 'All notifications cleared' });
};
