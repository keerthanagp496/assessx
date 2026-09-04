import React, { useState } from 'react';
import { quickprepApi } from '../api/client';

export function QuickPrepQuizModal({ topicId, topicTitle, questions = [], onClose, onQuizCompleted }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [revealed, setRevealed] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  // Fallback questions if none provided
  const quizQuestions = questions.length > 0 ? questions : [
    {
      id: 101,
      question: 'Which data structure follows LIFO (Last-In-First-Out) ordering?',
      optionsJson: JSON.stringify(['Queue', 'Stack', 'Array', 'HashMap']),
      correctOption: 'Stack',
      explanation: 'Stack strictly follows LIFO order where the last pushed element is the first to be popped.',
      questionType: 'MCQ'
    },
    {
      id: 102,
      question: 'What is the average time complexity of searching a key in a HashMap?',
      optionsJson: JSON.stringify(['O(1)', 'O(log N)', 'O(N)', 'O(N log N)']),
      correctOption: 'O(1)',
      explanation: 'HashMap computes bucket index in O(1) constant time on average using the key\'s hashCode().',
      questionType: 'COMPLEXITY'
    },
    {
      id: 103,
      question: 'Which traversal on a Binary Search Tree (BST) visits keys in strictly sorted ascending order?',
      optionsJson: JSON.stringify(['Preorder', 'Inorder', 'Postorder', 'Level Order']),
      correctOption: 'Inorder',
      explanation: 'Inorder traversal processes Left Subtree (smaller) -> Root -> Right Subtree (larger), generating sorted order.',
      questionType: 'MCQ'
    }
  ];

  const currentQ = quizQuestions[currentIndex];
  let options = [];
  try {
    options = typeof currentQ.optionsJson === 'string'
      ? JSON.parse(currentQ.optionsJson)
      : (currentQ.optionsJson || ['A', 'B', 'C', 'D']);
  } catch (_) {
    options = ['Option A', 'Option B', 'Option C', 'Option D'];
  }

  const handleSelectOption = (option) => {
    if (result) return;
    setSelectedAnswers(prev => ({ ...prev, [currentQ.id]: option }));
    setRevealed(prev => ({ ...prev, [currentQ.id]: true }));
  };

  const handleNext = () => {
    if (currentIndex < quizQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const answersList = quizQuestions.map(q => ({
      questionId: q.id,
      selectedOption: selectedAnswers[q.id] || ''
    }));

    try {
      const res = await quickprepApi.submitQuiz({
        topicId: topicId || null,
        answers: answersList
      });
      setResult(res);
      onQuizCompleted?.(res);
    } catch (_) {
      // Local calculation fallback
      let correct = 0;
      quizQuestions.forEach(q => {
        if ((selectedAnswers[q.id] || '').trim().toLowerCase() === (q.correctOption || '').trim().toLowerCase()) {
          correct++;
        }
      });
      const pct = Math.round((correct / quizQuestions.length) * 100);
      const res = {
        total: quizQuestions.length,
        score: correct,
        percentage: pct,
        strongTopics: pct >= 70 ? ['Core Java', 'Data Structures'] : ['Basic Concepts'],
        weakTopics: pct < 70 ? ['Traversals & Complexities'] : [],
        recommendations: pct >= 80
          ? ['Great job! You are exam-ready for this topic.']
          : ['Revise code syntax and Big-O complexities before taking the test.']
      };
      setResult(res);
      onQuizCompleted?.(res);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop-blur">
      <div className="quickprep-quiz-modal-card">
        {/* Modal Header */}
        <div className="modal-header-row">
          <div className="quiz-title-badge">
            <span className="quiz-lightning-icon">⚡</span>
            <div>
              <h3 className="quiz-modal-title">Rapid Java & DSA Quiz</h3>
              <p className="quiz-modal-subtitle">{topicTitle || 'Self-Assessment Challenge'}</p>
            </div>
          </div>
          <button type="button" className="btn-modal-close" onClick={onClose}>✕</button>
        </div>

        {result ? (
          /* Quiz Results Summary Screen */
          <div className="quiz-results-view">
            <div className="quiz-score-circle-wrapper">
              <div className="quiz-score-circle">
                <span className="score-number">{result.score}/{result.total}</span>
                <span className="score-percentage">{result.percentage}%</span>
              </div>
              <h4 className="result-headline">
                {result.percentage >= 80 ? '🎉 Exam Ready!' : result.percentage >= 50 ? '👍 Good Progress' : '⚡ Revision Recommended'}
              </h4>
            </div>

            <div className="result-diagnostic-grid">
              <div className="diagnostic-box strong-box">
                <span className="box-title">💪 Strong Concepts</span>
                <div className="tag-cluster">
                  {(result.strongTopics || ['Java Core']).map((t, idx) => (
                    <span key={idx} className="badge-strong">✓ {t}</span>
                  ))}
                </div>
              </div>

              <div className="diagnostic-box weak-box">
                <span className="box-title">🎯 Topics to Revise</span>
                <div className="tag-cluster">
                  {(result.weakTopics && result.weakTopics.length > 0 ? result.weakTopics : ['None! All clear']).map((t, idx) => (
                    <span key={idx} className="badge-revise">⚡ {t}</span>
                  ))}
                </div>
              </div>
            </div>

            {result.recommendations && (
              <div className="quiz-recommendation-note">
                <strong>💡 QuickPrep Advice:</strong> {result.recommendations[0]}
              </div>
            )}

            <div className="quiz-modal-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setResult(null);
                  setCurrentIndex(0);
                  setSelectedAnswers({});
                  setRevealed({});
                }}
              >
                🔄 Retake Quiz
              </button>
              <button type="button" className="btn btn-primary" onClick={onClose}>
                ✓ Complete & Return to Topic
              </button>
            </div>
          </div>
        ) : (
          /* Active Question Step */
          <div className="quiz-question-view">
            {/* Step Progress Bar */}
            <div className="quiz-progress-indicator-bar">
              <div className="progress-text-line">
                <span>Question {currentIndex + 1} of {quizQuestions.length}</span>
                <span className="question-type-badge">{currentQ.questionType || 'MCQ'}</span>
              </div>
              <div className="quiz-progress-track">
                <div
                  className="quiz-progress-fill"
                  style={{ width: `${((currentIndex + 1) / quizQuestions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Text */}
            <div className="quiz-question-body">
              <p className="question-prompt-text">{currentQ.question}</p>

              {/* Options */}
              <div className="quiz-options-list">
                {options.map((opt, i) => {
                  const isSelected = selectedAnswers[currentQ.id] === opt;
                  const isCorrect = (currentQ.correctOption || '').trim().toLowerCase() === opt.trim().toLowerCase();
                  const showFeedback = revealed[currentQ.id];

                  let optionClass = 'quiz-option-card';
                  if (isSelected) optionClass += ' selected';
                  if (showFeedback) {
                    if (isCorrect) optionClass += ' correct';
                    else if (isSelected && !isCorrect) optionClass += ' incorrect';
                  }

                  return (
                    <button
                      key={i}
                      type="button"
                      className={optionClass}
                      onClick={() => handleSelectOption(opt)}
                    >
                      <span className="option-bullet-letter">{String.fromCharCode(65 + i)}</span>
                      <span className="option-label-text">{opt}</span>
                      {showFeedback && isCorrect && <span className="feedback-check">✓</span>}
                      {showFeedback && isSelected && !isCorrect && <span className="feedback-cross">✗</span>}
                    </button>
                  );
                })}
              </div>

              {/* Reveal Explanation if answered */}
              {revealed[currentQ.id] && currentQ.explanation && (
                <div className="quiz-explanation-box">
                  <strong>💡 Rationale:</strong> {currentQ.explanation}
                </div>
              )}
            </div>

            {/* Footer Navigation */}
            <div className="quiz-footer-nav-row">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handlePrev}
                disabled={currentIndex === 0}
              >
                ← Previous
              </button>

              {currentIndex < quizQuestions.length - 1 ? (
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={handleNext}
                >
                  Next Question →
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-success btn-sm"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Calculating...' : '⚡ Submit Quiz & View Score'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
