import { useState, useEffect, useRef } from 'react';
import { Bell, X } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

export default function ToastNotification() {
  const { notifications } = useNotifications();
  const [toasts, setToasts] = useState([]);
  const prevLenRef = useRef(notifications.length);

  // When a new notification arrives, pop a toast
  useEffect(() => {
    if (notifications.length > prevLenRef.current) {
      const latest = notifications[0]; // newest is first
      const toastId = latest.id;
      setToasts(prev => [...prev, { ...latest, toastId, exiting: false }]);

      // Auto-dismiss after 4s
      setTimeout(() => {
        setToasts(prev =>
          prev.map(t => t.toastId === toastId ? { ...t, exiting: true } : t)
        );
        setTimeout(() => {
          setToasts(prev => prev.filter(t => t.toastId !== toastId));
        }, 320);
      }, 4000);
    }
    prevLenRef.current = notifications.length;
  }, [notifications]);

  const dismiss = (toastId) => {
    setToasts(prev => prev.map(t => t.toastId === toastId ? { ...t, exiting: true } : t));
    setTimeout(() => setToasts(prev => prev.filter(t => t.toastId !== toastId)), 320);
  };

  if (toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed', bottom: '24px', right: '24px',
      zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '10px',
      pointerEvents: 'none'
    }}>
      {toasts.map(toast => (
        <div
          key={toast.toastId}
          className={toast.exiting ? 'toast-exit' : 'toast-enter'}
          style={{
            display: 'flex', alignItems: 'flex-start', gap: '12px',
            padding: '14px 16px',
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderLeft: '4px solid var(--color-primary)',
            borderRadius: '14px',
            boxShadow: '0 8px 24px rgba(15,23,42,0.15)',
            maxWidth: '320px', minWidth: '260px',
            pointerEvents: 'all'
          }}
        >
          {/* Icon */}
          <div style={{
            padding: '6px', borderRadius: '8px', flexShrink: 0,
            backgroundColor: 'rgba(15,118,110,0.12)', color: 'var(--color-primary)'
          }}>
            <Bell size={14} />
          </div>

          {/* Content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{
              margin: 0, fontSize: '0.84rem', fontWeight: 600,
              color: 'var(--color-text-main)', lineHeight: 1.4
            }}>
              Board Update
            </p>
            <p style={{
              margin: '3px 0 0', fontSize: '0.8rem',
              color: 'var(--color-text-muted)', lineHeight: 1.5
            }}>
              {toast.message}
            </p>
          </div>

          {/* Dismiss */}
          <button
            onClick={() => dismiss(toast.toastId)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--color-text-muted)', flexShrink: 0, padding: '2px',
              display: 'flex', alignItems: 'center'
            }}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
