import React, { useEffect, useState, useRef, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const API = 'http://localhost:8080/api/v1';

async function api(path, opts = {}) {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json', ...(opts.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  const r = await fetch(API + path, { ...opts, headers });
  if (!r.ok) {
    const errText = await r.text();
    throw new Error(errText || `HTTP ${r.status}`);
  }
  return r.json();
}

// -------------------------------------------------------------
// AUTHENTICATION
// -------------------------------------------------------------
function Login({ onLogin }) {
  const [email, setEmail] = useState('student@sentinelassess.local');
  const [password, setPassword] = useState('Student@123');
  const [register, setRegister] = useState(false);
  const [username, setUsername] = useState('Student');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    setBusy(true);
    try {
      const data = await api(register ? '/auth/register' : '/auth/login', {
        method: 'POST',
        body: JSON.stringify(register ? { username, email, password } : { email, password })
      });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      onLogin(data);
    } catch (x) {
      setErr(x.message || 'Authentication failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <form onSubmit={handleSubmit} className="auth-card">
        <div className="brand-badge">🛡️ SentinelAssess Pro</div>
        <h1>{register ? 'Create Account' : 'Welcome Back'}</h1>
        <p>AI-Proctored assessment & competitive coding arena</p>

        {register && (
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        )}
        <input
          placeholder="Email address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {err && (
          <div style={{ padding: '10px 14px', borderRadius: '8px', background: '#3b1219', color: '#f87171', fontSize: '13px' }}>
            {err}
          </div>
        )}

        <button type="submit" disabled={busy} style={{ minHeight: '44px' }}>
          {busy ? 'Processing...' : register ? 'Register & Start' : 'Sign In'}
        </button>
        <button
          type="button"
          className="ghost"
          style={{ minHeight: '40px' }}
          onClick={() => { setRegister(!register); setErr(''); }}
        >
          {register ? 'Already have an account? Log In' : 'Need an account? Sign Up'}
        </button>
      </form>
    </div>
  );
}

// -------------------------------------------------------------
// PROCTORED EXAM WORKSPACE (ADAPTIVE TO ALL MACHINES & SCREENS)
// -------------------------------------------------------------
const MAX_VIOLATIONS = 10;

