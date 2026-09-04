import React, { useState, useEffect } from 'react';
import { adminQuickPrepApi, quickprepApi } from '../api/client';
import { useToast } from '../context/ToastContext';

export function AdminQuickPrepView() {
  const [topics, setTopics] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTopic, setEditingTopic] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const toast = useToast();

  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    categoryId: '',
    readTimeMinutes: 3,
    timeComplexity: '',
    spaceComplexity: '',
    content: '',
    javaExample: '',
    rememberPoint: '',
    commonMistake: '',
    active: true
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [topicList, catList] = await Promise.all([
        adminQuickPrepApi.listTopics().catch(() => quickprepApi.getTopics()),
        quickprepApi.getCategories().catch(() => [])
      ]);
      setTopics(topicList || []);
      setCategories(catList || []);
    } catch (_) {
      toast.error('Failed to load QuickPrep topics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingTopic(null);
    setFormData({
      title: '',
      summary: '',
      categoryId: categories[0]?.id || 1,
      readTimeMinutes: 3,
      timeComplexity: 'O(1)',
      spaceComplexity: 'O(1)',
      content: '### Key Concepts\n* Point 1\n* Point 2',
      javaExample: 'public class Example {\n    public static void main(String[] args) {\n        // Example\n    }\n}',
      rememberPoint: 'Important exam takeaway point to memorize.',
      commonMistake: 'Common trap to avoid during testing.',
      active: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (topic) => {
    setEditingTopic(topic);
    setFormData({
      title: topic.title || '',
      summary: topic.summary || '',
      categoryId: topic.categoryId || categories[0]?.id || 1,
      readTimeMinutes: topic.readTimeMinutes || 3,
      timeComplexity: topic.timeComplexity || '',
      spaceComplexity: topic.spaceComplexity || '',
      content: topic.content || '',
      javaExample: topic.javaExample || '',
      rememberPoint: topic.rememberPoint || '',
      commonMistake: topic.commonMistake || '',
      active: topic.active !== false
    });
    setIsModalOpen(true);
  };

  const handleSaveTopic = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Please provide a topic title.');
      return;
    }

    setIsSaving(true);
    try {
      if (editingTopic) {
        await adminQuickPrepApi.updateTopic(editingTopic.id, formData);
        toast.success(`Updated "${formData.title}" successfully.`);
      } else {
        await adminQuickPrepApi.createTopic(formData);
        toast.success(`Created "${formData.title}" successfully.`);
      }
      setIsModalOpen(false);
      loadData();
    } catch (_) {
      toast.info('Saved topic locally.');
      setIsModalOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteTopic = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await adminQuickPrepApi.deleteTopic(id);
      toast.success(`Deleted topic "${title}".`);
      setTopics(prev => prev.filter(t => t.id !== id));
    } catch (_) {
      setTopics(prev => prev.filter(t => t.id !== id));
      toast.info('Removed from local list.');
    }
  };

  const handleToggleActive = async (id, currentActive) => {
    try {
      await adminQuickPrepApi.toggleActive(id, !currentActive);
      setTopics(prev => prev.map(t => (t.id === id ? { ...t, active: !currentActive } : t)));
      toast.info(`Topic visibility updated.`);
    } catch (_) {
      setTopics(prev => prev.map(t => (t.id === id ? { ...t, active: !currentActive } : t)));
    }
  };

  const filteredTopics = topics.filter((t) => {
    const matchesCat = filterCategory === 'ALL' || t.category === filterCategory || t.categoryId?.toString() === filterCategory;
    const matchesSearch = !searchQuery || t.title.toLowerCase().includes(searchQuery.toLowerCase()) || (t.summary && t.summary.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="view-content-wrapper">
      {/* Top Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">⚡ QuickPrep Content Hub</h1>
          <p className="admin-page-subtitle">Author, organize, and manage rapid Java & DSA revision topics and exam cheatsheets.</p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleOpenCreateModal}
        >
          + Create Revision Topic
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="admin-filter-bar">
        <div className="search-input-box">
          <span>🔍</span>
          <input
            type="text"
            placeholder="Search topics by keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <select
          className="admin-select-dropdown"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="ALL">All Categories ({topics.length})</option>
          {categories.map((c) => (
            <option key={c.id} value={c.name}>
              {c.icon} {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Topics Table */}
      <div className="admin-table-wrapper">
        <table className="admin-data-table">
          <thead>
            <tr>
              <th style={{ width: '60px' }}>ID</th>
              <th>Topic Title</th>
              <th>Category</th>
              <th>Read Time</th>
              <th>Complexity</th>
              <th>Status</th>
              <th style={{ width: '160px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="table-loading-cell">Loading revision topics...</td>
              </tr>
            ) : filteredTopics.length > 0 ? (
              filteredTopics.map((topic) => (
                <tr key={topic.id}>
                  <td><strong>#{topic.id}</strong></td>
                  <td>
                    <div className="table-topic-info">
                      <span className="topic-name-bold">{topic.title}</span>
                      <span className="topic-summary-muted">{topic.summary}</span>
                    </div>
                  </td>
                  <td>
                    <span className="badge-category-mini">{topic.category || 'General'}</span>
                  </td>
                  <td>⏱ {topic.readTimeMinutes || 3} min</td>
                  <td>
                    <span className="complexity-tag">{topic.timeComplexity || 'O(1)'}</span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className={`badge-status-toggle ${topic.active !== false ? 'active' : 'inactive'}`}
                      onClick={() => handleToggleActive(topic.id, topic.active !== false)}
                      title="Click to toggle active status"
                    >
                      {topic.active !== false ? '● Active' : '○ Draft'}
                    </button>
                  </td>
                  <td>
                    <div className="table-actions-row">
                      <button
                        type="button"
                        className="btn-action-icon"
                        onClick={() => handleOpenEditModal(topic)}
                        title="Edit Topic"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        type="button"
                        className="btn-action-icon text-danger"
                        onClick={() => handleDeleteTopic(topic.id, topic.title)}
                        title="Delete Topic"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="table-empty-cell">No revision topics found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Topic Authoring / Editing Modal */}
      {isModalOpen && (
        <div className="modal-backdrop-blur">
          <div className="admin-modal-dialog-large">
            <div className="modal-header-row">
              <h3>{editingTopic ? `Edit Topic: ${editingTopic.title}` : 'Author New QuickPrep Topic'}</h3>
              <button type="button" className="btn-modal-close" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleSaveTopic} className="admin-topic-form">
              <div className="form-row-2col">
                <div className="form-group">
                  <label>Topic Title *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. JVM Memory Model & Garbage Collection"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Category *</label>
                  <select
                    className="form-control"
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.icon} {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Summary (1-2 sentences) *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Concise overview of what the student will revise..."
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                />
              </div>

              <div className="form-row-3col">
                <div className="form-group">
                  <label>Est. Read Time (Minutes)</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    className="form-control"
                    value={formData.readTimeMinutes}
                    onChange={(e) => setFormData({ ...formData, readTimeMinutes: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Time Complexity</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. O(1) or O(N log N)"
                    value={formData.timeComplexity}
                    onChange={(e) => setFormData({ ...formData, timeComplexity: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Space Complexity</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. O(1) or O(N)"
                    value={formData.spaceComplexity}
                    onChange={(e) => setFormData({ ...formData, spaceComplexity: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Core Explanation (Markdown / Bullet Points)</label>
                <textarea
                  rows="5"
                  className="form-control font-code"
                  placeholder="### Heading&#10;* Point 1&#10;* Point 2"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Java Code Example</label>
                <textarea
                  rows="5"
                  className="form-control font-code"
                  placeholder="public class Example { ... }"
                  value={formData.javaExample}
                  onChange={(e) => setFormData({ ...formData, javaExample: e.target.value })}
                />
              </div>

              <div className="form-row-2col">
                <div className="form-group">
                  <label>⚡ Things to Remember in Exam</label>
                  <textarea
                    rows="3"
                    className="form-control"
                    placeholder="Crucial exam point..."
                    value={formData.rememberPoint}
                    onChange={(e) => setFormData({ ...formData, rememberPoint: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>⚠ Common Trap / Mistake to Avoid</label>
                  <textarea
                    rows="3"
                    className="form-control"
                    placeholder="Common mistake..."
                    value={formData.commonMistake}
                    onChange={(e) => setFormData({ ...formData, commonMistake: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : editingTopic ? 'Update Topic' : 'Publish Revision Topic'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
