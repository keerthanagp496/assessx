import React, { useState } from 'react';

export function AdminUsersView() {
  const [search, setSearch] = useState('');

  const mockUsers = [
    { id: 1, name: 'Admin User', email: 'admin@sentinelassess.local', role: 'ROLE_ADMIN', solved: 50, points: 1200, status: 'Active', joined: 'Jan 2026' },
    { id: 2, name: 'Karthik P', email: 'student@sentinelassess.local', role: 'ROLE_STUDENT', solved: 42, points: 380, status: 'Active', joined: 'Mar 2026' },
    { id: 3, name: 'Alex Chen', email: 'alex.chen@dev.io', role: 'ROLE_STUDENT', solved: 48, points: 980, status: 'Active', joined: 'Feb 2026' },
    { id: 4, name: 'Samira Khan', email: 'samira.k@outlook.com', role: 'ROLE_STUDENT', solved: 45, points: 920, status: 'Active', joined: 'Feb 2026' },
    { id: 5, name: 'Ravi Kumar', email: 'ravi.kumar@tech.in', role: 'ROLE_STUDENT', solved: 43, points: 890, status: 'Active', joined: 'Mar 2026' }
  ];

  const filtered = mockUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="view-content-wrapper">
      <div className="admin-hero-header">
        <div>
          <span className="admin-tag">👥 User Registry</span>
          <h1 className="admin-title">Candidate & Administrator Directory</h1>
          <p className="admin-subtitle">
            Manage student enrollments, permissions, competitive ratings, and progress metrics.
          </p>
        </div>
      </div>

      <div className="admin-table-filter-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Search users by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="table-count-label">
          <strong>{filtered.length}</strong> active candidates
        </div>
      </div>

      <div className="table-responsive-container">
        <table className="modern-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Assigned Role</th>
              <th>Problems Solved</th>
              <th>Points Earned</th>
              <th>Joined Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id}>
                <td>
                  <div className="coder-identity-cell">
                    <div className="coder-avatar-mini">{u.name[0]}</div>
                    <strong>{u.name}</strong>
                  </div>
                </td>
                <td className="text-muted">{u.email}</td>
                <td>
                  <span className={`rank-tier-badge ${u.role === 'ROLE_ADMIN' ? 'bg-purple' : ''}`}>
                    {u.role === 'ROLE_ADMIN' ? '👑 Administrator' : '👤 Student'}
                  </span>
                </td>
                <td><strong>{u.solved}</strong></td>
                <td><span className="points-highlight">{u.points} pts</span></td>
                <td className="text-dim">{u.joined}</td>
                <td>
                  <span className="badge-status badge-status-success">● {u.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
