import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';

export function CompetitionsView({ onSelectCompetition }) {
  const toast = useToast();
  const [registered, setRegistered] = useState({});

  const contests = [
    {
      id: 'c1',
      title: 'Weekly Java DSA Sprint #42',
      status: 'LIVE',
      startTime: 'Live Now',
      remainingTime: '01:24:12 remaining',
      duration: '2 Hours',
      problems: 4,
      participants: 580,
      description: 'Timed contest focusing on Sliding Window, Dynamic Programming, and Binary Search algorithms.',
      ratingEffect: 'Rated',
      solved: '2 / 4',
      rank: '#24',
      score: 80
    },
    {
      id: 'c2',
      title: 'Biweekly Java Collections & Stream API Clash',
      status: 'UPCOMING',
      startTime: 'Starts in 02:14:32',
      remainingTime: null,
      duration: '1h 30m',
      problems: 3,
      participants: 342,
      description: 'Test your mastery in custom HashMaps, PriorityQueues, TreeSets, and concurrent data pipelines.',
      ratingEffect: 'Rated'
    },
    {
      id: 'c3',
      title: 'Sentinel Grandmaster Algorithmic Cup 2026',
      status: 'UPCOMING',
      startTime: 'Sep 12, 2026 • 18:00 UTC',
      remainingTime: null,
      duration: '3 Hours',
      problems: 6,
      participants: 1240,
      description: 'The premier open Java programming championship with complex graph theory and combinatorics.',
      ratingEffect: 'Premier Rated'
    }
  ];

  const handleRegister = (id, title) => {
    setRegistered((prev) => ({ ...prev, [id]: true }));
    toast.success(`Registered successfully for ${title}!`);
  };

  return (
    <div className="view-content-wrapper">
      <div className="competitions-hero-header">
        <div>
          <span className="competitions-tag">⚡ Live Coding Competitions</span>
          <h1 className="competitions-title">Java Algorithmic Contests</h1>
          <p className="competitions-subtitle">
            Compete in timed rounds, solve challenging problems under pressure, and raise your global developer rating.
          </p>
        </div>

        <div className="competitions-rating-badge">
          <span className="rating-num">1792</span>
          <span className="rating-lbl">Your Rating (Master)</span>
        </div>
      </div>

      {/* Contests List */}
      <div className="contests-grid">
        {contests.map((c) => {
          const isLive = c.status === 'LIVE';
          const isReg = Boolean(registered[c.id]);

          return (
            <div key={c.id} className={`contest-card ${isLive ? 'live-card' : ''}`}>
              <div className="contest-card-top">
                <span className={`contest-status-pill ${isLive ? 'live' : 'upcoming'}`}>
                  {isLive ? '● Live Contest' : '⏱ Upcoming'}
                </span>
                <span className="contest-rating-tag">{c.ratingEffect}</span>
              </div>

              <h2 className="contest-title">{c.title}</h2>
              <p className="contest-desc">{c.description}</p>

              <div className="contest-meta-grid">
                <div className="contest-meta-item">
                  <span className="meta-icon">⏱️</span>
                  <div>
                    <div className="meta-val">{c.duration}</div>
                    <div className="meta-lbl">Duration</div>
                  </div>
                </div>
                <div className="contest-meta-item">
                  <span className="meta-icon">📝</span>
                  <div>
                    <div className="meta-val">{c.problems} Problems</div>
                    <div className="meta-lbl">Count</div>
                  </div>
                </div>
                <div className="contest-meta-item">
                  <span className="meta-icon">👥</span>
                  <div>
                    <div className="meta-val">{c.participants}</div>
                    <div className="meta-lbl">Registered</div>
                  </div>
                </div>
              </div>

              {isLive ? (
                <div className="contest-live-box">
                  <div className="live-telemetry-row">
                    <span className="time-remaining">⏱ {c.remainingTime}</span>
                    <span className="live-score">Score: {c.score} (Rank {c.rank})</span>
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary btn-block"
                    onClick={() => onSelectCompetition?.(c.id)}
                  >
                    Enter Live Arena →
                  </button>
                </div>
              ) : (
                <div className="contest-footer-action">
                  <span className="contest-start-time">{c.startTime}</span>
                  <button
                    type="button"
                    className={`btn ${isReg ? 'btn-secondary' : 'btn-primary'} btn-sm`}
                    onClick={() => handleRegister(c.id, c.title)}
                  >
                    {isReg ? '✓ Registered' : 'Join Competition'}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