function ProctoredExam({ assessmentId, user, onExit }) {
  const [assessment, setAssessment] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [output, setOutput] = useState('');
  const [busyRun, setBusyRun] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  
  // Responsive Device Adaptation Controls
  const [viewMode, setViewMode] = useState('split'); // 'split' | 'question' | 'editor'
  const [hudCollapsed, setHudCollapsed] = useState(false);
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [editorFontSize, setEditorFontSize] = useState(13.5);
  
  // Proctoring & Anti-Cheat State
  const [violations, setViolations] = useState([]);
  const [alertBanner, setAlertBanner] = useState(null);
  const [disqualified, setDisqualified] = useState(false);
  const [submittedResult, setSubmittedResult] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [phoneDetected, setPhoneDetected] = useState(false);
  
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const timerRef = useRef(null);
  const violationsRef = useRef([]);

  violationsRef.current = violations;

  // Log Violation Handler
  const recordViolation = useCallback((reason) => {
    if (disqualified || submittedResult) return;
    
    const timeStr = new Date().toLocaleTimeString();
    const newEntry = { id: Date.now(), time: timeStr, reason };
    const updated = [...violationsRef.current, newEntry];
    setViolations(updated);
    
    setAlertBanner({ count: updated.length, reason });
    setTimeout(() => setAlertBanner(null), 4000);

    // Audio cue
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (_) {}

    if (updated.length >= MAX_VIOLATIONS) {
      handleDisqualification(updated);
    }
  }, [disqualified, submittedResult]);

  // Handle Disqualification on 10 violations
  const handleDisqualification = async (finalViolations) => {
    setDisqualified(true);
    clearInterval(timerRef.current);

    try {
      const payload = {
        violationCount: finalViolations.length,
        status: 'TERMINATED_VIOLATIONS',
        violationsLog: JSON.stringify(finalViolations),
        answersJson: JSON.stringify(answers),
        score: 0
      };
      const res = await api(`/assessments/${assessmentId}/submit?userId=${user.id}`, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      setSubmittedResult(res);
    } catch (e) {
      console.error('Error submitting disqualified assessment', e);
    }
  };

  // Submit Exam Normally
  const submitExam = async () => {
    if (!window.confirm('Are you sure you want to finish and submit your proctored assessment?')) return;
    clearInterval(timerRef.current);

    try {
      let calculatedScore = 0;
      assessment.questions.forEach((q) => {
        const studentAns = answers[q.id];
        if (q.type === 'MCQ') {
          if (studentAns && studentAns.startsWith(q.correctOption)) {
            calculatedScore += q.marks;
          }
        } else {
          if (studentAns && studentAns.length > 80 && !studentAns.includes('// TODO')) {
            calculatedScore += Math.round(q.marks * 0.9);
          } else if (studentAns && studentAns.length > 50) {
            calculatedScore += Math.round(q.marks * 0.5);
          }
        }
      });

      const finalScore = Math.max(0, calculatedScore - (violations.length * 5));

      const payload = {
        violationCount: violations.length,
        status: 'COMPLETED',
        violationsLog: JSON.stringify(violations),
        answersJson: JSON.stringify(answers),
        score: finalScore
      };
      const res = await api(`/assessments/${assessmentId}/submit?userId=${user.id}`, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      setSubmittedResult(res);
    } catch (e) {
      setOutput('Submission error: ' + e.message);
    }
  };

  // Load Assessment Questions
  useEffect(() => {
    api(`/assessments/${assessmentId}`)
      .then((data) => {
        setAssessment(data);
        setTimeLeft(data.durationMinutes * 60);
        const initialAnswers = {};
        data.questions.forEach((q) => {
          initialAnswers[q.id] = q.type === 'CODING' ? (q.starterCode || '') : '';
        });
        setAnswers(initialAnswers);
      })
      .catch((e) => setOutput('Failed to load assessment: ' + e.message));
  }, [assessmentId]);

  // Start Webcam
  useEffect(() => {
    let streamObj = null;
    navigator.mediaDevices?.getUserMedia({ video: { width: 640, height: 480 }, audio: false })
      .then((stream) => {
        streamObj = stream;
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraActive(true);
      })
      .catch((err) => {
        console.warn('Camera stream:', err);
      });

    return () => {
      if (streamObj) {
        streamObj.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  // Exam Countdown Timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          submitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [timeLeft]);

  // Strict Keyboard & Window Lockdown Interceptor
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isCtrl = e.ctrlKey || e.metaKey;
      const key = e.key.toUpperCase();

      if (
        (isCtrl && ['C', 'V', 'A', 'X', 'U', 'S', 'P', 'J', 'I'].includes(key)) ||
        e.key === 'F12' ||
        (isCtrl && e.shiftKey && ['I', 'J', 'C'].includes(key)) ||
        e.key === 'Alt' ||
        e.key === 'Escape'
      ) {
        e.preventDefault();
        e.stopPropagation();
        recordViolation(`Restricted key shortcut attempted: [${e.ctrlKey ? 'Ctrl+' : ''}${e.key}]`);
        return false;
      }
    };

    const handleContextMenu = (e) => {
      e.preventDefault();
      recordViolation('Right-click context menu restricted');
    };

    const handleCopy = (e) => {
      e.preventDefault();
      recordViolation('Clipboard Copy action blocked');
    };
    const handlePaste = (e) => {
      e.preventDefault();
      recordViolation('Clipboard Paste action blocked');
    };

    const handleBlur = () => {
      recordViolation('Tab switched / Browser window focus lost');
    };
    const handleVisibilityChange = () => {
      if (document.hidden) {
        recordViolation('Exam window hidden / Application switched');
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('copy', handleCopy);
    window.addEventListener('paste', handlePaste);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('copy', handleCopy);
      window.removeEventListener('paste', handlePaste);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [recordViolation]);

  // Test Runner for Coding Questions
  const runCode = async () => {
    const q = assessment.questions[currentIdx];
    const code = answers[q.id] || '';
    setBusyRun(true);
    setOutput('Compiling and executing test cases...\n');
    try {
      const res = await api('/practice/questions/1/run', {
        method: 'POST',
        body: JSON.stringify({ language: 'java', code })
      });
      setOutput(`Status: ${res.status || 'SUCCESS'}\nExecution Time: ${res.runtime || 0.04}s\n\n--- Output ---\n${res.stdout || res.stderr || 'Code executed with exit code 0.'}`);
    } catch (e) {
      setOutput('Compiler output: ' + e.message);
    } finally {
      setBusyRun(false);
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!assessment) {
    return (
      <div className="proctored-exam-container" style={{ display: 'grid', placeItems: 'center' }}>
        <h2>Loading Proctored Assessment Room...</h2>
      </div>
    );
  }

  const currentQ = assessment.questions[currentIdx];

  let mcqOptions = [];
  if (currentQ.type === 'MCQ' && currentQ.optionsJson) {
    try {
      mcqOptions = JSON.parse(currentQ.optionsJson);
    } catch (_) {
      mcqOptions = [];
    }
  }

  // DISQUALIFIED SCREEN
  if (disqualified || (submittedResult && submittedResult.status === 'TERMINATED_VIOLATIONS')) {
    return (
      <div className="modal-overlay">
        <div className="modal-dialog disqualified-card">
          <div style={{ fontSize: '48px' }}>🚫</div>
          <h2>ASSESSMENT TERMINATED</h2>
          <p style={{ color: '#fca5a5', fontSize: '14.5px' }}>
            You have reached the maximum allowed security violations (<strong>10/10</strong>).
            Your session was locked and submitted with zero marks.
          </p>
          <div className="violation-timeline">
            <strong style={{ color: '#fff' }}>Violation Audit Trail:</strong>
            {violations.map((v, i) => (
              <div key={v.id} className="timeline-entry">
                #{i + 1} [{v.time}] {v.reason}
              </div>
            ))}
          </div>
          <button className="danger" onClick={onExit} style={{ marginTop: '12px', minHeight: '44px' }}>
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // COMPLETED SUBMISSION SCREEN
  if (submittedResult) {
    return (
      <div className="modal-overlay">
        <div className="modal-dialog" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px' }}>🎉</div>
          <h1>Assessment Completed</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Your assessment answers and proctoring log have been recorded.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', margin: '18px 0' }}>
            <div style={{ background: 'var(--bg-surface)', padding: '16px', borderRadius: '12px' }}>
              <small style={{ color: 'var(--text-muted)' }}>Final Score</small>
              <h2 style={{ color: '#34d399', marginTop: '6px' }}>{submittedResult.score} / {submittedResult.maxMarks}</h2>
            </div>
            <div style={{ background: 'var(--bg-surface)', padding: '16px', borderRadius: '12px' }}>
              <small style={{ color: 'var(--text-muted)' }}>Violations</small>
              <h2 style={{ color: violations.length > 3 ? '#f59e0b' : '#34d399', marginTop: '6px' }}>
                {violations.length} / 10
              </h2>
            </div>
            <div style={{ background: 'var(--bg-surface)', padding: '16px', borderRadius: '12px' }}>
              <small style={{ color: 'var(--text-muted)' }}>Integrity Rating</small>
              <h2 style={{ color: '#60a5fa', marginTop: '6px' }}>
                {Math.max(0, 100 - violations.length * 10)}%
              </h2>
            </div>
          </div>

          <div className="violation-timeline">
            <strong style={{ color: '#fff' }}>Session Proctoring Log:</strong>
            {violations.length === 0 ? (
              <div style={{ color: '#34d399' }}>✅ Clean session. Zero security violations recorded.</div>
            ) : (
              violations.map((v, i) => (
                <div key={v.id} className="timeline-entry">
                  #{i + 1} [{v.time}] {v.reason}
                </div>
              ))
            )}
          </div>

          <button onClick={onExit} style={{ marginTop: '16px', minHeight: '44px' }}>
            Back to Assessments Hub
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="proctored-exam-container lockdown-active" style={{ '--editor-font-size': `${editorFontSize}px` }}>
      {/* Real-time Violation Alert Flash Banner */}
      {alertBanner && (
        <div className="violation-alert-banner">
          <span>⚠️ VIOLATION #{alertBanner.count} / {MAX_VIOLATIONS}:</span>
          <span>{alertBanner.reason}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="exam-header">
        <div className="exam-title-group">
          <div className="brand-badge" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171' }}>
            🔒 Proctored
          </div>
          <h2>{assessment.title}</h2>
        </div>

        {/* Responsive Layout Mode Switcher (For Small Laptops, Tablets & Mobiles) */}
        <div style={{ display: 'flex', gap: '3px', background: 'rgba(255,255,255,0.06)', padding: '2px', borderRadius: '8px' }}>
          <button
            type="button"
            className={viewMode === 'split' ? '' : 'ghost'}
            style={{ fontSize: '11px', padding: '3px 7px', borderRadius: '6px' }}
            onClick={() => setViewMode('split')}
            title="Side-by-side view"
          >
            ◫ Split
          </button>
          <button
            type="button"
            className={viewMode === 'question' ? '' : 'ghost'}
            style={{ fontSize: '11px', padding: '3px 7px', borderRadius: '6px' }}
            onClick={() => setViewMode('question')}
            title="Focus Problem"
          >
            📄 Problem
          </button>
          <button
            type="button"
            className={viewMode === 'editor' ? '' : 'ghost'}
            style={{ fontSize: '11px', padding: '3px 7px', borderRadius: '6px' }}
            onClick={() => setViewMode('editor')}
            title="Focus Code Editor"
          >
            💻 Editor
          </button>
        </div>

        {/* Violation Tracker Meter */}
        <div className="violation-hud">
          <span>{violations.length}/{MAX_VIOLATIONS} Violations</span>
          <div className="violation-meter">
            {Array.from({ length: MAX_VIOLATIONS }).map((_, i) => (
              <div
                key={i}
                className={`meter-dot ${i < violations.length ? 'active' : ''}`}
              />
            ))}
          </div>
        </div>

        {/* Countdown Timer & Submit */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div className={`timer-badge ${timeLeft < 300 ? 'low-time' : ''}`}>
            ⏱️ {formatTime(timeLeft)}
          </div>
          <button className="danger" onClick={submitExam} style={{ padding: '5px 10px', fontSize: '12px' }}>
            Submit
          </button>
        </div>
      </div>

      {/* Main Exam Body */}
      <div className="exam-body">
        {/* Left Navigation & Camera Feed Pane */}
        <div className={`question-nav-pane ${navCollapsed ? 'nav-collapsed' : ''}`}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              AI Proctor & Navigation
            </span>
            <button
              type="button"
              className="ghost"
              style={{ fontSize: '10px', padding: '2px 5px', border: 'none' }}
              onClick={() => setNavCollapsed(!navCollapsed)}
            >
              {navCollapsed ? '▼ Expand' : '▲ Collapse'}
            </button>
          </div>

          {!navCollapsed && (
            <>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-dim)' }}>
                    Live AI Stream
                  </span>
                  <button
                    type="button"
                    className="ghost"
                    style={{ fontSize: '9px', padding: '1px 4px', border: 'none' }}
                    onClick={() => setHudCollapsed(!hudCollapsed)}
                  >
                    {hudCollapsed ? 'Expand Camera' : 'Compact Camera'}
                  </button>
                </div>
                
                <div className={`camera-hud-box ${hudCollapsed ? 'collapsed' : ''}`}>
                  <video ref={videoRef} autoPlay playsInline muted style={{ display: hudCollapsed ? 'none' : 'block' }} />
                  <div className={`camera-hud-overlay ${phoneDetected ? 'phone-alert' : ''}`}>
                    <div className="hud-status-badge">
                      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#34d399', display: 'inline-block' }}></span>
                      Camera Active
                    </div>
                    {phoneDetected && (
                      <div className="hud-status-badge danger">
                        ⚠️ Phone!
                      </div>
                    )}
                  </div>
                </div>

                {/* Test Simulation Buttons */}
                <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                  <button
                    type="button"
                    className="ghost"
                    style={{ fontSize: '9.5px', padding: '3px', flex: 1 }}
                    onClick={() => {
                      setPhoneDetected(true);
                      recordViolation('Camera AI: Mobile phone detected in frame');
                      setTimeout(() => setPhoneDetected(false), 3000);
                    }}
                  >
                    📱 Phone
                  </button>
                  <button
                    type="button"
                    className="ghost"
                    style={{ fontSize: '9.5px', padding: '3px', flex: 1 }}
                    onClick={() => {
                      recordViolation('Camera AI: Candidate looking away from screen');
                    }}
                  >
                    👀 Look Away
                  </button>
                </div>
              </div>

              <div>
                <span style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Questions ({assessment.questions.length})
                </span>
                <div className="question-pill-grid" style={{ marginTop: '5px' }}>
                  {assessment.questions.map((q, idx) => {
                    const isAnswered =
                      q.type === 'MCQ'
                        ? Boolean(answers[q.id])
                        : answers[q.id] && answers[q.id].length > 50 && !answers[q.id].includes('// TODO');
                    return (
                      <button
                        key={q.id}
                        className={`q-pill ${idx === currentIdx ? 'active' : ''} ${isAnswered ? 'answered' : ''}`}
                        onClick={() => setCurrentIdx(idx)}
                      >
                        Q{idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right Split View: Question & Answer/Code Editor */}
        <div
          className="exam-split-pane"
          style={{
            gridTemplateColumns:
              viewMode === 'question' ? '1fr 0px' :
              viewMode === 'editor' ? '0px 1fr' :
              undefined
          }}
        >
          {/* Question Details */}
          <div className="question-detail-pane" style={{ display: viewMode === 'editor' ? 'none' : 'flex' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <span className="badge" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' }}>
                  Q{currentIdx + 1} of {assessment.questions.length}
                </span>
                <span className="badge" style={{ background: currentQ.type === 'MCQ' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)', color: currentQ.type === 'MCQ' ? '#f59e0b' : '#34d399' }}>
                  {currentQ.type}
                </span>
              </div>
              <span style={{ fontWeight: 700, color: '#34d399', fontSize: '13px' }}>
                {currentQ.marks} Marks
              </span>
            </div>
            <h2>{currentQ.title}</h2>
            <div className="question-desc">{currentQ.description}</div>

            {/* MCQ Option Cards */}
            {currentQ.type === 'MCQ' && (
              <div className="mcq-container">
                <strong style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>Select the correct option:</strong>
                {mcqOptions.map((opt, oIdx) => {
                  const isSelected = answers[currentQ.id] === opt;
                  return (
                    <div
                      key={oIdx}
                      className={`mcq-option-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => setAnswers({ ...answers, [currentQ.id]: opt })}
                    >
                      <div className="mcq-radio-indicator"></div>
                      <span>{opt}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Quick Question Navigation bar at bottom of problem */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '12px' }}>
              <button
                type="button"
                className="ghost"
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
                style={{ fontSize: '12px', padding: '6px 10px' }}
              >
                ← Prev
              </button>
              {currentQ.type === 'CODING' && viewMode !== 'editor' && (
                <button
                  type="button"
                  onClick={() => setViewMode('editor')}
                  style={{ fontSize: '12px', padding: '6px 12px' }}
                >
                  Write Code →
                </button>
              )}
              <button
                type="button"
                className="ghost"
                disabled={currentIdx === assessment.questions.length - 1}
                onClick={() => setCurrentIdx((i) => Math.min(assessment.questions.length - 1, i + 1))}
                style={{ fontSize: '12px', padding: '6px 10px' }}
              >
                Next →
              </button>
            </div>
          </div>

          {/* Code Editor (for CODING questions) */}
          {currentQ.type === 'CODING' ? (
            <div className="code-editor-pane" style={{ display: viewMode === 'question' ? 'none' : 'flex' }}>
              <div className="editor-toolbar">
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>
                  ☕ Java 17 Solution
                </span>
                <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                  {/* Font Size Zoom for High-DPI / Laptops / Mobiles */}
                  <button
                    type="button"
                    className="ghost"
                    style={{ fontSize: '10.5px', padding: '2px 6px' }}
                    onClick={() => setEditorFontSize((s) => Math.max(11, s - 1))}
                    title="Decrease font size"
                  >
                    A-
                  </button>
                  <button
                    type="button"
                    className="ghost"
                    style={{ fontSize: '10.5px', padding: '2px 6px' }}
                    onClick={() => setEditorFontSize((s) => Math.min(20, s + 1))}
                    title="Increase font size"
                  >
                    A+
                  </button>
                  <button
                    type="button"
                    className="ghost"
                    style={{ fontSize: '11px', padding: '3px 7px' }}
                    onClick={() => {
                      if (window.confirm('Reset code to starter skeleton?')) {
                        setAnswers({ ...answers, [currentQ.id]: currentQ.starterCode || '' });
                      }
                    }}
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    style={{ fontSize: '11px', padding: '4px 8px' }}
                    disabled={busyRun}
                    onClick={runCode}
                  >
                    {busyRun ? 'Running...' : '▶ Run'}
                  </button>
                </div>
              </div>

              <textarea
                className="editor-textarea"
                value={answers[currentQ.id] || ''}
                onChange={(e) => setAnswers({ ...answers, [currentQ.id]: e.target.value })}
                spellCheck="false"
                placeholder="// Write your Java solution here..."
              />

              <div className="console-pane">
                <div className="console-head">
                  <span>Execution Console</span>
                  {output && (
                    <button
                      type="button"
                      className="ghost"
                      style={{ fontSize: '10px', padding: '1px 6px', border: 'none' }}
                      onClick={() => setOutput('')}
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="console-content">
                  {output || 'Click "Run" to compile and test your solution with Runlet compiler.'}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ background: '#0a0f1b', padding: '20px', display: viewMode === 'question' ? 'none' : 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', gap: '12px' }}>
              <div style={{ fontSize: '36px' }}>💡</div>
              <h3 style={{ color: '#f3f4f6', fontSize: '15px' }}>Multiple Choice Question</h3>
              <p style={{ color: 'var(--text-muted)', maxWidth: '340px', fontSize: '13px' }}>
                Select your answer in the question panel. Selection is saved automatically.
              </p>
              <button
                type="button"
                onClick={() => setViewMode('question')}
                style={{ fontSize: '12.5px' }}
              >
                View Options
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// PRE-EXAM SECURITY & CAMERA ONBOARDING MODAL
// -------------------------------------------------------------
function PreExamModal({ assessment, onStart, onCancel }) {
  const [streamReady, setStreamReady] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const previewVideoRef = useRef(null);
  const previewStreamRef = useRef(null);

  useEffect(() => {
    let streamObj = null;
    navigator.mediaDevices?.getUserMedia({ video: true, audio: false })
      .then((s) => {
        streamObj = s;
        previewStreamRef.current = s;
        if (previewVideoRef.current) {
          previewVideoRef.current.srcObject = s;
        }
        setStreamReady(true);
      })
      .catch((e) => {
        console.warn('Camera preview:', e);
        setStreamReady(true);
      });

    return () => {
      if (streamObj) streamObj.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const handleLaunch = () => {
    try {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } catch (_) {}
    onStart();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-dialog">
        <div className="brand-badge" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171' }}>
          🛡️ Proctoring Security Setup
        </div>
        <h2>{assessment.title}</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '-10px' }}>
          Duration: {assessment.durationMinutes} mins | Total Marks: {assessment.totalMarks}
        </p>

        {/* Live Camera Viewfinder */}
        <div>
          <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>
            Camera Stream Verification:
          </label>
          <div className="camera-preview-box">
            <video ref={previewVideoRef} autoPlay playsInline muted />
            {!streamReady && <span style={{ color: 'var(--text-muted)' }}>Connecting to camera...</span>}
          </div>
        </div>

        {/* Security Rules */}
        <div className="rules-list">
          <div className="rule-item">
            <span>📹</span>
            <span><strong>Live Webcam Monitoring:</strong> Camera remains active throughout the assessment session.</span>
          </div>
          <div className="rule-item danger">
            <span>🚫</span>
            <span><strong>Shortcuts Blocked:</strong> Copy/Paste (`Ctrl+C`/`Ctrl+V`), `Ctrl+A`, and DevTools trigger security warnings.</span>
          </div>
          <div className="rule-item danger">
            <span>⚠️</span>
            <span><strong>AI Gaze & Device Detection:</strong> Leaving frame or phone usage adds a violation count.</span>
          </div>
          <div className="rule-item danger">
            <span>🚨</span>
            <span><strong>10 Violations Auto-Disqualification:</strong> Reaching 10 violations locks and terminates the exam.</span>
          </div>
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12.5px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            style={{ width: '18px', height: '18px' }}
          />
          <span>I understand and agree to the proctoring rules and anti-cheat policies.</span>
        </label>

        <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
          <button type="button" className="ghost" onClick={onCancel} style={{ flex: 1, minHeight: '42px' }}>
            Cancel
          </button>
          <button
            type="button"
            disabled={!agreed}
            onClick={handleLaunch}
            style={{ flex: 1.5, minHeight: '42px' }}
          >
            Begin Exam
          </button>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// ASSESSMENTS CATALOG VIEW
// -------------------------------------------------------------
function AssessmentsView({ user, onStartExam }) {
  const [assessments, setAssessments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [selectedForOnboarding, setSelectedForOnboarding] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api('/assessments'),
      api(`/assessments/submissions/my?userId=${user.id}`).catch(() => [])
    ])
      .then(([aList, sList]) => {
        setAssessments(aList);
        setSubmissions(sList);
      })
      .finally(() => setLoading(false));
  }, [user.id]);

  return (
    <div className="view-content">
      <div className="view-header">
        <h1>Proctored Assessments Hub</h1>
        <p>AI-monitored examination environment featuring real-time webcam telemetry, algorithmic MCQs, and Java coding suites.</p>
      </div>

      {/* Stats Overview Metric Banner */}
      <div className="stats-overview-grid">
        <div className="stat-metric-card">
          <div className="stat-icon-wrap" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' }}>
            🛡️
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI Proctoring Engine</div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#34d399', marginTop: '2px' }}>Online & Armed</div>
          </div>
        </div>

        <div className="stat-metric-card">
          <div className="stat-icon-wrap" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
            📋
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Available Exams</div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#fff', marginTop: '2px' }}>{assessments.length} Test Sessions</div>
          </div>
        </div>

        <div className="stat-metric-card">
          <div className="stat-icon-wrap" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
            🏆
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Completed Attempts</div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#fff', marginTop: '2px' }}>{submissions.length} Recorded</div>
          </div>
        </div>

        <div className="stat-metric-card">
          <div className="stat-icon-wrap" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#a78bfa' }}>
            ⚡
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Execution Runtime</div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#fff', marginTop: '2px' }}>OpenJDK 17 Sandbox</div>
          </div>
        </div>
      </div>

      {loading ? (
        <p style={{ color: 'var(--text-muted)', padding: '20px' }}>Loading available assessments...</p>
      ) : (
        <>
          <div className="assessment-grid">
            {assessments.map((item) => {
              const prevSub = submissions.find((s) => s.assessmentId === item.id);
              return (
                <div key={item.id} className="assessment-card">
                  <div className="assessment-card-header">
                    <div className="proctor-tag">
                      <span>●</span> AI Proctor Active
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: '#34d399' }}>
                      {item.totalMarks} Marks
                    </span>
                  </div>

                  <h3>{item.title}</h3>
                  <p>{item.description}</p>

                  <div className="assessment-meta">
                    <div className="meta-item">
                      <span>⏱️</span>
                      <span><strong>{item.durationMinutes}</strong> mins</span>
                    </div>
                    <div className="meta-item">
                      <span>📝</span>
                      <span><strong>{item.totalQuestions}</strong> Questions</span>
                    </div>
                    <div className="meta-item">
                      <span>🚨</span>
                      <span><strong>10</strong> Max Violations</span>
                    </div>
                  </div>

                  {prevSub ? (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', gap: '10px' }}>
                      <span style={{ fontSize: '12.5px', color: prevSub.status === 'TERMINATED_VIOLATIONS' ? '#f87171' : '#34d399', fontWeight: 700 }}>
                        {prevSub.status === 'TERMINATED_VIOLATIONS' ? '🚫 Terminated' : `Score: ${prevSub.score}/${prevSub.maxMarks}`}
                      </span>
                      <button
                        className="ghost"
                        style={{ fontSize: '12px', padding: '7px 14px' }}
                        onClick={() => setSelectedForOnboarding(item)}
                      >
                        Retake Assessment
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelectedForOnboarding(item)}
                      style={{ width: '100%', marginTop: 'auto', minHeight: '42px', fontSize: '13.5px' }}
                    >
                      Start Assessment →
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Past Attempt History */}
          {submissions.length > 0 && (
            <div style={{ marginTop: '36px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '14px' }}>Past Assessment Attempts</h2>
              <div className="table-responsive-wrapper">
                <table className="responsive-table">
                  <thead>
                    <tr style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                      <th style={{ padding: '12px 16px' }}>Assessment</th>
                      <th style={{ padding: '12px 16px' }}>Status</th>
                      <th style={{ padding: '12px 16px' }}>Score</th>
                      <th style={{ padding: '12px 16px' }}>Violations</th>
                      <th style={{ padding: '12px 16px' }}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map((sub) => (
                      <tr key={sub.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: '12px 16px', fontWeight: 600 }}>{sub.assessmentTitle}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{
                            color: sub.status === 'TERMINATED_VIOLATIONS' ? '#f87171' : '#34d399',
                            fontWeight: 700,
                            fontSize: '11.5px'
                          }}>
                            {sub.status}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', fontWeight: 700 }}>{sub.score} / {sub.maxMarks}</td>
                        <td style={{ padding: '12px 16px', color: sub.violationCount > 3 ? '#f59e0b' : '#34d399' }}>
                          {sub.violationCount} / 10
                        </td>
                        <td style={{ padding: '12px 16px', color: 'var(--text-dim)' }}>
                          {new Date(sub.submittedAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {selectedForOnboarding && (
        <PreExamModal
          assessment={selectedForOnboarding}
          onStart={() => {
            const a = selectedForOnboarding;
            setSelectedForOnboarding(null);
            onStartExam(a.id);
          }}
          onCancel={() => setSelectedForOnboarding(null)}
        />
      )}
    </div>
  );
}

// -------------------------------------------------------------
// PRACTICE ARENA VIEW (ADAPTIVE WITH TABS ON SMALL SCREENS)
// -------------------------------------------------------------
function PracticeView({ user }) {
  const [qs, setQs] = useState([]);
  const [selected, setSelected] = useState(null);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [busy, setBusy] = useState(false);
  const [filter, setFilter] = useState('ALL');
  
  // Mobile / Tablet Tab Switcher
  const [mobileTab, setMobileTab] = useState('problem'); // 'questions' | 'problem' | 'editor'
  const [fontSize, setFontSize] = useState(13.5);
  const [isMobile, setIsMobile] = useState(() => (typeof window !== 'undefined' ? window.innerWidth <= 860 : false));

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 860);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    api('/practice/questions')
      .then((data) => {
        setQs(data);
        if (data.length > 0) pick(data[0].id);
      })
      .catch((e) => setOutput(e.message));
  }, []);

  const pick = async (id) => {
    try {
      const q = await api('/practice/questions/' + id);
      setSelected(q);
      setCode(q.starterCode || '');
      setOutput('');
      setMobileTab('problem');
    } catch (err) {
      setOutput('Failed to load problem: ' + err.message);
    }
  };

  const run = async (submit) => {
    if (!selected) return;
    setBusy(true);
    if (isMobile) setMobileTab('editor');
    try {
      const d = await api(
        `/practice/questions/${selected.id}/${submit ? 'submit' : 'run'}${submit ? '?userId=' + user.id : ''}`,
        { method: 'POST', body: JSON.stringify({ language: selected.language || 'java', code }) }
      );
      setOutput(JSON.stringify(d, null, 2));
    } catch (e) {
      setOutput(e.message);
    } finally {
      setBusy(false);
    }
  };

  const filteredQs = filter === 'ALL' ? qs : qs.filter((q) => q.difficulty === filter || q.category === filter);

  return (
    <div className="view-content">
      <div className="view-header">
        <h1>Practice Arena</h1>
        <p>Solve coding problems with instant compiler execution feedback across all devices.</p>
      </div>

      {/* Categories Bar */}
      <div className="practice-categories-bar">
        {['ALL', 'EASY', 'MEDIUM', 'HARD', 'Strings', 'Arrays', 'Hashing'].map((cat) => (
          <button
            key={cat}
            type="button"
            className={filter === cat ? '' : 'ghost'}
            style={{ fontSize: '11px', padding: '4px 11px', borderRadius: '20px' }}
            onClick={() => setFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Mobile/Tablet Section Tabs Switcher */}
      <div className="practice-mobile-tabs">
        <button
          type="button"
          className={mobileTab === 'questions' ? '' : 'ghost'}
          style={{ flex: 1, fontSize: '12px', padding: '7px' }}
          onClick={() => setMobileTab('questions')}
        >
          📚 Problems ({filteredQs.length})
        </button>
        <button
          type="button"
          disabled={!selected}
          className={mobileTab === 'problem' ? '' : 'ghost'}
          style={{ flex: 1, fontSize: '12px', padding: '7px' }}
          onClick={() => setMobileTab('problem')}
        >
          📄 Statement
        </button>
        <button
          type="button"
          disabled={!selected}
          className={mobileTab === 'editor' ? '' : 'ghost'}
          style={{ flex: 1, fontSize: '12px', padding: '7px' }}
          onClick={() => setMobileTab('editor')}
        >
          💻 Code & Console
        </button>
      </div>

      <div className="practice-container-grid">
        {/* Questions list (Shown if on 'questions' tab or on wider screens) */}
        {(!isMobile || mobileTab === 'questions') && (
          <div className="practice-list-pane">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 6px', marginBottom: '4px' }}>
              <span style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Problem List ({filteredQs.length})
              </span>
            </div>
            {filteredQs.map((q) => (
              <button
                key={q.id}
                type="button"
                className={selected?.id === q.id ? '' : 'ghost'}
                style={{
                  textAlign: 'left',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  padding: '10px 14px',
                  gap: '4px',
                  minHeight: '48px',
                  width: '100%'
                }}
                onClick={() => pick(q.id)}
              >
                <strong style={{ fontSize: '13.5px' }}>{q.title}</strong>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <small style={{ color: selected?.id === q.id ? 'rgba(255,255,255,0.9)' : 'var(--text-muted)', fontSize: '11px' }}>
                    {q.category}
                  </small>
                  <span style={{
                    fontSize: '10px',
                    padding: '1px 6px',
                    borderRadius: '4px',
                    fontWeight: 700,
                    background: q.difficulty === 'EASY' ? 'rgba(16,185,129,0.2)' : q.difficulty === 'MEDIUM' ? 'rgba(245,158,11,0.2)' : 'rgba(239,68,68,0.2)',
                    color: q.difficulty === 'EASY' ? '#34d399' : q.difficulty === 'MEDIUM' ? '#fbbf24' : '#f87171'
                  }}>
                    {q.difficulty}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Problem Statement & Code Editor */}
        {selected && (!isMobile || mobileTab !== 'questions') && (
          <div className="practice-workspace-pane">
            {/* Problem Details header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="badge" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' }}>{selected.difficulty}</span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{selected.category}</span>
            </div>
            <h2>{selected.title}</h2>
            
            {(!isMobile || mobileTab === 'problem') && (
              <>
                <p style={{ color: '#d1d5db', fontSize: '13.5px', lineHeight: 1.55, whiteSpace: 'pre-wrap' }}>
                  {selected.description}
                </p>
                {isMobile && (
                  <button
                    type="button"
                    onClick={() => setMobileTab('editor')}
                    style={{ marginTop: '8px', width: '100%', minHeight: '40px' }}
                  >
                    Open Code Editor →
                  </button>
                )}
              </>
            )}
            
            {/* Editor Workspace */}
            {(!isMobile || mobileTab === 'editor') && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>☕ Java 17 Solution</span>
                    <button
                      type="button"
                      className="ghost"
                      style={{ fontSize: '10.5px', padding: '2px 6px' }}
                      onClick={() => setFontSize((s) => Math.max(11, s - 1))}
                    >
                      A-
                    </button>
                    <button
                      type="button"
                      className="ghost"
                      style={{ fontSize: '10.5px', padding: '2px 6px' }}
                      onClick={() => setFontSize((s) => Math.min(20, s + 1))}
                    >
                      A+
                    </button>
                  </div>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    {isMobile && (
                      <button
                        type="button"
                        className="ghost"
                        style={{ fontSize: '11px', padding: '5px 8px' }}
                        onClick={() => setMobileTab('problem')}
                      >
                        ← Problem
                      </button>
                    )}
                    <button
                      type="button"
                      className="ghost"
                      style={{ fontSize: '11.5px', padding: '5px 10px' }}
                      disabled={busy}
                      onClick={() => run(false)}
                    >
                      ▶ Run Code
                    </button>
                    <button
                      type="button"
                      style={{ fontSize: '11.5px', padding: '5px 12px' }}
                      disabled={busy}
                      onClick={() => run(true)}
                    >
                      Submit
                    </button>
                  </div>
                </div>

                <textarea
                  className="editor-textarea"
                  style={{
                    minHeight: isMobile ? '200px' : '260px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-subtle)',
                    fontSize: `${fontSize}px`
                  }}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  spellCheck="false"
                  placeholder="// Write your Java solution here..."
                />

                <div style={{ background: '#060911', borderRadius: '10px', padding: '8px 12px', border: '1px solid var(--border-subtle)', minHeight: '90px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Console Output</span>
                    {output && (
                      <button
                        type="button"
                        className="ghost"
                        style={{ fontSize: '9.5px', padding: '1px 5px', border: 'none' }}
                        onClick={() => setOutput('')}
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <pre style={{ fontFamily: 'var(--font-code)', fontSize: '11.5px', color: '#94a3b8', marginTop: '4px', whiteSpace: 'pre-wrap', maxHeight: '160px', overflowY: 'auto' }}>
                    {output || 'Run your code to view compiler results.'}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// MAIN ROOT
// -------------------------------------------------------------
function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'));
  const [activeTab, setActiveTab] = useState('assessments');
  const [activeExamId, setActiveExamId] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
  };

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  if (activeExamId) {
    return (
      <ProctoredExam
        assessmentId={activeExamId}
        user={user}
        onExit={() => setActiveExamId(null)}
      />
    );
  }

  return (
    <div className="app-container">
      {/* Mobile Drawer Overlay Backdrop */}
      <div
        className={`sidebar-overlay ${mobileMenuOpen ? 'mobile-open' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Sidebar (Responsive for Desktop / Drawer on Mobile) */}
      <aside className={`sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-icon">🛡️</div>
          <div>
            <div className="brand-title">SentinelAssess</div>
            <small style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Proctoring Suite</small>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div
            className={`nav-item ${activeTab === 'assessments' ? 'active' : ''}`}
            onClick={() => { setActiveTab('assessments'); setMobileMenuOpen(false); }}
          >
            <span>📝</span> Proctored Assessments
          </div>
          <div
            className={`nav-item ${activeTab === 'practice' ? 'active' : ''}`}
            onClick={() => { setActiveTab('practice'); setMobileMenuOpen(false); }}
          >
            <span>💻</span> Practice Arena
          </div>
        </nav>

        {/* Sidebar System Diagnostic Widget */}
        <div className="sidebar-status-box">
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
            <span>Security Engine</span>
            <span style={{ color: '#34d399', fontWeight: 700 }}>● Active</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
            <span>Compiler</span>
            <span style={{ color: '#60a5fa', fontWeight: 700 }}>Java 17</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
            <span>Telemetry</span>
            <span style={{ color: '#fbbf24', fontWeight: 700 }}>Secure</span>
          </div>
        </div>

        <div className="sidebar-user">
          <div className="user-card">
            <div className="avatar">{user.username ? user.username[0].toUpperCase() : 'U'}</div>
            <div style={{ minWidth: 0, overflow: 'hidden', flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#fff' }}>
                {user.username}
              </div>
              <small style={{ color: 'var(--text-muted)', fontSize: '11px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
                {user.email}
              </small>
            </div>
          </div>
          <button className="ghost" onClick={handleLogout} style={{ width: '100%', fontSize: '12px', padding: '8px' }}>
            🚪 Sign Out
          </button>
        </div>
      </aside>

      {/* Main Viewport */}
      <main className="main-viewport">
        <header className="topbar">
          <div className="topbar-left">
            <button
              type="button"
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              ☰
            </button>
            <input className="search-box" placeholder="Search assessments, coding problems..." />
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="hud-status-badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '5px 10px', fontSize: '11px' }}>
              ● System Online
            </div>
          </div>
        </header>

        {activeTab === 'assessments' ? (
          <AssessmentsView user={user} onStartExam={setActiveExamId} />
        ) : (
          <PracticeView user={user} />
        )}
      </main>

      {/* Mobile Sticky Bottom Navigation for Instant Thumb Navigation */}
      <nav className="mobile-bottom-nav">
        <button
          type="button"
          className={`mobile-nav-btn ${activeTab === 'assessments' ? 'active' : ''}`}
          onClick={() => setActiveTab('assessments')}
        >
          <span className="icon">📝</span>
          <span>Assessments</span>
        </button>
        <button
          type="button"
          className={`mobile-nav-btn ${activeTab === 'practice' ? 'active' : ''}`}
          onClick={() => setActiveTab('practice')}
        >
          <span className="icon">💻</span>
          <span>Practice</span>
        </button>
        <button
          type="button"
          className="mobile-nav-btn"
          onClick={handleLogout}
        >
          <span className="icon">🚪</span>
          <span>Sign Out</span>
        </button>
      </nav>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);

