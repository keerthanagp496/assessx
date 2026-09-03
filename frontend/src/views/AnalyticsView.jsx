import React from 'react';

export function AnalyticsView({ user }) {
  const stats = {
    solved: 42,
    accuracy: '76%',
    points: 380,
    streak: '8 days',
    totalSubmissions: 58
  };

  const topicAccuracy = [
    { topic: 'Arrays & Dynamic Arrays', pct: 90, solved: 18, total: 20 },
    { topic: 'Strings & Parsing', pct: 82, solved: 14, total: 17 },
    { topic: 'Searching & Binary Search', pct: 76, solved: 8, total: 11 },
    { topic: 'Sorting Algorithms', pct: 71, solved: 7, total: 10 },
    { topic: 'Linked Lists & Pointers', pct: 64, solved: 6, total: 10 },
    { topic: 'Trees & BST', pct: 51, solved: 4, total: 8 },
    { topic: 'Graphs (BFS & DFS)', pct: 42, solved: 3, total: 7 }
  ];

  const difficultyStats = [
    { diff: 'Easy', count: 24, total: 28, color: '#10b981', pct: 85 },
    { diff: 'Medium', count: 14, total: 20, color: '#f59e0b', pct: 70 },
    { diff: 'Hard', count: 4, total: 12, color: '#ef4444', pct: 33 }
  ];

  return (
    <div className="view-content-wrapper">
      <div className="analytics-hero-header">
        <div>
          <span className="analytics-tag">📈 Performance Metrics</span>
          <h1 className="analytics-title">Developer Skill & Analytics</h1>
          <p className="analytics-subtitle">
            Comprehensive diagnostic telemetry tracking your Java problem-solving velocity, accuracy, and topic strengths.
          </p>
        </div>

        <div className="analytics-health-card">
          <span className="health-score">Level 8</span>
          <span className="health-lbl">Proficiency Rank</span>
        </div>
      </div>

      {/* Main Metric Cards */}
      <div className="stats-metric-grid">
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Problems Solved</span>
            <span className="metric-icon-box bg-blue">✓</span>
          </div>
          <div className="metric-value">{stats.solved}</div>
          <div className="metric-footnote">
            <span className="text-success">Across 7 Core Topics</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Submission Accuracy</span>
            <span className="metric-icon-box bg-green">🎯</span>
          </div>
          <div className="metric-value">{stats.accuracy}</div>
          <div className="metric-footnote">
            <span className="text-success">44 of 58</span> test runs accepted
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Total Points</span>
            <span className="metric-icon-box bg-amber">⚡</span>
          </div>
          <div className="metric-value">{stats.points}</div>
          <div className="metric-footnote">
            <span>Rank #18 Globally</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Current Streak</span>
            <span className="metric-icon-box bg-purple">🔥</span>
          </div>
          <div className="metric-value">{stats.streak}</div>
          <div className="metric-footnote">
            <span className="text-warning">Daily active coding</span>
          </div>
        </div>
      </div>

      {/* 2-Column Analytics Visualizations */}
      <div className="analytics-columns-grid">
        {/* Left: Topic Mastery */}
        <div className="analytics-card-box">
          <div className="box-header-row">
            <h2 className="box-title">Topic Performance Breakdown</h2>
            <span className="box-tag">Java Data Structures</span>
          </div>

          <div className="analytics-topics-list">
            {topicAccuracy.map((t) => (
              <div key={t.topic} className="topic-analytic-row">
                <div className="topic-header-line">
                  <span className="topic-title-text">{t.topic}</span>
                  <span className="topic-score-text">
                    <strong>{t.pct}%</strong> ({t.solved}/{t.total})
                  </span>
                </div>
                <div className="progress-track-thick">
                  <div
                    className="progress-fill-gradient"
                    style={{ width: `${t.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Difficulty & Submission Breakdown */}
        <div className="analytics-card-box">
          <div className="box-header-row">
            <h2 className="box-title">Difficulty Distribution</h2>
            <span className="box-tag">Solved vs Available</span>
          </div>

          <div className="difficulty-bars-group">
            {difficultyStats.map((d) => (
              <div key={d.diff} className="diff-stat-card">
                <div className="diff-header-line">
                  <span className="diff-name" style={{ color: d.color }}>
                    {d.diff}
                  </span>
                  <span className="diff-count">
                    <strong>{d.count}</strong> / {d.total} solved
                  </span>
                </div>
                <div className="diff-bar-track">
                  <div
                    className="diff-bar-fill"
                    style={{ width: `${d.pct}%`, backgroundColor: d.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Submission Verdicts */}
          <div className="verdicts-summary-block">
            <h3 className="verdict-block-title">Submission Verdicts</h3>
            <div className="verdict-pills-row">
              <div className="verdict-pill accepted">
                <span className="v-num">76%</span>
                <span className="v-lbl">Accepted</span>
              </div>
              <div className="verdict-pill wrong">
                <span className="v-num">16%</span>
                <span className="v-lbl">Wrong Answer</span>
              </div>
              <div className="verdict-pill error">
                <span className="v-num">8%</span>
                <span className="v-lbl">Compile Error</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
