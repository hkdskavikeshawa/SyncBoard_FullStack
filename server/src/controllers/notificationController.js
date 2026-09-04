import Notification from '../models/Notification.js';
import Board from '../models/Board.js';

export const getUserNotifications = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    next(error);
  }
};

export const markNotificationRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findById(id);
    
    if (notification) {
      notification.read = true;
      await notification.save();
      res.json(notification);
    } else {
      res.status(404).json({ message: 'Notification not found' });
    }
  } catch (error) {
    next(error);
  }
};

export const createNotification = async ({ userId, message, actor }) => {
  try {
    await Notification.create({
      userId,
      message,
      type: 'info'
    });
  } catch (error) {
    console.error('Error creating notification', error);
  }
};

export const notifyBoardMembers = async ({ boardId, actorId, actorName, actionMessage, excludeUserIds = [] }) => {
  try {
    const board = await Board.findById(boardId);
    if (!board) return;

    const membersToNotify = new Set([board.ownerId.toString(), ...board.invitedMembers.map(id => id.toString())]);

    // Don't notify the person who did the action
    if (actorId) membersToNotify.delete(actorId.toString());

    // Don't notify specifically excluded users
    excludeUserIds.forEach(id => membersToNotify.delete(id.toString()));

    const notificationsToCreate = Array.from(membersToNotify).map(userId => ({
      userId,
      message: `${actorName || 'Someone'} ${actionMessage}`,
      type: 'info'
    }));

    if (notificationsToCreate.length > 0) {
      await Notification.insertMany(notificationsToCreate);
    }
  } catch (error) {
    console.error('Error in notifyBoardMembers:', error);
  }
};

export const clearUserNotifications = async (req, res, next) => {
  try {
    const userId = req.user.id;
    await Notification.deleteMany({ userId });
    res.json({ message: 'Notifications cleared' });
  } catch (error) {
    next(error);
  }
};

export const markNotificationsRead = async (req, res, next) => {
  try {
    const userId = req.user.id;
    await Notification.updateMany({ userId, read: false }, { read: true });
    res.json({ message: 'Notifications marked as read' });
  } catch (error) {
    next(error);
  }
};
