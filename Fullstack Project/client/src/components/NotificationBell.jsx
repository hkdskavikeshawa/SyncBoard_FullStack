import { useState, useRef, useEffect } from 'react';
import { Bell, CheckCheck, Trash2, ArrowRight } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

const formatRelativeTime = (isoString) => {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

export default function NotificationBell() {
  const { notifications, unreadCount, markAllRead, clearAll, bellRef } = useNotifications();
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);
  const prevUnread = useRef(unreadCount);

  // Close panel on outside click
  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Mark all read when panel opens
  const handleOpen = () => {
    setOpen(o => {
      if (!o) markAllRead();
      return !o;
    });
  };

  return (
    <div ref={panelRef} style={{ position: 'relative' }}>
      {/* Bell Button */}
      <button
        ref={bellRef}
        onClick={handleOpen}
        id="notification-bell-btn"
        style={{
          position: 'relative', padding: '8px',
          border: '1px solid var(--color-border)', borderRadius: '50%',
          background: open ? 'var(--color-background)' : 'transparent',
          color: 'var(--color-text-main)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.2s ease'
        }}
        title="Notifications"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span
            className="notification-badge-pop"
            key={unreadCount}
            style={{
              position: 'absolute', top: '-4px', right: '-4px',
              minWidth: '18px', height: '18px', padding: '0 4px',
              borderRadius: '9999px', fontSize: '0.65rem', fontWeight: 700,
              backgroundColor: '#EF4444', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '2px solid var(--color-surface)'
            }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div style={{
          position: 'absolute', right: 0, top: 'calc(100% + 10px)',
          width: '340px', backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)', borderRadius: '16px',
          boxShadow: '0 16px 40px rgba(15,23,42,0.15)',
          zIndex: 300, overflow: 'hidden',
          animation: 'fadeIn 0.2s ease forwards'
        }}>
          {/* Panel Header */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '14px 16px', borderBottom: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-background)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bell size={16} color="var(--color-primary)" />
              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text-main)' }}>
                Notifications
              </span>
              {notifications.length > 0 && (
                <span style={{
                  fontSize: '0.7rem', fontWeight: 600, padding: '2px 7px',
                  borderRadius: '9999px', backgroundColor: 'rgba(15,118,110,0.12)',
                  color: 'var(--color-primary)'
                }}>
                  {notifications.length}
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              {notifications.length > 0 && (
                <>
                  <button
                    onClick={markAllRead}
                    title="Mark all read"
                    style={{ padding: '4px 8px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'transparent', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem' }}
                  >
                    <CheckCheck size={13} /> All read
                  </button>
                  <button
                    onClick={clearAll}
                    title="Clear all"
                    style={{ padding: '4px 8px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'transparent', cursor: 'pointer', color: '#EF4444', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem' }}
                  >
                    <Trash2 size={13} />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* List */}
          <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <div style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                <Bell size={32} style={{ marginBottom: '12px', opacity: 0.3 }} />
                <p style={{ fontWeight: 500, margin: 0 }}>All caught up!</p>
                <p style={{ fontSize: '0.8rem', margin: '4px 0 0' }}>No notifications yet</p>
              </div>
            ) : (
              notifications.map((n, i) => (
                <div
                  key={n.id}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: '10px',
                    padding: '12px 16px',
                    backgroundColor: n.read ? 'transparent' : 'rgba(15,118,110,0.04)',
                    borderBottom: i < notifications.length - 1 ? '1px solid var(--color-border)' : 'none',
                    transition: 'background 0.2s'
                  }}
                >
                  {/* Indicator dot */}
                  <div style={{
                    width: '8px', height: '8px', borderRadius: '50%', marginTop: '5px', flexShrink: 0,
                    backgroundColor: n.read ? 'transparent' : 'var(--color-primary)',
                    border: n.read ? '1.5px solid var(--color-border)' : 'none'
                  }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      margin: 0, fontSize: '0.84rem', color: 'var(--color-text-main)',
                      lineHeight: 1.5, fontWeight: n.read ? 400 : 500
                    }}>
                      {n.message}
                    </p>
                    <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                      {formatRelativeTime(n.timestamp)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
