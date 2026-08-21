import { Link, useLocation } from 'react-router-dom';
import { LayoutGrid, BarChart2, Calendar, Users, Sun, Moon, LogOut, History } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';

export default function Navbar({ onOpenActivity }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const navItems = [
    { label: 'Board', path: '/', icon: LayoutGrid },
    { label: 'Analytics', path: '/analytics', icon: BarChart2 },
    { label: 'Calendar', path: '/calendar', icon: Calendar },
    { label: 'Team', path: '/team', icon: Users },
  ];

  return (
    <nav className="glass-panel" style={{ 
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
      marginBottom: '24px', padding: '14px 24px', borderRadius: 'var(--radius-lg)',
      zIndex: 100, position: 'relative'
    }}>
      {/* Brand Logo & Main Nav Items */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <img src="/logo.png" alt="CodeForge" style={{ height: '48px' }} />
        </Link>

        <div style={{ width: '1px', height: '32px', backgroundColor: 'var(--color-border)' }}></div>

        {/* Navigation Pills */}
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

      {/* Utilities & User Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Dark Mode Toggle */}
        <button 
          onClick={() => setDarkMode(!darkMode)} 
          className="btn btn-outline" 
          style={{ padding: '8px', border: '1px solid var(--color-border)', borderRadius: '50%', color: 'var(--color-text-main)' }} 
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Activity Feed Drawer */}
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

        <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--color-border)', margin: '0 4px' }}></div>

        {/* User Badge & Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ 
            width: '34px', height: '34px', borderRadius: '50%', 
            backgroundColor: 'var(--color-primary)', color: 'white', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            fontWeight: 600, fontSize: '0.875rem' 
          }} title={user?.email || 'User'}>
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <button onClick={logout} className="btn btn-outline" style={{ padding: '8px', border: 'none' }} title="Logout">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </nav>
  );
}
