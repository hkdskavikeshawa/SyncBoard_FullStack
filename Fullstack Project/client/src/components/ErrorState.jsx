import { AlertTriangle } from 'lucide-react';

export default function ErrorState({ message, onRetry }) {
  return (
    <div className="animate-fade-in" style={{ 
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
      height: '50vh', gap: '16px', textAlign: 'center' 
    }}>
      <div style={{ backgroundColor: '#FEE2E2', padding: '16px', borderRadius: '50%', color: 'var(--color-danger)' }}>
        <AlertTriangle size={48} />
      </div>
      <div>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>Something went wrong</h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px' }}>{message || 'Failed to load data. Please try again.'}</p>
        {onRetry && (
          <button onClick={onRetry} className="btn btn-primary">Try Again</button>
        )}
      </div>
    </div>
  );
}
