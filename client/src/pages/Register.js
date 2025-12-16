import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import { register } from '../services/api';
import './Register.css';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const recaptchaRef = useRef();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const validatePassword = (pwd) => {
    const hasUpperCase = /[A-Z]/.test(pwd);
    const hasLowerCase = /[a-z]/.test(pwd);
    const hasNumbers = /\d/.test(pwd);
    const hasSpecialChar = /[@$!%*?&]/.test(pwd);
    const isLongEnough = pwd.length >= 8;

    return {
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar,
      isLongEnough,
      isValid: hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar && isLongEnough
    };
  };

  const passwordStrength = validatePassword(formData.password);

  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    console.log('[REGISTER] Form submission - validating inputs');

    // Input validation
    if (!formData.username || !formData.email || !formData.password) {
      const errorMsg = 'All fields are required';
      console.warn(`[REGISTER] Validation failed: ${errorMsg}`);
      setError(errorMsg);
      return;
    }

    // Username validation (3-20 chars, alphanumeric + underscore/hyphen)
    if (formData.username.length < 3 || formData.username.length > 20) {
      const errorMsg = 'Username must be 3-20 characters';
      console.warn(`[REGISTER] Username length invalid: ${formData.username.length}`);
      setError(errorMsg);
      return;
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(formData.username)) {
      const errorMsg = 'Username can only contain letters, numbers, underscores, and hyphens';
      console.warn(`[REGISTER] Invalid username format`);
      setError(errorMsg);
      return;
    }

    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      const errorMsg = 'Invalid email format';
      console.warn(`[REGISTER] Invalid email format: ${formData.email}`);
      setError(errorMsg);
      return;
    }

    // CAPTCHA validation
    if (!captchaToken) {
      console.warn('[REGISTER] CAPTCHA not completed');
      setError('Please complete the CAPTCHA verification');
      return;
    }

    // Password validation
    if (formData.password !== formData.confirmPassword) {
      console.warn('[REGISTER] Passwords do not match');
      setError('Passwords do not match');
      return;
    }

    if (!passwordStrength.isValid) {
      console.warn('[REGISTER] Password strength insufficient');
      setError('Password does not meet requirements');
      return;
    }

    console.log(`[REGISTER] All validations passed for user: ${formData.username}`);
    setLoading(true);

    try {
      console.log('[REGISTER] Sending registration request to server...');
      const response = await register(
        formData.username,
        formData.email,
        formData.password,
        captchaToken
      );
      
      console.log('[REGISTER] Server response received:', response.success ? '✅ Success' : '❌ Failed');
      
      // Registration successful - redirect to 2FA setup (email auto-verified)
      if (response.success && response.user) {
        console.log(`[REGISTER] ✅ Registration complete for ${formData.username}, redirecting to 2FA setup`);
        // Store user info and token for 2FA setup
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('token', response.token);
        navigate('/setup-2fa');
      } else {
        const errorMsg = response.message || 'Registration failed. Please try again.';
        console.error(`[REGISTER] Server error: ${errorMsg}`);
        setError(errorMsg);
      }
    } catch (err) {
      const errorMsg = err.message || 'Registration failed. Please try again.';
      console.error(`[REGISTER] ❌ Error: ${errorMsg}`);
      console.error('[REGISTER] Stack:', err.stack);
      setError(errorMsg);
      setSuccess(false);
      // Reset captcha on error
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
      setCaptchaToken(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Register</h2>
        
        {success ? (
          <div className="success-message-box">
            <div className="success-icon">✓</div>
            <h3>Account created successfully!</h3>
            <p>We've sent a verification email to: <strong>{userEmail}</strong></p>
            <p>Please check your inbox and click the verification link.</p>
            <p className="note">Note: Check your spam folder if you don't see it.</p>
            <div className="button-group">
              <Link to="/login" className="submit-button">
                Back to Login
              </Link>
              {/* Resend verification email button - can implement later */}
              {/* <button className="submit-button secondary" onClick={handleResendVerification}>
                Resend Verification Email
              </button> */}
            </div>
          </div>
        ) : (
          <>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Enter your username"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {formData.password && (
              <div className="password-requirements">
                <p className="requirements-title">Password must contain:</p>
                <div className={`requirement ${passwordStrength.isLongEnough ? 'met' : ''}`}>
                  ✓ At least 8 characters
                </div>
                <div className={`requirement ${passwordStrength.hasUpperCase ? 'met' : ''}`}>
                  ✓ One uppercase letter (A-Z)
                </div>
                <div className={`requirement ${passwordStrength.hasLowerCase ? 'met' : ''}`}>
                  ✓ One lowercase letter (a-z)
                </div>
                <div className={`requirement ${passwordStrength.hasNumbers ? 'met' : ''}`}>
                  ✓ One number (0-9)
                </div>
                <div className={`requirement ${passwordStrength.hasSpecialChar ? 'met' : ''}`}>
                  ✓ One special character (@$!%*?&)
                </div>
              </div>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="password-input-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm your password"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>
          
          <div className="form-group captcha-group">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey="6LfwRC0sAAAAAI4uY5mHJ699kTPFnNeZVrNz9sbh"
              onChange={handleCaptchaChange}
              theme="dark"
            />
            <small style={{marginTop: '10px', color: '#999', fontSize: '11px'}}>
              This site is protected by reCAPTCHA and the Google
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{color: '#999', marginLeft: '3px'}}>Privacy Policy</a> and
              <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" style={{color: '#999', marginLeft: '3px'}}>Terms of Service</a> apply.
            </small>
          </div>

          <button 
            type="submit" 
            className="submit-button" 
            disabled={loading || !captchaToken}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
            </form>
            <p className="auth-link">
              Already have an account? <Link to="/login">Login here</Link>
            </p>
            <button onClick={() => navigate('/')} className="back-button" style={{marginTop: '15px', width: '100%', padding: '10px', backgroundColor: '#555', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer'}}>
              Back to Main Menu
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Register;


