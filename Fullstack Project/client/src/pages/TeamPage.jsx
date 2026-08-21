import { useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import Navbar from '../components/Navbar';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import InviteMemberDialog from '../components/InviteMemberDialog';
import { Users, UserPlus, Mail, Shield, CheckCircle2, Clock, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TeamPage() {
  const { members, tasks, columns, status, error, loadInitial, isOwner } = useTasks();
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  if (status === 'loading' || status === 'idle') return <LoadingState />;
  if (status === 'error') return <ErrorState message={error} onRetry={loadInitial} />;

  const doneColumn = columns.find(c => c.name.toLowerCase().includes('done') || c.name.toLowerCase().includes('complete'));

  const memberStats = members.map(m => {
    const assignedTasks = tasks.filter(t => (t.assigneeIds || []).includes(m.id) || t.assigneeId === m.id);
    const activeTasks = assignedTasks.filter(t => t.columnId !== doneColumn?.id);
    const completedTasks = assignedTasks.filter(t => t.columnId === doneColumn?.id);
    const rate = assignedTasks.length > 0 ? Math.round((completedTasks.length / assignedTasks.length) * 100) : 0;
    
    return {
      member: m,
      assignedTasks,
      activeTasks,
      completedTasks,
      rate
    };
  });

  const getRoleBadgeStyle = (role) => {
    switch ((role || '').toLowerCase()) {
      case 'owner':
        return { bg: 'rgba(15, 118, 110, 0.15)', color: 'var(--color-primary)', label: 'Owner' };
      case 'admin':
        return { bg: 'rgba(56, 189, 248, 0.15)', color: '#0284C7', label: 'Admin' };
      case 'developer':
        return { bg: 'rgba(234, 179, 8, 0.15)', color: '#EAB308', label: 'Developer' };
      default:
        return { bg: 'rgba(100, 116, 139, 0.15)', color: 'var(--color-text-muted)', label: 'Member' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', padding: '24px', backgroundColor: 'var(--color-background)' }}>
      <Navbar />

      {/* Page Header */}
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Users color="var(--color-primary)" size={28} />
            <span>Team & Workload Management</span>
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', margin: '4px 0 0 0' }}>
            Manage team members, roles, task assignments, and workload balances
          </p>
        </div>

        {isOwner && (
          <button onClick={() => setShowInviteDialog(true)} className="btn btn-primary">
            <UserPlus size={18} /> Invite Member
          </button>
        )}
      </div>

      {/* Member Directory & Workload Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', flex: 1 }}>
        {memberStats.map(({ member, assignedTasks, activeTasks, completedTasks, rate }) => {
          const roleStyle = getRoleBadgeStyle(member.role);
          const initials = member.name.split(' ').map(n => n[0]).join('').toUpperCase();

          return (
            <div key={member.id} className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                {/* Member Profile Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ 
                      width: '48px', height: '48px', borderRadius: '50%', 
                      backgroundColor: 'var(--color-secondary)', color: '#0F172A', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center', 
                      fontSize: '1.1rem', fontWeight: 700 
                    }}>
                      {initials}
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
                        {member.name}
                      </h3>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                        <Mail size={12} /> {member.email || `${member.name.toLowerCase().replace(/\s+/g, '')}@company.com`}
                      </div>
                    </div>
                  </div>

                  <span style={{ 
                    fontSize: '0.75rem', fontWeight: 600, padding: '4px 10px', borderRadius: '12px',
                    backgroundColor: roleStyle.bg, color: roleStyle.color, textTransform: 'uppercase'
                  }}>
                    {roleStyle.label}
                  </span>
                </div>

                {/* Workload Progress */}
                <div style={{ backgroundColor: 'var(--color-surface)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '8px' }}>
                    <span>Active Workload</span>
                    <span>{rate}% Completion Rate</span>
                  </div>

                  <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--color-border)', borderRadius: '4px', overflow: 'hidden', marginBottom: '12px' }}>
                    <div style={{ width: `${rate}%`, height: '100%', backgroundColor: 'var(--color-primary)' }}></div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={14} color="var(--color-warning)" /> {activeTasks.length} Active Tasks
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={14} color="var(--color-success)" /> {completedTasks.length} Completed
                    </span>
                  </div>
                </div>

                {/* Active Tasks List */}
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>
                    Assigned Tasks ({assignedTasks.length})
                  </div>
                  {activeTasks.length === 0 ? (
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontStyle: 'italic', padding: '8px 0' }}>
                      No active tasks currently assigned
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {activeTasks.slice(0, 3).map(task => (
                        <Link 
                          key={task.id} 
                          to={`/tasks/${task.id}`}
                          style={{
                            textDecoration: 'none', padding: '8px 12px', borderRadius: 'var(--radius-sm)',
                            backgroundColor: 'var(--color-background)', border: '1px solid var(--color-border)',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            fontSize: '0.85rem', color: 'var(--color-text-main)', fontWeight: 500
                          }}
                        >
                          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '80%' }}>
                            {task.title}
                          </span>
                          <ArrowUpRight size={14} color="var(--color-text-muted)" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showInviteDialog && <InviteMemberDialog onClose={() => setShowInviteDialog(false)} />}
    </div>
  );
}
