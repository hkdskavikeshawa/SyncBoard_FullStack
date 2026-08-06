export default function ConfirmDialog({ title, message, onConfirm, onCancel }) {
  return (
    <div style={{
      position: 'fixed', inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
    }}>
      <div className="animate-fade-in glass-panel" style={{
        backgroundColor: 'var(--color-surface)', padding: '24px', borderRadius: 'var(--radius-md)',
        width: '100%', maxWidth: '400px', boxShadow: 'var(--shadow-lg)'
      }}>
        <h3 style={{ marginTop: 0, marginBottom: '12px', fontSize: '1.25rem' }}>{title}</h3>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px' }}>{message}</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button onClick={onCancel} className="btn btn-outline">Cancel</button>
          <button onClick={onConfirm} className="btn btn-danger">Confirm</button>
        </div>
      </div>
    </div>
  );
}
