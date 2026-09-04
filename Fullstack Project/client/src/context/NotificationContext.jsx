import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import * as notifApi from '../api/notifications';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const bellRef = useRef(null);
  const { user } = useAuth();

  const triggerBellRing = () => {
    if (bellRef.current) {
      bellRef.current.classList.remove('bell-ring');
      void bellRef.current.offsetWidth;
      bellRef.current.classList.add('bell-ring');
      setTimeout(() => bellRef.current?.classList.remove('bell-ring'), 700);
    }
  };

  const fetchUserNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      return;
    }
    try {
      const data = await notifApi.getNotifications();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching user notifications:', err);
    }
  }, [user]);

  useEffect(() => {
    fetchUserNotifications();
  }, [fetchUserNotifications]);

  useEffect(() => {
    const channel = new BroadcastChannel('collab_board_sync');
    channel.onmessage = (e) => {
      if (e.data?.type === 'NOTIFY' || e.data?.type === 'SYNC') {
        fetchUserNotifications().then(() => triggerBellRing());
      }
    };
    return () => channel.close();
  }, [fetchUserNotifications]);

  const addNotification = useCallback((message, actor = '') => {
    const notif = {
      id: crypto.randomUUID(),
      message,
      actor,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications(prev => [notif, ...prev].slice(0, 50));
    triggerBellRing();
  }, []);

  const markAllRead = useCallback(async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    try {
      await notifApi.markNotificationsAsRead();
    } catch (err) {
      console.error('Failed to mark notifications read on server:', err);
    }
  }, []);

  const clearAll = useCallback(async () => {
    setNotifications([]);
    try {
      await notifApi.clearNotifications();
    } catch (err) {
      console.error('Failed to clear notifications on server:', err);
    }
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, fetchUserNotifications, addNotification, markAllRead, clearAll, bellRef }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
};
