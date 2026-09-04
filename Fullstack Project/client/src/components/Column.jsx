import TaskCard from './TaskCard';
import { useTasks } from '../hooks/useTasks';
import { useState } from 'react';
import { ArrowUpDown, AlertCircle } from 'lucide-react';

const getColumnAccent = (name) => {
  const lower = (name || '').toLowerCase();
  if (lower.includes('todo') || lower.includes('to do')) return '#3B82F6';
  if (lower.includes('progress') || lower.includes('doing')) return '#F59E0B';
  if (lower.includes('done') || lower.includes('complete')) return '#10B981';
  return '#0F766E';
};

const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };

export default function Column({ column, tasks }) {
  const { moveTask, updateColumn, removeColumn, isOwner } = useTasks();
  const [isDragOver, setIsDragOver] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(column.name);
  const [showMenu, setShowMenu] = useState(false);
  const [sortBy, setSortBy] = useState('default');

  const accentColor = getColumnAccent(column.name);
  const maxWip = column.limit || 5; // Default WIP limit threshold for visual alert
  const isOverWip = column.limit && tasks.length > column.limit;

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    if (e.currentTarget.contains(e.relatedTarget)) return;
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      moveTask(taskId, column.id);
    }
  };

  const handleDelete = () => {
    if (tasks.length > 0) {
      alert('Cannot delete a column that contains tasks. Please move or delete the tasks first.');
      return;
    }
    if (confirm(`Are you sure you want to delete the column "${column.name}"?`)) {
      removeColumn(column.id);
    }
    setShowMenu(false);
  };

  // Sort tasks based on sortBy
  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortBy === 'priority') {
      const pA = priorityOrder[(a.priority || 'medium').toLowerCase()] || 2;
      const pB = priorityOrder[(b.priority || 'medium').toLowerCase()] || 2;
      return pB - pA;
    }
    if (sortBy === 'dueDate') {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  return (
    <div 
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{ 
        flex: 1, minWidth: '320px', 
        backgroundColor: isDragOver ? 'rgba(255, 255, 255, 0.4)' : 'var(--color-surface)', 
        backdropFilter: 'blur(12px)',
        borderRadius: '24px', padding: '20px', display: 'flex', flexDirection: 'column',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        border: isDragOver ? '2px dashed var(--color-success)' : '1px solid var(--color-border)',
        borderTop: `5px solid ${accentColor}`,
        boxShadow: isDragOver ? 'var(--shadow-glow)' : 'var(--shadow-sm)',
        height: '100%',
        overflow: 'hidden'
      }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', padding: '0 4px' }}>
        {isEditing ? (
          <input 
            type="text" 
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => {
              setIsEditing(false);
              if (name.trim() && name !== column.name) updateColumn(column.id, { name: name.trim() });
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') e.currentTarget.blur();
            }}
            style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text-main)', textTransform: 'uppercase', border: '1px solid var(--color-primary)', borderRadius: '4px', padding: '2px 4px', width: '100%' }}
          />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 
              onClick={() => setIsEditing(true)}
              style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text-main)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '0.05em', cursor: 'pointer', margin: 0 }}
              title="Click to rename"
            >
              {column.name}
              <span style={{ 
                backgroundColor: isOverWip ? 'rgba(239, 68, 68, 0.2)' : 'var(--color-background)', 
                color: isOverWip ? 'var(--color-danger)' : 'var(--color-text-muted)', 
                padding: '2px 8px', border: '1px solid var(--color-border)',
                borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 
              }}>
                {tasks.length} {column.limit ? `/ ${column.limit}` : ''}
              </span>
            </h3>
            {isOverWip && (
              <span title="WIP limit exceeded!" style={{ color: 'var(--color-danger)', display: 'flex', alignItems: 'center' }}>
                <AlertCircle size={16} />
              </span>
            )}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {/* Sorting Dropdown */}
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ padding: '2px 6px', fontSize: '0.75rem', borderRadius: '4px', border: '1px solid var(--color-border)', background: 'transparent', color: 'var(--color-text-muted)', cursor: 'pointer' }}
            title="Sort Column Tasks"
          >
            <option value="default">Sort: Default</option>
            <option value="priority">Priority</option>
            <option value="dueDate">Due Date</option>
            <option value="title">Title</option>
          </select>

          {isOwner && (
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setShowMenu(!showMenu)}
                style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', padding: '4px' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
              </button>
              
              {showMenu && (
                <>
                  <div 
                    style={{ position: 'fixed', inset: 0, zIndex: 10 }} 
                    onClick={() => setShowMenu(false)}
                  />
                  <div style={{ 
                    position: 'absolute', right: 0, top: '100%', 
                    backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', 
                    borderRadius: 'var(--radius-md)', padding: '4px', 
                    boxShadow: 'var(--shadow-lg)', zIndex: 20, minWidth: '150px' 
                  }}>
                    <button 
                      onClick={() => { setIsEditing(true); setShowMenu(false); }}
                      style={{ width: '100%', textAlign: 'left', padding: '8px 12px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem', borderRadius: '4px', color: 'var(--color-text-main)' }}
                    >
                      Rename Column
                    </button>
                    <button 
                      onClick={handleDelete}
                      style={{ width: '100%', textAlign: 'left', padding: '8px 12px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem', borderRadius: '4px', color: 'var(--color-danger)' }}
                    >
                      Delete Column
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Column Tasks Body */}
      <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
        {sortedTasks.length === 0 ? (
          <div style={{ 
            padding: '40px 24px', textAlign: 'center', color: 'var(--color-text-muted)', 
            fontSize: '0.875rem', border: '2px dashed var(--color-border)', borderRadius: '16px',
            backgroundColor: 'var(--color-background)'
          }}>
            Drop tasks here
          </div>
        ) : (
          sortedTasks.map(task => <TaskCard key={task.id} task={task} />)
        )}
      </div>
    </div>
  );
}
