export const boards = [
  { id: 'b1', name: 'Frontend Redesign', ownerId: 'u1' },
  { id: 'b2', name: 'Backend API V2', ownerId: 'u2' }
];

export const columns = [
  { id: 'backlog', boardId: 'b1', name: 'Backlog', order: 1 },
  { id: 'in-progress', boardId: 'b1', name: 'In Progress', order: 2 },
  { id: 'review', boardId: 'b1', name: 'Review', order: 3 },
  { id: 'done', boardId: 'b1', name: 'Done', order: 4 },
  
  { id: 'c5', boardId: 'b2', name: 'To Do', order: 1 },
  { id: 'c6', boardId: 'b2', name: 'Done', order: 2 }
];

export const members = [
  { id: 'u1', name: 'Ayesha' },
  { id: 'u2', name: 'Dev' },
  { id: 'u3', name: 'Nuwan' },
];

export const seedTasks = [
  {
    id: 't1',
    title: 'Design the board layout',
    description: 'Three columns, responsive down to tablet.',
    columnId: 'backlog',
    boardId: 'b1',
    assigneeId: 'u1',
    dueDate: '2026-08-20',
    createdAt: '2026-08-02T09:00:00.000Z',
  },
  {
    id: 't2',
    title: 'Setup Vite project',
    description: 'Initialize React + Vite project and add router.',
    columnId: 'in-progress',
    boardId: 'b1',
    assigneeId: 'u2',
    dueDate: '2026-08-05',
    createdAt: '2026-08-03T10:00:00.000Z',
  },
  {
    id: 't3',
    title: 'Write project brief',
    description: 'Finalize the project requirements.',
    columnId: 'done',
    boardId: 'b1',
    assigneeId: 'u3',
    dueDate: '2026-08-01',
    createdAt: '2026-07-30T10:00:00.000Z',
  },
  {
    id: 't4',
    title: 'Fix critical bug in task form',
    description: 'Validation is not triggering on submit.',
    columnId: 'review',
    boardId: 'b1',
    assigneeId: null,
    dueDate: '2026-08-04',
    createdAt: '2026-08-03T15:00:00.000Z',
  },
  {
    id: 't5',
    title: 'Database Schema',
    description: 'Design the new tables for boards and columns.',
    columnId: 'c5',
    boardId: 'b2',
    assigneeId: 'u1',
    dueDate: '2026-08-10',
    createdAt: '2026-08-05T09:00:00.000Z',
  }
];
