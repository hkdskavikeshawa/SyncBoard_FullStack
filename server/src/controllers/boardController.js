import Board from '../models/Board.js';
import Column from '../models/Column.js';
import Task from '../models/Task.js';
import User from '../models/User.js';
import { sendInviteEmail } from '../utils/emailService.js';
import { createNotification, notifyBoardMembers } from './notificationController.js';

export const getBoards = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userBoards = await Board.find({
      $or: [{ ownerId: userId }, { invitedMembers: userId }]
    });
    res.json(userBoards);
  } catch (error) {
    next(error);
  }
};

export const createBoard = async (req, res, next) => {
  try {
    const { name } = req.body;
    const ownerId = req.user.id;

    if (!name) {
      return res.status(400).json({ message: 'Board name is required' });
    }

    const defaultMockMembers = [ownerId];

    const newBoard = await Board.create({
      name,
      ownerId,
      invitedMembers: defaultMockMembers
    });

    const defaultCols = ['To Do', 'In Progress', 'Done'];
    const colsToCreate = defaultCols.map((colName, index) => ({
      boardId: newBoard._id,
      name: colName,
      order: index + 1
    }));
    await Column.insertMany(colsToCreate);

    createNotification({
      userId: ownerId,
      message: `You created board "${newBoard.name}"`,
      actor: req.user?.name || 'You'
    });

    res.status(201).json(newBoard);
  } catch (error) {
    next(error);
  }
};

export const updateBoard = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const board = await Board.findById(id);
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    if (name !== undefined) board.name = name;
    await board.save();

    res.json(board);
  } catch (error) {
    next(error);
  }
};

export const deleteBoard = async (req, res, next) => {
  try {
    const { id } = req.params;

    const board = await Board.findByIdAndDelete(id);
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    await Column.deleteMany({ boardId: id });
    await Task.deleteMany({ boardId: id });

    res.json({ message: 'Board deleted successfully', id });
  } catch (error) {
    next(error);
  }
};

export const inviteMemberToBoard = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'User email is required' });
    }

    const board = await Board.findById(id);
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (board.ownerId.toString() === user._id.toString()) {
      return res.status(400).json({ message: 'User is already the owner of this board' });
    }

    if (board.invitedMembers.includes(user._id)) {
      return res.status(400).json({ message: 'User is already invited to this board' });
    }

    board.invitedMembers.push(user._id);
    await board.save();

    const inviterName = req.user?.name || 'A teammate';

    notifyBoardMembers({
      boardId: board._id,
      actorId: req.user?.id,
      actorName: inviterName,
      actionMessage: `invited ${user.name || user.email} to join board "${board.name}"`,
      excludeUserIds: [user._id.toString()]
    });

    createNotification({
      userId: user._id,
      message: `${inviterName} invited you to join board "${board.name}"`,
      actor: inviterName
    });

    sendInviteEmail({
      toEmail: user.email,
      inviterName: inviterName,
      boardName: board.name,
    }).catch((err) => console.error('Error sending invite email:', err));

    res.json(board);
  } catch (error) {
    next(error);
  }
};
