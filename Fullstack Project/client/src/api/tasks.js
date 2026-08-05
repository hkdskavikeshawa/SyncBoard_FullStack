import { seedTasks, columns, members } from '../data/mockData';

const DELAY = 600;
let FAIL_NEXT = false;

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
const clone = (v) => JSON.parse(JSON.stringify(v));

let db = clone(seedTasks);

export class NotFoundError extends Error {}

export function simulateNextFailure() { FAIL_NEXT = true; }

async function guard() {
  await sleep(DELAY);
  if (FAIL_NEXT) {
    FAIL_NEXT = false;
    throw new Error('Network request failed');
  }
}

export async function getTasks() {
  await guard();
  return clone(db);
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

export async function getColumns() {
  await sleep(100);
  return clone(columns);
}

export async function getMembers() {
  await sleep(100);
  return clone(members);
}
