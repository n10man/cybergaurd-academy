import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AiOutlineArrowLeft, AiOutlineCheckCircle, AiOutlineKey } from 'react-icons/ai';
import './PasswordRecovery.css';

function PasswordRecovery() {
  const navigate = useNavigate();
  const [step, setStep] = useState('email'); // email, verify, reset, complete
  const [email, setEmail] = useState('');
  const [twoFACode, setTwoFACode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    // In a real app, you'd verify the email exists
    // For now, proceed to 2FA code entry
    setLoading(false);
    setStep('verify');
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!twoFACode) {
      setError('Please enter your 2FA code or backup code');
      return;
    }

    setLoading(true);
    // Email, 2FA code validated on next step with password
    setLoading(false);
    setStep('reset');
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

  const passwordStrength = validatePassword(newPassword);

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!newPassword || !confirmPassword) {
      setError('Please enter and confirm your new password');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!passwordStrength.isValid) {
      setError('Password does not meet security requirements');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/recover-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          verificationCode: twoFACode,
          newPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Account recovery failed');
      }

      if (data.success && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setStep('complete');
      }
    } catch (err) {
      setError(err.message || 'Account recovery failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'complete') {
    return (
      <div className="password-recovery-container">
        <div className="recovery-card">
          <div className="success-checkmark"><AiOutlineCheckCircle /></div>
          <h2>Password Reset Successful!</h2>
          <p>Your account password has been reset. You are now logged in.</p>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/dashboard')}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="password-recovery-container">
      <div className="recovery-card">
        <Link to="/login" className="back-button">
          <AiOutlineArrowLeft />
          Back to Login
        </Link>

        <div className="recovery-icon">
          <AiOutlineKey />
        </div>
        <h1 className="recovery-title">Account Recovery</h1>

        {step === 'email' && (
          <form onSubmit={handleEmailSubmit} className="recovery-form">
            <p className="recovery-description">
              Don't worry! We can help you regain access to your account using your Two-Factor Authentication.
            </p>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your account email"
                className="form-input"
                required
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Verifying...' : 'Continue'}
            </button>
          </form>
        )}

        {step === 'verify' && (
          <form onSubmit={handleVerifySubmit} className="recovery-form">
            <p className="recovery-description">
              Enter your 2FA code or backup code to verify your identity.
            </p>

            <div className="form-group">
              <label>2FA Code or Backup Code</label>
              <input
                type="text"
                value={twoFACode}
                onChange={(e) => setTwoFACode(e.target.value.toUpperCase())}
                placeholder="000000 or XXXXXXXX"
                maxLength="8"
                className="form-input"
                required
                autoFocus
              />
              <small className="form-help">Enter 6-digit code or 8-character backup code</small>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify Code'}
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setStep('email');
                setError('');
              }}
            >
              Back
            </button>
          </form>
        )}

        {step === 'reset' && (
          <form onSubmit={handleResetSubmit} className="recovery-form">
            <p className="recovery-description">
              Create a new password for your account. Choose a strong password.
            </p>

            <div className="form-group">
              <label>New Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="form-input"
                required
              />
            </div>

            <div className="password-strength">
              <div className={`strength-item ${passwordStrength.hasUpperCase ? 'met' : ''}`}>
                ✓ Uppercase letter
              </div>
              <div className={`strength-item ${passwordStrength.hasLowerCase ? 'met' : ''}`}>
                ✓ Lowercase letter
              </div>
              <div className={`strength-item ${passwordStrength.hasNumbers ? 'met' : ''}`}>
                ✓ Number
              </div>
              <div className={`strength-item ${passwordStrength.hasSpecialChar ? 'met' : ''}`}>
                ✓ Special character (@$!%*?&)
              </div>
              <div className={`strength-item ${passwordStrength.isLongEnough ? 'met' : ''}`}>
                ✓ At least 8 characters
              </div>
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="form-input"
                required
              />
              <label className="show-password-toggle">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                />
                Show password
              </label>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !passwordStrength.isValid}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setStep('verify');
                setError('');
              }}
            >
              Back
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default PasswordRecovery;
