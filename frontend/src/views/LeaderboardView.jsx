import React, { useState } from 'react';

export function LeaderboardView({ user }) {
  const [activeTab, setActiveTab] = useState('global');

  const podium = [
    { rank: 2, name: 'Sam', points: 920, solved: 45, rating: 1792, medal: '🥈', avatar: 'S' },
    { rank: 1, name: 'Alex', points: 980, solved: 48, rating: 1840, medal: '🥇', avatar: 'A' },
    { rank: 3, name: 'Ravi', points: 890, solved: 43, rating: 1755, medal: '🥉', avatar: 'R' }
  ];

  const rankings = [
    { rank: 1, name: 'Alex', solved: 48, points: 980, rating: 1840, badge: 'Grandmaster' },
    { rank: 2, name: 'Sam', solved: 45, points: 920, rating: 1792, badge: 'Master' },
    { rank: 3, name: 'Ravi', solved: 43, points: 890, rating: 1755, badge: 'Master' },
    { rank: 4, name: 'Elena Rostova', solved: 41, points: 840, rating: 1710, badge: 'Candidate Master' },
    { rank: 5, name: 'Chen Wei', solved: 39, points: 810, rating: 1685, badge: 'Candidate Master' },
    { rank: 6, name: 'Priya Sharma', solved: 38, points: 790, rating: 1660, badge: 'Expert' },
    { rank: 7, name: 'Lucas Silva', solved: 36, points: 750, rating: 1640, badge: 'Expert' },
    { rank: 8, name: 'David Miller', solved: 35, points: 720, rating: 1615, badge: 'Expert' },
    { rank: 18, name: user?.username || 'Karthik (You)', solved: 42, points: 380, rating: 1540, badge: 'Java Specialist', isCurrent: true }
  ];

  return (
    <div className="view-content-wrapper">
      <div className="leaderboard-hero-header">
        <div>
          <span className="leaderboard-tag">🏆 Global Standings</span>
          <h1 className="leaderboard-title">Hall of Fame & Rankings</h1>
          <p className="leaderboard-subtitle">
            Celebrating the top Java engineers, competitive problem solvers, and assessment leaders.
          </p>
        </div>

        <div className="leaderboard-user-rank-box">
          <span className="rank-title">Your Current Rank</span>
          <span className="rank-number">#18</span>
          <span className="rank-points">380 Total Points</span>
        </div>
      </div>

      {/* Podium for Top 3 */}
      <div className="podium-container">
        {/* 2nd Place */}
        <div className="podium-card rank-2">
          <div className="podium-medal">{podium[0].medal}</div>
          <div className="podium-avatar">{podium[0].avatar}</div>
          <div className="podium-name">{podium[0].name}</div>
          <div className="podium-points">{podium[0].points} pts</div>
          <div className="podium-sub">{podium[0].solved} Solved • {podium[0].rating} Rating</div>
          <div className="podium-bar bar-2">2nd</div>
        </div>

        {/* 1st Place */}
        <div className="podium-card rank-1">
          <div className="podium-medal">{podium[1].medal}</div>
          <div className="podium-avatar crown-avatar">{podium[1].avatar}</div>
          <div className="podium-name">{podium[1].name}</div>
          <div className="podium-points">{podium[1].points} pts</div>
          <div className="podium-sub">{podium[1].solved} Solved • {podium[1].rating} Rating</div>
          <div className="podium-bar bar-1">1st</div>
        </div>

        {/* 3rd Place */}
        <div className="podium-card rank-3">
          <div className="podium-medal">{podium[2].medal}</div>
          <div className="podium-avatar">{podium[2].avatar}</div>
          <div className="podium-name">{podium[2].name}</div>
          <div className="podium-points">{podium[2].points} pts</div>
          <div className="podium-sub">{podium[2].solved} Solved • {podium[2].rating} Rating</div>
          <div className="podium-bar bar-3">3rd</div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="leaderboard-tabs-bar">
        {['global', 'weekly', 'competitions', 'arrays', 'strings'].map((tab) => (
          <button
            key={tab}
            type="button"
            className={`leaderboard-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Rankings Table */}
      <div className="table-responsive-container">
        <table className="modern-table leaderboard-table">
          <thead>
            <tr>
              <th style={{ width: '80px' }}>Rank</th>
              <th>Coder</th>
              <th>Rank Badge</th>
              <th>Problems Solved</th>
              <th>Total Points</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {rankings.map((r) => (
              <tr key={r.rank} className={r.isCurrent ? 'current-user-row' : ''}>
                <td>
                  <span className={`rank-number-pill ${r.rank <= 3 ? `top-${r.rank}` : ''}`}>
                    {r.rank === 1 ? '🥇' : r.rank === 2 ? '🥈' : r.rank === 3 ? '🥉' : `#${r.rank}`}
                  </span>
                </td>
                <td>
                  <div className="coder-identity-cell">
                    <div className="coder-avatar-mini">{r.name[0]}</div>
                    <span className="coder-name">
                      {r.name} {r.isCurrent && <span className="you-pill">You</span>}
                    </span>
                  </div>
                </td>
                <td>
                  <span className="rank-tier-badge">{r.badge}</span>
                </td>
                <td>
                  <strong>{r.solved}</strong> problems
                </td>
                <td>
                  <span className="points-highlight">{r.points} pts</span>
                </td>
                <td>
                  <strong className="rating-value">{r.rating}</strong>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
