import { useState, useEffect } from 'react';
import authService from '../services/authService';
import './Login.css';

const ROLES = [
  { role: 'admin',      label: 'Admin',   icon: '🛡️' },
  { role: 'management', label: 'Manager', icon: '💼' },
];

export default function Login({ onLogin }) {
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [selectedRole, setSelectedRole] = useState('admin');
  const [error, setError]               = useState('');
  const [loading, setLoading]           = useState(false);
  const [showPw, setShowPw]             = useState(false);
  const [remember, setRemember]         = useState(false);
  const [toast, setToast]               = useState('');

  useEffect(() => {
    setEmail('admin@manzio.com');
    setPassword('admin123');
  }, []);

  function pickRole(role) {
    setSelectedRole(role);
    setError('');
    if (role === 'admin') {
      setEmail('admin@manzio.com');
      setPassword('admin123');
    } else if (role === 'management') {
      setEmail('manager@manzio.com');
      setPassword('manager123');
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!email.trim()) return setError('Please enter your email address.');
    if (!password)     return setError('Please enter your password.');

    setLoading(true);

    try {
      const res = await authService.login(email.trim(), password);
      if (res.success) {
        setToast(`Welcome back, ${res.user.name}!`);
        setTimeout(() => onLogin(res.user), 900);
      } else {
        setError(res.message || 'Invalid email or password. Please try again.');
        setLoading(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Connection error. Please make sure backend is running.');
      setLoading(false);
    }
  }

  return (
    <div className="login-root">
      {/* Animated background orbs */}
      <div className="login-bg">
        <div className="login-bg__orb login-bg__orb--1" />
        <div className="login-bg__orb login-bg__orb--2" />
        <div className="login-bg__orb login-bg__orb--3" />
      </div>

      {/* Success toast */}
      {toast && (
        <div className="login-toast" role="status">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M5 8l2 2 4-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {toast}
        </div>
      )}

      <div className="login-container">
        
        {/* Left Column: Brand Text & Info */}
        <div className="login-brand">
          <div className="login-brand-logo-row">
            <div className="login-brand-logo">M</div>
            <span className="login-brand-logo-text">Manzio</span>
          </div>
          <h1 className="login-brand-headline">
            Proposals that<br />
            <span className="login-highlight">close deals,</span><br />
            not just open them.
          </h1>
          <p className="login-brand-sub">
            Streamline your proposal workflow — from draft to approval,
            all in one collaborative system built for your team.
          </p>
          <div className="login-brand-features">
            {[
              'Role-based access for management & admin',
              'Real-time proposal status tracking',
              'One-click PDF generation & email delivery',
            ].map((f, i) => (
              <div key={i} className="login-brand-feature">
                <span className="login-brand-feature__dot" />
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Center Column: Glassmorphism Login Card */}
        <div className="login-panel">
          <div className="login-card">
            
            {/* Header */}
            <div className="login-card__header">
              <h2 className="login-card__title">Welcome back</h2>
              <p className="login-card__subtitle">Sign in to your Manzio workspace</p>
            </div>

            <form className="login-form" onSubmit={handleSubmit} noValidate>
              
              {/* Role selector */}
              <div className="login-field">
                <span className="login-label">Select role</span>
                <div className="login-roles">
                  {ROLES.map(r => (
                    <button
                      key={r.role}
                      type="button"
                      className={`login-role-btn ${selectedRole === r.role ? 'is-selected' : ''}`}
                      onClick={() => pickRole(r.role)}
                    >
                      <span className="login-role-btn__icon">{r.icon}</span>
                      <span className="login-role-btn__name">{r.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="login-divider"><span>credentials</span></div>

              {/* Email input */}
              <div className="login-field">
                <label className="login-label" htmlFor="login-email">Email</label>
                <div className="login-input-wrap">
                  <input
                    id="login-email"
                    type="email"
                    className="login-input"
                    placeholder="you@manzio.com"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setError(''); }}
                    required
                    autoComplete="email"
                  />
                  <span className="login-input-icon">
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                      <rect x="1" y="3" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
                      <path d="M1 4.5l6.5 4.5L14 4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                    </svg>
                  </span>
                </div>
              </div>

              {/* Password input */}
              <div className="login-field">
                <label className="login-label" htmlFor="login-password">Password</label>
                <div className="login-input-wrap">
                  <input
                    id="login-password"
                    type={showPw ? 'text' : 'password'}
                    className="login-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError(''); }}
                    required
                    autoComplete="current-password"
                    style={{ paddingRight: 44 }}
                  />
                  <span className="login-input-icon">
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                      <rect x="3" y="6.5" width="9" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
                      <path d="M5 6.5V5a2.5 2.5 0 0 1 5 0v1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                    </svg>
                  </span>
                  <button
                    type="button"
                    className="login-pw-toggle"
                    onClick={() => setShowPw(v => !v)}
                    aria-label={showPw ? 'Hide password' : 'Show password'}
                    tabIndex={-1}
                  >
                    {showPw ? (
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                        <path d="M1 7.5C2.5 4.5 5 3 7.5 3s5 1.5 6.5 4.5C12.5 10.5 10 12 7.5 12S2.5 10.5 1 7.5z" stroke="currentColor" strokeWidth="1.3"/>
                        <circle cx="7.5" cy="7.5" r="1.8" stroke="currentColor" strokeWidth="1.3"/>
                        <path d="M2 2l11 11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                      </svg>
                    ) : (
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                        <path d="M1 7.5C2.5 4.5 5 3 7.5 3s5 1.5 6.5 4.5C12.5 10.5 10 12 7.5 12S2.5 10.5 1 7.5z" stroke="currentColor" strokeWidth="1.3"/>
                        <circle cx="7.5" cy="7.5" r="1.8" stroke="currentColor" strokeWidth="1.3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Extras: Remember me + Forgot password */}
              <div className="login-extras">
                <label className="login-remember">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={e => setRemember(e.target.checked)}
                  />
                  Remember me
                </label>
                <button type="button" className="login-forgot" onClick={() => alert('Please contact your system administrator to reset your password.')}
                >
                  Forgot password?
                </button>
              </div>

              {/* Error display */}
              {error && (
                <div className="login-error" role="alert">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.3"/>
                    <path d="M7 4v3.5M7 10h.01" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                  </svg>
                  {error}
                </div>
              )}

              {/* Submit button */}
              <button type="submit" className="login-submit" disabled={loading}>
                {loading ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ animation: 'spin 0.7s linear infinite' }}>
                      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="22" strokeDashoffset="10" strokeLinecap="round"/>
                    </svg>
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign in
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </>
                )}
              </button>
            </form>


          </div>
        </div>

        {/* Right Column: Spacer */}
        <div className="login-spacer" />

      </div>

      {/* Footer */}
      <p className="login-footer">
        © 2025 Manzio . All rights reserved.
      </p>
    </div>
  );
}