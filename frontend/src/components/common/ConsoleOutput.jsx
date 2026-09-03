import React, { useState } from 'react';

export function ConsoleOutput({
  isCompiling = false,
  result = null,
  rawOutput = '',
  onClear,
  sampleInput = '',
  sampleOutput = ''
}) {
  const [activeTab, setActiveTab] = useState('output'); // 'output' | 'testcases' | 'errors'

  // Parse result payload from backend if present
  let status = null;
  let passedCount = 0;
  let totalCount = 0;
  let runtime = null;
  let memory = null;
  let stdout = '';
  let stderr = '';
  let pointsAwarded = null;

  if (result) {
    if (typeof result === 'object') {
      status = result.status || (result.passed ? 'ACCEPTED' : 'COMPLETED');
      passedCount = result.passedTests ?? result.passedCount ?? 0;
      totalCount = result.totalTests ?? result.totalCount ?? 0;
      runtime = result.runtime || result.executionTime || '0.24s';
      memory = result.memory || '81 MB';
      stdout = result.output || result.stdout || '';
      stderr = result.error || result.stderr || '';
      pointsAwarded = result.pointsEarned ?? result.pointsAwarded ?? null;
    } else if (typeof result === 'string') {
      try {
        const parsed = JSON.parse(result);
        status = parsed.status || (parsed.passed ? 'ACCEPTED' : 'COMPLETED');
        passedCount = parsed.passedTests ?? parsed.passedCount ?? 0;
        totalCount = parsed.totalTests ?? parsed.totalCount ?? 0;
        runtime = parsed.runtime || parsed.executionTime || '0.24s';
        memory = parsed.memory || '81 MB';
        stdout = parsed.output || parsed.stdout || '';
        stderr = parsed.error || parsed.stderr || '';
        pointsAwarded = parsed.pointsEarned ?? parsed.pointsAwarded ?? null;
      } catch (_) {
        stdout = result;
      }
    }
  } else if (rawOutput) {
    stdout = rawOutput;
  }

  const isAccepted = status === 'ACCEPTED' || (totalCount > 0 && passedCount === totalCount);
  const isWrongAnswer = status === 'WRONG_ANSWER' || (totalCount > 0 && passedCount < totalCount);
  const hasError = Boolean(stderr || (status && status.includes('ERROR')));

  return (
    <div className="console-panel">
      {/* Console Header / Tabs */}
      <div className="console-header">
        <div className="console-tabs">
          <button
            type="button"
            className={`console-tab ${activeTab === 'output' ? 'active' : ''}`}
            onClick={() => setActiveTab('output')}
          >
            Terminal Output
          </button>
          <button
            type="button"
            className={`console-tab ${activeTab === 'testcases' ? 'active' : ''}`}
            onClick={() => setActiveTab('testcases')}
          >
            Test Cases {totalCount > 0 ? `(${passedCount}/${totalCount})` : ''}
          </button>
          {hasError && (
            <button
              type="button"
              className={`console-tab error-tab ${activeTab === 'errors' ? 'active' : ''}`}
              onClick={() => setActiveTab('errors')}
            >
              ⚠ Errors
            </button>
          )}
        </div>

        <div className="console-actions">
          {onClear && (stdout || stderr || result) && (
            <button type="button" className="btn-icon-tiny" onClick={onClear} title="Clear Console">
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Console Body */}
      <div className="console-body">
        {isCompiling ? (
          <div className="compiling-state">
            <span className="spinner-icon">⟳</span>
            <div>
              <div className="compiling-title">Compiling Java...</div>
              <small className="compiling-desc">Executing code in OpenJDK 17 sandbox container</small>
            </div>
          </div>
        ) : (
          <>
            {/* Verdict Status Banner */}
            {status && (
              <div className={`verdict-banner ${isAccepted ? 'accepted' : isWrongAnswer ? 'wrong-answer' : 'error'}`}>
                <div className="verdict-main">
                  <span className="verdict-icon">
                    {isAccepted ? '✓' : isWrongAnswer ? '✗' : '⚠'}
                  </span>
                  <div>
                    <span className="verdict-text">
                      {isAccepted
                        ? 'Accepted'
                        : isWrongAnswer
                        ? 'Wrong Answer'
                        : status}
                    </span>
                    {totalCount > 0 && (
                      <span className="verdict-count">
                        ({passedCount} / {totalCount} test cases passed)
                      </span>
                    )}
                  </div>
                </div>

                <div className="verdict-stats">
                  {pointsAwarded !== null && (
                    <span className="stat-pill points">+{pointsAwarded} pts</span>
                  )}
                  {runtime && <span className="stat-pill">⚡ {runtime}</span>}
                  {memory && <span className="stat-pill">💾 {memory}</span>}
                </div>
              </div>
            )}

            {/* TAB 1: Terminal Output */}
            {activeTab === 'output' && (
              <div className="terminal-view">
                {stdout ? (
                  <pre className="terminal-content">{stdout}</pre>
                ) : (
                  <div className="terminal-placeholder">
                    <span>Press <strong>Run Code</strong> to execute with sample test cases, or <strong>Submit</strong> to evaluate all tests.</span>
                  </div>
                )}
                {stderr && (
                  <div className="stderr-block">
                    <div className="stderr-title">Compiler / Error Output:</div>
                    <pre className="stderr-content">{stderr}</pre>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: Test Cases */}
            {activeTab === 'testcases' && (
              <div className="testcases-view">
                {sampleInput || sampleOutput ? (
                  <div className="testcase-card">
                    <div className="testcase-header">
                      <span className="testcase-badge">Sample Test 1</span>
                      {status && (
                        <span className={`testcase-status ${isAccepted ? 'pass' : 'fail'}`}>
                          {isAccepted ? '✓ Passed' : 'Test Evaluated'}
                        </span>
                      )}
                    </div>
                    {sampleInput && (
                      <div className="testcase-field">
                        <label>Input:</label>
                        <pre>{sampleInput}</pre>
                      </div>
                    )}
                    {sampleOutput && (
                      <div className="testcase-field">
                        <label>Expected Output:</label>
                        <pre>{sampleOutput}</pre>
                      </div>
                    )}
                    {stdout && (
                      <div className="testcase-field">
                        <label>Your Output:</label>
                        <pre>{stdout}</pre>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="terminal-placeholder">
                    <span>No public test case data specified. Submit solution to evaluate against test suites.</span>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: Errors */}
            {activeTab === 'errors' && (
              <div className="error-view">
                <div className="error-box">
                  <div className="error-header">
                    <span>⚠ Compilation / Runtime Diagnostic</span>
                  </div>
                  <pre className="error-body">{stderr || 'No runtime errors reported.'}</pre>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
