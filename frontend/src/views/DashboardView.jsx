import React, { useEffect, useState } from 'react';
import { practiceApi, assessmentApi } from '../api/client';
import { DifficultyBadge, PointsBadge } from '../components/common/Badge';
import { Skeleton } from '../components/common/Skeleton';

export function DashboardView({ user, onNavigateToPractice, onNavigateToAssessments, onSelectProblem, onStartAssessment }) {
  const [questions, setQuestions] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  useEffect(() => {
    let mounted = true;
    Promise.all([
      practiceApi.listQuestions().catch(() => []),
      assessmentApi.listAssessments().catch(() => []),
      assessmentApi.getMySubmissions(user.id).catch(() => [])
    ]).then(([qList, aList, sList]) => {
      if (mounted) {
        setQuestions(qList);
        setAssessments(aList);
        setSubmissions(sList);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
    };
  }, [user.id]);

  // Derive stats
  const solvedCount = 42; // Base demonstration score
  const totalPoints = 380;
  const rank = '#18';
  const acceptanceRate = '76%';

  const recommendedQuestions = questions.length > 0
    ? questions.slice(0, 4)
    : [
        { id: 1, title: 'Reverse a String', category: 'Strings', difficulty: 'EASY', points: 5, description: 'Reverse the characters of a given string in-place or using StringBuilder.' },
        { id: 2, title: 'Second Largest Element', category: 'Arrays', difficulty: 'EASY', points: 5, description: 'Find the second largest distinct integer in an unsorted array.' },
        { id: 3, title: 'Palindrome Check', category: 'Strings', difficulty: 'EASY', points: 5, description: 'Determine whether a string reads the same forwards and backwards.' }
      ];

  const topicMastery = [
    { topic: 'Arrays', percentage: 90, count: '18 / 20' },
    { topic: 'Strings', percentage: 78, count: '14 / 18' },
    { topic: 'Linked Lists', percentage: 65, count: '8 / 12' },
    { topic: 'Trees & BST', percentage: 52, count: '6 / 11' },
    { topic: 'Graphs & BFS/DFS', percentage: 44, count: '4 / 9' }
  ];

  const weeklyStreak = [
    { day: 'Mon', active: true, count: 4 },
    { day: 'Tue', active: true, count: 6 },
    { day: 'Wed', active: true, count: 3 },
    { day: 'Thu', active: true, count: 7 },
    { day: 'Fri', active: true, count: 5 },
    { day: 'Sat', active: true, count: 8 },
    { day: 'Sun', active: true, count: 2 }
  ];

  return (
    <div className="view-content-wrapper">
      {/* Dashboard Greeting Header */}
      <div className="dashboard-welcome-header">
        <div>
          <h1 className="welcome-heading">
            {getGreeting()}, {user?.username || 'Karthik'} 👋
          </h1>
          <p className="welcome-subheading">
            Ready to improve your Java skills? Solve problems, tackle proctored tests, and climb the ranks.
          </p>
        </div>

        <div className="welcome-quick-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={onNavigateToPractice}
          >
            ☕ Open Practice Arena
          </button>
        </div>
      </div>

      {/* Main 4 Metric Cards */}
      <div className="stats-metric-grid">
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Problems Solved</span>
            <span className="metric-icon-box bg-blue">✓</span>
          </div>
          <div className="metric-value">{solvedCount}</div>
          <div className="metric-footnote">
            <span className="text-success">↑ 6 this week</span> • Java DSA
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Total Points</span>
            <span className="metric-icon-box bg-amber">⚡</span>
          </div>
          <div className="metric-value">{totalPoints}</div>
          <div className="metric-footnote">
            <span className="text-warning">+35 pts</span> from recent assessments
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Current Rank</span>
            <span className="metric-icon-box bg-purple">🏆</span>
          </div>
          <div className="metric-value">{rank}</div>
          <div className="metric-footnote">
            <span>Top 5%</span> of active coders
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Acceptance Rate</span>
            <span className="metric-icon-box bg-green">🎯</span>
          </div>
          <div className="metric-value">{acceptanceRate}</div>
          <div className="metric-footnote">
            <span className="text-success">High accuracy</span> on first run
          </div>
        </div>
      </div>

      {/* 2-Column Section: Continue Practicing & Activity / Topic Mastery */}
      <div className="dashboard-columns-grid">
        {/* Left Column: Recommended Problems + Upcoming Assessments */}
        <div className="dashboard-main-col">
          {/* Section: Continue Practicing */}
          <div className="dashboard-section-box">
            <div className="section-header-row">
              <div>
                <h2 className="section-title">Continue Practicing</h2>
                <p className="section-subtitle">Curated Java challenges to sharpen your problem-solving speed</p>
              </div>
              <button
                type="button"
                className="btn-link"
                onClick={onNavigateToPractice}
              >
                View all problems →
              </button>
            </div>

            <div className="recommended-problems-list">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="problem-row-skeleton">
                    <Skeleton width="40%" height="20px" />
                    <Skeleton width="20%" height="16px" />
                  </div>
                ))
              ) : (
                recommendedQuestions.map((q) => (
                  <div key={q.id} className="problem-summary-card">
                    <div className="problem-card-left">
                      <div className="problem-card-status">○</div>
                      <div>
                        <h3 className="problem-card-title">{q.title}</h3>
                        <div className="problem-card-tags">
                          <span className="topic-pill">{q.category || 'Java Basics'}</span>
                          <DifficultyBadge difficulty={q.difficulty} />
                          <PointsBadge points={q.difficulty === 'HARD' ? 15 : q.difficulty === 'MEDIUM' ? 10 : 5} />
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => onSelectProblem(q.id)}
                    >
                      Solve →
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Section: Upcoming Assessments */}
          <div className="dashboard-section-box">
            <div className="section-header-row">
              <div>
                <h2 className="section-title">Proctored Assessments</h2>
                <p className="section-subtitle">Real-time monitored certification exams & tests</p>
              </div>
              <button
                type="button"
                className="btn-link"
                onClick={onNavigateToAssessments}
              >
                Assessments Hub →
              </button>
            </div>

            <div className="assessment-cards-row">
              {loading ? (
                <Skeleton height="110px" borderRadius="10px" />
              ) : assessments.length > 0 ? (
                assessments.slice(0, 2).map((a) => {
                  const submission = submissions.find((s) => s.assessmentId === a.id);
                  return (
                    <div key={a.id} className="dashboard-assessment-card">
                      <div className="assessment-badge-line">
                        <span className="badge-proctor-mini">🛡️ AI Proctor</span>
                        <span className="assessment-marks-text">{a.totalMarks} Marks</span>
                      </div>
                      <h3 className="assessment-card-title">{a.title}</h3>
                      <div className="assessment-info-meta">
                        <span>⏱️ {a.durationMinutes} mins</span>
                        <span>📝 {a.totalQuestions} Questions</span>
                        <span>☕ Java 17</span>
                      </div>
                      <div className="assessment-action-line">
                        {submission ? (
                          <span className="badge-submission-status">
                            Score: {submission.score}/{submission.maxMarks}
                          </span>
                        ) : (
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={() => onStartAssessment(a.id)}
                          >
                            Start Assessment
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-muted-box">No active assessments scheduled right now.</div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Weekly Activity & Topic Performance */}
        <div className="dashboard-side-col">
          {/* Weekly Activity Streak */}
          <div className="dashboard-section-box">
            <div className="section-header-row">
              <div>
                <h3 className="section-title">Weekly Activity</h3>
                <span className="streak-tag">🔥 8-day streak</span>
              </div>
            </div>

            <div className="weekly-activity-bars">
              {weeklyStreak.map((item) => (
                <div key={item.day} className="day-activity-col">
                  <div className="bar-track">
                    <div
                      className="bar-fill"
                      style={{ height: `${Math.min(item.count * 12, 100)}%` }}
                      title={`${item.count} submissions`}
                    />
                  </div>
                  <span className="day-label">{item.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Topic Performance Bars */}
          <div className="dashboard-section-box">
            <h3 className="section-title">Topic Performance</h3>
            <p className="section-subtitle">Your mastery breakdown across core Java algorithms</p>

            <div className="topic-bars-list">
              {topicMastery.map((tm) => (
                <div key={tm.topic} className="topic-bar-item">
                  <div className="topic-bar-label-line">
                    <span className="topic-name">{tm.topic}</span>
                    <span className="topic-pct">{tm.percentage}%</span>
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{ width: `${tm.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
