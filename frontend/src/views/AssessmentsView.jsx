import React, { useState, useEffect } from 'react';
import { assessmentApi } from '../api/client';
import { ProctorBadge, StatusBadge } from '../components/common/Badge';
import { PreExamModal } from './PreExamModal';
import { Skeleton } from '../components/common/Skeleton';
import { EmptyState } from '../components/common/EmptyState';

export function AssessmentsView({ user, onStartExam }) {
  const [assessments, setAssessments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedForCheck, setSelectedForCheck] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);

    Promise.all([
      assessmentApi.listAssessments().catch(() => []),
      assessmentApi.getMySubmissions(user.id).catch(() => [])
    ]).then(([aList, sList]) => {
      if (active) {
        setAssessments(aList);
        setSubmissions(sList);
        setLoading(false);
      }
    });

    return () => {
      active = false;
    };
  }, [user.id]);

  return (
    <div className="view-content-wrapper">
      {/* Header Banner */}
      <div className="assessments-hero-header">
        <div>
          <span className="assessments-hero-tag">🛡️ Proctored Assessment Hub</span>
          <h1 className="assessments-hero-title">Certification & Diagnostic Exams</h1>
          <p className="assessments-hero-subtitle">
            Secure, timed assessments featuring real-time webcam telemetry, Java algorithmic challenges, and conceptual MCQs.
          </p>
        </div>

        <div className="assessment-stats-pill">
          <div className="stat-pill-item">
            <span className="stat-pill-num">{assessments.length}</span>
            <span className="stat-pill-lbl">Available</span>
          </div>
          <div className="stat-pill-divider"></div>
          <div className="stat-pill-item">
            <span className="stat-pill-num">{submissions.length}</span>
            <span className="stat-pill-lbl">Completed</span>
          </div>
        </div>
      </div>

      {/* Available Assessment Cards Grid */}
      <div className="section-header-block">
        <h2 className="section-block-title">Available Assessments</h2>
        <p className="section-block-desc">Select an assessment to initiate the hardware telemetry check and begin.</p>
      </div>

      {loading ? (
        <div className="assessments-cards-grid">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="assessment-card-skeleton">
              <Skeleton width="40%" height="22px" />
              <Skeleton width="90%" height="24px" style={{ margin: '10px 0' }} />
              <Skeleton width="100%" height="40px" />
              <Skeleton width="100%" height="40px" style={{ marginTop: 'auto' }} />
            </div>
          ))}
        </div>
      ) : assessments.length === 0 ? (
        <EmptyState
          icon="🛡️"
          title="No assessments published"
          description="There are currently no proctored assessments scheduled. Check back shortly or practice in the Arena."
        />
      ) : (
        <div className="assessments-cards-grid">
          {assessments.map((item) => {
            const prevSub = submissions.find((s) => s.assessmentId === item.id);
            return (
              <div key={item.id} className="assessment-hub-card">
                <div className="card-top-badges">
                  <ProctorBadge active={true} />
                  <span className="assessment-marks-pill">{item.totalMarks} Marks</span>
                </div>

                <h3 className="assessment-hub-title">{item.title}</h3>
                <p className="assessment-hub-desc">{item.description}</p>

                <div className="assessment-specs-grid">
                  <div className="spec-box">
                    <span className="spec-icon">⏱️</span>
                    <div>
                      <div className="spec-val">{item.durationMinutes} mins</div>
                      <div className="spec-lbl">Duration</div>
                    </div>
                  </div>

                  <div className="spec-box">
                    <span className="spec-icon">📝</span>
                    <div>
                      <div className="spec-val">{item.totalQuestions || 4} Items</div>
                      <div className="spec-lbl">MCQs & Code</div>
                    </div>
                  </div>

                  <div className="spec-box">
                    <span className="spec-icon">☕</span>
                    <div>
                      <div className="spec-val">OpenJDK 17</div>
                      <div className="spec-lbl">Compiler</div>
                    </div>
                  </div>
                </div>

                <div className="card-footer-action">
                  {prevSub ? (
                    <div className="past-attempt-line">
                      <div className="attempt-result-score">
                        <span className="score-lbl">Last Score:</span>
                        <strong className={prevSub.status === 'TERMINATED_VIOLATIONS' ? 'text-danger' : 'text-success'}>
                          {prevSub.status === 'TERMINATED_VIOLATIONS'
                            ? 'Disqualified'
                            : `${prevSub.score} / ${prevSub.maxMarks}`}
                        </strong>
                      </div>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => setSelectedForCheck(item)}
                      >
                        Retake Exam
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-primary btn-block"
                      onClick={() => setSelectedForCheck(item)}
                    >
                      Begin Assessment →
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Past Submissions History Table */}
      {submissions.length > 0 && (
        <div className="past-submissions-section">
          <div className="section-header-block">
            <h2 className="section-block-title">Assessment History & Records</h2>
            <p className="section-block-desc">Past verified attempts and proctoring telemetry audit logs.</p>
          </div>

          <div className="table-responsive-container">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Assessment Title</th>
                  <th>Status</th>
                  <th>Score</th>
                  <th>Violations</th>
                  <th>Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((sub) => (
                  <tr key={sub.id}>
                    <td>
                      <strong>{sub.assessmentTitle}</strong>
                    </td>
                    <td>
                      <StatusBadge status={sub.status} />
                    </td>
                    <td>
                      <strong className="score-highlight">
                        {sub.score} / {sub.maxMarks}
                      </strong>
                    </td>
                    <td>
                      <span className={sub.violationCount > 3 ? 'text-danger font-bold' : 'text-success'}>
                        {sub.violationCount} / 10
                      </span>
                    </td>
                    <td className="text-muted">
                      {sub.submittedAt ? new Date(sub.submittedAt).toLocaleString() : 'Recent'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pre-Exam Hardware Check Modal */}
      {selectedForCheck && (
        <PreExamModal
          assessment={selectedForCheck}
          onStart={() => {
            const targetId = selectedForCheck.id;
            setSelectedForCheck(null);
            onStartExam(targetId);
          }}
          onCancel={() => setSelectedForCheck(null)}
        />
      )}
    </div>
  );
}
