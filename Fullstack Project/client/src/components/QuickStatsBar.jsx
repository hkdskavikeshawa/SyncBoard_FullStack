import { useState } from 'react';
import { BarChart2, CheckCircle2, Clock, Users, ChevronUp, ChevronDown } from 'lucide-react';

export default function QuickStatsBar({ tasks = [], columns = [], members = [] }) {
  const [collapsed, setCollapsed] = useState(false);

  const totalTasks = tasks.length;
  
  // Find done column id if any
  const doneColumn = columns.find(c => c.name.toLowerCase().includes('done') || c.name.toLowerCase().includes('complete'));
  const doneColumnId = doneColumn ? doneColumn.id : null;

  const completedTasks = doneColumnId 
    ? tasks.filter(t => t.columnId === doneColumnId).length 
    : tasks.filter(t => t.status === 'done' || t.status === 'completed').length;

  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const todayStr = new Date().toISOString().split('T')[0];
  const overdueTasks = tasks.filter(t => t.dueDate && t.dueDate < todayStr && t.columnId !== doneColumnId).length;

  return (
    <div 
      className="glass-panel animate-fade-in" 
      style={{ 
        marginBottom: '20px', 
        padding: collapsed ? '10px 20px' : '16px 24px', 
        borderRadius: 'var(--radius-md)',
        transition: 'all 0.3s ease'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-muted)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <BarChart2 size={16} color="var(--color-primary)" />
          <span>Board Overview & Metrics</span>
        </div>
        <button 
          onClick={() => setCollapsed(!collapsed)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}
        >
          <span>{collapsed ? 'Expand Stats' : 'Collapse'}</span>
          {collapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
        </button>
      </div>

      {!collapsed && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginTop: '16px' }}>
          {/* Total Tasks */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
            <div style={{ padding: '8px', borderRadius: '50%', backgroundColor: 'rgba(56, 189, 248, 0.15)', color: '#0284C7' }}>
              <BarChart2 size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Total Tasks</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-main)' }}>{totalTasks}</div>
            </div>
          </div>

          {/* Completion Rate */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
            <div style={{ padding: '8px', borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--color-success)' }}>
              <CheckCircle2 size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Completed</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-success)' }}>{completionPercentage}%</span>
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-main)' }}>{completedTasks} / {totalTasks}</div>
            </div>
          </div>

          {/* Overdue */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
            <div style={{ padding: '8px', borderRadius: '50%', backgroundColor: overdueTasks > 0 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(100, 116, 139, 0.1)', color: overdueTasks > 0 ? 'var(--color-danger)' : 'var(--color-text-muted)' }}>
              <Clock size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Overdue Tasks</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: overdueTasks > 0 ? 'var(--color-danger)' : 'var(--color-text-main)' }}>{overdueTasks}</div>
            </div>
          </div>

          {/* Active Members */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
            <div style={{ padding: '8px', borderRadius: '50%', backgroundColor: 'rgba(15, 118, 110, 0.15)', color: 'var(--color-primary)' }}>
              <Users size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Team Members</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-main)' }}>{members.length}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
