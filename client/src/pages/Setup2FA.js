import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Setup2FA.css';

function Setup2FA() {
  const navigate = useNavigate();
  const [step, setStep] = useState('intro'); // intro, qrcode, verify, complete
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [backupCodes, setBackupCodes] = useState([]);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (step === 'qrcode') {
      generateQRCode();
    }
  }, [step]);

  const generateQRCode = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      console.log('📱 Generating QR Code...');
      console.log('Token exists:', !!token);
      console.log('Token:', token ? token.substring(0, 20) + '...' : 'NO TOKEN');
      
      const response = await fetch('http://localhost:5000/api/auth/setup-2fa', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (data.qrCode && data.secret) {
        setQrCode(data.qrCode);
        setSecret(data.secret);
      }
    } catch (err) {
      console.error('QR generation error:', err);
      setError('Failed to generate QR code');
    } finally {
      setLoading(false);
    }
  };

  const verifyAndEnable2FA = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/verify-2fa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          verificationCode,
          secret,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '2FA setup failed');
      }

      setBackupCodes(data.backupCodes || []);
      setStep('complete');
    } catch (err) {
      setError(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const downloadBackupCodes = () => {
    const element = document.createElement('a');
    const file = new Blob(
      [
        `CyberGuard Academy - 2FA Backup Codes\nUsername: ${user.username}\nGenerated: ${new Date().toLocaleString()}\n\n${backupCodes.join('\n')}\n\nKEEP THESE SAFE. DO NOT SHARE WITH ANYONE.`,
      ],
      { type: 'text/plain' }
    );
    element.href = URL.createObjectURL(file);
    element.download = `${user.username}-backup-codes.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const finishSetup = () => {
    navigate('/dashboard');
  };

  return (
    <div className="setup-2fa-container">
      <div className="setup-2fa-card">
        {step === 'intro' && (
          <div className="setup-step">
            <h2>🔐 Enable Two-Factor Authentication</h2>
            <p>Two-factor authentication adds an extra layer of security to your account.</p>

            <div className="security-benefits">
              <div className="benefit">
                <span className="benefit-icon">✓</span>
                <div>
                  <h4>Enhanced Security</h4>
                  <p>Protect your account even if your password is compromised</p>
                </div>
              </div>
              <div className="benefit">
                <span className="benefit-icon">✓</span>
                <div>
                  <h4>Easy to Use</h4>
                  <p>Use any authenticator app (Google Authenticator, Authy, Microsoft Authenticator)</p>
                </div>
              </div>
              <div className="benefit">
                <span className="benefit-icon">✓</span>
                <div>
                  <h4>Backup Codes</h4>
                  <p>Receive backup codes to regain access if you lose your authenticator</p>
                </div>
              </div>
            </div>

            <div className="setup-buttons">
              <button 
                className="btn btn-primary"
                onClick={() => setStep('qrcode')}
              >
                Get Started
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => navigate('/dashboard')}
              >
                Skip for Now
              </button>
            </div>
          </div>
        )}

        {step === 'qrcode' && (
          <div className="setup-step">
            <h2>📱 Scan QR Code</h2>
            <p>Use your authenticator app to scan this QR code:</p>

            {qrCode ? (
              <>
                <div className="qrcode-container">
                  <img 
                    src={qrCode} 
                    alt="QR Code" 
                    className="qrcode-image"
                  />
                </div>

                <div className="manual-entry">
                  <p>Can't scan? Enter this code manually:</p>
                  <code className="secret-code">{secret}</code>
                </div>

                <p className="setup-note">
                  👉 Recommended apps: Google Authenticator, Microsoft Authenticator, Authy
                </p>

                <button 
                  className="btn btn-primary"
                  onClick={() => setStep('verify')}
                >
                  I've Scanned the Code
                </button>
              </>
            ) : (
              <p>Loading QR code...</p>
            )}

            {error && <div className="error-message">{error}</div>}
          </div>
        )}

        {step === 'verify' && (
          <div className="setup-step">
            <h2>✓ Verify Setup</h2>
            <p>Enter the 6-digit code from your authenticator app:</p>

            <form onSubmit={verifyAndEnable2FA}>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="000000"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength="6"
                  className="verification-input"
                  autoFocus
                />
              </div>

              {error && <div className="error-message">{error}</div>}

              <button 
                type="submit"
                className="btn btn-primary"
                disabled={loading || verificationCode.length !== 6}
              >
                {loading ? 'Verifying...' : 'Verify & Enable 2FA'}
              </button>

              <button 
                type="button"
                className="btn btn-secondary"
                onClick={() => setStep('qrcode')}
              >
                Back
              </button>
            </form>
          </div>
        )}

        {step === 'complete' && (
          <div className="setup-step">
            <div className="success-checkmark">✓</div>
            <h2>🎉 2FA Enabled Successfully!</h2>
            <p>Your account is now protected with two-factor authentication.</p>

            <div className="backup-codes-section">
              <h3>⚠️  Save Your Backup Codes</h3>
              <p>If you lose access to your authenticator, you can use these codes to regain access. Each code can be used once.</p>

              <div className="backup-codes-list">
                {backupCodes.map((code, idx) => (
                  <div key={idx} className="backup-code">
                    {code}
                  </div>
                ))}
              </div>

              <button 
                className="btn btn-secondary"
                onClick={downloadBackupCodes}
              >
                📥 Download Backup Codes
              </button>
            </div>

            <button 
              className="btn btn-primary"
              onClick={finishSetup}
            >
              Go to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Setup2FA;
