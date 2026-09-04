import React from 'react';
import { useTheme } from '../../context/ThemeContext';

export function Sidebar({ activeTab, onSelectTab, user, onToggleRole, onLogout, mobileOpen, onCloseMobile }) {
  const { theme, toggleTheme, isDark } = useTheme();
  const isAdmin = user?.role === 'ROLE_ADMIN' || user?.role === 'ADMIN';

  const studentNavGroups = [
    {
      group: 'OVERVIEW',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: '📊' }
      ]
    },
    {
      group: 'LEARN & REVISE',
      items: [
        { id: 'quickprep', label: '⚡ QuickPrep', icon: '⚡', highlight: true },
        { id: 'practice', label: 'Practice Arena', icon: '☕' },
        { id: 'competitions', label: 'Competitions', icon: '🎯' },
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

  const adminNavGroups = [
    {
      group: 'ADMIN OVERVIEW',
      items: [
        { id: 'admin_dashboard', label: 'Admin Metrics', icon: '📊' }
      ]
    },
    {
      group: 'CONTENT AUTHORING',
      items: [
        { id: 'admin_quickprep', label: '⚡ QuickPrep Hub', icon: '⚡' },
        { id: 'admin_practice', label: 'Question Bank', icon: '📝' },
        { id: 'admin_assessments', label: 'Exam Hub', icon: '🛡️' }
      ]
    },
    {
      group: 'AUDIT & CANDIDATES',
      items: [
        { id: 'admin_submissions', label: 'Submissions & Audit', icon: '📋' },
        { id: 'admin_users', label: 'Candidate Directory', icon: '👥' }
      ]
    },
    {
      group: 'STUDENT PORTAL PREVIEW',
      items: [
        { id: 'dashboard', label: 'Student View', icon: '👀' },
        { id: 'quickprep', label: '⚡ QuickPrep', icon: '⚡' },
        { id: 'practice', label: 'Practice Arena', icon: '☕' }
      ]
    }
  ];

  const navGroups = isAdmin ? adminNavGroups : studentNavGroups;

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
            <span className="brand-name">AssessX</span>
            <span className="brand-tagline">Assess • Practice • Compete</span>
          </div>
        </div>

        {/* Mode Switcher Banner (ONLY visible to Administrators) */}
        {isAdmin && (
          <div className="sidebar-mode-switcher-bar">
            <button
              type="button"
              className={`mode-btn ${activeTab.startsWith('admin_') ? '' : 'active'}`}
              onClick={() => onSelectTab('dashboard')}
            >
              👤 Student View
            </button>
            <button
              type="button"
              className={`mode-btn ${activeTab.startsWith('admin_') ? 'active admin-active' : ''}`}
              onClick={() => onSelectTab('admin_dashboard')}
            >
              👑 Admin Portal
            </button>
          </div>
        )}

        {/* Student Class Badge for Students */}
        {!isAdmin && (
          <div className="student-sidebar-class-badge" style={{ padding: '8px 14px', margin: '0 12px 10px', background: 'rgba(99,102,241,0.08)', borderRadius: '8px', border: '1px solid rgba(99,102,241,0.18)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11.5px', color: 'var(--primary-light)' }}>
            <span>🎓</span>
            <div>
              <div style={{ fontWeight: 600 }}>Student Portal</div>
              <div style={{ fontSize: '10.5px', color: 'var(--text-dim)' }}>{user?.userClass || 'Second Year - Java & DSA'}</div>
            </div>
          </div>
        )}

        {/* Navigation Categories */}
        <nav className="sidebar-menu">
          {navGroups.map((sec) => (
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
                {isAdmin ? '👑 Administrator' : '👤 Java Developer'}
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
