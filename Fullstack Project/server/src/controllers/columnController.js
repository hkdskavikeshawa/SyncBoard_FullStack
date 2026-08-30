import { store } from '../data/store.js';
import { cryptoRandomUUID } from '../utils/idGenerator.js';
import { notifyBoardMembers } from './notificationController.js';

export const getColumns = (req, res) => {
  const { boardId } = req.query;
  if (!boardId) {
    return res.status(400).json({ message: 'boardId query parameter is required' });
  }

  const boardColumns = store.columns.filter((c) => c.boardId === boardId);
  res.json(boardColumns);
};

export const createColumn = (req, res) => {
  const { boardId, name } = req.body;

  if (!boardId || !name) {
    return res.status(400).json({ message: 'boardId and column name are required' });
  }

  const existingCols = store.columns.filter((c) => c.boardId === boardId);
  const newCol = {
    id: cryptoRandomUUID(),
    boardId,
    name,
    order: existingCols.length + 1
  };

  store.columns.push(newCol);

  notifyBoardMembers({
    boardId: newCol.boardId,
    actorId: req.user?.id,
    actorName: req.user?.name || 'A teammate',
    actionMessage: `added column "${newCol.name}"`
  });

  res.status(201).json(newCol);
};

export const updateColumn = (req, res) => {
  const { id } = req.params;
  const patch = req.body;

  const col = store.columns.find((c) => c.id === id);
  if (!col) {
    return res.status(404).json({ message: 'Column not found' });
  }

  Object.assign(col, patch);
  res.json(col);
};

export const deleteColumn = (req, res) => {
  const { id } = req.params;

  const index = store.columns.findIndex((c) => c.id === id);
  if (index === -1) {
    return res.status(404).json({ message: 'Column not found' });
  }

  const col = store.columns[index];
  store.columns.splice(index, 1);
  // Also clean up tasks in this deleted column
  store.tasks = store.tasks.filter((t) => t.columnId !== id);

  notifyBoardMembers({
    boardId: col.boardId,
    actorId: req.user?.id,
    actorName: req.user?.name || 'A teammate',
    actionMessage: `deleted column "${col.name}"`
  });

  res.json({ message: 'Column deleted successfully', id });
};
