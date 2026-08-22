import { useParams, useNavigate } from 'react-router-dom';
import { useTasks } from '../hooks/useTasks';
import TaskForm from '../components/TaskForm';
import CommentThread from '../components/CommentThread';
import Navbar from '../components/Navbar';
import { ArrowLeft, Calendar, User, Tag, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import NotFoundPage from './NotFoundPage';

const getPriorityStyle = (priority) => {
  switch ((priority || '').toLowerCase()) {
    case 'urgent': return { bg: 'rgba(239,68,68,0.12)', color: '#EF4444', label: 'Urgent' };
    case 'high':   return { bg: 'rgba(249,115,22,0.12)', color: '#F97316', label: 'High' };
    case 'low':    return { bg: 'rgba(59,130,246,0.12)',  color: '#3B82F6', label: 'Low' };
    default:       return { bg: 'rgba(234,179,8,0.12)',   color: '#EAB308', label: 'Medium' };
  }
};

export default function TaskDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tasks, columns, addTask, updateTaskDetails, isOwner } = useTasks();

  const isNew = id === 'new';
  const [task, setTask] = useState(null);
  const [editMode, setEditMode] = useState(isNew);

  useEffect(() => {
    if (!isNew) {
      const found = tasks.find(t => t.id === id);
      setTask(found || null);
    } else if (!isOwner) {
      navigate('/');
    }
  }, [id, tasks, isNew, isOwner, navigate]);

  if (!isNew && !task) return <NotFoundPage />;

  const handleSubmit = async (formData) => {
    if (isNew) {
      if (columns.length === 0) {
        alert('Please create a column first before adding a task.');
        return;
      }
      const defaultColumnId = [...columns].sort((a, b) => a.order - b.order)[0].id;
      await addTask({ ...formData, columnId: defaultColumnId });
      navigate('/');
    } else {
      await updateTaskDetails(id, formData);
      setEditMode(false);
    }
  };

  const priorityInfo = task ? getPriorityStyle(task.priority) : null;
  const isOverdue = task?.dueDate && new Date(task.dueDate) < new Date(new Date().setHours(0, 0, 0, 0));

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-background)', padding: '24px' }}>
      <Navbar />

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="btn btn-outline"
          style={{ marginBottom: '24px', border: 'none', paddingLeft: 0, paddingRight: 0, gap: '6px' }}
        >
          <ArrowLeft size={18} /> Back to Board
        </button>

        {/* Task Meta Header (only for existing tasks) */}
        {!isNew && task && (
          <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-lg)', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                  <span style={{
                    fontSize: '0.7rem', fontWeight: 700, padding: '3px 10px', borderRadius: '12px',
                    backgroundColor: priorityInfo.bg, color: priorityInfo.color, textTransform: 'uppercase'
                  }}>
                    {priorityInfo.label}
                  </span>
                  {isOverdue && (
                    <span className="overdue-badge">
                      <span className="overdue-badge-dot" />
                      Overdue
                    </span>
                  )}
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    #CF-{task.id.slice(0, 3).toUpperCase()}
                  </span>
                </div>
                <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-text-main)', margin: 0 }}>
                  {task.title}
                </h1>
                {task.description && (
                  <p style={{ marginTop: '10px', color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: 1.65 }}>
                    {task.description}
                  </p>
                )}
              </div>

              {isOwner && (
                <button
                  onClick={() => setEditMode(e => !e)}
                  className="btn btn-outline"
                  style={{ fontSize: '0.8rem', padding: '6px 16px' }}
                >
                  {editMode ? 'Cancel Edit' : 'Edit Task'}
                </button>
              )}
            </div>

            {/* Meta row */}
            <div style={{ display: 'flex', gap: '16px', marginTop: '16px', flexWrap: 'wrap' }}>
              {task.dueDate && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', color: isOverdue ? '#EF4444' : 'var(--color-text-muted)' }}>
                  <Calendar size={14} />
                  Due: {new Date(task.dueDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                </div>
              )}
              {task.tags && task.tags.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  <Tag size={14} />
                  {task.tags.map((t, i) => (
                    <span key={i} style={{
                      padding: '1px 8px', borderRadius: '10px',
                      backgroundColor: 'var(--color-background)', border: '1px solid var(--color-border)'
                    }}>#{t}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Edit Form (shown for new task, or when editing) */}
        {(isNew || editMode) && (
          <div className="glass-panel" style={{ padding: '32px', borderRadius: 'var(--radius-lg)', marginBottom: '20px' }}>
            <h2 style={{ marginBottom: '24px', fontSize: '1.25rem', fontWeight: 700 }}>
              {isNew ? 'Create New Task' : 'Edit Task'}
            </h2>
            <TaskForm
              initialData={isNew ? {} : task}
              onSubmit={handleSubmit}
              onCancel={() => isNew ? navigate('/') : setEditMode(false)}
            />
          </div>
        )}

        {/* Comment Thread (only for existing tasks) */}
        {!isNew && (
          <div className="glass-panel" style={{ padding: '28px', borderRadius: 'var(--radius-lg)' }}>
            <CommentThread taskId={id} />
          </div>
        )}
      </div>
    </div>
  );
}
