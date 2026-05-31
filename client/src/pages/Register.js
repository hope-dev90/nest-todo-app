import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register, loading, error, clearError, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [localError, setLocalError] = useState('');

  useEffect(() => { if (user) navigate('/dashboard'); }, [user, navigate]);
  useEffect(() => { clearError(); }, []);

  const handleChange = e => {
    setLocalError('');
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setLocalError('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return;
    }
    const ok = await register(form.name, form.email, form.password);
    if (ok) navigate('/dashboard');
  };

  const displayError = localError || error;

  return (
    <div className="auth-root">
      {/* Left panel */}
      <div className="auth-panel">
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', color: 'white' }}>
          <div style={{ fontSize: 56, marginBottom: 24 }}>🚀</div>
          <h2 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 32, fontWeight: 700, marginBottom: 12 }}>
            Start your journey
          </h2>
          <p style={{ fontSize: 15, opacity: 0.8, maxWidth: 300, margin: '0 auto 2rem' }}>
            Join thousands of people who use Taskify to stay organized and productive every day.
          </p>
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            borderRadius: 16,
            padding: '1.25rem',
            backdropFilter: 'blur(8px)',
            maxWidth: 280,
            margin: '0 auto',
            textAlign: 'left',
          }}>
            <div style={{ fontSize: 13, opacity: 0.9, marginBottom: 4 }}>✨ Free forever plan</div>
            <div style={{ fontSize: 13, opacity: 0.9, marginBottom: 4 }}>📱 Works on all devices</div>
            <div style={{ fontSize: 13, opacity: 0.9 }}>🔐 Your data stays private</div>
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
          <h1 className="auth-title">Create account</h1>
          <p className="auth-subtitle">Get started — it's free</p>

          {displayError && <div className="auth-error">{displayError}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full name</label>
              <input
                className="form-input"
                type="text"
                name="name"
                placeholder="Kim Namjoon"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
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
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm password</label>
              <input
                className="form-input"
                type="password"
                name="confirm"
                placeholder="••••••••"
                value={form.confirm}
                onChange={handleChange}
                required
              />
            </div>
            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? <span className="spinner" /> : 'Create account'}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
