import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';

export function SettingsView({ user }) {
  const { theme, toggleTheme, isDark } = useTheme();
  const toast = useToast();

  const [tabSize, setTabSize] = useState('4');
  const [fontSize, setFontSize] = useState('14');
  const [autoCloseBrackets, setAutoCloseBrackets] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);

  const handleSavePreferences = (e) => {
    e.preventDefault();
    toast.success('Settings and editor preferences saved!');
  };

  return (
    <div className="view-content-wrapper">
      <div className="settings-hero-header">
        <div>
          <span className="settings-tag">⚙️ Workspace Configuration</span>
          <h1 className="settings-title">Preferences & Environment</h1>
          <p className="settings-subtitle">
            Configure your code editor ergonomics, compiler defaults, and account settings.
          </p>
        </div>
      </div>

      <form onSubmit={handleSavePreferences} className="settings-cards-stack">
        {/* Editor Ergonomics */}
        <div className="settings-card-box">
          <h2 className="box-title">Java Code Editor Preferences</h2>
          <p className="box-subtitle">Tailor the in-browser IDE behavior to your coding habits.</p>

          <div className="settings-fields-grid">
            <div className="form-group">
              <label>Default Tab Indentation</label>
              <select
                className="form-control"
                value={tabSize}
                onChange={(e) => setTabSize(e.target.value)}
              >
                <option value="2">2 Spaces</option>
                <option value="4">4 Spaces (Standard Java)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Editor Base Font Size</label>
              <select
                className="form-control"
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value)}
              >
                <option value="12">12px (Compact)</option>
                <option value="13.5">13.5px (Default)</option>
                <option value="15">15px (Comfortable)</option>
                <option value="16">16px (Large)</option>
              </select>
            </div>
          </div>

          <div className="settings-toggles-list">
            <label className="toggle-label-row">
              <div>
                <strong>Auto-Close Brackets & Quotes</strong>
                <p className="toggle-sub">Automatically insert matching <code>{'{}'}</code>, <code>()</code>, <code>[]</code>, and <code>""</code></p>
              </div>
              <input
                type="checkbox"
                checked={autoCloseBrackets}
                onChange={(e) => setAutoCloseBrackets(e.target.checked)}
              />
            </label>

            <label className="toggle-label-row">
              <div>
                <strong>Auditory Violation Warnings</strong>
                <p className="toggle-sub">Play acoustic alert chime when anti-cheat boundaries are flagged</p>
              </div>
              <input
                type="checkbox"
                checked={soundEffects}
                onChange={(e) => setSoundEffects(e.target.checked)}
              />
            </label>
          </div>
        </div>

        {/* Theme Settings */}
        <div className="settings-card-box">
          <h2 className="box-title">Interface Theme & Appearance</h2>
          <p className="box-subtitle">Select between dark developer mode or high-contrast light theme.</p>

          <div className="theme-selection-grid">
            <div
              className={`theme-card-option ${isDark ? 'selected' : ''}`}
              onClick={() => isDark ? null : toggleTheme()}
            >
              <div className="theme-preview dark-preview">
                <div className="preview-sidebar"></div>
                <div className="preview-main"></div>
              </div>
              <div className="theme-card-info">
                <strong>Deep Slate (Dark Mode)</strong>
                <span>Recommended for coding & low fatigue</span>
              </div>
            </div>

            <div
              className={`theme-card-option ${!isDark ? 'selected' : ''}`}
              onClick={() => !isDark ? null : toggleTheme()}
            >
              <div className="theme-preview light-preview">
                <div className="preview-sidebar"></div>
                <div className="preview-main"></div>
              </div>
              <div className="theme-card-info">
                <strong>Clean Slate (Light Mode)</strong>
                <span>Crisp contrast for bright environments</span>
              </div>
            </div>
          </div>
        </div>

        {/* Account Info */}
        <div className="settings-card-box">
          <h2 className="box-title">Account Credentials</h2>
          <p className="box-subtitle">Authenticated user profile and permissions.</p>

          <div className="settings-fields-grid">
            <div className="form-group">
              <label>Username</label>
              <input type="text" value={user?.username || 'Student'} disabled />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input type="email" value={user?.email || 'student@sentinelassess.local'} disabled />
            </div>

            <div className="form-group">
              <label>Assigned Role</label>
              <input type="text" value={user?.role || 'ROLE_STUDENT'} disabled />
            </div>
          </div>
        </div>

        <div className="settings-submit-bar">
          <button type="submit" className="btn btn-primary">
            Save Preferences
          </button>
        </div>
      </form>
    </div>
  );
}
