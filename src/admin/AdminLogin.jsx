import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from './AdminContext';
import './AdminLogin.css';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAdmin();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="al-page">
      {/* Left decorative panel */}
      <div className="al-panel">
        <div className="al-panel-overlay" />
        <div className="al-panel-content">
          <div className="al-logo-mark">V</div>
          <h1>Velora Admin</h1>
          <p>Manage your luxury skincare brand from one powerful dashboard.</p>
          <div className="al-panel-stats">
            <div className="al-pstat"><span>12</span><small>Products</small></div>
            <div className="al-pstat"><span>2+</span><small>Users</small></div>
            <div className="al-pstat"><span>₹2.5K</span><small>Revenue</small></div>
          </div>
        </div>
      </div>

      {/* Right login form */}
      <div className="al-form-side">
        <div className="al-form-card">
          <div className="al-form-header">
            <div className="al-shield">🛡</div>
            <h2>Admin Access</h2>
            <p>Sign in to your admin dashboard</p>
          </div>

          {error && <div className="al-error">{error}</div>}

          <form onSubmit={handleSubmit} className="al-form">
            <div className="al-field">
              <label>Email Address</label>
              <div className="al-input-wrap">
                <span className="al-icon">✉</span>
                <input
                  type="email"
                  name="email"
                  placeholder="admin@velora.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="al-field">
              <label>Password</label>
              <div className="al-input-wrap">
                <span className="al-icon">🔒</span>
                <input
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                />
                <button type="button" className="al-eye" onClick={() => setShowPass(!showPass)}>
                  {showPass ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            <button type="submit" className="al-submit" disabled={loading}>
              {loading ? (
                <span className="al-spinner" />
              ) : (
                <> Sign In to Dashboard &rarr;</>
              )}
            </button>
          </form>

          <div className="al-hint">
            <span>🔐 Secure admin access only</span>
          </div>

          <a href="/" className="al-back">← Back to Velora Website</a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
