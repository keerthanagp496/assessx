import React from 'react';

export function MobileNav({ activeTab, onSelectTab }) {
  const items = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'quickprep', label: '⚡ QuickPrep', icon: '⚡' },
    { id: 'practice', label: 'Practice', icon: '☕' },
    { id: 'assessments', label: 'Assess', icon: '🛡️' },
    { id: 'leaderboard', label: 'Ranks', icon: '🏆' }
  ];

  return (
    <nav className="mobile-bottom-bar" aria-label="Mobile Navigation">
      {items.map((it) => (
        <button
          key={it.id}
          type="button"
          className={`mobile-bar-btn ${activeTab === it.id ? 'active' : ''}`}
          onClick={() => onSelectTab(it.id)}
        >
          <span className="mobile-bar-icon">{it.icon}</span>
          <span className="mobile-bar-label">{it.label}</span>
        </button>
      ))}
    </nav>
  );
}
