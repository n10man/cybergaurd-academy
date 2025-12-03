import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { register } from '../services/api';
import './Register.css';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  // reCAPTCHA removed for debugging - keep other form state intact

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  // handleCaptchaChange removed

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // CAPTCHA removed - proceed with basic validation

    // Validation
      if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

      if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const response = await register(
        formData.username,
        formData.email,
        formData.password
      );
      
      // Registration successful - show email verification instructions
      if (response.success && response.user) {
        setSuccess(true);
        setUserEmail(response.user.email || formData.email);
        setError('');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
      setSuccess(false);
      // No captcha to reset
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
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password (min 6 characters)"
              minLength={6}
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm your password"
              minLength={6}
            />
          </div>
          {/* reCAPTCHA removed for debugging */}
          <button 
            type="submit" 
            className="submit-button" 
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
            </form>
            <p className="auth-link">
              Already have an account? <Link to="/login">Login here</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default Register;


