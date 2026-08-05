import { createContext, useReducer, useEffect, useCallback } from 'react';
import * as api from '../api/tasks';

export const TasksContext = createContext(null);

const initialState = { tasks: [], status: 'idle', error: null, members: [], columns: [] };

function tasksReducer(state, action) {
  switch (action.type) {
    case 'LOAD_START':   
      return { ...state, status: 'loading', error: null };
    case 'LOAD_SUCCESS': 
      return { ...state, status: 'success', tasks: action.payload.tasks, members: action.payload.members, columns: action.payload.columns };
    case 'LOAD_ERROR':   
      return { ...state, status: 'error', error: action.error };
    case 'TASK_ADDED':   
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'TASK_UPDATED':
      return { 
        ...state,
        tasks: state.tasks.map((t) => (t.id === action.payload.id ? action.payload : t)) 
      };
    case 'TASK_DELETED':
      return { ...state, tasks: state.tasks.filter((t) => t.id !== action.id) };
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}

export function TasksProvider({ children }) {
  const [state, dispatch] = useReducer(tasksReducer, initialState);

  const load = useCallback(async () => {
    dispatch({ type: 'LOAD_START' });
    try {
      const [tasks, members, columns] = await Promise.all([
        api.getTasks(),
        api.getMembers(),
        api.getColumns()
      ]);
      dispatch({ type: 'LOAD_SUCCESS', payload: { tasks, members, columns } });
    } catch (err) {
      dispatch({ type: 'LOAD_ERROR', error: err.message });
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const addTask = async (input) =>
    dispatch({ type: 'TASK_ADDED', payload: await api.createTask(input) });

  const updateTaskDetails = async (id, patch) =>
    dispatch({ type: 'TASK_UPDATED', payload: await api.updateTask(id, patch) });

  const moveTask = async (id, columnId) =>
    dispatch({ type: 'TASK_UPDATED', payload: await api.updateTask(id, { columnId }) });

  const removeTask = async (id) => {
    await api.deleteTask(id);
    dispatch({ type: 'TASK_DELETED', id });
  };

  return (
    <TasksContext.Provider value={{ ...state, load, addTask, moveTask, removeTask, updateTaskDetails }}>
      {children}
    </TasksContext.Provider>
  );
}
