import { useState } from 'react';
import { validateTask } from '../utils/validation';
import { useTasks } from '../hooks/useTasks';

export default function TaskForm({ initialData, onSubmit, onCancel }) {
  const { members } = useTasks();
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    dueDate: initialData?.dueDate || '',
    assigneeId: initialData?.assigneeId || ''
  });
  
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for the field being edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateTask(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <label htmlFor="title" className="input-label">Title <span style={{color: 'var(--color-danger)'}}>*</span></label>
        <input 
          type="text" id="title" name="title" className="input-field"
          value={formData.title} onChange={handleChange}
          placeholder="e.g., Update user profile"
        />
        {errors.title && <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '4px' }}>{errors.title}</div>}
      </div>

      <div>
        <label htmlFor="description" className="input-label">Description</label>
        <textarea 
          id="description" name="description" className="input-field" rows={3}
          value={formData.description} onChange={handleChange}
          placeholder="Add more details..."
        />
      </div>

      <div>
        <label htmlFor="dueDate" className="input-label">Due Date</label>
        <input 
          type="date" id="dueDate" name="dueDate" className="input-field"
          value={formData.dueDate} onChange={handleChange}
        />
        {errors.dueDate && <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '4px' }}>{errors.dueDate}</div>}
      </div>

      <div>
        <label htmlFor="assigneeId" className="input-label">Assignee</label>
        <select 
          id="assigneeId" name="assigneeId" className="input-field"
          value={formData.assigneeId} onChange={handleChange}
        >
          <option value="">Unassigned</option>
          {members.map(m => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
        {onCancel && <button type="button" onClick={onCancel} className="btn btn-outline">Cancel</button>}
        <button type="submit" className="btn btn-primary">Save Task</button>
      </div>
    </form>
  );
}
