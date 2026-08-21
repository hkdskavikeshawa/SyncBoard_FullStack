import { useState, useEffect } from 'react';
import { useTasks } from '../hooks/useTasks';
import { applyFilters } from '../utils/filters';
import Board from '../components/Board';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import { Plus, Search, ChevronDown, LogOut, Pencil, Trash2, Sun, Moon, LayoutGrid, List } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import CreateBoardDialog from '../components/CreateBoardDialog';
import InviteMemberDialog from '../components/InviteMemberDialog';
import PromptDialog from '../components/PromptDialog';
import QuickStatsBar from '../components/QuickStatsBar';
import ListView from '../components/ListView';
import { useAuth } from '../context/AuthContext';

export default function BoardPage() {
  const { boards, activeBoardId, setActiveBoard, tasks, members, columns, status, error, loadInitial, loadBoardData, updateBoard, removeBoard, isOwner } = useTasks();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ search: '', assignee: '', status: '' });
  const [showBoardSelector, setShowBoardSelector] = useState(false);
  const [showCreateBoard, setShowCreateBoard] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [showRenameBoard, setShowRenameBoard] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [viewMode, setViewMode] = useState('board');

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleRenameBoardConfirm = (newName) => {
    if (newName && newName !== activeBoard.name) {
      updateBoard(activeBoard.id, { name: newName });
    }
    setShowRenameBoard(false);
  };

  const handleDeleteBoard = () => {
    if (confirm(`Are you sure you want to delete the board "${activeBoard.name}"? This will delete all tasks and columns in it.`)) {
      removeBoard(activeBoard.id);
    }
  };

  if (status === 'loading' || status === 'idle') return <LoadingState />;
  if (status === 'error') return <ErrorState message={error} onRetry={loadInitial} />;

  const visibleTasks = applyFilters(tasks, filters);

  const header = (
    <div className="glass-panel" style={{ position: 'relative', zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', padding: '16px 24px', borderRadius: 'var(--radius-lg)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <img src="/logo.png" alt="CodeForge" style={{ height: '64px' }} />
        <div style={{ width: '1px', height: '48px', backgroundColor: 'var(--color-border)' }}></div>
        <div style={{ position: 'relative' }}>
          <button 
            className="btn btn-outline" 
            style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '8px', border: 'none', background: 'transparent' }}
            onClick={() => setShowBoardSelector(!showBoardSelector)}
          >
            <span style={{ fontWeight: 600 }}>{activeBoard ? activeBoard.name : 'Select Board'}</span>
            <ChevronDown size={16} />
          </button>
          
          {showBoardSelector && (
            <div style={{
              position: 'absolute', left: 0, top: '100%', marginTop: '4px',
              backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)', padding: '8px', boxShadow: 'var(--shadow-lg)',
              zIndex: 50, minWidth: '220px', display: 'flex', flexDirection: 'column'
            }}>
              {boards.map(b => (
                <button 
                  key={b.id} 
                  onClick={() => { setActiveBoard(b.id); setShowBoardSelector(false); }}
                  style={{ 
                    padding: '8px 12px', textAlign: 'left', border: 'none', background: 'transparent', 
                    cursor: 'pointer', borderRadius: 'var(--radius-sm)', 
                    backgroundColor: activeBoardId === b.id ? 'var(--color-bg)' : 'transparent',
                    fontWeight: activeBoardId === b.id ? 600 : 400
                  }}
                >
                  {b.name}
                </button>
              ))}
              <div style={{ height: '1px', backgroundColor: 'var(--color-border)', margin: '8px 0' }}></div>
              <button 
                onClick={() => { setShowCreateBoard(true); setShowBoardSelector(false); }}
                style={{ padding: '8px 12px', textAlign: 'left', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--color-primary)', fontWeight: 600 }}
              >
                + Create New Board
              </button>
            </div>
          )}
        </div>
        {activeBoard && isOwner && (
          <div style={{ display: 'flex', gap: '4px', marginLeft: '4px' }}>
            <button onClick={() => setShowInviteDialog(true)} title="Invite Member" style={{ padding: '6px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary)', borderRadius: '4px' }} onMouseEnter={e => e.target.style.backgroundColor = 'var(--color-bg)'} onMouseLeave={e => e.target.style.backgroundColor = 'transparent'}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ pointerEvents: 'none' }}><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
            </button>
            <button onClick={() => setShowRenameBoard(true)} title="Rename Board" style={{ padding: '6px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', borderRadius: '4px' }} onMouseEnter={e => e.target.style.backgroundColor = 'var(--color-border)'} onMouseLeave={e => e.target.style.backgroundColor = 'transparent'}>
              <Pencil size={14} style={{ pointerEvents: 'none' }} />
            </button>
            <button onClick={handleDeleteBoard} title="Delete Board" style={{ padding: '6px', background: 'none', border: 'none', cursor: 'pointer', color: '#DC2626', borderRadius: '4px' }} onMouseEnter={e => e.target.style.backgroundColor = '#FEE2E2'} onMouseLeave={e => e.target.style.backgroundColor = 'transparent'}>
              <Trash2 size={14} style={{ pointerEvents: 'none' }} />
            </button>
          </div>
        )}
      </div>
      
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <button 
          onClick={() => setDarkMode(!darkMode)} 
          className="btn btn-outline" 
          style={{ padding: '8px', border: '1px solid var(--color-border)', borderRadius: '50%', color: 'var(--color-text-main)' }} 
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div style={{ display: 'flex', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden', padding: '2px', backgroundColor: 'var(--color-surface)' }}>
          <button 
            onClick={() => setViewMode('board')} 
            style={{ padding: '6px 10px', border: 'none', background: viewMode === 'board' ? 'var(--color-primary)' : 'transparent', color: viewMode === 'board' ? 'white' : 'var(--color-text-muted)', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 500 }}
            title="Kanban Board View"
          >
            <LayoutGrid size={15} /> Board
          </button>
          <button 
            onClick={() => setViewMode('list')} 
            style={{ padding: '6px 10px', border: 'none', background: viewMode === 'list' ? 'var(--color-primary)' : 'transparent', color: viewMode === 'list' ? 'white' : 'var(--color-text-muted)', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 500 }}
            title="Table List View"
          >
            <List size={15} /> List
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ position: 'relative' }}>
            <select 
              className="input-field" 
              style={{ padding: '8px 10px', fontSize: '0.875rem', width: '140px', appearance: 'none' }}
              value={filters.assignee}
              onChange={(e) => setFilters(prev => ({ ...prev, assignee: e.target.value }))}
            >
              <option value="">All Assignees</option>
              {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>
          <div style={{ position: 'relative' }}>
            <select 
              className="input-field"
              style={{ padding: '8px 10px', fontSize: '0.875rem', width: '130px', appearance: 'none' }}
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            >
              <option value="">All Statuses</option>
              {columns.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>
        <div style={{ position: 'relative', width: '200px' }}>
          <Search size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--color-text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search Tasks..." 
            className="input-field" 
            style={{ paddingLeft: '34px', paddingTop: '8px', paddingBottom: '8px' }}
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          />
        </div>
        {isOwner && (
          <Link to="/tasks/new" className="btn btn-primary" style={{ textDecoration: 'none' }}>
            <Plus size={16} /> New Task
          </Link>
        )}
        <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--color-border)', margin: '0 8px' }}></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '0.875rem' }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <button onClick={logout} className="btn btn-outline" style={{ padding: '8px', border: 'none' }} title="Logout">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: '24px', backgroundColor: 'var(--color-background)', overflowY: 'auto' }}>
      {header}
      <QuickStatsBar tasks={tasks} columns={columns} members={members} />
      
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <div style={{ flex: 1, overflowX: 'auto' }}>
          {boards.length === 0 ? (
            <EmptyState 
              title="No Boards Found" 
              subtitle="Create a new board to get started."
              action={<button onClick={() => setShowCreateBoard(true)} className="btn btn-primary">Create Board</button>} 
            />
          ) : tasks.length === 0 && !filters.search ? (
            <EmptyState 
              title={`Welcome to ${activeBoard?.name}`} 
              subtitle="Your board is empty. Start by creating a task."
              action={<Link to="/tasks/new" className="btn btn-primary" style={{ textDecoration: 'none' }}>Create First Task</Link>} 
            />
          ) : visibleTasks.length === 0 ? (
            <EmptyState title="No tasks match your filters" subtitle="Try adjusting your search criteria." />
          ) : viewMode === 'list' ? (
            <ListView tasks={visibleTasks} />
          ) : (
            <Board tasks={visibleTasks} />
          )}
        </div>
      </div>

      {showCreateBoard && <CreateBoardDialog onClose={() => setShowCreateBoard(false)} />}
      {showInviteDialog && <InviteMemberDialog onClose={() => setShowInviteDialog(false)} />}
      {showRenameBoard && (
        <PromptDialog 
          title="Rename Board" 
          defaultValue={activeBoard.name}
          onConfirm={handleRenameBoardConfirm} 
          onCancel={() => setShowRenameBoard(false)} 
        />
      )}
      
      <button 
        onClick={() => setShowCreateBoard(true)}
        className="btn btn-primary"
        style={{
          position: 'fixed',
          bottom: '32px',
          right: '32px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-lg)',
          padding: 0,
          zIndex: 40
        }}
        title="Create New Board"
      >
        <Plus size={24} />
      </button>
    </div>
  );
}