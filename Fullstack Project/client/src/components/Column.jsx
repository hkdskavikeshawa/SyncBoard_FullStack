import TaskCard from './TaskCard';
import { useTasks } from '../hooks/useTasks';
import { useState } from 'react';

export default function Column({ column, tasks }) {
  const { moveTask } = useTasks();
  const [isDragOver, setIsDragOver] = useState(false);

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
        <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '0.05em' }}>
          {column.name} ({tasks.length})
        </h3>
        <button style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
        </button>
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
