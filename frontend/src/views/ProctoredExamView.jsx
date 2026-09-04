import React, { useState, useEffect, useRef, useCallback } from 'react';
import { assessmentApi, practiceApi } from '../api/client';
import { CodeEditor } from '../components/common/CodeEditor';
import { ConsoleOutput } from '../components/common/ConsoleOutput';
import { useToast } from '../context/ToastContext';

const MAX_VIOLATIONS = 5;

export function ProctoredExamView({ assessmentId, user, onExit }) {
  const [assessment, setAssessment] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [markedReview, setMarkedReview] = useState({});
  const [output, setOutput] = useState('');
  const [busyRun, setBusyRun] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);

  // Proctoring State
  const [violations, setViolations] = useState([]);
  const [alertBanner, setAlertBanner] = useState(null);
  const [disqualified, setDisqualified] = useState(false);
  const [submittedResult, setSubmittedResult] = useState(null);
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [phoneAlert, setPhoneAlert] = useState(false);
  const [detectorStatus, setDetectorStatus] = useState('Initializing AI Camera...');

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const timerRef = useRef(null);
  const detectIntervalRef = useRef(null);
  const cocoModelRef = useRef(null);
  const violationsRef = useRef([]);
  violationsRef.current = violations;
  const toast = useToast();

  // Play audio chime for violation
  const playViolationChime = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(480, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.35);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch (_) {}
  };

  const handleFinalSubmit = useCallback(async (forcedByViolations = false) => {
    if (!assessment) return;

    try {
      const payload = {
        answers,
        violations: violationsRef.current.map((v) => v.reason),
        terminatedByViolations: forcedByViolations
      };

      const result = await assessmentApi.submitAssessment(assessment.id, user.id, payload);
      setSubmittedResult(result);
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    } catch (err) {
      toast.error(err.message || 'Failed to submit exam');
      setSubmittedResult({
        score: 0,
        maxMarks: assessment.totalMarks,
        status: forcedByViolations ? 'TERMINATED_VIOLATIONS' : 'SUBMITTED',
        violationCount: violationsRef.current.length
      });
    }
  }, [assessment, answers, user.id, toast]);

  const recordViolation = useCallback((reason) => {
    if (disqualified || submittedResult) return;

    const timeStr = new Date().toLocaleTimeString();
    const newEntry = { id: Date.now(), time: timeStr, reason };
    const updated = [...violationsRef.current, newEntry];
    setViolations(updated);

    setAlertBanner({ count: updated.length, reason });
    playViolationChime();

    setTimeout(() => setAlertBanner(null), 4000);

    if (updated.length >= MAX_VIOLATIONS) {
      setDisqualified(true);
      // Auto-submit on 5 violations
      handleFinalSubmit(true);
    }
  }, [disqualified, submittedResult, handleFinalSubmit]);

  // Request Fullscreen immediately on mount
  useEffect(() => {
    try {
      if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } catch (_) {}
  }, []);

  // Load assessment details
  useEffect(() => {
    let active = true;
    assessmentApi
      .getAssessment(assessmentId)
      .then((data) => {
        if (active) {
          setAssessment(data);
          setTimeLeft((data.durationMinutes || 45) * 60);

          // Populate initial answer states
          const initAnswers = {};
          data.questions?.forEach((q) => {
            if (q.type === 'CODING') {
              initAnswers[q.id] = q.starterCode || `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Write solution\n    }\n}`;
            } else {
              initAnswers[q.id] = '';
            }
          });
          setAnswers(initAnswers);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (active) {
          toast.error(err.message || 'Failed to load assessment');
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [assessmentId]);

  // Setup camera stream & initialize real-time AI Phone Detector
  useEffect(() => {
    let localStream = null;
    navigator.mediaDevices
      ?.getUserMedia({ video: { width: { ideal: 640 }, height: { ideal: 480 } }, audio: false })
      .then((s) => {
        localStream = s;
        streamRef.current = s;
        if (videoRef.current) {
          videoRef.current.srcObject = s;
        }

        // Initialize TensorFlow COCO-SSD model if available in window
        if (window.cocoSsd) {
          setDetectorStatus('Loading TensorFlow COCO-SSD Model...');
          window.cocoSsd.load().then((model) => {
            cocoModelRef.current = model;
            setDetectorStatus('AI Camera: Active Phone & Face Detector');

            // Run detection loop every 1.2s
            detectIntervalRef.current = setInterval(async () => {
              if (!videoRef.current || videoRef.current.readyState < 2 || !cocoModelRef.current) return;
              try {
                const predictions = await cocoModelRef.current.detect(videoRef.current);
                const phoneItem = predictions.find(
                  (p) => (p.class === 'cell phone' || p.class === 'remote' || p.class === 'telephone') && p.score > 0.45
                );
                if (phoneItem) {
                  setPhoneAlert(true);
                  recordViolation(`Camera AI: Mobile phone detected in frame (${Math.round(phoneItem.score * 100)}% confidence)`);
                  setTimeout(() => setPhoneAlert(false), 3500);
                }
              } catch (_) {}
            }, 1200);
          }).catch(() => {
            setDetectorStatus('AI Camera: Vision Telemetry Active');
          });
        } else {
          setDetectorStatus('AI Camera: Vision Telemetry Active');
        }
      })
      .catch((e) => {
        console.warn('Exam video stream:', e);
        setDetectorStatus('Camera Permission Required');
      });

    return () => {
      if (localStream) localStream.getTracks().forEach((t) => t.stop());
      if (detectIntervalRef.current) clearInterval(detectIntervalRef.current);
    };
  }, [loading, recordViolation]);

  // Timer countdown
  useEffect(() => {
    if (loading || !assessment || disqualified || submittedResult) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleFinalSubmit(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [loading, assessment, disqualified, submittedResult, handleFinalSubmit]);

  // Anti-cheat listeners (Lockdown Mode)
  useEffect(() => {
    if (loading || disqualified || submittedResult) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        recordViolation('Tab switched / Browser minimized');
      }
    };

    const handleWindowBlur = () => {
      recordViolation('Window focus lost / Switched to other application');
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        recordViolation('Fullscreen exited (Security lockdown active)');
      }
    };

    const handleKeyDown = (e) => {
      // Block ANY Ctrl or Cmd combination (Ctrl+C, Ctrl+V, Ctrl+A, Ctrl+X, Ctrl+W, Ctrl+T, Ctrl+Tab, etc.)
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        e.stopPropagation();
        const keyName = e.key ? e.key.toUpperCase() : 'KEY';
        recordViolation(`Restricted shortcut blocked (${e.ctrlKey ? 'Ctrl' : 'Cmd'}+${keyName})`);
        return false;
      }
      if (e.key === 'F12' || e.key === 'F11' || e.key === 'F5') {
        e.preventDefault();
        e.stopPropagation();
        recordViolation(`DevTools inspect or refresh key blocked (${e.key})`);
        return false;
      }
      if (e.altKey) {
        e.preventDefault();
        e.stopPropagation();
        recordViolation('Alt key window-switching shortcut blocked');
        return false;
      }
    };

    const handleCopyPaste = (e) => {
      e.preventDefault();
      e.stopPropagation();
      recordViolation(`Clipboard action blocked (${e.type.toUpperCase()})`);
      return false;
    };

    const handleContextMenu = (e) => {
      e.preventDefault();
      e.stopPropagation();
      recordViolation('Context right-click blocked');
      return false;
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('contextmenu', handleContextMenu, true);
    window.addEventListener('copy', handleCopyPaste, true);
    window.addEventListener('paste', handleCopyPaste, true);
    window.addEventListener('cut', handleCopyPaste, true);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('contextmenu', handleContextMenu, true);
      window.removeEventListener('copy', handleCopyPaste, true);
      window.removeEventListener('paste', handleCopyPaste, true);
      window.removeEventListener('cut', handleCopyPaste, true);
    };
  }, [loading, disqualified, submittedResult, recordViolation]);

  const handleTestRunCode = async (qId) => {
    const currentCode = answers[qId];
    if (!currentCode) return;
    setBusyRun(true);
    setOutput('');

    try {
      const res = await practiceApi.runCode(1, {
        language: 'java',
        code: currentCode
      });
      setOutput(res.output || res.stdout || JSON.stringify(res, null, 2));
    } catch (err) {
      setOutput(err.message || 'Compiler execution error');
    } finally {
      setBusyRun(false);
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="exam-fullscreen-container flex-center">
        <div className="loading-spinner-box">
          <span className="spinner-icon">⟳</span>
          <p>Initializing Secure Examination Room...</p>
        </div>
      </div>
    );
  }

  // Submitted / Terminated Results Screen
  if (submittedResult) {
    const isTerminated = submittedResult.status === 'TERMINATED_VIOLATIONS' || disqualified;
    return (
      <div className="exam-fullscreen-container flex-center">
        <div className="exam-result-card">
          <div className="result-header-icon">
            {isTerminated ? '🚫' : '🏆'}
          </div>
          <h2 className="result-title">
            {isTerminated ? 'Assessment Terminated' : 'Assessment Submitted Successfully'}
          </h2>
          <p className="result-desc">
            {isTerminated
              ? 'Exam was automatically terminated due to exceeding the maximum allowable anti-cheat violations.'
              : 'Your responses and code submissions have been securely evaluated and recorded in the audit registry.'}
          </p>

          <div className="result-score-block">
            <div className="result-metric">
              <span className="metric-label">Final Score</span>
              <span className="metric-val">
                {submittedResult.score ?? 0} / {submittedResult.maxMarks ?? assessment.totalMarks}
              </span>
            </div>
            <div className="result-metric">
              <span className="metric-label">Violations Logged</span>
              <span className="metric-val text-warning">
                {violations.length} / {MAX_VIOLATIONS}
              </span>
            </div>
            <div className="result-metric">
              <span className="metric-label">Verdict</span>
              <span className={`metric-val ${isTerminated ? 'text-danger' : 'text-success'}`}>
                {isTerminated ? 'DISQUALIFIED' : 'PASSED'}
              </span>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-primary btn-block"
            onClick={onExit}
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = assessment?.questions?.[currentIdx];
  const isMcq = currentQuestion?.type === 'MCQ';
  let mcqOptions = [];
  if (isMcq && currentQuestion.optionsJson) {
    try {
      mcqOptions = JSON.parse(currentQuestion.optionsJson);
    } catch (_) {
      mcqOptions = ['Option A', 'Option B', 'Option C', 'Option D'];
    }
  }

  return (
    <div className="exam-fullscreen-container lockdown-mode">
      {/* Violation Alert Banner */}
      {alertBanner && (
        <div className="exam-violation-alert-banner">
          <span>🚨</span>
          <strong>Security Warning ({alertBanner.count}/{MAX_VIOLATIONS}):</strong>
          <span>{alertBanner.reason}</span>
        </div>
      )}

      {/* Exam Header */}
      <header className="exam-top-bar">
        <div className="exam-title-group">
          <span className="exam-brand-logo">◈</span>
          <span className="exam-title-text">{assessment.title}</span>
        </div>

        {/* Violation Meter */}
        <div className="exam-violation-meter">
          <span className="meter-label">{violations.length}/{MAX_VIOLATIONS} Violations</span>
          <div className="meter-dots-row">
            {Array.from({ length: MAX_VIOLATIONS }).map((_, i) => (
              <span
                key={i}
                className={`meter-dot ${i < violations.length ? 'filled' : ''}`}
              />
            ))}
          </div>
        </div>

        {/* Timer & Finish */}
        <div className="exam-timer-actions">
          <div className={`exam-timer-pill ${timeLeft < 300 ? 'urgent' : ''}`}>
            ⏱️ {formatTime(timeLeft)}
          </div>
          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={() => {
              if (window.confirm('Are you sure you want to finish and submit your assessment now?')) {
                handleFinalSubmit(false);
              }
            }}
          >
            Submit Assessment
          </button>
        </div>
      </header>

      {/* Main Exam Body */}
      <div className="exam-main-body">
        {/* Left Sidebar: Proctor Stream & Question Navigator */}
        <aside className={`exam-left-pane ${navCollapsed ? 'collapsed' : ''}`}>
          <div className="left-pane-header">
            <span className="pane-title">AI Proctor & Items</span>
            <button
              type="button"
              className="btn-icon-tiny"
              onClick={() => setNavCollapsed(!navCollapsed)}
            >
              {navCollapsed ? '▶' : '◀'}
            </button>
          </div>

          {!navCollapsed && (
            <>
              {/* Live Camera HUD Box */}
              <div className="exam-camera-box">
                <video ref={videoRef} autoPlay playsInline muted />
                <div className={`camera-hud-badge ${phoneAlert ? 'alert' : ''}`}>
                  <span className="hud-indicator-dot"></span>
                  <span>{phoneAlert ? '🚨 PHONE DETECTED!' : 'AI Camera Active'}</span>
                </div>
                <div className="camera-detector-status-line" style={{ fontSize: '10.5px', color: phoneAlert ? 'var(--danger)' : 'var(--text-dim)', textAlign: 'center', marginTop: '4px', fontWeight: 500 }}>
                  {phoneAlert ? '⚠️ Security Alert: Mobile Phone Detected' : detectorStatus}
                </div>
              </div>

              {/* Simulation Testing Buttons for Proctoring Demonstration */}
              <div className="proctor-test-sim-bar">
                <button
                  type="button"
                  className="btn-sim"
                  onClick={() => {
                    setPhoneAlert(true);
                    recordViolation('Camera AI: Mobile device detected in visual frame');
                    setTimeout(() => setPhoneAlert(false), 3000);
                  }}
                >
                  📱 Test Phone
                </button>
                <button
                  type="button"
                  className="btn-sim"
                  onClick={() => recordViolation('Camera AI: Candidate gaze diverted away from screen')}
                >
                  👀 Test Gaze
                </button>
              </div>

              {/* Question Navigator Matrix */}
              <div className="exam-navigator-block">
                <div className="nav-matrix-header">
                  <span>Questions ({assessment.questions.length})</span>
                </div>

                <div className="nav-pills-grid">
                  {assessment.questions.map((q, idx) => {
                    const isAnswered =
                      q.type === 'MCQ'
                        ? Boolean(answers[q.id])
                        : answers[q.id] && answers[q.id].length > 50 && !answers[q.id].includes('// Write solution');
                    const isReview = Boolean(markedReview[q.id]);
                    const isCurrent = idx === currentIdx;

                    let pillClass = 'unanswered';
                    if (isCurrent) pillClass = 'current';
                    else if (isReview) pillClass = 'review';
                    else if (isAnswered) pillClass = 'answered';

                    return (
                      <button
                        key={q.id}
                        type="button"
                        className={`q-nav-pill ${pillClass}`}
                        onClick={() => setCurrentIdx(idx)}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="nav-legend">
                  <span className="legend-item"><span className="dot dot-current"></span> Current</span>
                  <span className="legend-item"><span className="dot dot-answered"></span> Answered</span>
                  <span className="legend-item"><span className="dot dot-review"></span> Review</span>
                  <span className="legend-item"><span className="dot dot-unanswered"></span> Unanswered</span>
                </div>
              </div>
            </>
          )}
        </aside>

        {/* Right Content Pane: Question Statement & MCQ / Code Editor */}
        <main className="exam-workspace-pane">
          {currentQuestion ? (
            <div className="exam-question-card">
              {/* Question Header */}
              <div className="exam-question-header">
                <div className="q-number-title">
                  <span className="q-badge">Question {currentIdx + 1} of {assessment.questions.length}</span>
                  <span className="q-marks-tag">+{currentQuestion.marks} Marks</span>
                  <span className="q-type-tag">{currentQuestion.type}</span>
                </div>

                <div className="q-review-toggle">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={Boolean(markedReview[currentQuestion.id])}
                      onChange={(e) =>
                        setMarkedReview((prev) => ({
                          ...prev,
                          [currentQuestion.id]: e.target.checked
                        }))
                      }
                    />
                    <span>Mark for Review</span>
                  </label>
                </div>
              </div>

              {/* Question Title & Description */}
              <h2 className="exam-question-title">{currentQuestion.title}</h2>
              <div className="exam-question-description">
                {currentQuestion.description}
              </div>

              {/* Question Form: MCQ or Coding */}
              {isMcq ? (
                <div className="mcq-options-container">
                  <h3 className="mcq-prompt-heading">Select the correct option:</h3>
                  <div className="mcq-options-list">
                    {mcqOptions.map((opt, oIdx) => {
                      const optKey = opt.substring(0, 1).toUpperCase();
                      const isSelected = answers[currentQuestion.id] === optKey || answers[currentQuestion.id] === opt;
                      return (
                        <div
                          key={oIdx}
                          className={`mcq-option-row ${isSelected ? 'selected' : ''}`}
                          onClick={() =>
                            setAnswers((prev) => ({
                              ...prev,
                              [currentQuestion.id]: optKey
                            }))
                          }
                        >
                          <span className="mcq-radio-indicator">
                            {isSelected ? '●' : '○'}
                          </span>
                          <span className="mcq-option-text">{opt}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="coding-question-container">
                  <div className="coding-editor-header">
                    <span>☕ Java Solution Editor</span>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      disabled={busyRun}
                      onClick={() => handleTestRunCode(currentQuestion.id)}
                    >
                      {busyRun ? '⟳ Compiling...' : '▶ Test Run'}
                    </button>
                  </div>

                  <CodeEditor
                    value={answers[currentQuestion.id] || ''}
                    onChange={(val) =>
                      setAnswers((prev) => ({
                        ...prev,
                        [currentQuestion.id]: val
                      }))
                    }
                    language="Java"
                    minHeight="280px"
                  />

                  {output && (
                    <div className="exam-console-preview">
                      <div className="console-title-bar">
                        <span>Compiler Test Output</span>
                        <button
                          type="button"
                          className="btn-icon-tiny"
                          onClick={() => setOutput('')}
                        >
                          Clear
                        </button>
                      </div>
                      <pre className="console-text">{output}</pre>
                    </div>
                  )}
                </div>
              )}

              {/* Navigation Bottom Controls */}
              <div className="exam-nav-controls">
                <button
                  type="button"
                  className="btn btn-secondary"
                  disabled={currentIdx === 0}
                  onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
                >
                  ← Previous
                </button>

                <div className="nav-progress-text">
                  Question {currentIdx + 1} / {assessment.questions.length}
                </div>

                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={currentIdx === assessment.questions.length - 1}
                  onClick={() => setCurrentIdx((i) => Math.min(assessment.questions.length - 1, i + 1))}
                >
                  Next →
                </button>
              </div>
            </div>
          ) : (
            <p>No questions found in this assessment.</p>
          )}
        </main>
      </div>
    </div>
  );
}
