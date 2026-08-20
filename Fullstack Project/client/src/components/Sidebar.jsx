import { useTasks } from '../hooks/useTasks';

export default function Sidebar() {
  const { members } = useTasks();

  return (
    <div style={{ 
      width: '300px', 
      paddingLeft: '24px', 
      borderLeft: '1px solid var(--color-border)',
      display: 'flex',
      flexDirection: 'column',
      gap: '32px'
    }}>
      {/* Activity Feed */}
      <div>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px' }}>Activity Feed</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Static Mock Activity */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ marginTop: '6px', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-text-muted)' }} />
            <div>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-main)', margin: 0 }}>Refactor User Auth</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: 0 }}>20 hours ago</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ marginTop: '6px', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-text-muted)' }} />
            <div>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-main)', margin: 0 }}>Setup Database Schema</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: 0 }}>Yesterday</p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Members */}
      <div>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px' }}>Team Members</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {members.map(member => {
            const initials = member.name.split(' ').map(n => n[0]).join('').toUpperCase();
            return (
              <div key={member.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ 
                  width: '32px', height: '32px', borderRadius: '50%', 
                  backgroundColor: '#E2E8F0', color: '#475569',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.75rem', fontWeight: 600
                }}>
                  {initials}
                </div>
                <span style={{ fontSize: '0.875rem', color: 'var(--color-text-main)' }}>
                  {initials} {initials} {/* Matching screenshot displaying "JD JD" style or just name */}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
