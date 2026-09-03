import React, { useState, useEffect } from 'react';
import { practiceApi } from '../api/client';
import { DifficultyBadge, PointsBadge } from '../components/common/Badge';
import { EmptyState } from '../components/common/EmptyState';
import { Skeleton } from '../components/common/Skeleton';

export function PracticeArenaView({ onSelectProblem, searchQuery = '' }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  const categories = [
    'ALL',
    'Java Basics',
    'Strings',
    'Arrays',
    'Linked Lists',
    'Stack',
    'Queue',
    'Hashing',
    'Searching',
    'Sorting',
    'Recursion',
    'Trees',
    'Graphs',
    'Dynamic Programming',
    'Greedy',
    'Backtracking',
    'Java Collections',
    'Mathematics'
  ];

  const difficulties = ['ALL', 'EASY', 'MEDIUM', 'HARD'];
  const statuses = ['ALL', 'SOLVED', 'ATTEMPTED', 'UNSOLVED'];

  useEffect(() => {
    let active = true;
    setLoading(true);
    practiceApi
      .listQuestions()
      .then((data) => {
        if (active) {
          setQuestions(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (active) {
          setError(err.message || 'Failed to load practice questions');
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  // Filter questions based on state
  const filteredQuestions = questions.filter((q) => {
    // Search query
    if (searchQuery.trim()) {
      const match =
        q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (q.category && q.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (q.description && q.description.toLowerCase().includes(searchQuery.toLowerCase()));
      if (!match) return false;
    }

    // Category
    if (selectedCategory !== 'ALL') {
      const cat = (q.category || '').toLowerCase();
      const sub = (q.subcategory || '').toLowerCase();
      const target = selectedCategory.toLowerCase();
      if (!cat.includes(target) && !sub.includes(target) && !(target === 'java basics' && (cat.includes('basic') || cat.includes('syntax')))) {
        return false;
      }
    }

    // Difficulty
    if (selectedDifficulty !== 'ALL') {
      if (String(q.difficulty).toUpperCase() !== selectedDifficulty) {
        return false;
      }
    }

    return true;
  });

  const clearFilters = () => {
    setSelectedCategory('ALL');
    setSelectedDifficulty('ALL');
    setSelectedStatus('ALL');
  };

  return (
    <div className="view-content-wrapper">
      {/* Header Banner */}
      <div className="practice-hero-header">
        <div>
          <span className="practice-hero-tag">☕ Java Practice Arena</span>
          <h1 className="practice-hero-title">Master Java & Data Structures</h1>
          <p className="practice-hero-subtitle">
            Solve problems, refine your algorithmic thinking, and compile code in real-time.
          </p>
        </div>

        <div className="practice-stats-pill">
          <div className="stat-pill-item">
            <span className="stat-pill-num">{questions.length}</span>
            <span className="stat-pill-lbl">Available</span>
          </div>
          <div className="stat-pill-divider"></div>
          <div className="stat-pill-item">
            <span className="stat-pill-num">OpenJDK 17</span>
            <span className="stat-pill-lbl">Runtime</span>
          </div>
        </div>
      </div>

      {/* Categories Pill Slider */}
      <div className="category-scroll-container">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Filter Control Bar */}
      <div className="filter-controls-bar">
        <div className="filter-select-group">
          <label className="filter-label">Difficulty:</label>
          <select
            className="filter-select"
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
          >
            {difficulties.map((d) => (
              <option key={d} value={d}>
                {d === 'ALL' ? 'All Difficulties' : d}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-select-group">
          <label className="filter-label">Status:</label>
          <select
            className="filter-select"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s === 'ALL' ? 'All Statuses' : s}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-results-count">
          Showing <strong>{filteredQuestions.length}</strong> of {questions.length} problems
        </div>
      </div>

      {/* Problem Cards / List Rows */}
      {loading ? (
        <div className="problem-list-container">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="problem-row-skeleton">
              <Skeleton width="45%" height="22px" />
              <Skeleton width="15%" height="18px" />
              <Skeleton width="80px" height="32px" borderRadius="6px" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="error-banner-card">
          <span>⚠</span>
          <div>
            <strong>Unable to load problems:</strong>
            <p>{error}</p>
          </div>
        </div>
      ) : filteredQuestions.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="No problems found"
          description="We couldn't find any practice problems matching your selected filters or search keyword."
          actionLabel="Clear All Filters"
          onAction={clearFilters}
        />
      ) : (
        <div className="problem-cards-list">
          {filteredQuestions.map((q) => {
            const points = q.difficulty === 'HARD' ? 15 : q.difficulty === 'MEDIUM' ? 10 : 5;
            return (
              <div
                key={q.id}
                className="problem-row-card"
                onClick={() => onSelectProblem(q.id)}
              >
                <div className="problem-row-left">
                  <div className="problem-status-icon" title="Unsolved">
                    ○
                  </div>
                  <div className="problem-row-info">
                    <div className="problem-row-title-line">
                      <h3 className="problem-row-title">{q.title}</h3>
                      <DifficultyBadge difficulty={q.difficulty} />
                    </div>
                    <p className="problem-row-desc">{q.description}</p>
                    <div className="problem-row-meta">
                      <span className="problem-lang-tag">☕ Java</span>
                      <span className="problem-meta-dot">•</span>
                      <span className="problem-category-tag">{q.category || 'Algorithms'}</span>
                      {q.subcategory && q.subcategory !== q.category && (
                        <>
                          <span className="problem-meta-dot">•</span>
                          <span className="problem-category-tag">{q.subcategory}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="problem-row-right">
                  <PointsBadge points={points} />
                  <button
                    type="button"
                    className="btn btn-primary btn-sm btn-solve"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectProblem(q.id);
                    }}
                  >
                    Solve →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
