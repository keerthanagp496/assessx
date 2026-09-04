import React, { useState, useEffect } from 'react';
import { quickprepApi } from '../api/client';
import { QuickPrepQuizModal } from './QuickPrepQuizModal';

export function QuickPrepTopicView({ topicId, user, onBack, onNavigateTopic, allTopics = [] }) {
  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    quickprepApi.getTopic(topicId)
      .then((data) => {
        if (mounted) {
          setTopic(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) {
          const fallback = allTopics.find(t => t.id === topicId) || allTopics[0];
          setTopic(fallback);
          setLoading(false);
        }
      });

    // Load bookmark and progress status
    if (user?.id) {
      quickprepApi.getBookmarks(user.id)
        .then((bookmarks) => {
          if (mounted) {
            setIsBookmarked(bookmarks.some(b => b.topicId === topicId));
          }
        }).catch(() => {});

      quickprepApi.getProgress(user.id)
        .then((progressList) => {
          if (mounted) {
            const entry = progressList.find(p => p.topicId === topicId);
            setIsCompleted(entry ? entry.completed : false);
          }
        }).catch(() => {});
    }

    return () => {
      mounted = false;
    };
  }, [topicId, user?.id, allTopics]);

  const handleToggleBookmark = async () => {
    if (!user?.id || !topic) return;
    try {
      const res = await quickprepApi.toggleBookmark({
        userId: user.id,
        topicId: topic.id
      });
      setIsBookmarked(res.bookmarked);
    } catch (_) {
      setIsBookmarked(!isBookmarked);
    }
  };

  const handleToggleComplete = async () => {
    if (!user?.id || !topic) return;
    const nextVal = !isCompleted;
    setIsCompleted(nextVal);
    try {
      await quickprepApi.saveProgress({
        userId: user.id,
        topicId: topic.id,
        completed: nextVal
      });
    } catch (_) {
      // Offline fallback state kept in React state
    }
  };

  const handleCopyCode = () => {
    if (!topic?.javaExample) return;
    navigator.clipboard.writeText(topic.javaExample);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Compute Previous and Next Topics
  const currentIndex = allTopics.findIndex(t => t.id === (topic?.id || topicId));
  const prevTopic = currentIndex > 0 ? allTopics[currentIndex - 1] : null;
  const nextTopic = currentIndex >= 0 && currentIndex < allTopics.length - 1 ? allTopics[currentIndex + 1] : null;

  if (loading || !topic) {
    return (
      <div className="view-content-wrapper">
        <div className="quickprep-topic-skeleton">
          <div className="skeleton-bar" style={{ width: '30%', height: '24px' }}></div>
          <div className="skeleton-bar" style={{ width: '60%', height: '36px', marginTop: '16px' }}></div>
          <div className="skeleton-bar" style={{ width: '100%', height: '200px', marginTop: '24px' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="view-content-wrapper">
      {/* Top Breadcrumb & Quick Controls */}
      <div className="quickprep-topic-header-bar">
        <button type="button" className="btn-back-link" onClick={onBack}>
          ← Back to QuickPrep Hub
        </button>

        <div className="topic-meta-actions">
          <button
            type="button"
            className={`btn-bookmark-pill ${isBookmarked ? 'active' : ''}`}
            onClick={handleToggleBookmark}
            title={isBookmarked ? 'Remove Bookmark' : 'Bookmark for later'}
          >
            {isBookmarked ? '⭐ Saved' : '☆ Save Topic'}
          </button>

          <button
            type="button"
            className={`btn-complete-pill ${isCompleted ? 'completed' : ''}`}
            onClick={handleToggleComplete}
          >
            {isCompleted ? '✓ Completed' : '○ Mark as Reviewed'}
          </button>

          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => setShowQuizModal(true)}
          >
            ⚡ Rapid Quiz ({topic.quizQuestions?.length || 3})
          </button>
        </div>
      </div>

      {/* Main Topic Revision Card */}
      <article className="quickprep-topic-container">
        {/* Category & Complexity Badges */}
        <div className="topic-header-badges">
          <span className="topic-category-badge">
            {topic.categoryIcon || '☕'} {topic.category || 'Core Java'}
          </span>
          <span className="topic-read-badge">⏱️ {topic.readTimeMinutes || 3} min revision</span>
          {topic.timeComplexity && (
            <span className="topic-complexity-badge time">
              ⏱ {topic.timeComplexity}
            </span>
          )}
          {topic.spaceComplexity && (
            <span className="topic-complexity-badge space">
              💾 {topic.spaceComplexity}
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="quickprep-topic-title">{topic.title}</h1>
        {topic.summary && (
          <p className="quickprep-topic-lead">{topic.summary}</p>
        )}

        {/* Core Concept Content Body */}
        <div className="quickprep-concept-body">
          {topic.content ? (
            topic.content.split('\n\n').map((para, i) => {
              if (para.startsWith('### ')) {
                return <h3 key={i} className="concept-subheading">{para.replace('### ', '')}</h3>;
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
            <p className="concept-paragraph">{topic.summary}</p>
          )}
        </div>

        {/* Java Example Code Block */}
        {topic.javaExample && (
          <div className="quickprep-code-box">
            <div className="code-box-header">
              <div className="code-lang-label">
                <span>☕ Java Snippet</span>
              </div>
              <button
                type="button"
                className="btn-copy-code"
                onClick={handleCopyCode}
              >
                {copiedCode ? '✓ Copied' : '📋 Copy Code'}
              </button>
            </div>
            <pre className="code-pre-block">
              <code>{topic.javaExample}</code>
            </pre>
          </div>
        )}

        {/* ⚡ Important Exam Point Alert */}
        {topic.rememberPoint && (
          <div className="quickprep-alert-card remember-card">
            <div className="alert-icon-col">⚡</div>
            <div className="alert-text-col">
              <h4 className="alert-heading">Things to Remember in the Exam</h4>
              <p className="alert-body">{topic.rememberPoint}</p>
            </div>
          </div>
        )}

        {/* ⚠ Common Mistake Alert */}
        {topic.commonMistake && (
          <div className="quickprep-alert-card mistake-card">
            <div className="alert-icon-col">⚠</div>
            <div className="alert-text-col">
              <h4 className="alert-heading">Common Trap & Mistake to Avoid</h4>
              <p className="alert-body">{topic.commonMistake}</p>
            </div>
          </div>
        )}

        {/* Bottom Pagination & Navigation Controls */}
        <div className="topic-bottom-navigation-bar">
          {prevTopic ? (
            <button
              type="button"
              className="btn btn-secondary btn-nav-topic"
              onClick={() => onNavigateTopic(prevTopic.id)}
            >
              ← Previous: {prevTopic.title}
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            className="btn btn-primary btn-quiz-cta"
            onClick={() => setShowQuizModal(true)}
          >
            ⚡ Test Yourself with Rapid Quiz →
          </button>

          {nextTopic ? (
            <button
              type="button"
              className="btn btn-secondary btn-nav-topic"
              onClick={() => onNavigateTopic(nextTopic.id)}
            >
              Next: {nextTopic.title} →
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-secondary btn-nav-topic"
              onClick={onBack}
            >
              ✓ Complete Path & Return
            </button>
          )}
        </div>
      </article>

      {/* Rapid Quiz Modal */}
      {showQuizModal && (
        <QuickPrepQuizModal
          topicId={topic.id}
          topicTitle={topic.title}
          questions={topic.quizQuestions || []}
          onClose={() => setShowQuizModal(false)}
          onQuizCompleted={(res) => {
            if (res.percentage >= 60) {
              handleToggleComplete();
            }
          }}
        />
      )}
    </div>
  );
}
