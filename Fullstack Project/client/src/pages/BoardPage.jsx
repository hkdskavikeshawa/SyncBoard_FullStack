import { useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import { applyFilters } from '../utils/filters';
import Board from '../components/Board';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import { Plus, Search, Filter, ChevronDown, LogOut, Pencil, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { simulateNextFailure } from '../api/tasks';
import CreateBoardDialog from '../components/CreateBoardDialog';
import InviteMemberDialog from '../components/InviteMemberDialog';
import { useAuth } from '../context/AuthContext';

export default function BoardPage() {
  const { boards, activeBoardId, setActiveBoard, tasks, members, columns, status, error, loadInitial, loadBoardData, updateBoard, removeBoard, isOwner } = useTasks();
  const { user, logout } = useAuth();
  const [filters, setFilters] = useState({ search: '', assignee: '', status: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [showBoardSelector, setShowBoardSelector] = useState(false);
  const [showCreateBoard, setShowCreateBoard] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);

  const activeBoard = boards.find(b => b.id === activeBoardId);

  const handleTestError = () => {
    simulateNextFailure();
    loadBoardData(activeBoardId);
  };

  const handleRenameBoard = () => {
    const newName = prompt('Enter new board name:', activeBoard.name);
    if (newName && newName.trim() && newName !== activeBoard.name) {
      updateBoard(activeBoard.id, { name: newName.trim() });
    }
  };

  const handleDeleteBoard = () => {
    if (confirm(`Are you sure you want to delete the board "${activeBoard.name}"? This will delete all tasks and columns in it.`)) {
      removeBoard(activeBoard.id);
    }
  };

  if (status === 'loading' || status === 'idle') return <LoadingState />;
  if (status === 'error') return <ErrorState message={error} onRetry={load} />;

  const visibleTasks = applyFilters(tasks, filters);
  
  const header = (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--color-border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>
          CodeForge
        </h1>
        <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--color-border)' }}></div>
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
            <button onClick={handleRenameBoard} title="Rename Board" style={{ padding: '6px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', borderRadius: '4px' }} onMouseEnter={e => e.target.style.backgroundColor = 'var(--color-border)'} onMouseLeave={e => e.target.style.backgroundColor = 'transparent'}>
              <Pencil size={14} style={{ pointerEvents: 'none' }} />
            </button>
            <button onClick={handleDeleteBoard} title="Delete Board" style={{ padding: '6px', background: 'none', border: 'none', cursor: 'pointer', color: '#DC2626', borderRadius: '4px' }} onMouseEnter={e => e.target.style.backgroundColor = '#FEE2E2'} onMouseLeave={e => e.target.style.backgroundColor = 'transparent'}>
              <Trash2 size={14} style={{ pointerEvents: 'none' }} />
            </button>
          </div>
        )}
      </div>
      
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <button onClick={handleTestError} className="btn btn-outline" style={{ padding: '8px 12px', color: 'var(--color-danger)', borderColor: 'var(--color-danger)', fontSize: '0.75rem' }} title="Trigger Network Error">
          Test Error
        </button>
        <div style={{ position: 'relative' }}>
          <button 
            className="btn btn-outline" 
            style={{ padding: '8px', color: showFilters ? 'var(--color-primary)' : 'var(--color-text-muted)', borderColor: showFilters ? 'var(--color-primary)' : 'var(--color-border)' }} 
            title="Filter"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={18} />
          </button>
          
          {showFilters && (
            <div style={{
              position: 'absolute', right: 0, top: '100%', marginTop: '8px',
              backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)', padding: '16px', boxShadow: 'var(--shadow-lg)',
              zIndex: 50, display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '200px'
            }}>
              <div>
                <label className="input-label" style={{ fontSize: '0.75rem', marginBottom: '4px' }}>Assignee</label>
                <select 
                  className="input-field" 
                  style={{ padding: '6px 10px', fontSize: '0.875rem' }}
                  value={filters.assignee}
                  onChange={(e) => setFilters(prev => ({ ...prev, assignee: e.target.value }))}
                >
                  <option value="">All Assignees</option>
                  {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
              <div>
                <label className="input-label" style={{ fontSize: '0.75rem', marginBottom: '4px' }}>Status</label>
                <select 
                  className="input-field"
                  style={{ padding: '6px 10px', fontSize: '0.875rem' }}
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                >
                  <option value="">All Statuses</option>
                  {columns.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>
          )}
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
          <Link to="/tasks/new" className="btn btn-primary" style={{ textDecoration: 'none', backgroundColor: '#10B981', borderColor: '#10B981' }}>
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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '24px', backgroundColor: 'var(--color-surface)' }}>
      {header}
      
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <div style={{ flex: 1, overflowX: 'auto' }}>
          {boards.length === 0 ? (
            <EmptyState 
              title="No Boards Found" 
              subtitle="Create a new board to get started."
              action={<button onClick={() => setShowCreateBoard(true)} className="btn btn-primary" style={{ backgroundColor: '#10B981', borderColor: '#10B981' }}>Create Board</button>} 
            />
          ) : tasks.length === 0 && !filters.search ? (
            <EmptyState 
              title={`Welcome to ${activeBoard?.name}`} 
              subtitle="Your board is empty. Start by creating a task."
              action={<Link to="/tasks/new" className="btn btn-primary" style={{ textDecoration: 'none', backgroundColor: '#10B981', borderColor: '#10B981' }}>Create First Task</Link>} 
            />
          ) : visibleTasks.length === 0 ? (
            <EmptyState title="No tasks match your filters" subtitle="Try adjusting your search criteria." />
          ) : (
            <Board tasks={visibleTasks} />
          )}
        </div>
      </div>

      {showCreateBoard && <CreateBoardDialog onClose={() => setShowCreateBoard(false)} />}
      {showInviteDialog && <InviteMemberDialog onClose={() => setShowInviteDialog(false)} />}
    </div>
  );
}
