import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiUser, FiPhone, FiEye, FiEyeOff, FiArrowLeft } from 'react-icons/fi';
import Toast from './Toast';
import api from '../utils/api';
import './AuthPage.css';
import veloraLogo from '../assets/velora_logo.png';

const AuthPage = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  
  const [viewMode, setViewMode] = useState('login'); // 'login', 'signup', 'forgot'
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotToast, setForgotToast] = useState(null);
  
  // Forms state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  // Forgot password flow states
  const [forgotEmail, setForgotEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const isLogin = viewMode === 'login';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isLogin) {
      const res = await login(formData.email, formData.password);
      if (res.success) {
        navigate('/');
      } else {
        setError(res.message || 'Invalid email or password');
      }
    } else {
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }
      
      const res = await register(
        formData.name,
        formData.email,
        formData.password,
        formData.phone
      );
      if (res.success) {
        navigate('/');
      } else {
        setError(res.message || 'Registration failed');
      }
    }
    setLoading(false);
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);
    try {
      const res = await api.post('/auth/forgot-password', { email: forgotEmail });
      if (res.data.success) {
        setOtpSent(true);
        setSuccessMsg(res.data.message || 'OTP verification code has been sent to your email.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/auth/reset-password', {
        email: forgotEmail,
        otp,
        password: newPassword
      });
      if (res.data.success) {
        setForgotToast({ message: '🎉 Password reset successfully! You can now log in.', type: 'success' });
        setViewMode('login');
        setOtpSent(false);
        setForgotEmail('');
        setOtp('');
        setNewPassword('');
        setConfirmNewPassword('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container animate-fade">
      {forgotToast && <Toast message={forgotToast.message} type={forgotToast.type} onDone={() => setForgotToast(null)} />}
      <div className="auth-split-wrapper">
        {/* Left Panel: Cover Image & Brand Slogan */}
        <div className="auth-cover-panel">
          <div className="cover-overlay"></div>
          <div className="cover-content">
            <Link to="/" className="back-home-link">
              <FiArrowLeft /> Back to Home
            </Link>
            <div className="cover-brand">
              <h2>VELORA</h2>
              <p>NATURE’S ESSENCE, SCIENCE’S PRECISION</p>
            </div>
            <p className="cover-quote">
              "True beauty blooms when you treat your skin with ingredients that respect its natural balance."
            </p>
          </div>
        </div>

        {/* Right Panel: Form Content */}
        <div className="auth-form-panel">
          <div className="auth-form-wrapper">
            {/* Logo Header */}
            <div className="auth-brand-header">
              <img src={veloraLogo} alt="Velora" className="auth-logo" />
              {viewMode === 'forgot' ? (
                <>
                  <h3>Reset Password</h3>
                  <p className="auth-subtitle">
                    {otpSent 
                      ? 'Enter the 6-digit code sent to your email and your new password.'
                      : 'Enter your registered email address to receive a secure recovery code.'}
                  </p>
                </>
              ) : (
                <>
                  <h3>{isLogin ? 'Welcome Back' : 'Create Account'}</h3>
                  <p className="auth-subtitle">
                    {isLogin 
                      ? 'Sign in to access your orders, points, and skincare vault.' 
                      : 'Join the circle for special member benefits and 10% off.'}
                  </p>
                </>
              )}
            </div>

            {/* Tabs */}
            {viewMode !== 'forgot' && (
              <div className="auth-tabs">
                <button 
                  className={`auth-tab-btn ${isLogin ? 'active' : ''}`}
                  onClick={() => { setViewMode('login'); setError(''); setSuccessMsg(''); }}
                >
                  Sign In
                </button>
                <button 
                  className={`auth-tab-btn ${viewMode === 'signup' ? 'active' : ''}`}
                  onClick={() => { setViewMode('signup'); setError(''); setSuccessMsg(''); }}
                >
                  Sign Up
                </button>
                <div className={`auth-indicator-pill ${viewMode === 'signup' ? 'signup-active' : ''}`}></div>
              </div>
            )}

            {error && <div className="auth-error-alert">{error}</div>}
            {successMsg && <div className="auth-success-alert" style={{
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid #10b981',
              color: '#10b981',
              borderRadius: '10px',
              padding: '12px 16px',
              fontSize: '0.85rem',
              marginBottom: '20px',
              textAlign: 'center'
            }}>{successMsg}</div>}

            {/* Form */}
            {viewMode === 'forgot' ? (
              otpSent ? (
                /* Enter OTP and Reset Password Form */
                <form onSubmit={handleResetPassword} className="auth-form-fields">
                  <div className="form-input-group">
                    <label>Verification Code (OTP)</label>
                    <div className="input-wrapper">
                      <FiLock className="input-icon" />
                      <input
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                        maxLength={6}
                      />
                    </div>
                  </div>

                  <div className="form-input-group">
                    <label>New Password</label>
                    <div className="input-wrapper">
                      <FiLock className="input-icon" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="New Password (min 6 characters)"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        className="toggle-password-visibility"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                  </div>

                  <div className="form-input-group">
                    <label>Confirm New Password</label>
                    <div className="input-wrapper">
                      <FiLock className="input-icon" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Confirm New Password"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <button type="submit" className="auth-submit-btn-large" disabled={loading}>
                    {loading ? 'Processing...' : 'Reset Password'}
                  </button>

                  <div style={{ textAlign: 'center', marginTop: '16px' }}>
                    <button 
                      type="button" 
                      onClick={handleSendOTP} 
                      className="forgot-password-link"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#56876D', fontSize: '0.85rem' }}
                    >
                      Resend Code
                    </button>
                  </div>

                  <button 
                    type="button" 
                    className="auth-submit-btn-large" 
                    style={{ background: '#f5f5f5', color: '#666', marginTop: '12px' }}
                    onClick={() => { setViewMode('login'); setOtpSent(false); setError(''); setSuccessMsg(''); }}
                  >
                    ← Back to Sign In
                  </button>
                </form>
              ) : (
                /* Enter Email to Send OTP Form */
                <form onSubmit={handleSendOTP} className="auth-form-fields">
                  <div className="form-input-group">
                    <label>Email Address</label>
                    <div className="input-wrapper">
                      <FiMail className="input-icon" />
                      <input
                        type="email"
                        placeholder="you@example.com"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <button type="submit" className="auth-submit-btn-large" disabled={loading}>
                    {loading ? 'Processing...' : 'Send Verification Code'}
                  </button>

                  <button 
                    type="button" 
                    className="auth-submit-btn-large" 
                    style={{ background: '#f5f5f5', color: '#666', marginTop: '12px' }}
                    onClick={() => { setViewMode('login'); setError(''); setSuccessMsg(''); }}
                  >
                    ← Back to Sign In
                  </button>
                </form>
              )
            ) : (
              /* Normal Sign In / Sign Up Form */
              <form onSubmit={handleSubmit} className="auth-form-fields">
                {!isLogin && (
                  <div className="form-input-group">
                    <label>Full Name</label>
                    <div className="input-wrapper">
                      <FiUser className="input-icon" />
                      <input
                        type="text"
                        name="name"
                        placeholder="Jane Doe"
                        value={formData.name}
                        onChange={handleChange}
                        required={!isLogin}
                      />
                    </div>
                  </div>
                )}

                <div className="form-input-group">
                  <label>Email Address</label>
                  <div className="input-wrapper">
                    <FiMail className="input-icon" />
                    <input
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {!isLogin && (
                  <div className="form-input-group">
                    <label>Phone Number</label>
                    <div className="input-wrapper">
                      <FiPhone className="input-icon" />
                      <input
                        type="tel"
                        name="phone"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={handleChange}
                        required={!isLogin}
                      />
                    </div>
                  </div>
                )}

                <div className="form-input-group">
                  <label>Password</label>
                  <div className="input-wrapper">
                    <FiLock className="input-icon" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      className="toggle-password-visibility"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>

                {!isLogin && (
                  <div className="form-input-group">
                    <label>Confirm Password</label>
                    <div className="input-wrapper">
                      <FiLock className="input-icon" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required={!isLogin}
                      />
                    </div>
                  </div>
                )}

                {isLogin && (
                  <div className="auth-extra-options">
                    <label className="remember-me-checkbox">
                      <input type="checkbox" />
                      <span className="checkbox-box"></span>
                      <span>Remember me</span>
                    </label>
                    <button 
                      type="button" 
                      className="forgot-password-link" 
                      onClick={() => { setViewMode('forgot'); setError(''); setSuccessMsg(''); }}
                    >
                      Forgot Password?
                    </button>
                  </div>
                )}

                <button type="submit" className="auth-submit-btn-large" disabled={loading}>
                  {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
                </button>
              </form>
            )}

            {!isLogin && viewMode !== 'forgot' && (
              <p className="auth-agreement-notice">
                By signing up, you agree to our{' '}
                <Link to="/terms">Terms</Link> and{' '}
                <Link to="/privacy">Privacy Policy</Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
