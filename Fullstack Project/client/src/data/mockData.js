export const columns = [
  { id: 'backlog', name: 'Backlog', order: 1 },
  { id: 'in-progress', name: 'In Progress', order: 2 },
  { id: 'review', name: 'Review', order: 3 },
  { id: 'done', name: 'Done', order: 4 },
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
    assigneeId: 'u1',
    dueDate: '2026-08-20',
    createdAt: '2026-08-02T09:00:00.000Z',
  },
  {
    id: 't2',
    title: 'Setup Vite project',
    description: 'Initialize React + Vite project and add router.',
    columnId: 'in-progress',
    assigneeId: 'u2',
    dueDate: '2026-08-05',
    createdAt: '2026-08-03T10:00:00.000Z',
  },
  {
    id: 't3',
    title: 'Write project brief',
    description: 'Finalize the project requirements.',
    columnId: 'done',
    assigneeId: 'u3',
    dueDate: '2026-08-01',
    createdAt: '2026-07-30T10:00:00.000Z',
  },
  {
    id: 't4',
    title: 'Fix critical bug in task form',
    description: 'Validation is not triggering on submit.',
    columnId: 'review',
    assigneeId: null,
    dueDate: '2026-08-04',
    createdAt: '2026-08-03T15:00:00.000Z',
  }
];
