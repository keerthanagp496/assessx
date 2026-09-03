import React from 'react';

export function DifficultyBadge({ difficulty = 'EASY' }) {
  const diff = String(difficulty).toUpperCase();
  let className = 'badge-easy';
  if (diff === 'MEDIUM') className = 'badge-medium';
  if (diff === 'HARD') className = 'badge-hard';

  return <span className={`badge-diff ${className}`}>{diff}</span>;
}

export function StatusBadge({ status }) {
  let label = status;
  let variant = 'info';

  if (status === 'SOLVED' || status === 'ACCEPTED' || status === 'COMPLETED') {
    label = '✓ Solved';
    variant = 'success';
  } else if (status === 'ATTEMPTED' || status === 'IN_PROGRESS' || status === 'LIVE') {
    label = '◐ In Progress';
    variant = 'warning';
  } else if (status === 'TERMINATED_VIOLATIONS' || status === 'DISQUALIFIED') {
    label = '✕ Terminated';
    variant = 'danger';
  } else if (status === 'UNSOLVED' || status === 'UPCOMING') {
    label = status === 'UPCOMING' ? '● Upcoming' : '○ Unsolved';
    variant = 'neutral';
  }

  return <span className={`badge-status badge-status-${variant}`}>{label}</span>;
}

export function ProctorBadge({ active = true }) {
  return (
    <span className={`badge-proctor ${active ? 'active' : ''}`}>
      <span className="proctor-indicator">●</span> AI Proctor Active
    </span>
  );
}

export function PointsBadge({ points }) {
  return (
    <span className="badge-points">
      +{points} pts
    </span>
  );
}
