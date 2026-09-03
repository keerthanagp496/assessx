import React from 'react';
import { useTheme } from '../../context/ThemeContext';

export function Sidebar({ activeTab, onSelectTab, user, onLogout, mobileOpen, onCloseMobile }) {
  const { theme, toggleTheme, isDark } = useTheme();
  const isAdmin = user?.role === 'ROLE_ADMIN' || user?.role === 'ADMIN';

  const navItems = [
    {
      group: 'OVERVIEW',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: '📊' }
      ]
    },
    {
      group: 'LEARN',
      items: [
        { id: 'practice', label: 'Practice Arena', icon: '☕' },
        { id: 'competitions', label: 'Competitions', icon: '⚡' },
        { id: 'leaderboard', label: 'Leaderboard', icon: '🏆' }
      ]
    },
    {
      group: 'ASSESS',
      items: [
        { id: 'assessments', label: 'Assessments', icon: '🛡️' }
      ]
    },
    {
      group: 'INSIGHTS',
      items: [
        { id: 'analytics', label: 'Analytics', icon: '📈' },
        { id: 'profile', label: 'Profile', icon: '👤' }
      ]
    }
  ];

  if (isAdmin) {
    navItems.push({
      group: 'ADMINISTRATION',
      items: [
        { id: 'admin_dashboard', label: 'Admin Metrics', icon: '⚙️' },
        { id: 'admin_practice', label: 'Question Bank', icon: '📝' }
      ]
    });
  }

  const handleItemClick = (id) => {
    onSelectTab(id);
    onCloseMobile?.();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        className={`sidebar-backdrop ${mobileOpen ? 'open' : ''}`}
        onClick={onCloseMobile}
        aria-hidden="true"
      />

      <aside className={`app-sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        {/* Brand Header */}
        <div className="sidebar-brand">
          <div className="brand-logo-icon">◈</div>
          <div className="brand-text-block">
            <span className="brand-name">SentinelAssess</span>
            <span className="brand-tagline">Assess • Practice • Compete</span>
          </div>
        </div>

        {/* Navigation Categories */}
        <nav className="sidebar-menu">
          {navItems.map((sec) => (
            <div key={sec.group} className="sidebar-section">
              <div className="section-label">{sec.group}</div>
              <div className="section-items">
                {sec.items.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`nav-pill ${activeTab === item.id ? 'active' : ''}`}
                    onClick={() => handleItemClick(item.id)}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-text">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Sidebar Telemetry Box */}
        <div className="sidebar-telemetry-box">
          <div className="telemetry-row">
            <span>Compiler Engine</span>
            <span className="telemetry-active">● OpenJDK 17</span>
          </div>
          <div className="telemetry-row">
            <span>AI Proctor</span>
            <span className="telemetry-ready">Ready</span>
          </div>
        </div>

        {/* Sidebar Footer Controls */}
        <div className="sidebar-footer">
          <div className="footer-actions">
            <button
              type="button"
              className={`footer-btn ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => handleItemClick('settings')}
              title="Platform Settings"
            >
              <span className="btn-icon">⚙️</span>
              <span>Settings</span>
            </button>

            <button
              type="button"
              className="footer-btn"
              onClick={toggleTheme}
              title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
            >
              <span className="btn-icon">{isDark ? '☀️' : '🌙'}</span>
              <span>{isDark ? 'Light' : 'Dark'}</span>
            </button>
          </div>

          {/* User Profile Card */}
          <div className="user-profile-strip">
            <div className="user-avatar">
              {user?.username ? user.username[0].toUpperCase() : 'U'}
            </div>
            <div className="user-info">
              <span className="user-name">{user?.username || 'Student'}</span>
              <span className="user-role-badge">
                {isAdmin ? 'Admin' : 'Java Developer'}
              </span>
            </div>
            <button
              type="button"
              className="btn-logout"
              onClick={onLogout}
              title="Sign Out"
              aria-label="Sign Out"
            >
              🚪
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
