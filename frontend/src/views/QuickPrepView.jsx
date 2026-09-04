import React, { useState, useEffect } from 'react';
import { quickprepApi } from '../api/client';
import { Skeleton } from '../components/common/Skeleton';

export function QuickPrepView({ user, onSelectTopic, onStartTimeMode }) {
  const [categories, setCategories] = useState([]);
  const [topics, setTopics] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [progressList, setProgressList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('quickprep_recent') || '[]');
    } catch (_) {
      return [];
    }
  });

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 250);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Load Categories & Topics
  useEffect(() => {
    let mounted = true;
    setLoading(true);

    Promise.all([
      quickprepApi.getCategories().catch(() => []),
      quickprepApi.getTopics().catch(() => []),
      user?.id ? quickprepApi.getBookmarks(user.id).catch(() => []) : Promise.resolve([]),
      user?.id ? quickprepApi.getProgress(user.id).catch(() => []) : Promise.resolve([])
    ]).then(([cats, topList, bmarks, prog]) => {
      if (mounted) {
        setCategories(cats);
        setTopics(topList);
        setBookmarks(bmarks);
        setProgressList(prog);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
    };
  }, [user?.id]);

  // Fetch search results when debounced query changes
  useEffect(() => {
    let mounted = true;
    if (debouncedQuery.trim()) {
      quickprepApi.searchTopics(debouncedQuery)
        .then((res) => {
          if (mounted) setTopics(res);
        })
        .catch(() => {});
    } else {
      quickprepApi.getTopics(selectedCategory)
        .then((res) => {
          if (mounted) setTopics(res);
        })
        .catch(() => {});
    }

    return () => {
      mounted = false;
    };
  }, [debouncedQuery, selectedCategory]);

  const handleSelectTopicWithRecent = (topic) => {
    // Add to recently viewed
    const updated = [topic, ...recentlyViewed.filter(t => t.id !== topic.id)].slice(0, 5);
    setRecentlyViewed(updated);
    try {
      localStorage.setItem('quickprep_recent', JSON.stringify(updated));
    } catch (_) {}
    onSelectTopic(topic.id);
  };

  const handleToggleBookmark = async (e, topicId) => {
    e.stopPropagation();
    if (!user?.id) return;
    try {
      const res = await quickprepApi.toggleBookmark({ userId: user.id, topicId });
      if (res.bookmarked) {
        const topic = topics.find(t => t.id === topicId);
        if (topic) setBookmarks(prev => [topic, ...prev]);
      } else {
        setBookmarks(prev => prev.filter(b => b.topicId !== topicId && b.id !== topicId));
      }
    } catch (_) {
      // Offline fallback
      setBookmarks(prev => {
        const exists = prev.some(b => b.topicId === topicId || b.id === topicId);
        if (exists) return prev.filter(b => b.topicId !== topicId && b.id !== topicId);
        const t = topics.find(t => t.id === topicId);
        return t ? [t, ...prev] : prev;
      });
    }
  };

  // Filter topics by category if selected
  const displayTopics = selectedCategory
    ? topics.filter(t => t.categoryId === selectedCategory || t.category === categories.find(c => c.id === selectedCategory)?.name)
    : topics;

  // Calculate stats
  const completedCount = progressList.filter(p => p.completed).length;
  const totalTopicCount = topics.length || 24;
  const overallProgressPct = Math.round((completedCount / totalTopicCount) * 100);

  // Time Sprint presets
  const timePresets = [
    { key: '10min', label: '10 MIN', desc: 'Power Blitz' },
    { key: '20min', label: '20 MIN', desc: 'Standard Revision' },
    { key: '30min', label: '30 MIN', desc: 'In-Depth Track' },
    { key: '1hour', label: '1 HOUR', desc: 'Masterclass' },
    { key: '2hours', label: '2 HOURS', desc: 'Full Camp' }
  ];

  return (
    <div className="view-content-wrapper quickprep-hub-wrapper">
      {/* Hero Header Section */}
      <div className="quickprep-hero-banner">
        <div className="hero-content-col">
          <div className="quickprep-badge-line">
            <span className="badge-flash-icon">⚡</span>
            <span className="badge-flash-text">LAST-MINUTE REVISION CENTER</span>
          </div>
          <h1 className="quickprep-main-heading">
            Revise Java & DSA Concepts <span className="text-highlight">in Minutes</span>.
          </h1>
          <p className="quickprep-subheading">
            Learn the most important concepts, review syntax, examine code patterns, avoid common traps, and test yourself before your exam.
          </p>

          {/* Time Selector Bar */}
          <div className="time-selector-panel">
            <span className="time-selector-prompt">⏱ How much time do you have?</span>
            <div className="time-button-group">
              {timePresets.map((preset) => (
                <button
                  key={preset.key}
                  type="button"
                  className="btn-time-pill"
                  onClick={() => onStartTimeMode(preset.key)}
                >
                  <span className="pill-duration">{preset.label}</span>
                  <span className="pill-label">{preset.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Hero Mastery Stats Box */}
        <div className="hero-stats-card">
          <div className="stats-card-header">
            <span className="stats-card-title">My QuickPrep Mastery</span>
            <span className="stats-pct-badge">{overallProgressPct}%</span>
          </div>
          <div className="stats-progress-bar-track">
            <div
              className="stats-progress-bar-fill"
              style={{ width: `${overallProgressPct}%` }}
            />
          </div>
          <div className="stats-meta-row">
            <span>{completedCount} of {totalTopicCount} topics reviewed</span>
            <span className="stats-bookmark-count">⭐ {bookmarks.length} saved</span>
          </div>
          <button
            type="button"
            className="btn btn-primary btn-block btn-start-sprint"
            onClick={() => onStartTimeMode('20min')}
          >
            ⚡ Start 20-Min Java Sprint →
          </button>
        </div>
      </div>

      {/* Live Search & Quick Filter Bar */}
      <div className="quickprep-search-filter-bar">
        <div className="quickprep-search-box">
          <span className="search-symbol">🔍</span>
          <input
            type="text"
            className="quickprep-search-input"
            placeholder="Search HashMap, Binary Search, JVM, StringBuilder, BFS, Inorder, DP..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="btn-clear-search"
              onClick={() => setSearchQuery('')}
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="quickprep-category-pills-row">
          <button
            type="button"
            className={`cat-pill ${selectedCategory === null ? 'active' : ''}`}
            onClick={() => setSelectedCategory(null)}
          >
            All Topics ({topics.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`cat-pill ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
            >
              <span>{cat.icon || '⚡'}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2-Column Section: Main Topics Library & Side Utilities */}
      <div className="quickprep-main-grid">
        {/* Left / Main Column: Topics Cards */}
        <div className="quickprep-topics-column">
          <div className="section-title-row">
            <h2 className="section-main-title">
              {selectedCategory
                ? categories.find(c => c.id === selectedCategory)?.name || 'Revision Topics'
                : 'Popular Revision Topics'}
            </h2>
            <span className="section-count-tag">{displayTopics.length} topics available</span>
          </div>

          <div className="quickprep-cards-grid">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="quickprep-card-skeleton">
                  <Skeleton width="50%" height="20px" />
                  <Skeleton width="90%" height="36px" />
                  <Skeleton width="30%" height="16px" />
                </div>
              ))
            ) : displayTopics.length > 0 ? (
              displayTopics.map((topic) => {
                const isSaved = bookmarks.some(b => b.topicId === topic.id || b.id === topic.id);
                const isDone = progressList.some(p => p.topicId === topic.id && p.completed);

                return (
                  <div
                    key={topic.id}
                    className={`quickprep-topic-card ${isDone ? 'completed-card' : ''}`}
                    onClick={() => handleSelectTopicWithRecent(topic)}
                  >
                    <div className="card-top-line">
                      <span className="card-cat-badge">
                        {topic.categoryIcon || '☕'} {topic.category || 'Java'}
                      </span>
                      <button
                        type="button"
                        className={`card-bookmark-btn ${isSaved ? 'saved' : ''}`}
                        onClick={(e) => handleToggleBookmark(e, topic.id)}
                        title={isSaved ? 'Saved in My QuickPrep' : 'Save topic'}
                      >
                        {isSaved ? '⭐' : '☆'}
                      </button>
                    </div>

                    <h3 className="card-topic-title">{topic.title}</h3>
                    <p className="card-topic-summary">{topic.summary}</p>

                    <div className="card-footer-line">
                      <div className="card-time-tag">
                        <span>⏱️ {topic.readTimeMinutes || 3} min</span>
                        {topic.timeComplexity && (
                          <span className="complexity-badge-mini">{topic.timeComplexity}</span>
                        )}
                      </div>
                      <span className="card-read-cta">
                        {isDone ? '✓ Reviewed' : 'Revise →'}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="quickprep-empty-box">
                <span className="empty-icon">🔍</span>
                <p>No topics matching "{searchQuery}"</p>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setSearchQuery('')}
                >
                  Clear Search Filter
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Bookmarks, Recently Viewed & Quick Cheat Sheets */}
        <div className="quickprep-sidebar-column">
          {/* My QuickPrep Saved Bookmarks */}
          <div className="quickprep-sidebar-box">
            <div className="sidebar-box-header">
              <h3 className="sidebar-box-title">⭐ My QuickPrep</h3>
              <span className="saved-count-pill">{bookmarks.length} saved</span>
            </div>

            <div className="saved-topics-list">
              {bookmarks.length > 0 ? (
                bookmarks.slice(0, 5).map((b) => (
                  <div
                    key={b.id || b.topicId}
                    className="saved-topic-item"
                    onClick={() => onSelectTopic(b.topicId || b.id)}
                  >
                    <div className="saved-item-title">{b.title}</div>
                    <span className="saved-item-category">{b.category}</span>
                  </div>
                ))
              ) : (
                <p className="sidebar-empty-text">No saved topics yet. Click the ☆ icon on any topic to bookmark it for rapid pre-exam access.</p>
              )}
            </div>
          </div>

          {/* Recently Viewed Topics */}
          {recentlyViewed.length > 0 && (
            <div className="quickprep-sidebar-box">
              <div className="sidebar-box-header">
                <h3 className="sidebar-box-title">🕒 Recently Viewed</h3>
              </div>
              <div className="saved-topics-list">
                {recentlyViewed.map((item) => (
                  <div
                    key={item.id}
                    className="saved-topic-item"
                    onClick={() => onSelectTopic(item.id)}
                  >
                    <div className="saved-item-title">{item.title}</div>
                    <span className="saved-item-category">{item.category}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Must-Remember Cheat Sheets Quick Launcher */}
          <div className="quickprep-sidebar-box banner-box">
            <div className="banner-icon-header">⚡</div>
            <h3 className="banner-box-title">Things You MUST Remember</h3>
            <p className="banner-box-desc">
              14 ultra high-yield exam points, String comparison rules, BST properties, and Big-O tables.
            </p>
            <button
              type="button"
              className="btn btn-secondary btn-sm btn-block"
              onClick={() => {
                const sheetTopic = topics.find(t => t.slug?.includes('must-remember') || t.title?.includes('MUST Remember'));
                if (sheetTopic) onSelectTopic(sheetTopic.id);
                else onSelectTopic(23);
              }}
            >
              Open Exam Cheatsheet →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
