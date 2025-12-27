import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineArrowLeft, AiOutlineLock } from 'react-icons/ai';
import { login } from '../services/api';
import './Login.css';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [twoFACode, setTwoFACode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [requiresTwoFA, setRequiresTwoFA] = useState(false);
  const [pendingUser, setPendingUser] = useState(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const navigate = useNavigate();

  // Load saved email on component mount
  React.useEffect(() => {
    const savedEmail = localStorage.getItem('rememberMeEmail');
    if (savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      const errorMsg = 'Email and password are required';
      setError(errorMsg);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      const errorMsg = 'Invalid email format';
      setError(errorMsg);
      return;
    }

    setLoading(true);

    try {
      const response = await login(formData.email, formData.password);
      
      if (response.requiresTwoFA) {
        // 2FA is enabled - show 2FA code input
        console.log('[LOGIN] 2FA required - showing 2FA verification screen');
        setRequiresTwoFA(true);
        setPendingUser({
          userId: response.userId,
          email: response.email,
          username: response.username
        });
        setError('');
      } else if (response.requiresSetup2FA) {
        // User hasn't set up 2FA yet - force setup
        console.log('[LOGIN] User must set up 2FA before accessing dashboard');
        localStorage.setItem('user', JSON.stringify({
          id: response.userId,
          username: response.username,
          email: response.email
        }));
        localStorage.setItem('token', 'temp-token-for-2fa-setup');
        navigate('/setup-2fa');
      } else if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        // Save email if remember me is checked
        if (rememberMe) {
          localStorage.setItem('rememberMeEmail', formData.email);
        } else {
          localStorage.removeItem('rememberMeEmail');
        }
        
        navigate('/dashboard');
      } else {
        const errorMsg = response.message || 'Login failed. Please try again.';
        setError(errorMsg);
      }
    } catch (err) {
      const errorMsg = err.message || 'Login failed. Please try again.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handle2FASubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!twoFACode) {
      setError('Please enter your 2FA code or backup code');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/verify-2fa-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: pendingUser.userId,
          verificationCode: twoFACode
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '2FA verification failed');
      }

      if (data.success && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        if (data.remainingBackupCodes !== undefined) {
          console.warn(`[LOGIN] Backup code used. ${data.remainingBackupCodes} backup codes remaining.`);
        }
        
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || '2FA verification failed');
    } finally {
      setLoading(false);
    }
  };

  if (requiresTwoFA && pendingUser) {
    return (
      <div className="login-container">
        <div className="login-wrapper">
          <Link 
            to="#" 
            className="back-button"
            onClick={() => {
              setRequiresTwoFA(false);
              setPendingUser(null);
              setTwoFACode('');
              setFormData({ email: '', password: '' });
            }}
          >
            <AiOutlineArrowLeft />
            Back
          </Link>
          <div className="login-logo">
            <AiOutlineLock className="logo-lock" />
          </div>
          <h1 className="login-title">Two-Factor Authentication</h1>
          <p className="login-subtitle">Enter your authentication code</p>
          <p className="login-description">Enter the 6-digit code from your authenticator app or a backup code</p>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handle2FASubmit} className="login-form">
            <div className="form-group">
              <input
                type="text"
                value={twoFACode}
                onChange={(e) => setTwoFACode(e.target.value.toUpperCase())}
                maxLength="8"
                placeholder="000000 or XXXXXXXX"
                className="form-input"
                autoFocus
              />
              <small className="form-help">Enter 6-digit code or 8-character backup code</small>
            </div>
            
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify'}
            </button>
          </form>

          <p className="login-help-text">
            Lost access to your authenticator? <Link to="/password-recovery" className="forgot-link">Use password recovery</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <Link to="/" className="back-button">
          <AiOutlineArrowLeft />
          Back
        </Link>
        <div className="login-logo">
          <div className="logo-c">C</div>
        </div>
        <h1 className="login-title">CyberGuard Academy</h1>
        <p className="login-subtitle">Welcome back</p>
        <p className="login-description">Please enter your details to sign in.</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email..."
              className="form-input"
            />
          </div>
          
          <div className="form-group password-group">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              className="form-input"
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </button>
          </div>
          
          <div className="form-options">
            <label className="remember-me">
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember me
            </label>
            <Link to="/password-recovery" className="forgot-password">Forgot password?</Link>
          </div>
          
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        
        <p className="signup-text">
          Don't have an account yet? <Link to="/register" className="signup-link">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;

