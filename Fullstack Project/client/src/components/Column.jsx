import TaskCard from './TaskCard';
import { useTasks } from '../hooks/useTasks';
import { useState } from 'react';

export default function Column({ column, tasks }) {
  const { moveTask, updateColumn, removeColumn } = useTasks();
  const [isDragOver, setIsDragOver] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(column.name);
  const [showMenu, setShowMenu] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    // Check if we are really leaving the column, not just a child element
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

  return (
    <div 
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{ 
        flex: 1, minWidth: '320px', backgroundColor: isDragOver ? '#E2E8F0' : '#F3F4F6', 
        borderRadius: 'var(--radius-lg)', padding: '16px', display: 'flex', flexDirection: 'column',
        transition: 'background-color 0.2s',
        border: isDragOver ? '2px dashed #10B981' : '2px solid transparent',
        height: '100%',
        overflow: 'hidden'
      }}>
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
          <h3 
            onClick={() => setIsEditing(true)}
            style={{ fontSize: '0.875rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '0.05em', cursor: 'pointer' }}
            title="Click to rename"
          >
            {column.name} ({tasks.length})
          </h3>
        )}
        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => setShowMenu(!showMenu)}
            style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', padding: '4px' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
          </button>
          
          {showMenu && (
            <>
              <div 
                style={{ position: 'fixed', inset: 0, zIndex: 10 }} 
                onClick={() => setShowMenu(false)}
              />
              <div style={{ 
                position: 'absolute', right: 0, top: '100%', 
                backgroundColor: 'white', border: '1px solid var(--color-border)', 
                borderRadius: 'var(--radius-md)', padding: '4px', 
                boxShadow: 'var(--shadow-lg)', zIndex: 20, minWidth: '150px' 
              }}>
                <button 
                  onClick={() => { setIsEditing(true); setShowMenu(false); }}
                  style={{ width: '100%', textAlign: 'left', padding: '8px 12px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem', borderRadius: '4px' }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#F3F4F6'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  Rename Column
                </button>
                <button 
                  onClick={handleDelete}
                  style={{ width: '100%', textAlign: 'left', padding: '8px 12px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem', borderRadius: '4px', color: '#DC2626' }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#FEE2E2'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  Delete Column
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      
      <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
        {tasks.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.875rem', border: '2px dashed var(--color-border)', borderRadius: 'var(--radius-md)' }}>
            Drop tasks here
          </div>
        ) : (
          tasks.map(task => <TaskCard key={task.id} task={task} />)
        )}
      </div>
    </div>
  );
}
