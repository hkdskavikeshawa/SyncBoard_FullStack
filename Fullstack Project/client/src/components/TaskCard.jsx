import { Calendar, User, MoreVertical, ArrowRight, Trash2, Edit3, CheckSquare, Tag, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTasks } from '../hooks/useTasks';
import { useState } from 'react';
import ConfirmDialog from './ConfirmDialog';

const getAvatarColor = (name) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash) % 360;
  return `hsl(${h}, 65%, 55%)`;
};

const getPriorityStyle = (priority) => {
  switch ((priority || '').toLowerCase()) {
    case 'urgent':
      return { bg: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', label: 'Urgent' };
    case 'high':
      return { bg: 'rgba(249, 115, 22, 0.15)', color: '#F97316', label: 'High' };
    case 'low':
      return { bg: 'rgba(59, 130, 246, 0.15)', color: '#3B82F6', label: 'Low' };
    case 'medium':
    default:
      return { bg: 'rgba(234, 179, 8, 0.15)', color: '#EAB308', label: 'Medium' };
  }
};

export default function TaskCard({ task }) {
  const { members, columns, moveTask, removeTask, isOwner } = useTasks();
  const [isHovered, setIsHovered] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const assignees = (task.assigneeIds || []).map(id => members.find(m => m.id === id)).filter(Boolean);
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date(new Date().setHours(0,0,0,0));
  const priorityInfo = getPriorityStyle(task.priority);

  // Subtask calculations if present
  const subtasks = task.subtasks || [];
  const completedSubtasks = subtasks.filter(s => s.completed).length;

  // Next column for quick move
  const currentColIndex = columns.findIndex(c => c.id === task.columnId);
  const nextColumn = currentColIndex >= 0 && currentColIndex < columns.length - 1 ? columns[currentColIndex + 1] : null;

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
          padding: '16px', borderRadius: '16px', marginBottom: '16px',
          position: 'relative', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
          backgroundColor: 'var(--color-surface)',
          cursor: 'grab',
          border: isOverdue ? '1px solid rgba(239,68,68,0.35)' : '1px solid var(--color-border)',
          borderLeft: `4px solid ${isOverdue ? '#EF4444' : priorityInfo.color}`,
          boxShadow: isOverdue
            ? (isHovered ? '0 10px 15px -3px rgba(239,68,68,0.2), 0 0 0 1px rgba(239,68,68,0.15)' : '0 0 0 1px rgba(239,68,68,0.1), 0 2px 8px rgba(239,68,68,0.12)')
            : (isHovered ? 'var(--shadow-md)' : 'var(--shadow-sm)'),
          transform: isHovered ? 'translateY(-4px)' : 'none'
        }}
        onDrag={(e) => e.currentTarget.style.borderColor = 'var(--color-success)'}
        onDragEnd={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}
      >
        {/* Card Header & Priority Pill */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ 
              fontSize: '0.7rem', fontWeight: 600, padding: '2px 8px', borderRadius: '12px', 
              backgroundColor: priorityInfo.bg, color: priorityInfo.color, textTransform: 'uppercase'
            }}>
              {priorityInfo.label}
            </span>
            {task.tags && task.tags.map((tag, idx) => (
              <span key={idx} style={{ 
                fontSize: '0.7rem', padding: '2px 8px', borderRadius: '12px', 
                backgroundColor: 'var(--color-background)', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)'
              }}>
                #{tag}
              </span>
            ))}
          </div>

          <div style={{ position: 'relative' }}>
            {(isHovered || showMenu) && (
              <button onClick={() => setShowMenu(!showMenu)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
                <MoreVertical size={16} />
              </button>
            )}
            
            {showMenu && (
              <div style={{ 
                position: 'absolute', right: 0, top: '24px', background: 'var(--color-surface)', 
                boxShadow: 'var(--shadow-md)', borderRadius: 'var(--radius-sm)', zIndex: 20,
                border: '1px solid var(--color-border)', width: '160px', overflow: 'hidden'
              }}>
                <div style={{ padding: '8px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', borderBottom: '1px solid var(--color-border)' }}>Move to...</div>
                {columns.filter(c => c.id !== task.columnId).map(col => (
                  <button key={col.id} onClick={() => { moveTask(task.id, col.id); setShowMenu(false); }} 
                    style={{ display: 'block', width: '100%', padding: '8px', textAlign: 'left', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.875rem', color: 'var(--color-text-main)' }}>
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

        {/* Overdue Badge */}
        {isOverdue && (
          <div style={{ marginBottom: '8px' }}>
            <span className="overdue-badge">
              <span className="overdue-badge-dot" />
              Overdue
            </span>
          </div>
        )}

        {/* Task Title & Code */}
        <div>
          <h4 style={{ margin: '0 0 4px 0', fontSize: '0.975rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
            <Link to={`/tasks/${task.id}`} style={{ textDecoration: 'none', color: 'var(--color-text-main)' }}>
              {task.title}
            </Link>
          </h4>
          <p style={{ margin: '0 0 10px 0', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            #CF-{task.id.slice(0, 3).toUpperCase() || '104'}
          </p>
        </div>
        
        {task.description && (
          <div style={{ 
            fontSize: '0.825rem', 
            color: 'var(--color-text-muted)', 
            marginBottom: '12px',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {task.description}
          </div>
        )}

        {/* Subtask Progress Bar if subtasks exist */}
        {subtasks.length > 0 && (
          <div style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><CheckSquare size={12} /> Subtasks</span>
              <span>{completedSubtasks}/{subtasks.length}</span>
            </div>
            <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--color-border)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ width: `${(completedSubtasks / subtasks.length) * 100}%`, height: '100%', backgroundColor: 'var(--color-primary)', transition: 'width 0.3s' }}></div>
            </div>
          </div>
        )}

        {/* Footer Meta & Quick Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {task.dueDate && (
              <div style={{ 
                display: 'flex', alignItems: 'center', gap: '4px',
                backgroundColor: isOverdue ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)', 
                color: isOverdue ? 'var(--color-danger)' : 'var(--color-success)', 
                padding: '3px 8px', 
                borderRadius: '12px', fontSize: '0.75rem', fontWeight: 500 
              }}>
                <Calendar size={12} />
                {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Quick action: move next column */}
            {isHovered && nextColumn && (
              <button 
                onClick={() => moveTask(task.id, nextColumn.id)}
                title={`Move to ${nextColumn.name}`}
                style={{ padding: '4px 8px', border: '1px solid var(--color-border)', borderRadius: '12px', background: 'var(--color-background)', color: 'var(--color-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px', fontSize: '0.75rem', fontWeight: 600 }}
              >
                <span>{nextColumn.name}</span>
                <ArrowRight size={12} />
              </button>
            )}

            {/* Assignees Avatars */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {assignees.length === 0 ? (
                <div style={{ width: '26px', height: '26px', borderRadius: '50%', backgroundColor: 'var(--color-border)', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.625rem', fontWeight: 600 }}>
                  ?
                </div>
              ) : (
                assignees.slice(0, 3).map((a, i) => (
                  <div key={a.id} style={{ 
                    width: '26px', height: '26px', borderRadius: '50%', 
                    backgroundColor: getAvatarColor(a.name), color: '#FFFFFF',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.625rem', fontWeight: 600, border: '1px solid var(--color-surface)',
                    marginLeft: i > 0 ? '-8px' : '0', zIndex: 10 - i
                  }} title={a.name}>
                    {a.name.split(' ').map(n=>n[0]).join('').toUpperCase()}
                  </div>
                ))
              )}
            </div>
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
