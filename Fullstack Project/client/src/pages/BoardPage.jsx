import { useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import { applyFilters } from '../utils/filters';
import Board from '../components/Board';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import Sidebar from '../components/Sidebar';
import { Plus, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { simulateNextFailure } from '../api/tasks';

export default function BoardPage() {
  const { tasks, members, columns, status, error, load } = useTasks();
  const [filters, setFilters] = useState({ search: '', assignee: '', status: '' });
  const [showFilters, setShowFilters] = useState(false);

  const handleTestError = () => {
    simulateNextFailure();
    load();
  };

  if (status === 'loading' || status === 'idle') return <LoadingState />;
  if (status === 'error') return <ErrorState message={error} onRetry={load} />;

  const visibleTasks = applyFilters(tasks, filters);
  
  const header = (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--color-border)' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
        CodeForge - Project Dashboard
      </h1>
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
        <Link to="/tasks/new" className="btn btn-primary" style={{ textDecoration: 'none', backgroundColor: '#10B981', borderColor: '#10B981' }}>
          <Plus size={16} /> New Task
        </Link>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: '24px', backgroundColor: 'var(--color-surface)' }}>
      {header}
      
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <div style={{ flex: 1, overflowX: 'auto', paddingRight: '24px' }}>
          {tasks.length === 0 ? (
            <EmptyState 
              title="Welcome to CodeForge" 
              subtitle="Your board is empty. Start by creating a task."
              action={<Link to="/tasks/new" className="btn btn-primary" style={{ textDecoration: 'none', backgroundColor: '#10B981', borderColor: '#10B981' }}>Create First Task</Link>} 
            />
          ) : visibleTasks.length === 0 ? (
            <EmptyState title="No tasks match your filters" subtitle="Try adjusting your search criteria." />
          ) : (
            <Board tasks={visibleTasks} />
          )}
        </div>
        
        <Sidebar />
      </div>
    </div>
  );
}
