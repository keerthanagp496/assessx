import React, { useState, useEffect } from 'react';
import { quickprepApi } from '../api/client';
import { QuickPrepQuizModal } from './QuickPrepQuizModal';

export function QuickPrepTimeMode({ duration = '20min', user, onExit, onSelectTopic }) {
  const [pathData, setPathData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [activeTopicDetail, setActiveTopicDetail] = useState(null);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(20 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizResult, setQuizResult] = useState(null);

  // Initialize path and topic
  useEffect(() => {
    let mounted = true;
    setLoading(true);

    quickprepApi.getRevisionPath(duration)
      .then((data) => {
        if (mounted) {
          setPathData(data);
          setTimeLeftSeconds((data.totalMinutes || 20) * 60);
          if (data.schedule && data.schedule.length > 0) {
            loadTopic(data.schedule[0].topicId);
          }
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [duration]);

  // Timer countdown tick
  useEffect(() => {
    if (!isTimerRunning || timeLeftSeconds <= 0) return;
    const interval = setInterval(() => {
      setTimeLeftSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeftSeconds]);

  const loadTopic = async (id) => {
    try {
      const topic = await quickprepApi.getTopic(id);
      setActiveTopicDetail(topic);
    } catch (_) {
      // Fallback
    }
  };

  const handleSelectStep = (idx) => {
    setCurrentStepIndex(idx);
    if (pathData?.schedule?.[idx]) {
      loadTopic(pathData.schedule[idx].topicId);
    }
  };

  const handleNextStep = () => {
    if (currentStepIndex < (pathData?.schedule?.length || 1) - 1) {
      handleSelectStep(currentStepIndex + 1);
    } else {
      setShowQuiz(true);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      handleSelectStep(currentStepIndex - 1);
    }
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  if (loading || !pathData) {
    return (
      <div className="view-content-wrapper">
        <div className="quickprep-topic-skeleton">
          <div className="skeleton-bar" style={{ width: '40%', height: '30px' }}></div>
          <div className="skeleton-bar" style={{ width: '100%', height: '100px', marginTop: '20px' }}></div>
        </div>
      </div>
    );
  }

  const schedule = pathData.schedule || [];
  const currentStep = schedule[currentStepIndex] || {};
  const progressPercent = Math.round(((currentStepIndex + 1) / (schedule.length || 1)) * 100);

  return (
    <div className="view-content-wrapper quickprep-timemode-layout">
      {/* Top Session Ribbon */}
      <div className="timemode-top-ribbon">
        <div className="ribbon-left">
          <button type="button" className="btn-exit-sprint" onClick={onExit}>
            ✕ Exit Revision Mode
          </button>
          <div className="sprint-title-badge">
            <span className="sprint-icon">⚡</span>
            <div>
              <strong>{pathData.title}</strong>
              <small>{pathData.totalMinutes} min structured sprint</small>
            </div>
          </div>
        </div>

        {/* Live Countdown Clock */}
        <div className="ribbon-center">
          <div className={`countdown-clock-pill ${timeLeftSeconds < 180 ? 'urgency' : ''}`}>
            <span className="clock-icon">⏱️</span>
            <span className="clock-time">{formatTime(timeLeftSeconds)}</span>
            <span className="clock-status">{timeLeftSeconds > 0 ? 'Remaining' : 'Time Up!'}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="ribbon-right">
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setIsTimerRunning(!isTimerRunning)}
          >
            {isTimerRunning ? '⏸ Pause Timer' : '▶ Resume Timer'}
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => setShowQuiz(true)}
          >
            ⚡ Sprint Quiz
          </button>
        </div>
      </div>

      {/* Progress Track */}
      <div className="timemode-progress-container">
        <div className="progress-info-row">
          <span>
            Topic <strong>{currentStepIndex + 1}</strong> of <strong>{schedule.length}</strong>: {currentStep.title}
          </span>
          <span className="progress-pct-bold">{progressPercent}% Completed</span>
        </div>
        <div className="timemode-progress-track">
          <div
            className="timemode-progress-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 2-Column Workspace: Left Timeline Roadmap, Right Fast Concept Reader */}
      <div className="timemode-split-view">
        {/* Timeline Roadmap Sidebar */}
        <div className="timemode-timeline-sidebar">
          <h4 className="timeline-sidebar-heading">Revision Schedule</h4>
          <div className="timeline-step-list">
            {schedule.map((step, idx) => {
              const isCurrent = idx === currentStepIndex;
              const isDone = idx < currentStepIndex;

              return (
                <button
                  key={idx}
                  type="button"
                  className={`timeline-step-card ${isCurrent ? 'active' : ''} ${isDone ? 'done' : ''}`}
                  onClick={() => handleSelectStep(idx)}
                >
                  <div className="step-timestamp-col">
                    <span className="timestamp-text">{step.timeStamp || `0${idx * 3}:00`}</span>
                    <span className="timestamp-bullet">{isDone ? '✓' : isCurrent ? '●' : '○'}</span>
                  </div>
                  <div className="step-info-col">
                    <div className="step-category-name">{step.category}</div>
                    <div className="step-title-name">{step.title}</div>
                    <div className="step-duration-tag">⏱ {step.durationMinutes} min</div>
                  </div>
                </button>
              );
            })}

            {/* Final Quiz Milestone Card */}
            <button
              type="button"
              className={`timeline-step-card quiz-milestone ${showQuiz ? 'active' : ''}`}
              onClick={() => setShowQuiz(true)}
            >
              <div className="step-timestamp-col">
                <span className="timestamp-text">{pathData.totalMinutes}:00</span>
                <span className="timestamp-bullet">🏆</span>
              </div>
              <div className="step-info-col">
                <div className="step-category-name">Self-Assessment</div>
                <div className="step-title-name">Rapid Sprint Quiz</div>
                <div className="step-duration-tag">Final Check</div>
              </div>
            </button>
          </div>
        </div>

        {/* Fast Concept Reader Card */}
        <div className="timemode-reader-panel">
          {activeTopicDetail ? (
            <div className="timemode-topic-content-card">
              <div className="topic-header-badges">
                <span className="topic-category-badge">
                  {activeTopicDetail.categoryIcon || '☕'} {activeTopicDetail.category || currentStep.category}
                </span>
                <span className="topic-read-badge">⏱ {activeTopicDetail.readTimeMinutes || 3} min read</span>
                {activeTopicDetail.timeComplexity && (
                  <span className="topic-complexity-badge time">⏱ {activeTopicDetail.timeComplexity}</span>
                )}
                {activeTopicDetail.spaceComplexity && (
                  <span className="topic-complexity-badge space">💾 {activeTopicDetail.spaceComplexity}</span>
                )}
              </div>

              <h2 className="timemode-topic-title">{activeTopicDetail.title}</h2>
              {activeTopicDetail.summary && (
                <p className="timemode-lead-summary">{activeTopicDetail.summary}</p>
              )}

              {/* Fast Explanation */}
              <div className="quickprep-concept-body">
                {activeTopicDetail.content ? (
                  activeTopicDetail.content.split('\n\n').map((para, i) => {
                    if (para.startsWith('### ')) {
                      return <h4 key={i} className="concept-subheading">{para.replace('### ', '')}</h4>;
                    }
                    if (para.startsWith('* ') || para.startsWith('- ')) {
                      const items = para.split('\n').map(l => l.replace(/^[\*\-]\s*/, ''));
                      return (
                        <ul key={i} className="concept-bullet-list">
                          {items.map((item, idx) => (
                            <li key={idx} dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                          ))}
                        </ul>
                      );
                    }
                    return (
                      <p key={i} className="concept-paragraph" dangerouslySetInnerHTML={{ __html: para.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                    );
                  })
                ) : (
                  <p>{activeTopicDetail.summary}</p>
                )}
              </div>

              {/* Java Snippet */}
              {activeTopicDetail.javaExample && (
                <div className="quickprep-code-box">
                  <div className="code-box-header">
                    <span>☕ Java Example</span>
                  </div>
                  <pre className="code-pre-block">
                    <code>{activeTopicDetail.javaExample}</code>
                  </pre>
                </div>
              )}

              {/* Remember Takeaway */}
              {activeTopicDetail.rememberPoint && (
                <div className="quickprep-alert-card remember-card">
                  <div className="alert-icon-col">⚡</div>
                  <div className="alert-text-col">
                    <h4 className="alert-heading">Things to Remember in the Exam</h4>
                    <p className="alert-body">{activeTopicDetail.rememberPoint}</p>
                  </div>
                </div>
              )}

              {/* Common Mistake Trap */}
              {activeTopicDetail.commonMistake && (
                <div className="quickprep-alert-card mistake-card">
                  <div className="alert-icon-col">⚠</div>
                  <div className="alert-text-col">
                    <h4 className="alert-heading">Common Mistake to Avoid</h4>
                    <p className="alert-body">{activeTopicDetail.commonMistake}</p>
                  </div>
                </div>
              )}

              {/* Bottom Step Switcher */}
              <div className="timemode-footer-controls">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handlePrevStep}
                  disabled={currentStepIndex === 0}
                >
                  ← Previous Topic
                </button>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleNextStep}
                >
                  {currentStepIndex < schedule.length - 1 ? 'Next Topic →' : 'Take Rapid Sprint Quiz ⚡'}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-muted-box">Loading topic revision content...</div>
          )}
        </div>
      </div>

      {/* Quiz Modal */}
      {showQuiz && (
        <QuickPrepQuizModal
          topicId={activeTopicDetail?.id}
          topicTitle={`${pathData.title} Quiz`}
          questions={activeTopicDetail?.quizQuestions || []}
          onClose={() => setShowQuiz(false)}
          onQuizCompleted={(res) => setQuizResult(res)}
        />
      )}
    </div>
  );
}
