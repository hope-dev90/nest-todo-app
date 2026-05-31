import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { icon: '⊞', label: 'Dashboard', path: '/dashboard' },
  { icon: '📝', label: 'My Notes',  path: '/notes' },
  { icon: '📅', label: 'Agenda',    path: '/agenda' },
];

const bottomItems = [
  { icon: '⚙️', label: 'Settings', path: '/settings' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : user?.email?.[0]?.toUpperCase() || 'U';

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">📋</div>
        <span>Taskify</span>
      </div>

      <div className="nav-section-label">Menu</div>

      <nav>
        {navItems.map(item => (
          <div
            key={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            {item.label}
          </div>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="nav-section-label">Account</div>
        {bottomItems.map(item => (
          <div
            key={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            {item.label}
          </div>
        ))}
        <div
          className="nav-item"
          onClick={logout}
          style={{ color: 'var(--danger)' }}
        >
          <span style={{ fontSize: 16 }}>🚪</span>
          Sign out
        </div>

        <div style={{ height: 12 }} />

        <div className="sidebar-user">
          <div className="avatar">{initials}</div>
          <div className="user-info">
            <div className="user-name">{user?.name || user?.email || 'User'}</div>
            <div className="user-role">{user?.email || ''}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
