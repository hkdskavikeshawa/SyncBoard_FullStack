import bcrypt from 'bcryptjs';

// Pre-hashed password for demo user ('password123')
const demoHashedPassword = bcrypt.hashSync('password123', 10);

export const store = {
  users: [
    { id: 'u1', name: 'Ayesha', email: 'ayesha@gmail.com', password: demoHashedPassword },
    { id: 'u2', name: 'Dev', email: 'dev@example.com', password: demoHashedPassword },
    { id: 'u3', name: 'Nuwan', email: 'nuwan@example.com', password: demoHashedPassword }
  ],

  boards: [
    { id: 'b1', name: 'Frontend Redesign', ownerId: 'u1', invitedMembers: ['u1', 'u2', 'u3'] },
    { id: 'b2', name: 'Backend API V2', ownerId: 'u2', invitedMembers: ['u1', 'u2', 'u3'] }
  ],

  columns: [
    { id: 'backlog', boardId: 'b1', name: 'Backlog', order: 1 },
    { id: 'in-progress', boardId: 'b1', name: 'In Progress', order: 2 },
    { id: 'review', boardId: 'b1', name: 'Review', order: 3 },
    { id: 'done', boardId: 'b1', name: 'Done', order: 4 },
    { id: 'c5', boardId: 'b2', name: 'To Do', order: 1 },
    { id: 'c6', boardId: 'b2', name: 'Done', order: 2 }
  ],

  members: [
    { id: 'u1', name: 'Ayesha', email: 'ayesha@gmail.com' },
    { id: 'u2', name: 'Dev', email: 'dev@example.com' },
    { id: 'u3', name: 'Nuwan', email: 'nuwan@example.com' }
  ],

  tasks: [
    {
      id: 't1',
      title: 'Design the board layout',
      description: 'Three columns, responsive down to tablet.',
      columnId: 'backlog',
      boardId: 'b1',
      assigneeIds: ['u1'],
      dueDate: '2026-08-20',
      priority: 'high',
      createdAt: '2026-08-02T09:00:00.000Z'
    },
    {
      id: 't2',
      title: 'Setup Vite project',
      description: 'Initialize React + Vite project and add router.',
      columnId: 'in-progress',
      boardId: 'b1',
      assigneeIds: ['u2'],
      dueDate: '2026-08-05',
      priority: 'medium',
      createdAt: '2026-08-03T10:00:00.000Z'
    },
    {
      id: 't3',
      title: 'Write project brief',
      description: 'Finalize the project requirements.',
      columnId: 'done',
      boardId: 'b1',
      assigneeIds: ['u3'],
      dueDate: '2026-08-01',
      priority: 'low',
      createdAt: '2026-07-30T10:00:00.000Z'
    },
    {
      id: 't4',
      title: 'Fix critical bug in task form',
      description: 'Validation is not triggering on submit.',
      columnId: 'review',
      boardId: 'b1',
      assigneeIds: [],
      dueDate: '2026-08-04',
      priority: 'urgent',
      createdAt: '2026-08-03T15:00:00.000Z'
    },
    {
      id: 't5',
      title: 'Database Schema',
      description: 'Design the new tables for boards and columns.',
      columnId: 'c5',
      boardId: 'b2',
      assigneeIds: ['u1', 'u2'],
      dueDate: '2026-08-10',
      priority: 'high',
      createdAt: '2026-08-01T12:00:00.000Z'
    }
  ],

  comments: [],

  notifications: []
};

