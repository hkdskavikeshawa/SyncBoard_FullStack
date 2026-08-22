import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const bellRef = useRef(null); // exposed so Navbar can trigger ring animation

  // Listen for NOTIFY events from other tabs via BroadcastChannel
  useEffect(() => {
    const channel = new BroadcastChannel('collab_board_sync');
    channel.onmessage = (e) => {
      if (e.data.type === 'NOTIFY' && e.data.message) {
        addNotification(e.data.message, e.data.actor || 'Someone');
      }
    };
    return () => channel.close();
  }, []);

  const addNotification = useCallback((message, actor = '') => {
    const notif = {
      id: crypto.randomUUID(),
      message,
      actor,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications(prev => [notif, ...prev].slice(0, 50)); // keep last 50
    // Trigger bell ring on the bell button if ref is attached
    if (bellRef.current) {
      bellRef.current.classList.remove('bell-ring');
      // Force reflow so animation restarts
      void bellRef.current.offsetWidth;
      bellRef.current.classList.add('bell-ring');
      setTimeout(() => bellRef.current?.classList.remove('bell-ring'), 700);
    }
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, addNotification, markAllRead, clearAll, bellRef }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
};
