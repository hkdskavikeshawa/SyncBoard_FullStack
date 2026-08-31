import { store } from '../data/store.js';
import { cryptoRandomUUID } from '../utils/idGenerator.js';
import { createNotification, notifyBoardMembers } from './notificationController.js';

export const getTasks = (req, res) => {
  const { boardId } = req.query;
  if (!boardId) {
    return res.status(400).json({ message: 'boardId query parameter is required' });
  }

  const tasks = store.tasks.filter((t) => t.boardId === boardId);
  res.json(tasks);
};

export const getTaskById = (req, res) => {
  const { id } = req.params;
  const task = store.tasks.find((t) => t.id === id);

  if (!task) {
    return res.status(404).json({ message: `Task ${id} not found` });
  }
  res.json(task);
};

export const createTask = (req, res) => {
  const input = req.body;

  if (!input.title || !input.boardId || !input.columnId) {
    return res.status(400).json({ message: 'Title, boardId, and columnId are required' });
  }

  const newTask = {
    id: cryptoRandomUUID(),
    createdAt: new Date().toISOString(),
    title: input.title,
    description: input.description || '',
    columnId: input.columnId,
    boardId: input.boardId,
    assigneeIds: input.assigneeIds || [],
    dueDate: input.dueDate || '',
    priority: input.priority || 'medium'
  };

  store.tasks.push(newTask);

  const actorName = req.user?.name || 'A teammate';
  const actorId = req.user?.id;

  // Notify all board participants/collaborators
  notifyBoardMembers({
    boardId: newTask.boardId,
    actorId,
    actorName,
    actionMessage: `created task "${newTask.title}"`
  });

  // Additional specific assignment notifications
  if (newTask.assigneeIds.length > 0) {
    newTask.assigneeIds.forEach(assigneeId => {
      if (assigneeId !== actorId) {
        createNotification({
          userId: assigneeId,
          message: `${actorName} assigned task "${newTask.title}" to you`,
          actor: actorName
        });
      }
    });
  }

  res.status(201).json(newTask);
};

export const updateTask = (req, res) => {
  const { id } = req.params;
  const patch = req.body;

  const task = store.tasks.find((t) => t.id === id);
  if (!task) {
    return res.status(404).json({ message: `Task ${id} not found` });
  }

  const oldColumnId = task.columnId;
  const oldAssigneeIds = [...(task.assigneeIds || [])];

  Object.assign(task, patch);

  const actorName = req.user?.name || 'A teammate';
  const actorId = req.user?.id;

  // Check if column changed (moved)
  if (patch.columnId && patch.columnId !== oldColumnId) {
    const col = store.columns.find(c => c.id === patch.columnId);
    const colName = col ? col.name : 'another column';
    
    notifyBoardMembers({
      boardId: task.boardId,
      actorId,
      actorName,
      actionMessage: `moved task "${task.title}" → ${colName}`
    });
  } else {
    notifyBoardMembers({
      boardId: task.boardId,
      actorId,
      actorName,
      actionMessage: `updated task "${task.title}"`
    });
  }

  // Check if newly assigned to someone
  if (patch.assigneeIds) {
    const newAssignees = patch.assigneeIds.filter(aid => !oldAssigneeIds.includes(aid));
    newAssignees.forEach(assigneeId => {
      if (assigneeId !== actorId) {
        createNotification({
          userId: assigneeId,
          message: `${actorName} assigned you to task "${task.title}"`,
          actor: actorName
        });
      }
    });
  }

  res.json(task);
};

export const deleteTask = (req, res) => {
  const { id } = req.params;

  const index = store.tasks.findIndex((t) => t.id === id);
  if (index === -1) {
    return res.status(404).json({ message: `Task ${id} not found` });
  }

  const task = store.tasks[index];
  store.tasks.splice(index, 1);
  // Remove related comments
  store.comments = store.comments.filter((c) => c.taskId !== id);

  notifyBoardMembers({
    boardId: task.boardId,
    actorId: req.user?.id,
    actorName: req.user?.name || 'A teammate',
    actionMessage: `deleted task "${task.title}"`
  });

  res.json({ message: 'Task deleted successfully', id });
};

export const getComments = (req, res) => {
  const { id } = req.params;
  const comments = store.comments.filter((c) => c.taskId === id);
  res.json(comments);
};

export const addComment = (req, res) => {
  const { id } = req.params;
  const { text, authorId, authorName } = req.body;

  if (!text) {
    return res.status(400).json({ message: 'Comment text is required' });
  }

  const task = store.tasks.find((t) => t.id === id);

  const newComment = {
    id: cryptoRandomUUID(),
    taskId: id,
    authorId: authorId || req.user?.id,
    authorName: authorName || req.user?.name || 'Anonymous',
    text,
    createdAt: new Date().toISOString(),
  };

  store.comments.push(newComment);

  if (task) {
    notifyBoardMembers({
      boardId: task.boardId,
      actorId: newComment.authorId,
      actorName: newComment.authorName,
      actionMessage: `commented on task "${task.title}"`
    });
  }

  res.status(201).json(newComment);
};

