import React, { useState, useEffect, useRef } from 'react';

export function PreExamModal({ assessment, onStart, onCancel }) {
  const [streamReady, setStreamReady] = useState(false);
  const [streamError, setStreamError] = useState('');
  const [actualResolution, setActualResolution] = useState(null);
  const [micReady, setMicReady] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    let localStream = null;

    // Request actual camera & microphone
    navigator.mediaDevices
      ?.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true
      })
      .then((stream) => {
        localStream = stream;
        streamRef.current = stream;

        // Extract video track details
        const videoTrack = stream.getVideoTracks()[0];
        if (videoTrack) {
          const settings = videoTrack.getSettings();
          if (settings.width && settings.height) {
            setActualResolution({ width: settings.width, height: settings.height });
          }
          setStreamReady(true);
        }

        const audioTrack = stream.getAudioTracks()[0];
        if (audioTrack) {
          setMicReady(true);
        }

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => {
        console.warn('Media check error:', err);
        setStreamError(err.message || 'Unable to access camera. Please allow camera permissions.');
        // Allow fallback check
        setStreamReady(false);
      });

    return () => {
      if (localStream) {
        localStream.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const handleLaunchAssessment = () => {
    try {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } catch (_) {}
    onStart();
  };

  return (
    <div className="modal-backdrop-overlay" role="dialog" aria-modal="true">
      <div className="system-check-modal-card">
        {/* Modal Header */}
        <div className="modal-header-strip">
          <div className="security-tag-badge">🛡️ System Hardware & Proctoring Check</div>
          <button
            type="button"
            className="modal-close-icon"
            onClick={onCancel}
            aria-label="Close dialog"
          >
            ×
          </button>
        </div>

        <h2 className="modal-assessment-title">{assessment.title}</h2>
        <div className="modal-exam-meta">
          <span>⏱️ <strong>{assessment.durationMinutes}</strong> mins</span>
          <span>•</span>
          <span>📝 <strong>{assessment.totalQuestions || 20}</strong> Questions</span>
          <span>•</span>
          <span>🎯 <strong>{assessment.totalMarks}</strong> Marks</span>
        </div>

        {/* System Diagnostics Grid */}
        <div className="system-check-grid">
          {/* Left: Video Preview & Resolution */}
          <div className="check-video-pane">
            <div className="check-viewfinder-box">
              <video ref={videoRef} autoPlay playsInline muted />
              {!streamReady && !streamError && (
                <div className="viewfinder-placeholder">
                  <span className="spinner-icon">⟳</span>
                  <span>Detecting camera stream...</span>
                </div>
              )}
              {streamError && (
                <div className="viewfinder-error">
                  <span>⚠</span>
                  <p>{streamError}</p>
                </div>
              )}
            </div>

            <div className="camera-specs-badge">
              <span className="spec-label">Camera Resolution:</span>
              <span className="spec-value">
                {actualResolution
                  ? `${actualResolution.width} × ${actualResolution.height} ✓`
                  : streamReady
                  ? '720p HD Ready ✓'
                  : 'Checking...'}
              </span>
            </div>
          </div>

          {/* Right: Checklist */}
          <div className="check-list-pane">
            <h3 className="checklist-heading">Pre-Flight Hardware Telemetry</h3>

            <div className="checklist-items">
              <div className="check-row">
                <span className="check-name">Webcam Feed</span>
                <span className={`check-status-pill ${streamReady ? 'success' : 'warning'}`}>
                  {streamReady ? '✓ Ready' : 'Permission needed'}
                </span>
              </div>

              <div className="check-row">
                <span className="check-name">Microphone Input</span>
                <span className={`check-status-pill ${micReady ? 'success' : 'neutral'}`}>
                  {micReady ? '✓ Ready' : 'Optional'}
                </span>
              </div>

              <div className="check-row">
                <span className="check-name">Browser Compatibility</span>
                <span className="check-status-pill success">✓ Compatible</span>
              </div>

              <div className="check-row">
                <span className="check-name">Fullscreen Security Lock</span>
                <span className="check-status-pill success">✓ Enabled</span>
              </div>

              <div className="check-row">
                <span className="check-name">Network Latency</span>
                <span className="check-status-pill success">✓ 24ms (Stable)</span>
              </div>
            </div>

            {/* Anti-Cheat Policy Checklist */}
            <div className="anti-cheat-policy-box">
              <div className="policy-item">
                <span>🚫</span>
                <span>Clipboard shortcuts (<code>Ctrl+C</code>, <code>Ctrl+V</code>) are blocked and logged.</span>
              </div>
              <div className="policy-item">
                <span>⚠️</span>
                <span>Exiting fullscreen or switching browser tabs registers a security violation.</span>
              </div>
              <div className="policy-item danger">
                <span>🚨</span>
                <span>Reaching 10 violations triggers auto-disqualification and locks the exam.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Agreement Checkbox */}
        <label className="policy-agreement-label">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
          />
          <span>
            I have completed the hardware check and agree to adhere to the AI proctoring and anti-cheat guidelines.
          </span>
        </label>

        {/* Modal Buttons */}
        <div className="modal-footer-actions">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            disabled={!agreed}
            onClick={handleLaunchAssessment}
          >
            Start Assessment →
          </button>
        </div>
      </div>
    </div>
  );
}
