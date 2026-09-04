import React, { useState } from 'react';
import { StatusBadge } from '../components/common/Badge';
import { useToast } from '../context/ToastContext';

export function AdminSubmissionsView() {
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [search, setSearch] = useState('');
  const [assessmentFilter, setAssessmentFilter] = useState('ALL');
  const [classFilter, setClassFilter] = useState('ALL');
  const [attendanceFilter, setAttendanceFilter] = useState('ALL');
  const toast = useToast();

  const mockCandidateRoster = [
    {
      id: 'sub-101',
      candidateName: 'Karthik P',
      candidateEmail: 'student@assessx.local',
      candidateClass: 'Second Year - Java & DSA',
      assessmentTitle: 'AssessX Core Java & Data Structures Proctored Assessment',
      score: 85,
      maxMarks: 100,
      percentage: 85,
      passedQuestions: '4 / 4',
      attendanceStatus: 'ATTENDED',
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
      candidateClass: 'Final Year - Placement & Systems',
      assessmentTitle: 'Advanced Full-Stack & System Logic Proctored Challenge',
      score: 95,
      maxMarks: 100,
      percentage: 95,
      passedQuestions: '4 / 4',
      attendanceStatus: 'ATTENDED',
      status: 'ACCEPTED',
      violations: 0,
      violationLogs: [],
      date: 'Sep 03, 2026 • 21:40'
    },
    {
      id: 'sub-103',
      candidateName: 'Samira Khan',
      candidateEmail: 'samira.k@outlook.com',
      candidateClass: 'Second Year - Java & DSA',
      assessmentTitle: 'Software Engineering & Algorithms Fast-Track Test',
      score: 0,
      maxMarks: 100,
      percentage: 0,
      passedQuestions: '0 / 3',
      attendanceStatus: 'ATTENDED',
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
      candidateClass: 'Second Year - Java & DSA',
      assessmentTitle: 'Sentinel Core Java & Data Structures Proctored Assessment',
      score: 75,
      maxMarks: 100,
      percentage: 75,
      passedQuestions: '3 / 4',
      attendanceStatus: 'ATTENDED',
      status: 'ACCEPTED',
      violations: 2,
      violationLogs: [
        '19:22:10 PM — DevTools inspect key triggered',
        '19:25:40 PM — Fullscreen exited'
      ],
      date: 'Sep 03, 2026 • 19:30'
    },
    {
      id: 'sub-105',
      candidateName: 'Priya Sharma',
      candidateEmail: 'priya.s@university.edu',
      candidateClass: 'Second Year - Java & DSA',
      assessmentTitle: 'Sentinel Core Java & Data Structures Proctored Assessment',
      score: 0,
      maxMarks: 100,
      percentage: 0,
      passedQuestions: '0 / 4',
      attendanceStatus: 'ABSENT',
      status: 'NOT_ATTENDED',
      violations: 0,
      violationLogs: [],
      date: 'N/A (Did not attend)'
    },
    {
      id: 'sub-106',
      candidateName: 'David Miller',
      candidateEmail: 'd.miller@campus.org',
      candidateClass: 'Final Year - Placement & Systems',
      assessmentTitle: 'Advanced Full-Stack & System Logic Proctored Challenge',
      score: 0,
      maxMarks: 100,
      percentage: 0,
      passedQuestions: '0 / 4',
      attendanceStatus: 'ABSENT',
      status: 'NOT_ATTENDED',
      violations: 0,
      violationLogs: [],
      date: 'N/A (Did not attend)'
    },
    {
      id: 'sub-107',
      candidateName: 'Ananya Gupta',
      candidateEmail: 'ananya.g@tech.ac.in',
      candidateClass: 'Second Year - Java & DSA',
      assessmentTitle: 'Sentinel Core Java & Data Structures Proctored Assessment',
      score: 90,
      maxMarks: 100,
      percentage: 90,
      passedQuestions: '4 / 4',
      attendanceStatus: 'ATTENDED',
      status: 'ACCEPTED',
      violations: 0,
      violationLogs: [],
      date: 'Sep 03, 2026 • 18:45'
    }
  ];

  const filtered = mockCandidateRoster.filter((s) => {
    const matchesSearch =
      s.candidateName.toLowerCase().includes(search.toLowerCase()) ||
      s.assessmentTitle.toLowerCase().includes(search.toLowerCase()) ||
      s.candidateEmail.toLowerCase().includes(search.toLowerCase());

    const matchesAssessment =
      assessmentFilter === 'ALL' || s.assessmentTitle === assessmentFilter;

    const matchesClass =
      classFilter === 'ALL' || s.candidateClass === classFilter;

    const matchesAttendance =
      attendanceFilter === 'ALL' || s.attendanceStatus === attendanceFilter;

    return matchesSearch && matchesAssessment && matchesClass && matchesAttendance;
  });

  // Calculate statistics
  const totalEnrolled = filtered.length;
  const totalAttended = filtered.filter(f => f.attendanceStatus === 'ATTENDED').length;
  const totalAbsent = filtered.filter(f => f.attendanceStatus === 'ABSENT').length;
  const attendedScores = filtered.filter(f => f.attendanceStatus === 'ATTENDED').map(f => f.score);
  const avgScore = attendedScores.length > 0
    ? Math.round(attendedScores.reduce((a, b) => a + b, 0) / attendedScores.length)
    : 0;

  // CSV Report Generator & Downloader
  const handleDownloadReportCSV = () => {
    const headers = [
      'Candidate Name',
      'Email Address',
      'Academic Class / Cohort',
      'Assessment Title',
      'Attendance Status',
      'Verdict',
      'Score Obtained',
      'Max Marks',
      'Percentage (%)',
      'Anti-Cheat Violations',
      'Submission Timestamp'
    ];

    const rows = filtered.map(item => [
      `"${item.candidateName}"`,
      `"${item.candidateEmail}"`,
      `"${item.candidateClass}"`,
      `"${item.assessmentTitle}"`,
      `"${item.attendanceStatus}"`,
      `"${item.status}"`,
      item.score,
      item.maxMarks,
      `${item.percentage}%`,
      item.violations,
      `"${item.date}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `AssessX_Attendance_Score_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Exported CSV report with ${filtered.length} candidate records.`);
  };

  return (
    <div className="view-content-wrapper">
      <div className="admin-hero-header">
        <div>
          <span className="admin-tag">📊 Examination Reports & Audit</span>
          <h1 className="admin-title">Candidate Attendance & Score Reports</h1>
          <p className="admin-subtitle">
            Categorize candidate attendance, audit proctored submission scores by class level, and export CSV diagnostic spreadsheets.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary btn-lg"
          onClick={handleDownloadReportCSV}
        >
          📥 Download Attendance & Score Report (CSV)
        </button>
      </div>

      {/* KPI Metrics Strip */}
      <div className="stats-metric-grid">
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Total Candidates</span>
            <span className="metric-icon-box bg-blue">👥</span>
          </div>
          <div className="metric-value">{totalEnrolled}</div>
          <div className="metric-footnote">Enrolled in selected scope</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Attended & Submitted</span>
            <span className="metric-icon-box bg-green">✓</span>
          </div>
          <div className="metric-value text-success">{totalAttended}</div>
          <div className="metric-footnote">
            {totalEnrolled > 0 ? `${Math.round((totalAttended / totalEnrolled) * 100)}% attendance rate` : '0%'}
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Absent / Not Attended</span>
            <span className="metric-icon-box bg-amber">✗</span>
          </div>
          <div className="metric-value text-warning">{totalAbsent}</div>
          <div className="metric-footnote">Did not start examination</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Attended Average Score</span>
            <span className="metric-icon-box bg-purple">📈</span>
          </div>
          <div className="metric-value">{avgScore} / 100</div>
          <div className="metric-footnote">Class performance mean</div>
        </div>
      </div>

      {/* Multi-Dimensional Filter Bar */}
      <div className="admin-filter-bar-row">
        <div className="search-input-box">
          <span>🔍</span>
          <input
            type="text"
            placeholder="Search candidate name, email, or assessment..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Assessment Dropdown */}
        <select
          className="admin-select-dropdown"
          value={assessmentFilter}
          onChange={(e) => setAssessmentFilter(e.target.value)}
        >
          <option value="ALL">All Assessments</option>
          <option value="Sentinel Core Java & Data Structures Proctored Assessment">Sentinel Core Java Proctored</option>
          <option value="Advanced Full-Stack & System Logic Proctored Challenge">Advanced Full-Stack Challenge</option>
          <option value="Software Engineering & Algorithms Fast-Track Test">Algorithms Fast-Track Test</option>
        </select>

        {/* Class Level Dropdown */}
        <select
          className="admin-select-dropdown"
          value={classFilter}
          onChange={(e) => setClassFilter(e.target.value)}
        >
          <option value="ALL">All Classes / Cohorts</option>
          <option value="Second Year - Java & DSA">Second Year - Java & DSA</option>
          <option value="Final Year - Placement & Systems">Final Year - Placement & Systems</option>
        </select>

        {/* Attendance Status Dropdown */}
        <select
          className="admin-select-dropdown"
          value={attendanceFilter}
          onChange={(e) => setAttendanceFilter(e.target.value)}
        >
          <option value="ALL">All Attendance Status</option>
          <option value="ATTENDED">Attended Only</option>
          <option value="ABSENT">Absent Only (Not Attended)</option>
        </select>
      </div>

      {/* Audit & Attendance Table */}
      <div className="table-responsive-container">
        <table className="modern-table">
          <thead>
            <tr>
              <th>Candidate</th>
              <th>Class / Cohort</th>
              <th>Assessment</th>
              <th>Attendance</th>
              <th>Score</th>
              <th>Accuracy</th>
              <th>Violations</th>
              <th>Attempt Time</th>
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
                  <span className="badge-category-mini">{s.candidateClass}</span>
                </td>
                <td>
                  <strong>{s.assessmentTitle}</strong>
                </td>
                <td>
                  <span className={`badge-attendance-pill ${s.attendanceStatus === 'ATTENDED' ? 'attended' : 'absent'}`}>
                    {s.attendanceStatus === 'ATTENDED' ? '● Attended' : '○ Absent'}
                  </span>
                </td>
                <td>
                  {s.attendanceStatus === 'ATTENDED' ? (
                    <strong className={s.status === 'TERMINATED_VIOLATIONS' ? 'text-danger' : 'score-highlight'}>
                      {s.score} / {s.maxMarks}
                    </strong>
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </td>
                <td>
                  {s.attendanceStatus === 'ATTENDED' ? (
                    <span className={s.percentage >= 70 ? 'text-success font-bold' : 'text-warning font-bold'}>
                      {s.percentage}%
                    </span>
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </td>
                <td>
                  {s.attendanceStatus === 'ATTENDED' ? (
                    <span className={s.violations >= 5 ? 'text-danger font-bold' : s.violations > 0 ? 'text-warning' : 'text-success'}>
                      {s.violations} / 10
                    </span>
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </td>
                <td className="text-muted">{s.date}</td>
                <td>
                  {s.attendanceStatus === 'ATTENDED' ? (
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => setSelectedSubmission(s)}
                    >
                      Audit Log
                    </button>
                  ) : (
                    <span className="text-dim" style={{ fontSize: '12px' }}>No Attempt</span>
                  )}
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
                <span className="text-muted" style={{ fontSize: '12px' }}>{selectedSubmission.candidateEmail} • {selectedSubmission.candidateClass}</span>
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
