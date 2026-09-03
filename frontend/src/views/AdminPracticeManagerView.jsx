import React, { useState, useEffect } from 'react';
import { adminPracticeApi } from '../api/client';
import { DifficultyBadge } from '../components/common/Badge';
import { useToast } from '../context/ToastContext';
import { EmptyState } from '../components/common/EmptyState';
import { Skeleton } from '../components/common/Skeleton';

export function AdminPracticeManagerView() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showWizard, setShowWizard] = useState(false);
  const [search, setSearch] = useState('');
  const toast = useToast();

  const loadQuestions = () => {
    setLoading(true);
    adminPracticeApi
      .listAll()
      .then((data) => {
        setQuestions(data);
        setLoading(false);
      })
      .catch((err) => {
        toast.error(err.message || 'Failed to load questions');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  const handleToggleActive = async (id, currentVal) => {
    try {
      await adminPracticeApi.toggleActive(id, !currentVal);
      toast.success(`Question ${!currentVal ? 'activated' : 'deactivated'}`);
      loadQuestions();
    } catch (err) {
      toast.error(err.message || 'Failed to toggle status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    try {
      await adminPracticeApi.deleteQuestion(id);
      toast.success('Question deleted from database');
      loadQuestions();
    } catch (err) {
      toast.error(err.message || 'Failed to delete question');
    }
  };

  const filtered = questions.filter(
    (q) =>
      q.title.toLowerCase().includes(search.toLowerCase()) ||
      (q.category && q.category.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="view-content-wrapper">
      <div className="admin-hero-header">
        <div>
          <span className="admin-tag">📝 Question Bank</span>
          <h1 className="admin-title">Practice Problem Authoring</h1>
          <p className="admin-subtitle">
            Curate coding problems, configure hidden execution test cases, and activate curriculum topics.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setShowWizard(true)}
        >
          + Create New Question
        </button>
      </div>

      {/* Search Bar */}
      <div className="admin-table-filter-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Filter questions by title or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="table-count-label">
          <strong>{filtered.length}</strong> questions in bank
        </div>
      </div>

      {/* Questions Table */}
      {loading ? (
        <div className="table-responsive-container">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Difficulty</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 4 }).map((_, i) => (
                <tr key={i}>
                  <td colSpan="5" style={{ padding: '16px' }}>
                    <Skeleton height="20px" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="📝"
          title="No questions found"
          description="No questions match your search or none have been created yet."
          actionLabel="+ Create First Question"
          onAction={() => setShowWizard(true)}
        />
      ) : (
        <div className="table-responsive-container">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Problem Title</th>
                <th>Category</th>
                <th>Difficulty</th>
                <th>Language</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((q) => (
                <tr key={q.id}>
                  <td>
                    <strong>{q.title}</strong>
                  </td>
                  <td>
                    <span className="topic-pill">{q.category || 'Java'}</span>
                  </td>
                  <td>
                    <DifficultyBadge difficulty={q.difficulty} />
                  </td>
                  <td>☕ {q.language || 'Java'}</td>
                  <td>
                    <button
                      type="button"
                      className={`status-toggle-pill ${q.active ? 'active' : 'inactive'}`}
                      onClick={() => handleToggleActive(q.id, q.active)}
                    >
                      {q.active ? '● Active' : '○ Draft'}
                    </button>
                  </td>
                  <td>
                    <div className="table-actions-group">
                      <button
                        type="button"
                        className="btn-icon-action danger"
                        onClick={() => handleDelete(q.id)}
                        title="Delete Question"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 6-Step Question Creation Wizard Modal */}
      {showWizard && (
        <QuestionCreationWizard
          onClose={() => setShowWizard(false)}
          onCreated={() => {
            setShowWizard(false);
            loadQuestions();
          }}
        />
      )}
    </div>
  );
}

// -------------------------------------------------------------
// 6-STEP QUESTION CREATION WIZARD
// -------------------------------------------------------------
function QuestionCreationWizard({ onClose, onCreated }) {
  const [step, setStep] = useState(1);
  const [busy, setBusy] = useState(false);
  const toast = useToast();

  const [formData, setFormData] = useState({
    title: '',
    category: 'Strings',
    subcategory: 'Manipulation',
    difficulty: 'EASY',
    language: 'Java',
    points: 5,
    description: '',
    constraints: '1 <= N <= 10^5\nAll characters are lowercase English letters.',
    inputFormat: 'A single string on standard input.',
    outputFormat: 'Print the computed result to standard output.',
    sampleInput: 'hello',
    sampleOutput: 'olleh',
    explanation: 'Characters are inverted in-place.',
    starterCode: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // TODO: Implement solution\n    }\n}`,
    testCaseInput: 'welcome',
    testCaseExpected: 'emoclew',
    testCaseHidden: true
  });

  const updateField = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handlePublish = async () => {
    setBusy(true);
    try {
      const payload = {
        title: formData.title,
        category: formData.category,
        subcategory: formData.subcategory,
        difficulty: formData.difficulty,
        language: formData.language,
        description: formData.description,
        constraints: formData.constraints,
        inputFormat: formData.inputFormat,
        outputFormat: formData.outputFormat,
        sampleInput: formData.sampleInput,
        sampleOutput: formData.sampleOutput,
        explanation: formData.explanation,
        starterCode: formData.starterCode,
        active: true
      };

      const created = await adminPracticeApi.createQuestion(payload);

      // Add test case if provided
      if (formData.testCaseInput && formData.testCaseExpected && created.id) {
        await adminPracticeApi.addTestCase(created.id, {
          input: formData.testCaseInput,
          expectedOutput: formData.testCaseExpected,
          hidden: formData.testCaseHidden,
          points: formData.difficulty === 'HARD' ? 15 : formData.difficulty === 'MEDIUM' ? 10 : 5
        });
      }

      toast.success('Question published successfully!');
      onCreated();
    } catch (err) {
      toast.error(err.message || 'Failed to create question');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="modal-backdrop-overlay" role="dialog" aria-modal="true">
      <div className="wizard-modal-card">
        {/* Wizard Header */}
        <div className="wizard-header">
          <div>
            <div className="wizard-tag">Step {step} of 6</div>
            <h2 className="wizard-title">
              {step === 1 && 'Basic Information'}
              {step === 2 && 'Problem Statement & Constraints'}
              {step === 3 && 'Sample Examples'}
              {step === 4 && 'Starter Code Boilerplate'}
              {step === 5 && 'Evaluation Test Cases'}
              {step === 6 && 'Review & Publish'}
            </h2>
          </div>
          <button type="button" className="modal-close-icon" onClick={onClose}>
            ×
          </button>
        </div>

        {/* Step Indicator Bar */}
        <div className="wizard-steps-track">
          {['Info', 'Problem', 'Examples', 'Code', 'Tests', 'Review'].map((label, idx) => (
            <div
              key={label}
              className={`wizard-step-node ${step === idx + 1 ? 'active' : step > idx + 1 ? 'completed' : ''}`}
              onClick={() => setStep(idx + 1)}
            >
              <div className="node-number">{step > idx + 1 ? '✓' : idx + 1}</div>
              <div className="node-label">{label}</div>
            </div>
          ))}
        </div>

        {/* Wizard Step Content */}
        <div className="wizard-body">
          {/* STEP 1: Basic Information */}
          {step === 1 && (
            <div className="wizard-form-grid">
              <div className="form-group full-width">
                <label>Problem Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Valid Anagram Checker"
                  value={formData.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Topic Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => updateField('category', e.target.value)}
                >
                  <option value="Strings">Strings</option>
                  <option value="Arrays">Arrays</option>
                  <option value="Linked Lists">Linked Lists</option>
                  <option value="Stack">Stack</option>
                  <option value="Queue">Queue</option>
                  <option value="Hashing">Hashing</option>
                  <option value="Searching">Searching</option>
                  <option value="Sorting">Sorting</option>
                  <option value="Recursion">Recursion</option>
                  <option value="Trees">Trees</option>
                  <option value="Graphs">Graphs</option>
                  <option value="Dynamic Programming">Dynamic Programming</option>
                </select>
              </div>

              <div className="form-group">
                <label>Difficulty</label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => updateField('difficulty', e.target.value)}
                >
                  <option value="EASY">Easy (5 pts)</option>
                  <option value="MEDIUM">Medium (10 pts)</option>
                  <option value="HARD">Hard (15 pts)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Programming Language</label>
                <input type="text" value="Java 17 (OpenJDK)" disabled />
              </div>

              <div className="form-group">
                <label>Subcategory Tag</label>
                <input
                  type="text"
                  placeholder="e.g. Sliding Window"
                  value={formData.subcategory}
                  onChange={(e) => updateField('subcategory', e.target.value)}
                />
              </div>
            </div>
          )}

          {/* STEP 2: Problem Description */}
          {step === 2 && (
            <div className="wizard-form-grid">
              <div className="form-group full-width">
                <label>Problem Description & Task *</label>
                <textarea
                  rows="4"
                  placeholder="Clearly describe the objective of the problem and requirements..."
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Input Format</label>
                <textarea
                  rows="2"
                  value={formData.inputFormat}
                  onChange={(e) => updateField('inputFormat', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Output Format</label>
                <textarea
                  rows="2"
                  value={formData.outputFormat}
                  onChange={(e) => updateField('outputFormat', e.target.value)}
                />
              </div>

              <div className="form-group full-width">
                <label>Constraints</label>
                <textarea
                  rows="2"
                  value={formData.constraints}
                  onChange={(e) => updateField('constraints', e.target.value)}
                />
              </div>
            </div>
          )}

          {/* STEP 3: Examples */}
          {step === 3 && (
            <div className="wizard-form-grid">
              <div className="form-group">
                <label>Sample Input 1</label>
                <textarea
                  rows="3"
                  value={formData.sampleInput}
                  onChange={(e) => updateField('sampleInput', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Sample Output 1</label>
                <textarea
                  rows="3"
                  value={formData.sampleOutput}
                  onChange={(e) => updateField('sampleOutput', e.target.value)}
                />
              </div>

              <div className="form-group full-width">
                <label>Sample Explanation</label>
                <textarea
                  rows="2"
                  placeholder="Explain step-by-step why the output is produced..."
                  value={formData.explanation}
                  onChange={(e) => updateField('explanation', e.target.value)}
                />
              </div>
            </div>
          )}

          {/* STEP 4: Starter Code */}
          {step === 4 && (
            <div className="wizard-form-grid">
              <div className="form-group full-width">
                <label>Java Starter Boilerplate</label>
                <textarea
                  rows="8"
                  className="font-mono-input"
                  value={formData.starterCode}
                  onChange={(e) => updateField('starterCode', e.target.value)}
                />
              </div>
            </div>
          )}

          {/* STEP 5: Test Cases */}
          {step === 5 && (
            <div className="wizard-form-grid">
              <div className="form-group">
                <label>Evaluation Test Case Input</label>
                <textarea
                  rows="3"
                  value={formData.testCaseInput}
                  onChange={(e) => updateField('testCaseInput', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Expected Output</label>
                <textarea
                  rows="3"
                  value={formData.testCaseExpected}
                  onChange={(e) => updateField('testCaseExpected', e.target.value)}
                />
              </div>

              <div className="form-group full-width">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.testCaseHidden}
                    onChange={(e) => updateField('testCaseHidden', e.target.checked)}
                  />
                  <span>
                    <strong>Hidden Test Case:</strong> Do not reveal input/output to candidates until evaluation.
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* STEP 6: Review & Publish */}
          {step === 6 && (
            <div className="wizard-review-pane">
              <div className="review-header-strip">
                <DifficultyBadge difficulty={formData.difficulty} />
                <span className="topic-pill">{formData.category}</span>
                <span className="topic-pill">{formData.language}</span>
              </div>

              <h3 className="review-title">{formData.title || 'Untitled Problem'}</h3>
              <p className="review-desc">{formData.description || 'No description provided.'}</p>

              <div className="review-sample-block">
                <div className="sample-col">
                  <strong>Sample Input:</strong>
                  <pre>{formData.sampleInput}</pre>
                </div>
                <div className="sample-col">
                  <strong>Sample Output:</strong>
                  <pre>{formData.sampleOutput}</pre>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Wizard Footer Navigation */}
        <div className="wizard-footer">
          <button
            type="button"
            className="btn btn-secondary"
            disabled={step === 1}
            onClick={() => setStep((s) => Math.max(1, s - 1))}
          >
            ← Previous
          </button>

          {step < 6 ? (
            <button
              type="button"
              className="btn btn-primary"
              disabled={step === 1 && !formData.title.trim()}
              onClick={() => setStep((s) => Math.min(6, s + 1))}
            >
              Next Step →
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary"
              disabled={busy || !formData.title.trim()}
              onClick={handlePublish}
            >
              {busy ? 'Publishing...' : '✓ Publish Question to Arena'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
