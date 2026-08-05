import { seedTasks, columns as seedColumns, boards as seedBoards, members } from '../data/mockData';

const DELAY = 600;
let FAIL_NEXT = false;

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
const clone = (v) => JSON.parse(JSON.stringify(v));

let db = clone(seedTasks);
let cols = clone(seedColumns);
let brds = clone(seedBoards);

export class NotFoundError extends Error {}

export function simulateNextFailure() { FAIL_NEXT = true; }

async function guard() {
  await sleep(DELAY);
  if (FAIL_NEXT) {
    FAIL_NEXT = false;
    throw new Error('Network request failed');
  }
}

export async function getTasks(boardId) {
  await guard();
  return clone(db.filter(t => t.boardId === boardId));
}

export async function getTaskById(id) {
  await guard();
  const task = db.find((t) => t.id === id);
  if (!task) throw new NotFoundError(`Task ${id} not found`);
  return clone(task);
}

export async function createTask(input) {
  await guard();
  const task = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...input,
  };
  db = [...db, task];
  return clone(task);
}

export async function updateTask(id, patch) {
  await guard();
  const idx = db.findIndex((t) => t.id === id);
  if (idx === -1) throw new NotFoundError(`Task ${id} not found`);
  db[idx] = { ...db[idx], ...patch };
  return clone(db[idx]);
}

export async function deleteTask(id) {
  await guard();
  db = db.filter((t) => t.id !== id);
  return { id };
}

export async function getColumns(boardId) {
  await sleep(100);
  return clone(cols.filter(c => c.boardId === boardId));
}

export async function createColumn(boardId, name) {
  await sleep(100);
  const col = {
    id: crypto.randomUUID(),
    boardId,
    name,
    order: cols.filter(c => c.boardId === boardId).length + 1
  };
  cols.push(col);
  return clone(col);
}

export async function updateColumn(id, patch) {
  await sleep(100);
  const idx = cols.findIndex((c) => c.id === id);
  if (idx === -1) throw new NotFoundError(`Column ${id} not found`);
  cols[idx] = { ...cols[idx], ...patch };
  return clone(cols[idx]);
}

export async function deleteColumn(id) {
  await sleep(100);
  cols = cols.filter(c => c.id !== id);
}

export async function getBoards() {
  await sleep(100);
  return clone(brds);
}

export async function createBoard(name, ownerId) {
  await sleep(100);
  const b = { id: crypto.randomUUID(), name, ownerId };
  brds.push(b);
  // Give it default columns
  ['To Do', 'In Progress', 'Done'].forEach((n, i) => {
    cols.push({ id: crypto.randomUUID(), boardId: b.id, name: n, order: i + 1 });
  });
  return clone(b);
}

export async function getMembers() {
  await sleep(100);
  return clone(members);
}
