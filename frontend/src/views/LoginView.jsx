import React, { useState } from 'react';
import { authApi } from '../api/client';
import { useToast } from '../context/ToastContext';

export function LoginView({ onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('Student');
  const [email, setEmail] = useState('student@sentinelassess.local');
  const [password, setPassword] = useState('Student@123');
  const [busy, setBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const toast = useToast();

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setBusy(true);

    try {
      const data = isRegister
        ? await authApi.register({ username, email, password })
        : await authApi.login({ email, password });

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      toast.success(`Welcome back, ${data.username}!`);
      onLoginSuccess(data);
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setBusy(false);
    }
  };

  const setDemoCredentials = (role) => {
    setErrorMsg('');
    if (role === 'student') {
      setUsername('Student');
      setEmail('student@sentinelassess.local');
      setPassword('Student@123');
      setIsRegister(false);
    } else {
      setUsername('Admin');
      setEmail('admin@sentinelassess.local');
      setPassword('Admin@123');
      setIsRegister(false);
    }
  };

  return (
    <div className="auth-fullscreen-container">
      <div className="auth-card-modern">
        {/* Brand Header */}
        <div className="auth-brand-badge">
          <span className="brand-logo-icon">◈</span>
          <span>SentinelAssess</span>
        </div>

        <h1 className="auth-title">
          {isRegister ? 'Create Developer Account' : 'Welcome to SentinelAssess'}
        </h1>
        <p className="auth-subtitle">
          Assess. Practice. Compete. Improve.
        </p>

        {/* Quick Demo Login Preset Buttons */}
        <div className="demo-preset-group">
          <span className="preset-label">Quick Demo Access:</span>
          <div className="preset-buttons">
            <button
              type="button"
              className="btn-preset"
              onClick={() => setDemoCredentials('student')}
            >
              👤 Student Demo
            </button>
            <button
              type="button"
              className="btn-preset"
              onClick={() => setDemoCredentials('admin')}
            >
              👑 Admin Demo
            </button>
          </div>
        </div>

        <form onSubmit={handleAuthSubmit} className="auth-form-body">
          {isRegister && (
            <div className="form-group">
              <label>Full Name / Username</label>
              <input
                type="text"
                placeholder="e.g. karthik_dev"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="name@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {errorMsg && (
            <div className="auth-error-banner" role="alert">
              <span>⚠</span> {errorMsg}
            </div>
          )}

          <button type="submit" className="btn btn-primary auth-submit-btn" disabled={busy}>
            {busy ? 'Verifying credentials...' : isRegister ? 'Create Account & Start' : 'Sign In to Workspace'}
          </button>

          <button
            type="button"
            className="btn-ghost-toggle"
            onClick={() => {
              setIsRegister(!isRegister);
              setErrorMsg('');
            }}
          >
            {isRegister
              ? 'Already registered? Sign In'
              : "Don't have an account? Create one"}
          </button>
        </form>

        <div className="auth-footer-note">
          <span>☕ OpenJDK 17 Sandbox</span>
          <span>•</span>
          <span>🛡️ AI Proctoring</span>
          <span>•</span>
          <span>⚡ Real Code Execution</span>
        </div>
      </div>
    </div>
  );
}
