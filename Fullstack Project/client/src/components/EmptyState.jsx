import { ClipboardList } from 'lucide-react';

export default function EmptyState({ title, subtitle, action }) {
  return (
    <div className="animate-fade-in" style={{ 
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
      padding: '48px 24px', textAlign: 'center', backgroundColor: 'var(--color-surface)',
      borderRadius: 'var(--radius-md)', border: '1px dashed var(--color-border)', margin: '24px 0'
    }}>
      <div style={{ backgroundColor: '#F1F5F9', padding: '16px', borderRadius: '50%', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
        <ClipboardList size={40} />
      </div>
      <h3 style={{ fontSize: '1.125rem', marginBottom: '8px', color: 'var(--color-text-main)' }}>{title || 'No tasks found'}</h3>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px', maxWidth: '400px' }}>
        {subtitle || "It looks like there's nothing here yet."}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
}
