import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: email, 2: otp+new password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSendOtp = async e => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await authApi.forgotPassword(email);
      setStep(2);
    } catch (e) {
      setError(e.response?.data?.message || 'Something went wrong');
    } finally { setLoading(false); }
  };

  const handleResetPassword = async e => {
    e.preventDefault();
    setLoading(true); setError('');
    if (newPassword !== confirmPassword) {
      setError("Passwords don't match");
      setLoading(false);
      return;
    }
    try {
      await authApi.resetPassword(email, otp, newPassword);
      navigate('/login');
    } catch (e) {
      setError(e.response?.data?.message || 'Something went wrong');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-root">
      <div className="auth-panel">
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', color: 'white' }}>
          <div style={{ fontSize: 56, marginBottom: 24 }}>🔑</div>
          <h2 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 28, fontWeight: 700, marginBottom: 12 }}>
            Reset your password
          </h2>
          <p style={{ fontSize: 15, opacity: 0.8, maxWidth: 280, margin: '0 auto' }}>
            We'll send you a secure OTP to reset your password in seconds.
          </p>
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-box animate-fadeUp">
          <div className="auth-logo">
            <div className="logo-icon">📋</div>
            <span>Taskify</span>
          </div>

          {step === 1 ? (
            <>
              <h1 className="auth-title">Forgot password?</h1>
              <p className="auth-subtitle">Enter your email and we'll send an OTP</p>
              {error && <div className="auth-error">{error}</div>}
              <form onSubmit={handleSendOtp}>
                <div className="form-group">
                  <label className="form-label">Email address</label>
                  <input
                    className="form-input"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>
                <button className="btn-primary" type="submit" disabled={loading}>
                  {loading ? <span className="spinner" /> : 'Send OTP'}
                </button>
              </form>
              <p className="auth-switch">
                <Link to="/login">← Back to sign in</Link>
              </p>
            </>
          ) : (
            <>
              <h1 className="auth-title">Enter OTP & New Password</h1>
              <p className="auth-subtitle">We sent an OTP to <strong>{email}</strong></p>
              {error && <div className="auth-error">{error}</div>}
              <form onSubmit={handleResetPassword}>
                <div className="form-group">
                  <label className="form-label">OTP</label>
                  <input
                    className="form-input"
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                    maxLength={6}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input
                    className="form-input"
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    minLength={8}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm New Password</label>
                  <input
                    className="form-input"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    minLength={8}
                    required
                  />
                </div>
                <button className="btn-primary" type="submit" disabled={loading}>
                  {loading ? <span className="spinner" /> : 'Reset Password'}
                </button>
              </form>
              <p className="auth-switch">
                <button
                  style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--primary)', fontWeight: 600, fontSize: 14 }}
                  onClick={() => setStep(1)}
                >
                  ← Go back to email
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
