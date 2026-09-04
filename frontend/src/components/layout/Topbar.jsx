import React, { useState } from 'react';

export function Topbar({ user, onToggleMobileMenu, onToggleRole, onSearch, searchQuery = '' }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const isAdmin = user?.role === 'ROLE_ADMIN' || user?.role === 'ADMIN';

  const notifications = [
    { id: 1, title: 'Weekly Java DSA Challenge', time: 'Starting in 2 hours', unread: true },
    { id: 2, title: 'Submission Evaluated', time: 'Reverse a String: 100% Passed', unread: false },
    { id: 3, title: 'Proctored Assessment Live', time: 'Core Java & Data Structures', unread: false }
  ];

  return (
    <header className="app-topbar">
      <div className="topbar-left">
        <button
          type="button"
          className="mobile-hamburger-btn"
          onClick={onToggleMobileMenu}
          aria-label="Open navigation menu"
        >
          ☰
        </button>

        {/* Search Bar with Shortcut hint */}
        <div className="global-search-container">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="global-search-input"
            placeholder="Search assessments, problems, topics..."
            value={searchQuery}
            onChange={(e) => onSearch?.(e.target.value)}
          />
          <kbd className="search-shortcut">Ctrl+K</kbd>
        </div>
      </div>

      <div className="topbar-right">
        {/* Role Indicator / Switcher for Admins */}
        {isAdmin ? (
          <button
            type="button"
            className="topbar-role-pill admin-pill"
            onClick={() => onToggleRole?.(user?.role === 'ROLE_ADMIN' ? 'ROLE_STUDENT' : 'ROLE_ADMIN')}
            title="Administrator Mode"
          >
            <span>👑 Administrator</span>
          </button>
        ) : (
          <div className="topbar-role-pill student-pill" style={{ cursor: 'default' }}>
            <span>🎓 Student</span>
            <small style={{ opacity: 0.8, marginLeft: '4px' }}>({user?.userClass?.split(' - ')[0] || 'Enrolled'})</small>
          </div>
        )}

        {/* Telemetry Status Pill */}
        <div className="system-status-indicator">
          <span className="status-dot-green"></span>
          <span className="status-label">Proctoring Ready</span>
        </div>

        {/* Notifications Bell */}
        <div className="notifications-dropdown-wrapper">
          <button
            type="button"
            className="topbar-icon-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
          >
            🔔
            <span className="unread-dot"></span>
          </button>

          {showNotifications && (
            <div className="notifications-popover">
              <div className="popover-header">
                <strong>Notifications</strong>
                <span className="unread-count">1 new</span>
              </div>
              <div className="popover-list">
                {notifications.map((n) => (
                  <div key={n.id} className={`popover-item ${n.unread ? 'unread' : ''}`}>
                    <div className="item-title">{n.title}</div>
                    <div className="item-time">{n.time}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Identity Pill */}
        <div className="topbar-user-pill">
          <span className="user-icon">{isAdmin ? '👑' : '👤'}</span>
          <span className="user-name-short">{user?.username || (isAdmin ? 'Admin' : 'Student')}</span>
        </div>
      </div>
    </header>
  );
}
