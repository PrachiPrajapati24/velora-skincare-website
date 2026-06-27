import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiUser, FiPhone, FiEye, FiEyeOff, FiArrowLeft } from 'react-icons/fi';
import Toast from './Toast';
import './AuthPage.css';
import veloraLogo from '../assets/velora_logo.png';

const AuthPage = () => {
  const navigate = useNavigate();
  const { login, register, googleLogin } = useAuth();
  
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotToast, setForgotToast] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  // Initialize Google Identity Services
  useEffect(() => {
    /* global google */
    if (window.google) {
      google.accounts.id.initialize({
        client_id: "YOUR_GOOGLE_CLIENT_ID_PLACEHOLDER.apps.googleusercontent.com",
        callback: async (response) => {
          try {
            setLoading(true);
            setError('');
            const token = response.credential;
            const payload = JSON.parse(atob(token.split('.')[1]));
            const res = await googleLogin(payload.name, payload.email, payload.sub);
            if (res.success) {
              navigate('/');
            } else {
              setError(res.message || 'Google authentication failed');
            }
          } catch (err) {
            console.error(err);
            setError('An error occurred during Google sign-in.');
          } finally {
            setLoading(false);
          }
        }
      });
      const btnEl = document.getElementById("google-signin-btn");
      if (btnEl) {
        google.accounts.id.renderButton(btnEl, { theme: "outline", size: "large", width: 220 });
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSimulatedGoogleLogin = async () => {
    setLoading(true);
    setError('');
    const res = await googleLogin(
      'Google User',
      'google.user@gmail.com',
      'google-id-123456'
    );
    if (res.success) {
      navigate('/');
    } else {
      setError(res.message);
    }
    setLoading(false);
  };

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
              <h3>{isLogin ? 'Welcome Back' : 'Create Account'}</h3>
              <p className="auth-subtitle">
                {isLogin 
                  ? 'Sign in to access your orders, points, and skincare vault.' 
                  : 'Join the circle for special member benefits and 10% off.'}
              </p>
            </div>

            {/* Tabs */}
            <div className="auth-tabs">
              <button 
                className={`auth-tab-btn ${isLogin ? 'active' : ''}`}
                onClick={() => { setIsLogin(true); setError(''); }}
              >
                Sign In
              </button>
              <button 
                className={`auth-tab-btn ${!isLogin ? 'active' : ''}`}
                onClick={() => { setIsLogin(false); setError(''); }}
              >
                Sign Up
              </button>
              <div className={`auth-indicator-pill ${!isLogin ? 'signup-active' : ''}`}></div>
            </div>

            {error && <div className="auth-error-alert">{error}</div>}

            {/* Form */}
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
                  <button type="button" className="forgot-password-link" onClick={() => setForgotToast({ message: '📧 Password reset link sent to your email!', type: 'info' })}>
                    Forgot Password?
                  </button>
                </div>
              )}

              <button type="submit" className="auth-submit-btn-large" disabled={loading}>
                {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <div className="auth-social-divider">
              <span>or continue with</span>
            </div>

            <div className="auth-social-buttons">
              <div id="google-signin-btn" className="google-gis-btn"></div>
              
              <button className="simulated-google-btn" onClick={handleSimulatedGoogleLogin}>
                <svg viewBox="0 0 24 24" width="18" height="18">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google Auth (Quick Test)
              </button>
            </div>

            {!isLogin && (
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
