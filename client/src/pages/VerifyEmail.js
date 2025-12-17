import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { verifyEmail } from '../services/api';
import './VerifyEmail.css';

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const verifyEmailToken = async () => {
      // Extract token from URL query parameter
      const token = searchParams.get('token');

      // If no token, set error
      if (!token) {
        setError('No verification token provided');
        setLoading(false);
        return;
      }

      // Make API request to verify email
      try {
        const response = await verifyEmail(token);
        
        // On success - check if login token is provided
        if (response.token) {
          // Auto-login: save token and user info
          localStorage.setItem('token', response.token);
          if (response.user) {
            localStorage.setItem('user', JSON.stringify(response.user));
          }
          
          setSuccess(true);
          setMessage('Email verified successfully! Welcome to CyberGuard Academy.');
          setError(null);
          
          // Countdown and redirect to dashboard
          const timer = setInterval(() => {
            setCountdown(prev => {
              if (prev <= 1) {
                clearInterval(timer);
                navigate('/dashboard');
                return 0;
              }
              return prev - 1;
            });
          }, 1000);

          return () => clearInterval(timer);
        } else {
          // No token provided, just show success message
          setSuccess(true);
          setMessage(response.message || 'Email verified successfully! You can now login.');
          setError(null);
        }
      } catch (err) {
        // On error
        setSuccess(false);
        setError(err.message || 'Failed to verify email. Please try again.');
        setMessage('');
      } finally {
        setLoading(false);
      }
    };

    verifyEmailToken();
  }, [searchParams, navigate]);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Email Verification</h2>
        
        {loading && (
          <div className="verification-status">
            <div className="spinner"></div>
            <p>Verifying your email...</p>
          </div>
        )}

        {!loading && success && (
          <div className="verification-status success">
            <div className="success-icon">✓</div>
            <p className="success-message">{message}</p>
            <p className="redirect-message">
              Redirecting to dashboard in {countdown}s...
            </p>
            <div className="progress-bar">
              <div className="progress-fill" style={{width: `${(5-countdown) * 20}%`}}></div>
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="verification-status error">
            <div className="error-icon">✗</div>
            <p className="error-message">{error}</p>
            <div className="button-group">
              <a href="/" className="submit-button">
                Back to Home
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default VerifyEmail;

