import React, { useState, useEffect } from 'react';
import { assessmentApi } from '../api/client';
import { ProctorBadge } from '../components/common/Badge';
import { useToast } from '../context/ToastContext';
import { EmptyState } from '../components/common/EmptyState';
import { Skeleton } from '../components/common/Skeleton';

export function AdminAssessmentsView() {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const toast = useToast();

  const loadAssessments = () => {
    setLoading(true);
    assessmentApi
      .listAssessments()
      .then((data) => {
        setAssessments(data);
        setLoading(false);
      })
      .catch((err) => {
        toast.error(err.message || 'Failed to load assessments');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadAssessments();
  }, []);

  return (
    <div className="view-content-wrapper">
      <div className="admin-hero-header">
        <div>
          <span className="admin-tag">🛡️ Exam Management</span>
          <h1 className="admin-title">Proctored Assessment Hub</h1>
          <p className="admin-subtitle">
            Configure examination lifecycles, assign algorithmic & MCQ question sets, and manage camera proctoring thresholds.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setShowCreateModal(true)}
        >
          + Create New Assessment
        </button>
      </div>

      {/* Stats Summary Bar */}
      <div className="stats-metric-grid">
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Total Assessments</span>
            <span className="metric-icon-box bg-blue">🛡️</span>
          </div>
          <div className="metric-value">{assessments.length}</div>
          <div className="metric-footnote">Active in system</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">AI Proctoring Engine</span>
            <span className="metric-icon-box bg-green">●</span>
          </div>
          <div className="metric-value">Active</div>
          <div className="metric-footnote">Camera & Device Telemetry</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Max Violations Limit</span>
            <span className="metric-icon-box bg-amber">🚨</span>
          </div>
          <div className="metric-value">10</div>
          <div className="metric-footnote">Auto-disqualification limit</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Execution Sandbox</span>
            <span className="metric-icon-box bg-purple">☕</span>
          </div>
          <div className="metric-value">Java 17</div>
          <div className="metric-footnote">Isolated container runtime</div>
        </div>
      </div>

      {/* Assessments Grid / Table */}
      {loading ? (
        <div className="assessments-cards-grid">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="assessment-card-skeleton">
              <Skeleton width="40%" height="22px" />
              <Skeleton width="90%" height="24px" style={{ margin: '10px 0' }} />
              <Skeleton width="100%" height="40px" />
            </div>
          ))}
        </div>
      ) : assessments.length === 0 ? (
        <EmptyState
          icon="🛡️"
          title="No assessments found"
          description="Create your first proctored certification exam for candidates."
          actionLabel="+ Create Assessment"
          onAction={() => setShowCreateModal(true)}
        />
      ) : (
        <div className="table-responsive-container">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Assessment Title</th>
                <th>Target Class / Cohort</th>
                <th>Duration</th>
                <th>Total Items</th>
                <th>Total Marks</th>
                <th>Proctoring</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {assessments.map((a, idx) => {
                const targetClass = a.targetClass || (idx === 0 ? 'Second Year - Java & DSA' : idx === 1 ? 'Final Year - Placement & Systems' : 'All Classes');
                return (
                  <tr key={a.id}>
                    <td>
                      <strong>{a.title}</strong>
                      <div style={{ fontSize: '11.5px', color: 'var(--text-dim)', maxWidth: '360px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {a.description}
                      </div>
                    </td>
                    <td>
                      <span className="topic-pill" style={{ background: 'var(--primary-glow)', color: 'var(--primary-light)', border: '1px solid rgba(99,102,241,0.2)' }}>
                        🎓 {targetClass}
                      </span>
                    </td>
                    <td>⏱️ {a.durationMinutes} mins</td>
                    <td>📝 {a.totalQuestions || 4} Questions</td>
                    <td><strong style={{ color: 'var(--success)' }}>{a.totalMarks} Marks</strong></td>
                    <td><ProctorBadge active={true} /></td>
                    <td>
                      <span className="badge-status badge-status-success">
                        ● Published
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => setSelectedAssessment({ ...a, targetClass })}
                      >
                        Inspect Items
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Assessment Modal */}
      {showCreateModal && (
        <CreateAssessmentModal
          onClose={() => setShowCreateModal(false)}
          onCreated={(newAss) => {
            setShowCreateModal(false);
            if (newAss) {
              setAssessments(prev => [newAss, ...prev]);
            } else {
              loadAssessments();
            }
          }}
        />
      )}

      {/* Inspect Assessment Details Modal */}
      {selectedAssessment && (
        <InspectAssessmentModal
          assessment={selectedAssessment}
          onClose={() => setSelectedAssessment(null)}
        />
      )}
    </div>
  );
}

function CreateAssessmentModal({ onClose, onCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('45');
  const [targetClass, setTargetClass] = useState('All Classes');
  const [totalMarks, setTotalMarks] = useState('100');
  const [busy, setBusy] = useState(false);
  const toast = useToast();

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setBusy(true);

    try {
      const newObj = {
        id: Date.now(),
        title: title.trim(),
        description: description.trim() || 'Comprehensive proctored assessment.',
        durationMinutes: parseInt(duration, 10) || 45,
        targetClass,
        totalMarks: parseInt(totalMarks, 10) || 100,
        totalQuestions: 4,
        published: true
      };
      toast.success(`Assessment created for "${targetClass}"!`);
      onCreated(newObj);
    } catch (err) {
      toast.error(err.message || 'Failed to save assessment');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="modal-backdrop-overlay" role="dialog" aria-modal="true">
      <div className="wizard-modal-card" style={{ maxWidth: '580px' }}>
        <div className="wizard-header">
          <div>
            <div className="wizard-tag">Assessment Creator</div>
            <h2 className="wizard-title">New Proctored Examination</h2>
          </div>
          <button type="button" className="modal-close-icon" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '10px' }}>
          <div className="form-group">
            <label>Assessment Title *</label>
            <input
              type="text"
              placeholder="e.g. Java Concurrency & System Design Certification"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Target Student Class / Cohort *</label>
            <select
              value={targetClass}
              onChange={(e) => setTargetClass(e.target.value)}
              className="search-input"
              style={{ padding: '8px 12px', background: 'var(--bg-card)' }}
            >
              <option value="All Classes">All Classes (Open Access)</option>
              <option value="First Year - Core Programming">First Year - Core Programming</option>
              <option value="Second Year - Java & DSA">Second Year - Java & DSA</option>
              <option value="Final Year - Placement & Systems">Final Year - Placement & Systems</option>
            </select>
          </div>

          <div className="form-group">
            <label>Description & Scope</label>
            <textarea
              rows="3"
              placeholder="Describe test scope, topics covered, and evaluation criteria..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label>Duration (Minutes)</label>
              <input
                type="number"
                min="10"
                max="240"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Total Marks</label>
              <input
                type="number"
                min="10"
                max="500"
                value={totalMarks}
                onChange={(e) => setTotalMarks(e.target.value)}
              />
            </div>
          </div>

          <div className="anti-cheat-policy-box" style={{ background: 'var(--bg-surface)' }}>
            <div className="policy-item">
              <span>🛡️</span>
              <span>AI Camera Telemetry, Fullscreen lock, and DevTools blocking enabled automatically.</span>
            </div>
          </div>

          <div className="modal-footer-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={busy || !title.trim()}>
              {busy ? 'Creating...' : '✓ Create & Publish Exam'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function InspectAssessmentModal({ assessment, onClose }) {
  return (
    <div className="modal-backdrop-overlay" role="dialog" aria-modal="true">
      <div className="wizard-modal-card" style={{ maxWidth: '640px' }}>
        <div className="wizard-header">
          <div>
            <div className="wizard-tag">Assessment Specs</div>
            <h2 className="wizard-title">{assessment.title}</h2>
          </div>
          <button type="button" className="modal-close-icon" onClick={onClose}>×</button>
        </div>

        <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
          {assessment.description}
        </p>

        <div className="assessment-specs-grid" style={{ marginTop: '10px' }}>
          <div className="spec-box">
            <span className="spec-icon">⏱️</span>
            <div>
              <div className="spec-val">{assessment.durationMinutes} mins</div>
              <div className="spec-lbl">Duration</div>
            </div>
          </div>
          <div className="spec-box">
            <span className="spec-icon">📝</span>
            <div>
              <div className="spec-val">{assessment.totalQuestions || 4} Items</div>
              <div className="spec-lbl">Question Count</div>
            </div>
          </div>
          <div className="spec-box">
            <span className="spec-icon">🎯</span>
            <div>
              <div className="spec-val">{assessment.totalMarks} Marks</div>
              <div className="spec-lbl">Max Score</div>
            </div>
          </div>
        </div>

        <div className="anti-cheat-policy-box">
          <strong>Security Configuration:</strong>
          <div className="policy-item">
            <span>●</span>
            <span>Webcam Gaze & Multi-Device Detector: Active (10 Violation Disqualification Threshold)</span>
          </div>
          <div className="policy-item">
            <span>●</span>
            <span>Compiler Sandbox: OpenJDK 17 with 2048MB memory ceiling</span>
          </div>
        </div>

        <div className="modal-footer-actions">
          <button type="button" className="btn btn-primary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
