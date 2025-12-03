import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { verifyEmail } from '../services/api';
import './VerifyEmail.css';

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

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
        
        // On success
        setSuccess(true);
        setMessage(response.message || 'Email verified successfully! You can now login.');
        setError(null);
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
  }, [searchParams]);

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
          <div className="verification-status">
            <div className="success-icon">✓</div>
            <p className="success-message">{message}</p>
            <Link to="/login" className="submit-button">
              Go to Login
            </Link>
          </div>
        )}

        {!loading && error && (
          <div className="verification-status">
            <div className="error-icon">✗</div>
            <p className="error-message">{error}</p>
            <div className="button-group">
              <Link to="/register" className="submit-button secondary">
                Back to Register
              </Link>
              {/* Resend verification button can be added later */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default VerifyEmail;

