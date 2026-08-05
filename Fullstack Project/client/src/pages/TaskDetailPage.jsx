import { useParams, useNavigate } from 'react-router-dom';
import { useTasks } from '../hooks/useTasks';
import TaskForm from '../components/TaskForm';
import { ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import NotFoundPage from './NotFoundPage';

export default function TaskDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tasks, columns, addTask, updateTaskDetails, isOwner } = useTasks();
  
  const isNew = id === 'new';
  const [task, setTask] = useState(null);
  
  useEffect(() => {
    if (!isNew) {
      const found = tasks.find(t => t.id === id);
      setTask(found || null);
    } else if (!isOwner) {
      navigate('/');
    }
  }, [id, tasks, isNew, isOwner, navigate]);

  if (!isNew && !task) {
    return <NotFoundPage />;
  }

  const handleSubmit = async (formData) => {
    if (isNew) {
      if (columns.length === 0) {
        alert("Please create a column first before adding a task.");
        return;
      }
      // Place it in the first column by order
      const defaultColumnId = [...columns].sort((a,b) => a.order - b.order)[0].id;
      await addTask({ ...formData, columnId: defaultColumnId });
    } else {
      await updateTaskDetails(id, formData);
    }
    navigate('/');
  };

  return (
    <div style={{ maxWidth: '600px', margin: '48px auto', padding: '24px' }}>
      <button 
        onClick={() => navigate('/')} 
        className="btn btn-outline" 
        style={{ marginBottom: '24px', border: 'none', paddingLeft: 0, paddingRight: 0 }}
      >
        <ArrowLeft size={18} /> Back to Board
      </button>
      
      <div className="glass-panel" style={{ padding: '32px', borderRadius: 'var(--radius-lg)' }}>
        <h2 style={{ marginBottom: '24px', fontSize: '1.5rem' }}>
          {isNew ? 'Create New Task' : 'Edit Task'}
        </h2>
        <TaskForm 
          initialData={isNew ? {} : task} 
          onSubmit={handleSubmit} 
          onCancel={() => navigate('/')}
        />
      </div>
    </div>
  );
}
