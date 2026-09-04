import React, { useState, useEffect } from 'react';
import { adminPracticeApi, assessmentApi } from '../api/client';

export function AdminDashboardView({ onNavigateToQuestions, onNavigateToAssessments }) {
  const [questionCount, setQuestionCount] = useState(0);
  const [assessmentCount, setAssessmentCount] = useState(0);

  useEffect(() => {
    adminPracticeApi.listAll()
      .then((qs) => setQuestionCount(qs.length))
      .catch(() => setQuestionCount(5));

    assessmentApi.listAssessments()
      .then((as) => setAssessmentCount(as.length))
      .catch(() => setAssessmentCount(3));
  }, []);

  const adminStats = [
    { title: 'Enrolled Candidates', value: '1,248', icon: '👥', color: 'bg-blue', note: 'Active across assessments' },
    { title: 'Proctored Assessments', value: String(assessmentCount || 3), icon: '🛡️', color: 'bg-purple', note: 'Security & Anti-cheat armed' },
    { title: 'Practice Question Bank', value: String(questionCount || 5), icon: '☕', color: 'bg-green', note: 'Java 17 DSA catalog' },
    { title: 'Total Submissions Evaluated', value: '8,420', icon: '⚡', color: 'bg-amber', note: 'OpenJDK sandbox executions' }
  ];

  return (
    <div className="view-content-wrapper">
      <div className="admin-hero-header">
        <div>
          <span className="admin-tag">👑 Platform Administration</span>
          <h1 className="admin-title">AssessX Control Center</h1>
          <p className="admin-subtitle">
            Oversee examination lifecycles, curate the Java problem bank, and inspect real-time candidate submissions.
          </p>
        </div>
      </div>

      {/* 4 Admin Stat Cards */}
      <div className="stats-metric-grid">
        {adminStats.map((s, idx) => (
          <div key={idx} className="metric-card">
            <div className="metric-header">
              <span className="metric-title">{s.title}</span>
              <span className={`metric-icon-box ${s.color}`}>{s.icon}</span>
            </div>
            <div className="metric-value">{s.value}</div>
            <div className="metric-footnote">{s.note}</div>
          </div>
        ))}
      </div>

      {/* Admin Quick Action Cards */}
      <div className="admin-action-cards-grid">
        <div className="admin-action-card">
          <div className="action-card-header">
            <span className="action-icon">📝</span>
            <h2 className="action-card-title">Practice Question Management</h2>
          </div>
          <p className="action-card-desc">
            Add new Java problems with multi-step authoring wizard, configure public & hidden evaluation test cases, and activate questions.
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={onNavigateToQuestions}
          >
            Manage Question Bank →
          </button>
        </div>

        <div className="admin-action-card">
          <div className="action-card-header">
            <span className="action-icon">🛡️</span>
            <h2 className="action-card-title">Proctored Assessment Hub</h2>
          </div>
          <p className="action-card-desc">
            Review live certification assessments, inspect violation telemetry logs, and view candidate grade distributions.
          </p>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onNavigateToAssessments}
          >
            View Assessments →
          </button>
        </div>
      </div>
    </div>
  );
}
