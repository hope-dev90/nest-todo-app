import React from 'react';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';

export default function AppLayout({ children, title, subtitle }) {
  const { user } = useAuth();

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <h2>{title || `${greeting()}, ${user?.name?.split(' ')[0] || 'there'} 👋`}</h2>
            <p>{subtitle || "Let's finish your tasks today!"}</p>
          </div>
          <div className="topbar-right">
            <button className="icon-btn" title="Notifications">
              🔔
              <span className="notif-dot" />
            </button>
          </div>
        </header>
        <div className="page-body">
          {children}
        </div>
      </div>
    </div>
  );
}
