import { Calendar, User, MoreVertical } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTasks } from '../hooks/useTasks';
import { useState } from 'react';
import ConfirmDialog from './ConfirmDialog';

export default function TaskCard({ task }) {
  const { members, columns, moveTask, removeTask, isOwner } = useTasks();
  const [isHovered, setIsHovered] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const assignee = members.find(m => m.id === task.assigneeId);
  
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date(new Date().setHours(0,0,0,0));

  const handleDelete = async () => {
    await removeTask(task.id);
    setShowDeleteConfirm(false);
  };

  const handleDragStart = (e) => {
    e.dataTransfer.setData('taskId', task.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <>
      <div 
        draggable
        onDragStart={handleDragStart}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => { setIsHovered(false); setShowMenu(false); }}
        style={{
          padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '16px',
          position: 'relative', transition: 'all 0.2s', backgroundColor: 'var(--color-surface)',
          cursor: 'grab', border: '1px solid var(--color-border)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
        }}
        onDrag={(e) => e.currentTarget.style.borderColor = '#10B981'}
        onDragEnd={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h4 style={{ margin: '0 0 4px 0', fontSize: '0.9375rem', fontWeight: 600 }}>
              <Link to={`/tasks/${task.id}`} style={{ textDecoration: 'none', color: 'var(--color-text-main)' }}>
                {task.title}
              </Link>
            </h4>
            <p style={{ margin: '0 0 16px 0', fontSize: '0.8125rem', color: '#9CA3AF' }}>
              #CF-{task.id.slice(0, 3).toUpperCase() || '104'}
            </p>
          </div>
          
          <div style={{ position: 'relative' }}>
            {(isHovered || showMenu) && (
              <button onClick={() => setShowMenu(!showMenu)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}>
                <MoreVertical size={16} />
              </button>
            )}
            
            {showMenu && (
              <div style={{ 
                position: 'absolute', right: 0, top: '24px', background: 'var(--color-surface)', 
                boxShadow: 'var(--shadow-md)', borderRadius: 'var(--radius-sm)', zIndex: 10,
                border: '1px solid var(--color-border)', width: '150px', overflow: 'hidden'
              }}>
                <div style={{ padding: '8px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', borderBottom: '1px solid var(--color-border)' }}>Move to...</div>
                {columns.filter(c => c.id !== task.columnId).map(col => (
                  <button key={col.id} onClick={() => { moveTask(task.id, col.id); setShowMenu(false); }} 
                    style={{ display: 'block', width: '100%', padding: '8px', textAlign: 'left', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.875rem' }}>
                    {col.name}
                  </button>
                ))}
                {isOwner && (
                  <div style={{ borderTop: '1px solid var(--color-border)' }}>
                    <button onClick={() => { setShowMenu(false); setShowDeleteConfirm(true); }} 
                      style={{ display: 'block', width: '100%', padding: '8px', textAlign: 'left', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--color-danger)', fontSize: '0.875rem' }}>
                      Delete Task
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ 
            backgroundColor: '#F3F4F6', color: '#4B5563', padding: '4px 12px', 
            borderRadius: '16px', fontSize: '0.75rem', fontWeight: 500 
          }}>
            Status
          </div>
          <div style={{ 
            width: '28px', height: '28px', borderRadius: '50%', 
            backgroundColor: '#E5E7EB', color: '#374151',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.625rem', fontWeight: 600, border: '1px solid #FFFFFF'
          }}>
            {assignee ? assignee.name.split(' ').map(n=>n[0]).join('').toUpperCase() : '??'}
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <ConfirmDialog 
          title="Delete Task" 
          message={`Are you sure you want to delete "${task.title}"?`}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </>
  );
}
