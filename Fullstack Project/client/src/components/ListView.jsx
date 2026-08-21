import { Link } from 'react-router-dom';
import { useTasks } from '../hooks/useTasks';
import { Calendar, User, ArrowUpRight } from 'lucide-react';

export default function ListView({ tasks = [] }) {
  const { columns, members, moveTask } = useTasks();

  const getMemberName = (assigneeId) => {
    const member = members.find(m => m.id === assigneeId);
    return member ? member.name : 'Unassigned';
  };

  const getColumnName = (columnId) => {
    const col = columns.find(c => c.id === columnId);
    return col ? col.name : 'Unknown';
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '20px', borderRadius: 'var(--radius-lg)', overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <th style={{ padding: '12px 16px' }}>Task</th>
            <th style={{ padding: '12px 16px' }}>Status / Column</th>
            <th style={{ padding: '12px 16px' }}>Assignee</th>
            <th style={{ padding: '12px 16px' }}>Due Date</th>
            <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <tr key={task.id} style={{ borderBottom: '1px solid var(--color-border)', transition: 'background 0.2s' }}>
              {/* Task Title & Code */}
              <td style={{ padding: '14px 16px' }}>
                <div style={{ fontWeight: 600, color: 'var(--color-text-main)', fontSize: '0.95rem' }}>
                  {task.title}
                </div>
                {task.description && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '2px', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {task.description}
                  </div>
                )}
              </td>

              {/* Status / Column Selector */}
              <td style={{ padding: '14px 16px' }}>
                <select 
                  value={task.columnId || ''} 
                  onChange={(e) => moveTask(task.id, e.target.value)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-surface)',
                    color: 'var(--color-text-main)',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                >
                  {columns.map(col => (
                    <option key={col.id} value={col.id}>{col.name}</option>
                  ))}
                </select>
              </td>

              {/* Assignee */}
              <td style={{ padding: '14px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: 'var(--color-text-main)' }}>
                  <div style={{ width: '26px', height: '26px', borderRadius: '50%', backgroundColor: 'var(--color-secondary)', color: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 600 }}>
                    {getMemberName(task.assigneeId).charAt(0).toUpperCase()}
                  </div>
                  <span>{getMemberName(task.assigneeId)}</span>
                </div>
              </td>

              {/* Due Date */}
              <td style={{ padding: '14px 16px' }}>
                {task.dueDate ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                    <Calendar size={14} />
                    <span>{task.dueDate}</span>
                  </div>
                ) : (
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>-</span>
                )}
              </td>

              {/* Actions */}
              <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                <Link 
                  to={`/tasks/${task.id}`} 
                  className="btn btn-outline" 
                  style={{ padding: '6px 12px', fontSize: '0.8rem', textDecoration: 'none' }}
                >
                  <span>Details</span>
                  <ArrowUpRight size={14} />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
