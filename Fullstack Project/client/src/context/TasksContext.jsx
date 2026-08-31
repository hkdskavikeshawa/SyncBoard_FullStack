import { createContext, useReducer, useEffect, useCallback, useContext } from 'react';
import * as api from '../api/tasks';
import { useAuth } from './AuthContext';
import { useNotifications } from './NotificationContext';

export const TasksContext = createContext(null);

const initialState = { 
  boards: [], activeBoardId: null, 
  tasks: [], columns: [], members: [], 
  status: 'idle', error: null 
};

function tasksReducer(state, action) {
  switch (action.type) {
    case 'LOAD_START':   
      return { ...state, status: 'loading', error: null };
    case 'BOARDS_LOADED':
      return { ...state, boards: action.payload.boards, members: action.payload.members, activeBoardId: action.payload.activeBoardId, status: 'success' };
    case 'BOARD_DATA_LOADED': 
      return { ...state, status: 'success', tasks: action.payload.tasks, columns: action.payload.columns };
    case 'LOAD_ERROR':   
      return { ...state, status: 'error', error: action.error };
    case 'SET_ACTIVE_BOARD':
      return { ...state, activeBoardId: action.payload };
    case 'BOARD_ADDED':
      return { ...state, boards: [...state.boards, action.payload] };
    case 'BOARD_UPDATED':
      return { ...state, boards: state.boards.map(b => b.id === action.payload.id ? action.payload : b) };
    case 'BOARD_DELETED':
      const newBoards = state.boards.filter(b => b.id !== action.id);
      return { ...state, boards: newBoards, activeBoardId: newBoards.length > 0 ? newBoards[0].id : null };
    case 'COLUMN_ADDED':
      return { ...state, columns: [...state.columns, action.payload] };
    case 'COLUMN_UPDATED':
      return { ...state, columns: state.columns.map(c => c.id === action.payload.id ? action.payload : c) };
    case 'COLUMN_DELETED':
      return { ...state, columns: state.columns.filter(c => c.id !== action.id) };
    case 'TASK_ADDED':   
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'TASK_UPDATED':
      return { ...state, tasks: state.tasks.map((t) => (t.id === action.payload.id ? action.payload : t)) };
    case 'TASK_DELETED':
      return { ...state, tasks: state.tasks.filter((t) => t.id !== action.id) };
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}

export function TasksProvider({ children }) {
  const [state, dispatch] = useReducer(tasksReducer, initialState);
  const { user } = useAuth();
  const { fetchUserNotifications } = useNotifications();

  // Load initial app data (boards & members)
  const loadInitial = useCallback(async () => {
    if (!user) return;
    dispatch({ type: 'LOAD_START' });
    try {
      const [boards, members] = await Promise.all([api.getBoards(user.id), api.getMembers()]);
      dispatch({ 
        type: 'BOARDS_LOADED', 
        payload: { boards, members, activeBoardId: boards.length > 0 ? boards[0].id : null } 
      });
    } catch (err) {
      dispatch({ type: 'LOAD_ERROR', error: err.message });
    }
  }, [user]);

  // Load data for the active board
  const loadBoardData = useCallback(async (boardId) => {
    if (!boardId) return;
    dispatch({ type: 'LOAD_START' });
    try {
      const [tasks, columns] = await Promise.all([api.getTasks(boardId), api.getColumns(boardId)]);
      dispatch({ type: 'BOARD_DATA_LOADED', payload: { tasks, columns } });
    } catch (err) {
      dispatch({ type: 'LOAD_ERROR', error: err.message });
    }
  }, []);

  // Initial mount
  useEffect(() => { loadInitial(); }, [loadInitial]);

  // When active board changes, load its data
  useEffect(() => {
    if (state.activeBoardId) {
      loadBoardData(state.activeBoardId);
    }
  }, [state.activeBoardId, loadBoardData]);

  // BroadcastChannel for Live Collaboration Sync
  useEffect(() => {
    const channel = new BroadcastChannel('collab_board_sync');
    channel.onmessage = (e) => {
      if (e.data.type === 'SYNC' && e.data.boardId === state.activeBoardId) {
        // If a change happened in another tab for our current board, reload data
        loadBoardData(state.activeBoardId);
      }
    };
    return () => channel.close();
  }, [state.activeBoardId, loadBoardData]);

  const notifySync = () => {
    const channel = new BroadcastChannel('collab_board_sync');
    channel.postMessage({ type: 'SYNC', boardId: state.activeBoardId });
    channel.postMessage({ type: 'NOTIFY' });
    fetchUserNotifications();
    channel.close();
  };


  const setActiveBoard = (boardId) => dispatch({ type: 'SET_ACTIVE_BOARD', payload: boardId });

  const addBoard = async (name, ownerId) => {
    const board = await api.createBoard(name, ownerId);
    dispatch({ type: 'BOARD_ADDED', payload: board });
    setActiveBoard(board.id);
  };

  const updateBoard = async (id, patch) => {
    dispatch({ type: 'BOARD_UPDATED', payload: await api.updateBoard(id, patch) });
    notifySync();
  };

  const removeBoard = async (id) => {
    await api.deleteBoard(id);
    dispatch({ type: 'BOARD_DELETED', id });
    notifySync();
  };

  const inviteMember = async (email) => {
    const updatedBoard = await api.inviteUserByEmail(state.activeBoardId, email);
    dispatch({ type: 'BOARD_UPDATED', payload: updatedBoard });
    notifySync();
  };

  const addColumn = async (name) => {
    dispatch({ type: 'COLUMN_ADDED', payload: await api.createColumn(state.activeBoardId, name) });
    notifySync();
  };

  const updateColumn = async (id, patch) => {
    dispatch({ type: 'COLUMN_UPDATED', payload: await api.updateColumn(id, patch) });
    notifySync();
  };

  const removeColumn = async (id) => {
    await api.deleteColumn(id);
    dispatch({ type: 'COLUMN_DELETED', id });
    notifySync();
  };

  const addTask = async (input) => {
    const task = await api.createTask({ ...input, boardId: state.activeBoardId });
    dispatch({ type: 'TASK_ADDED', payload: task });
    notifySync(`${user?.name || 'Someone'} created task "${task.title}"`);
  };

  const updateTaskDetails = async (id, patch) => {
    dispatch({ type: 'TASK_UPDATED', payload: await api.updateTask(id, patch) });
    notifySync(`${user?.name || 'Someone'} updated task details`);
  };

  const moveTask = async (id, columnId) => {
    const task = state.tasks.find(t => t.id === id);
    const col = state.columns.find(c => c.id === columnId);
    dispatch({ type: 'TASK_UPDATED', payload: await api.updateTask(id, { columnId }) });
    notifySync(`${user?.name || 'Someone'} moved "${task?.title || 'a task'}" → ${col?.name || columnId}`);
  };

  const removeTask = async (id) => {
    const task = state.tasks.find(t => t.id === id);
    await api.deleteTask(id);
    dispatch({ type: 'TASK_DELETED', id });
    notifySync(`${user?.name || 'Someone'} deleted "${task?.title || 'a task'}"`);
  };

  const allMembers = [...state.members];
  if (user && !allMembers.some(m => m.id === user.id)) {
    allMembers.unshift({ id: user.id, name: user.name, email: user.email });
  }

  const activeBoard = state.boards.find(b => b.id === state.activeBoardId);
  const isOwner = activeBoard?.ownerId === user?.id;

  const boardMemberIds = activeBoard
    ? [activeBoard.ownerId, ...(activeBoard.invitedMembers || [])]
    : [];

  const boardMembers = allMembers
    .filter(m => boardMemberIds.includes(m.id))
    .map(m => (user && m.id === user.id ? { ...m, name: user.name } : m));


  return (
    <TasksContext.Provider value={{ 
      ...state, boardMembers, loadInitial, loadBoardData, setActiveBoard, addBoard, updateBoard, removeBoard, inviteMember, isOwner,
      addColumn, updateColumn, removeColumn, addTask, moveTask, removeTask, updateTaskDetails 
    }}>
      {children}
    </TasksContext.Provider>
  );

}
