import { useState } from 'react';
import { validateTask } from '../utils/validation';
import { useTasks } from '../hooks/useTasks';

export default function TaskForm({ initialData, onSubmit, onCancel }) {
  const { boardMembers, members } = useTasks();
  const assignableMembers = boardMembers && boardMembers.length > 0 ? boardMembers : members;

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    dueDate: initialData?.dueDate || '',
    priority: initialData?.priority || 'medium',
    assigneeIds: initialData?.assigneeIds || []
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

  const handleAssigneeToggle = (memberId) => {
    setFormData(prev => {
      const isSelected = prev.assigneeIds.includes(memberId);
      const newAssigneeIds = isSelected 
        ? prev.assigneeIds.filter(id => id !== memberId)
        : [...prev.assigneeIds, memberId];
      return { ...prev, assigneeIds: newAssigneeIds };
    });
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <label htmlFor="dueDate" className="input-label">Due Date</label>
          <input 
            type="date" id="dueDate" name="dueDate" className="input-field"
            value={formData.dueDate} onChange={handleChange}
          />
          {errors.dueDate && <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '4px' }}>{errors.dueDate}</div>}
        </div>

        <div>
          <label htmlFor="priority" className="input-label">Priority Level</label>
          <select 
            id="priority" 
            name="priority" 
            className="input-field"
            value={formData.priority} 
            onChange={handleChange}
            style={{ fontWeight: 600 }}
          >
            <option value="urgent">🔴 Urgent</option>
            <option value="high">🟠 High</option>
            <option value="medium">🟡 Medium</option>
            <option value="low">🔵 Low</option>
          </select>
        </div>
      </div>

      <div>
        <label className="input-label">Assignees</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '150px', overflowY: 'auto', padding: '8px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
          {assignableMembers.length === 0 && <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>No board members available</span>}
          {assignableMembers.map(m => (
            <label key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.875rem' }}>
              <input 
                type="checkbox" 
                checked={formData.assigneeIds.includes(m.id)}
                onChange={() => handleAssigneeToggle(m.id)}
                style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)' }}
              />
              {m.name}
            </label>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
        {onCancel && <button type="button" onClick={onCancel} className="btn btn-outline">Cancel</button>}
        <button type="submit" className="btn btn-primary">Save Task</button>
      </div>
    </form>
  );
}
