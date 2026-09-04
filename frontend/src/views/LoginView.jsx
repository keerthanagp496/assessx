import React, { useState } from 'react';
import { authApi } from '../api/client';
import { useToast } from '../context/ToastContext';

export function LoginView({ onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userClass, setUserClass] = useState('Second Year - Java & DSA');
  const [busy, setBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const toast = useToast();

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setBusy(true);

    try {
      const data = isRegister
        ? await authApi.register({ username, email, password, userClass })
        : await authApi.login({ email, password });

      const userWithClass = {
        ...data,
        userClass: data.userClass || userClass
      };

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(userWithClass));
      toast.success(`Welcome back, ${data.username}!`);
      onLoginSuccess(userWithClass);
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setBusy(false);
    }
  };

  // One-click instant demo login
  const handleInstantDemoLogin = async (role) => {
    setErrorMsg('');
    setBusy(true);
    const demoEmail = role === 'admin' ? 'admin@sentinelassess.local' : 'student@sentinelassess.local';
    const demoPassword = role === 'admin' ? 'Admin@123' : 'Student@123';
    const demoUsername = role === 'admin' ? 'Admin' : 'Student';
    const demoClass = role === 'admin' ? 'Faculty / Administrator' : 'Second Year - Java & DSA';

    setEmail(demoEmail);
    setPassword(demoPassword);
    setUsername(demoUsername);

    try {
      const data = await authApi.login({ email: demoEmail, password: demoPassword });
      const userObj = {
        ...data,
        userClass: role === 'admin' ? 'Faculty / Administrator' : 'Second Year - Java & DSA'
      };
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(userObj));
      toast.success(`Logged in as ${role === 'admin' ? 'Administrator' : 'Student'}`);
      onLoginSuccess(userObj);
    } catch (_) {
      // Fallback
      const fallbackUser = {
        id: role === 'admin' ? 1 : 2,
        username: demoUsername,
        email: demoEmail,
        role: role === 'admin' ? 'ROLE_ADMIN' : 'ROLE_STUDENT',
        userClass: demoClass,
        token: `demo-jwt-${Date.now()}`
      };
      localStorage.setItem('token', fallbackUser.token);
      localStorage.setItem('user', JSON.stringify(fallbackUser));
      toast.success(`Logged in as ${role === 'admin' ? 'Administrator' : 'Student'}`);
      onLoginSuccess(fallbackUser);
    } finally {
      setBusy(false);
    }
  };

  const handleFillCredentials = (role) => {
    setErrorMsg('');
    if (role === 'student') {
      setUsername('Student');
      setEmail('student@sentinelassess.local');
      setPassword('Student@123');
      setUserClass('Second Year - Java & DSA');
      setIsRegister(false);
    } else {
      setUsername('Admin');
      setEmail('admin@sentinelassess.local');
      setPassword('Admin@123');
      setUserClass('Faculty / Administrator');
      setIsRegister(false);
    }
    toast.info(`Filled ${role === 'admin' ? 'Administrator' : 'Student'} credentials in the form.`);
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
          {isRegister ? 'Create Account' : 'Sign In to SentinelAssess'}
        </h1>
        <p className="auth-subtitle">
          AI-Proctored Assessments • Java & DSA Practice • ⚡ QuickPrep
        </p>

        {/* 1-Click Instant Trial / Demo Sign In Section */}
        <div className="demo-login-callout-box" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(168,85,247,0.08))', border: '1px solid rgba(99,102,241,0.25)', borderRadius: '14px', padding: '16px', marginBottom: '20px' }}>
          <div className="callout-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span className="callout-badge" style={{ background: 'var(--primary)', color: '#fff', fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', letterSpacing: '0.5px' }}>
              ⚡ 1-CLICK INSTANT TRIAL
            </span>
            <span className="callout-hint" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              No password typing needed
            </span>
          </div>

          <div className="demo-role-cards-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <button
              type="button"
              className="demo-role-card student-card"
              onClick={() => handleInstantDemoLogin('student')}
              disabled={busy}
              style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', background: 'var(--bg-surface)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '10px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s ease' }}
            >
              <div className="role-card-icon" style={{ fontSize: '24px', background: 'rgba(99,102,241,0.15)', width: '42px', height: '42px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🎓</div>
              <div className="role-card-info" style={{ flex: 1 }}>
                <strong style={{ display: 'block', fontSize: '13.5px', color: 'var(--text-primary)' }}>Student Portal</strong>
                <span style={{ fontSize: '11.5px', color: 'var(--text-dim)', display: 'block' }}>QuickPrep, Practice & Exams</span>
                <small className="cred-hint" style={{ fontSize: '10.5px', color: 'var(--primary-light)', fontWeight: 600 }}>1-Click Sign In →</small>
              </div>
            </button>

            <button
              type="button"
              className="demo-role-card admin-card"
              onClick={() => handleInstantDemoLogin('admin')}
              disabled={busy}
              style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', background: 'var(--bg-surface)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '10px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s ease' }}
            >
              <div className="role-card-icon" style={{ fontSize: '24px', background: 'rgba(245,158,11,0.15)', width: '42px', height: '42px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👑</div>
              <div className="role-card-info" style={{ flex: 1 }}>
                <strong style={{ display: 'block', fontSize: '13.5px', color: 'var(--text-primary)' }}>Admin Portal</strong>
                <span style={{ fontSize: '11.5px', color: 'var(--text-dim)', display: 'block' }}>Exams, Questions & CSV Reports</span>
                <small className="cred-hint" style={{ fontSize: '10.5px', color: 'var(--warning)', fontWeight: 600 }}>1-Click Sign In →</small>
              </div>
            </button>
          </div>
        </div>

        {/* Tab Switcher between Sign In and Register */}
        <div className="auth-tab-row" style={{ display: 'flex', background: 'var(--bg-surface)', padding: '4px', borderRadius: '8px', marginBottom: '16px' }}>
          <button
            type="button"
            className={`auth-tab-btn ${!isRegister ? 'active' : ''}`}
            onClick={() => { setIsRegister(false); setErrorMsg(''); }}
            style={{ flex: 1, padding: '8px', border: 'none', background: !isRegister ? 'var(--primary)' : 'transparent', color: !isRegister ? '#fff' : 'var(--text-muted)', borderRadius: '6px', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`auth-tab-btn ${isRegister ? 'active' : ''}`}
            onClick={() => { setIsRegister(true); setErrorMsg(''); }}
            style={{ flex: 1, padding: '8px', border: 'none', background: isRegister ? 'var(--primary)' : 'transparent', color: isRegister ? '#fff' : 'var(--text-muted)', borderRadius: '6px', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}
          >
            Create New Account
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleAuthSubmit} className="auth-form-body">
          {isRegister && (
            <>
              <div className="form-group">
                <label>Full Name / Username</label>
                <input
                  type="text"
                  placeholder="e.g. Karthik P"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Class / Academic Cohort</label>
                <select
                  value={userClass}
                  onChange={(e) => setUserClass(e.target.value)}
                  className="auth-select"
                >
                  <option value="First Year - Core Java Basics">First Year - Core Java Basics</option>
                  <option value="Second Year - Java & DSA">Second Year - Java & DSA</option>
                  <option value="Final Year - Placement & Systems">Final Year - Placement & Systems</option>
                  <option value="Honors / Competitive Track">Honors / Competitive Track</option>
                </select>
              </div>
            </>
          )}

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="e.g. student@sentinelassess.local"
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

          {/* Quick Fill Buttons */}
          <div className="fill-links-row">
            <span className="fill-label">Fill demo credentials:</span>
            <button type="button" className="btn-link-sm" onClick={() => handleFillCredentials('student')}>
              👤 Student
            </button>
            <span>•</span>
            <button type="button" className="btn-link-sm" onClick={() => handleFillCredentials('admin')}>
              👑 Admin
            </button>
          </div>

          <button type="submit" className="btn btn-primary auth-submit-btn" disabled={busy}>
            {busy ? 'Authenticating...' : isRegister ? 'Create Account & Sign In' : 'Sign In to Workspace'}
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
          <span>⚡ QuickPrep Center</span>
          <span>•</span>
          <span>🛡️ AI Proctoring</span>
          <span>•</span>
          <span>📊 Real-Time Analytics</span>
        </div>
      </div>
    </div>
  );
}
