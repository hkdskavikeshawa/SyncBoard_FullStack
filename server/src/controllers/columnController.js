import Column from '../models/Column.js';
import Task from '../models/Task.js';
import { notifyBoardMembers } from './notificationController.js';

export const getColumns = async (req, res, next) => {
  try {
    const { boardId } = req.query;
    if (!boardId) {
      return res.status(400).json({ message: 'boardId query parameter is required' });
    }
    const columns = await Column.find({ boardId }).sort({ order: 1 });
    res.json(columns);
  } catch (error) {
    next(error);
  }
};

export const createColumn = async (req, res, next) => {
  try {
    const { boardId, name, order } = req.body;
    if (!boardId || !name) {
      return res.status(400).json({ message: 'boardId and name are required' });
    }

    const newColumn = await Column.create({
      boardId,
      name,
      order: order || 99
    });

    notifyBoardMembers({
      boardId,
      actorId: req.user?.id,
      actorName: req.user?.name,
      actionMessage: `added a new column "${name}"`,
    });

    res.status(201).json(newColumn);
  } catch (error) {
    next(error);
  }
};

export const updateColumn = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, order } = req.body;

    const column = await Column.findById(id);
    if (!column) {
      return res.status(404).json({ message: 'Column not found' });
    }

    if (name !== undefined) column.name = name;
    if (order !== undefined) column.order = order;
    
    await column.save();

    res.json(column);
  } catch (error) {
    next(error);
  }
};

export const deleteColumn = async (req, res, next) => {
  try {
    const { id } = req.params;

    const column = await Column.findByIdAndDelete(id);
    if (!column) {
      return res.status(404).json({ message: 'Column not found' });
    }

    await Task.deleteMany({ columnId: id });

    res.json({ message: 'Column deleted successfully', id });
  } catch (error) {
    next(error);
  }
};
