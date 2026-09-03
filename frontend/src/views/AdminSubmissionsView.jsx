import React, { useState } from 'react';
import { StatusBadge } from '../components/common/Badge';

export function AdminSubmissionsView() {
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [search, setSearch] = useState('');

  const mockSubmissions = [
    {
      id: 'sub-101',
      candidateName: 'Karthik P',
      candidateEmail: 'student@sentinelassess.local',
      assessmentTitle: 'Sentinel Core Java & Data Structures Proctored Assessment',
      score: 85,
      maxMarks: 100,
      passedQuestions: '4 / 4',
      status: 'ACCEPTED',
      violations: 1,
      violationLogs: [
        '10:14:22 PM — Camera AI: Candidate gaze diverted away from screen'
      ],
      date: 'Sep 03, 2026 • 22:15'
    },
    {
      id: 'sub-102',
      candidateName: 'Alex Chen',
      candidateEmail: 'alex.chen@dev.io',
      assessmentTitle: 'Advanced Full-Stack & System Logic Proctored Challenge',
      score: 95,
      maxMarks: 100,
      passedQuestions: '4 / 4',
      status: 'ACCEPTED',
      violations: 0,
      violationLogs: [],
      date: 'Sep 03, 2026 • 21:40'
    },
    {
      id: 'sub-103',
      candidateName: 'Samira Khan',
      candidateEmail: 'samira.k@outlook.com',
      assessmentTitle: 'Software Engineering & Algorithms Fast-Track Test',
      score: 0,
      maxMarks: 100,
      passedQuestions: '0 / 3',
      status: 'TERMINATED_VIOLATIONS',
      violations: 10,
      violationLogs: [
        '20:05:12 PM — Fullscreen exited',
        '20:06:02 PM — Tab switched / Browser minimized',
        '20:06:45 PM — Restricted shortcut triggered (Ctrl+C)',
        '20:07:11 PM — Camera AI: Mobile device detected in visual frame',
        '20:08:30 PM — Max violation limit reached (Auto-Disqualified)'
      ],
      date: 'Sep 03, 2026 • 20:10'
    },
    {
      id: 'sub-104',
      candidateName: 'Ravi Kumar',
      candidateEmail: 'ravi.kumar@tech.in',
      assessmentTitle: 'Sentinel Core Java & Data Structures Proctored Assessment',
      score: 75,
      maxMarks: 100,
      passedQuestions: '3 / 4',
      status: 'ACCEPTED',
      violations: 2,
      violationLogs: [
        '19:22:10 PM — DevTools inspect key triggered',
        '19:25:40 PM — Fullscreen exited'
      ],
      date: 'Sep 03, 2026 • 19:30'
    }
  ];

  const filtered = mockSubmissions.filter(
    (s) =>
      s.candidateName.toLowerCase().includes(search.toLowerCase()) ||
      s.assessmentTitle.toLowerCase().includes(search.toLowerCase()) ||
      s.candidateEmail.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="view-content-wrapper">
      <div className="admin-hero-header">
        <div>
          <span className="admin-tag">📊 Candidate Submissions</span>
          <h1 className="admin-title">Exam Audit & Telemetry Logs</h1>
          <p className="admin-subtitle">
            Inspect real-time candidate attempts, verified scores, and tamper-proof anti-cheat violation registries.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="admin-table-filter-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Filter by candidate name, email, or assessment..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="table-count-label">
          Showing <strong>{filtered.length}</strong> recorded submissions
        </div>
      </div>

      {/* Audit Table */}
      <div className="table-responsive-container">
        <table className="modern-table">
          <thead>
            <tr>
              <th>Candidate</th>
              <th>Assessment</th>
              <th>Verdict / Status</th>
              <th>Score</th>
              <th>Items Passed</th>
              <th>Violations</th>
              <th>Submitted At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id}>
                <td>
                  <div className="coder-identity-cell">
                    <div className="coder-avatar-mini">{s.candidateName[0]}</div>
                    <div>
                      <div style={{ fontWeight: 700 }}>{s.candidateName}</div>
                      <small style={{ color: 'var(--text-dim)', fontSize: '11px' }}>{s.candidateEmail}</small>
                    </div>
                  </div>
                </td>
                <td>
                  <strong>{s.assessmentTitle}</strong>
                </td>
                <td>
                  <StatusBadge status={s.status} />
                </td>
                <td>
                  <strong className={s.status === 'TERMINATED_VIOLATIONS' ? 'text-danger' : 'score-highlight'}>
                    {s.score} / {s.maxMarks}
                  </strong>
                </td>
                <td>{s.passedQuestions}</td>
                <td>
                  <span className={s.violations >= 5 ? 'text-danger font-bold' : s.violations > 0 ? 'text-warning' : 'text-success'}>
                    {s.violations} / 10
                  </span>
                </td>
                <td className="text-muted">{s.date}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setSelectedSubmission(s)}
                  >
                    Audit Log
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Audit Detail Modal */}
      {selectedSubmission && (
        <div className="modal-backdrop-overlay" role="dialog" aria-modal="true">
          <div className="wizard-modal-card" style={{ maxWidth: '620px' }}>
            <div className="wizard-header">
              <div>
                <div className="wizard-tag">Audit Detail #{selectedSubmission.id}</div>
                <h2 className="wizard-title">{selectedSubmission.candidateName}</h2>
              </div>
              <button type="button" className="modal-close-icon" onClick={() => setSelectedSubmission(null)}>×</button>
            </div>

            <div className="assessment-specs-grid" style={{ marginTop: '10px' }}>
              <div className="spec-box">
                <span className="spec-icon">📝</span>
                <div>
                  <div className="spec-val">{selectedSubmission.score} / {selectedSubmission.maxMarks}</div>
                  <div className="spec-lbl">Final Score</div>
                </div>
              </div>
              <div className="spec-box">
                <span className="spec-icon">🎯</span>
                <div>
                  <div className="spec-val">{selectedSubmission.status}</div>
                  <div className="spec-lbl">Verdict</div>
                </div>
              </div>
              <div className="spec-box">
                <span className="spec-icon">🚨</span>
                <div>
                  <div className="spec-val text-warning">{selectedSubmission.violations} Violations</div>
                  <div className="spec-lbl">Anti-Cheat Flags</div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '14px' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px', color: 'var(--text-main)' }}>
                Proctoring Telemetry Timeline:
              </h3>
              {selectedSubmission.violationLogs.length > 0 ? (
                <div className="anti-cheat-policy-box" style={{ maxHeight: '180px', overflowY: 'auto' }}>
                  {selectedSubmission.violationLogs.map((log, idx) => (
                    <div key={idx} className="policy-item danger">
                      <span>●</span>
                      <span>{log}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-muted-box" style={{ background: 'var(--bg-surface)', padding: '12px', borderRadius: '6px', fontSize: '12.5px', color: 'var(--success)' }}>
                  ✓ Clean submission. Zero security violations recorded during this exam session.
                </div>
              )}
            </div>

            <div className="modal-footer-actions">
              <button type="button" className="btn btn-primary" onClick={() => setSelectedSubmission(null)}>
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
