import React from 'react';

export function Skeleton({ width = '100%', height = '20px', borderRadius = '6px', className = '' }) {
  return (
    <div
      className={`skeleton-box ${className}`}
      style={{ width, height, borderRadius }}
      aria-hidden="true"
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="card card-skeleton-wrapper">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
        <Skeleton width="90px" height="22px" borderRadius="12px" />
        <Skeleton width="60px" height="18px" />
      </div>
      <Skeleton width="75%" height="24px" style={{ marginBottom: '10px' }} />
      <Skeleton width="100%" height="16px" style={{ marginBottom: '6px' }} />
      <Skeleton width="90%" height="16px" style={{ marginBottom: '16px' }} />
      <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
        <Skeleton width="30%" height="32px" borderRadius="6px" />
        <Skeleton width="30%" height="32px" borderRadius="6px" />
      </div>
    </div>
  );
}

export function TableRowSkeleton({ columns = 5 }) {
  return (
    <tr className="skeleton-row">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} style={{ padding: '14px 16px' }}>
          <Skeleton height="18px" width={i === 0 ? '70%' : '50%'} />
        </td>
      ))}
    </tr>
  );
}
