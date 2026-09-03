import React, { useState, useEffect } from 'react';
import { practiceApi } from '../api/client';
import { DifficultyBadge, PointsBadge } from '../components/common/Badge';
import { CodeEditor } from '../components/common/CodeEditor';
import { ConsoleOutput } from '../components/common/ConsoleOutput';
import { useToast } from '../context/ToastContext';

export function PracticeWorkspace({ problemId, user, onBack }) {
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [busyRun, setBusyRun] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);
  const [mobileTab, setMobileTab] = useState('problem'); // 'problem' | 'editor' | 'console'
  const toast = useToast();

  useEffect(() => {
    let active = true;
    setLoading(true);
    practiceApi
      .getQuestion(problemId)
      .then((data) => {
        if (active) {
          setProblem(data);
          setCode(data.starterCode || `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Write your Java solution here\n    }\n}`);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (active) {
          toast.error(err.message || 'Failed to load problem statement');
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [problemId]);

  const handleRunCode = async (isSubmit = false) => {
    if (!problem) return;
    setBusyRun(true);
    setExecutionResult(null);

    // On mobile, switch to console tab to view result
    if (window.innerWidth <= 860) {
      setMobileTab('console');
    }

    try {
      const payload = {
        language: 'java',
        code
      };

      const res = isSubmit
        ? await practiceApi.submitCode(problem.id, user.id, payload)
        : await practiceApi.runCode(problem.id, payload);

      setExecutionResult(res);

      if (isSubmit) {
        if (res.passed || res.status === 'ACCEPTED' || (res.totalTests > 0 && res.passedTests === res.totalTests)) {
          toast.success('🎉 Solution Accepted! Points added to your profile.');
        } else {
          toast.warning('Solution did not pass all evaluation test cases.');
        }
      } else {
        toast.info('Code execution completed.');
      }
    } catch (err) {
      setExecutionResult({
        status: 'ERROR',
        error: err.message || 'Execution error'
      });
      toast.error(err.message || 'Failed to execute code');
    } finally {
      setBusyRun(false);
    }
  };

  const handleResetCode = () => {
    if (!problem) return;
    if (window.confirm('Reset code to initial starter template?')) {
      setCode(problem.starterCode || '');
      setExecutionResult(null);
      toast.info('Code reset to starter boilerplate');
    }
  };

  if (loading) {
    return (
      <div className="view-content-wrapper flex-center">
        <div className="loading-spinner-box">
          <span className="spinner-icon">⟳</span>
          <p>Loading Java Problem Workspace...</p>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="view-content-wrapper flex-center">
        <div className="error-banner-card">
          <p>Problem could not be loaded.</p>
          <button type="button" className="btn btn-secondary" onClick={onBack}>
            ← Back to Practice Arena
          </button>
        </div>
      </div>
    );
  }

  const points = problem.difficulty === 'HARD' ? 15 : problem.difficulty === 'MEDIUM' ? 10 : 5;

  return (
    <div className="workspace-fullscreen-layout">
      {/* Workspace Top Control Bar */}
      <div className="workspace-topbar">
        <div className="workspace-topbar-left">
          <button
            type="button"
            className="btn-back"
            onClick={onBack}
            title="Back to problem list"
          >
            ← Practice Arena
          </button>
          <div className="workspace-title-group">
            <h1 className="workspace-problem-title">{problem.title}</h1>
            <DifficultyBadge difficulty={problem.difficulty} />
            <PointsBadge points={points} />
          </div>
        </div>

        {/* Mobile Tab Switcher */}
        <div className="workspace-mobile-tab-switch">
          <button
            type="button"
            className={`ws-tab-btn ${mobileTab === 'problem' ? 'active' : ''}`}
            onClick={() => setMobileTab('problem')}
          >
            📄 Statement
          </button>
          <button
            type="button"
            className={`ws-tab-btn ${mobileTab === 'editor' ? 'active' : ''}`}
            onClick={() => setMobileTab('editor')}
          >
            💻 Editor
          </button>
          <button
            type="button"
            className={`ws-tab-btn ${mobileTab === 'console' ? 'active' : ''}`}
            onClick={() => setMobileTab('console')}
          >
            ⚡ Console {executionResult ? '●' : ''}
          </button>
        </div>

        {/* Desktop Code Actions */}
        <div className="workspace-topbar-actions">
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            disabled={busyRun}
            onClick={() => handleRunCode(false)}
          >
            {busyRun ? '⟳ Compiling...' : '▶ Run Code'}
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            disabled={busyRun}
            onClick={() => handleRunCode(true)}
          >
            {busyRun ? '⟳ Evaluating...' : 'Submit Solution'}
          </button>
        </div>
      </div>

      {/* Main 2-Pane Split Area (Problem ~40% | Editor + Console ~60%) */}
      <div className="workspace-split-container">
        {/* Left Pane: Problem Statement */}
        <div className={`workspace-statement-pane ${mobileTab !== 'problem' ? 'mobile-hidden' : ''}`}>
          <div className="statement-scroll-content">
            <div className="statement-tags-row">
              <span className="topic-pill">{problem.category || 'Java Basics'}</span>
              {problem.subcategory && (
                <span className="topic-pill">{problem.subcategory}</span>
              )}
              <span className="topic-pill">Java 17</span>
            </div>

            <div className="statement-section">
              <h2 className="statement-section-heading">Problem Description</h2>
              <div className="statement-text">{problem.description}</div>
            </div>

            {problem.inputFormat && (
              <div className="statement-section">
                <h3 className="statement-subheading">Input Format</h3>
                <div className="statement-text">{problem.inputFormat}</div>
              </div>
            )}

            {problem.outputFormat && (
              <div className="statement-section">
                <h3 className="statement-subheading">Output Format</h3>
                <div className="statement-text">{problem.outputFormat}</div>
              </div>
            )}

            {problem.sampleInput && (
              <div className="statement-section">
                <h3 className="statement-subheading">Sample Example 1</h3>
                <div className="example-box">
                  <div className="example-field">
                    <span className="example-label">Sample Input:</span>
                    <pre className="example-code">{problem.sampleInput}</pre>
                  </div>
                  <div className="example-field">
                    <span className="example-label">Sample Output:</span>
                    <pre className="example-code">{problem.sampleOutput}</pre>
                  </div>
                  {problem.explanation && (
                    <div className="example-field">
                      <span className="example-label">Explanation:</span>
                      <p className="example-explanation">{problem.explanation}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {problem.constraints && (
              <div className="statement-section">
                <h3 className="statement-subheading">Constraints</h3>
                <div className="constraints-box">
                  <pre>{problem.constraints}</pre>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Pane: Code Editor + Output Console */}
        <div className={`workspace-editor-pane ${mobileTab === 'problem' ? 'mobile-hidden' : ''}`}>
          <div className={`editor-sub-pane ${mobileTab === 'console' ? 'mobile-hidden' : ''}`}>
            <CodeEditor
              value={code}
              onChange={setCode}
              language="Java"
              onReset={handleResetCode}
              disabled={busyRun}
              minHeight="340px"
            />
          </div>

          <div className={`console-sub-pane ${mobileTab === 'editor' ? 'mobile-hidden' : ''}`}>
            <ConsoleOutput
              isCompiling={busyRun}
              result={executionResult}
              onClear={() => setExecutionResult(null)}
              sampleInput={problem.sampleInput}
              sampleOutput={problem.sampleOutput}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
