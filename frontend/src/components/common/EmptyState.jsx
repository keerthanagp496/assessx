import React from 'react';

export function EmptyState({
  icon = '🔍',
  title = 'No items found',
  description = 'Try adjusting your search criteria or filters to find what you are looking for.',
  actionLabel,
  onAction
}) {
  return (
    <div className="empty-state-card">
      <div className="empty-state-icon">{icon}</div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-desc">{description}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          className="btn btn-secondary empty-state-btn"
          onClick={onAction}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
