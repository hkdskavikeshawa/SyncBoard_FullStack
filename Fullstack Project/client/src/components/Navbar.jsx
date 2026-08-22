import { Link, useLocation } from 'react-router-dom';
import { LayoutGrid, BarChart2, Calendar, Users, Sun, Moon, LogOut, History } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect, useRef } from 'react';
import NotificationBell from './NotificationBell';

export default function Navbar({ onOpenActivity }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const menuRef = useRef(null);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { label: 'Board', path: '/', icon: LayoutGrid },
    { label: 'Analytics', path: '/analytics', icon: BarChart2 },
    { label: 'Calendar', path: '/calendar', icon: Calendar },
    { label: 'Team', path: '/team', icon: Users },
  ];

  const avatarLetter = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <nav className="glass-panel" style={{ 
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
      marginBottom: '24px', padding: '14px 24px', borderRadius: 'var(--radius-lg)',
      zIndex: 100, position: 'relative'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <img src="/logo.png" alt="CodeForge" style={{ height: '48px' }} />
        </Link>

        <div style={{ width: '1px', height: '32px', backgroundColor: 'var(--color-border)' }}></div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--color-background)', padding: '4px', borderRadius: '9999px', border: '1px solid var(--color-border)' }}>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.path} 
                to={item.path}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '8px 16px', borderRadius: '9999px',
                  fontSize: '0.875rem', fontWeight: 600,
                  textDecoration: 'none',
                  backgroundColor: isActive ? 'var(--color-primary)' : 'transparent',
                  color: isActive ? 'white' : 'var(--color-text-muted)',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button 
          onClick={() => setDarkMode(!darkMode)} 
          className="btn btn-outline" 
          style={{ padding: '8px', border: '1px solid var(--color-border)', borderRadius: '50%', color: 'var(--color-text-main)' }} 
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {onOpenActivity && (
          <button 
            onClick={onOpenActivity} 
            className="btn btn-outline" 
            style={{ padding: '8px', border: '1px solid var(--color-border)', borderRadius: '50%', color: 'var(--color-text-main)' }} 
            title="Activity Log & Export Data"
          >
            <History size={18} />
          </button>
        )}

        {/* Notification Bell */}
        <NotificationBell />

        <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--color-border)', margin: '0 4px' }}></div>

        <div ref={menuRef} style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            style={{
              border: 'none',
              background: 'transparent',
              padding: 0,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
            aria-label="Open user menu"
          >
            <div style={{ 
              width: '34px', height: '34px', borderRadius: '50%', 
              backgroundColor: 'var(--color-primary)', color: 'white', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              fontWeight: 600, fontSize: '0.875rem' 
            }} title={user?.email || 'User'}>
              {avatarLetter}
            </div>
          </button>

          {isOpen && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: 'calc(100% + 12px)',
              width: '280px',
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: '16px',
              boxShadow: '0 16px 40px rgba(15, 23, 42, 0.12)',
              overflow: 'hidden',
              zIndex: 200,
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '14px 16px', borderBottom: '1px solid var(--color-border)',
              }}>
                <div style={{
                  width: '42px', height: '42px', borderRadius: '50%',
                  backgroundColor: 'var(--color-primary)', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700
                }}>
                  {avatarLetter}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, color: 'var(--color-text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {user?.name || 'Demo User'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {user?.email || 'demo@example.com'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid' }}>
                <Link to="/profile" onClick={() => setIsOpen(false)} style={menuItemStyle}>My Profile</Link>
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    logout();
                  }}
                  style={{ ...menuItemStyle, borderTop: '1px solid var(--color-border)', background: 'transparent', textAlign: 'left', width: '100%', fontFamily: 'inherit' }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <LogOut size={14} />
                    Sign out
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

const menuItemStyle = {
  display: 'flex',
  alignItems: 'center',
  padding: '12px 16px',
  textDecoration: 'none',
  color: 'var(--color-text-main)',
  fontWeight: 600,
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
};
