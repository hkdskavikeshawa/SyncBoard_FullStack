import { Loader2 } from 'lucide-react';

export default function LoadingState() {
  return (
    <div className="flex-center animate-fade-in" style={{ height: '50vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
      <Loader2 size={40} className="spinner" style={{ color: 'var(--color-primary)', animation: 'spin 1s linear infinite' }} />
      <p style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>Loading SyncBoard...</p>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
