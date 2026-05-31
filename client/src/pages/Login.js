import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login, loading, error, clearError, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });

  useEffect(() => { if (user) navigate('/dashboard'); }, [user, navigate]);
  useEffect(() => { clearError(); }, []);

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    const ok = await login(form.email, form.password);
    if (ok) navigate('/dashboard');
  };

  return (
    <div className="auth-root">
      {/* Left panel */}
      <div className="auth-panel">
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', color: 'white' }}>
          <div style={{ fontSize: 56, marginBottom: 24 }}>📋</div>
          <h2 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 32, fontWeight: 700, marginBottom: 12 }}>
            Stay on top of everything
          </h2>
          <p style={{ fontSize: 15, opacity: 0.8, maxWidth: 300, margin: '0 auto 2rem' }}>
            Taskify helps you organize notes, manage your schedule, and never miss a deadline.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 260, margin: '0 auto' }}>
            {['📝 Smart note-taking', '📅 Agenda & calendar', '🔒 Secure & private'].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 14px', fontSize: 14, backdropFilter: 'blur(4px)' }}>
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: form */}
      <div className="auth-form-side">
        <div className="auth-box animate-fadeUp">
          <div className="auth-logo">
            <div className="logo-icon">📋</div>
            <span>Taskify</span>
          </div>
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">Sign in to your account to continue</p>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email address</label>
              <input
                className="form-input"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                className="form-input"
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
            <div style={{ textAlign: 'right', marginBottom: '1.25rem', marginTop: '-0.5rem' }}>
              <Link to="/forgot-password" style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 500 }}>
                Forgot password?
              </Link>
            </div>
            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? <span className="spinner" /> : 'Sign in'}
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account? <Link to="/register">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
