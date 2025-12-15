import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('token');

  // If already logged in, redirect to dashboard
  React.useEffect(() => {
    if (isLoggedIn) {
      navigate('/dashboard');
    }
  }, [isLoggedIn, navigate]);

  if (isLoggedIn) {
    return null;
  }

  return (
    <div className="landing-container">
      <div className="landing-content">
        <header className="landing-header">
          <h1>🔐 CyberGuard Academy</h1>
          <p>Master Cybersecurity Through Interactive Training</p>
        </header>

        <section className="landing-hero">
          <div className="hero-text">
            <h2>Learn Cybersecurity The Right Way</h2>
            <p>Join our interactive training platform and master email security, phishing detection, and cyber awareness through hands-on scenarios.</p>
          </div>
        </section>

        <section className="landing-features">
          <div className="feature">
            <div className="feature-icon">📧</div>
            <h3>Email Security Training</h3>
            <p>Learn to identify phishing emails and malicious content</p>
          </div>
          <div className="feature">
            <div className="feature-icon">🎮</div>
            <h3>Interactive Scenarios</h3>
            <p>Practice real-world cybersecurity situations</p>
          </div>
          <div className="feature">
            <div className="feature-icon">📊</div>
            <h3>Track Progress</h3>
            <p>Monitor your learning journey and improvements</p>
          </div>
          <div className="feature">
            <div className="feature-icon">🔐</div>
            <h3>Secure Training</h3>
            <p>Learn security best practices with 2FA protection</p>
          </div>
        </section>

        <section className="landing-cta">
          <button 
            className="btn btn-primary" 
            onClick={() => navigate('/login')}
          >
            Login
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={() => navigate('/register')}
          >
            Create Account
          </button>
        </section>

        <footer className="landing-footer">
          <p>&copy; 2025 CyberGuard Academy. Securing the future, one user at a time.</p>
        </footer>
      </div>
    </div>
  );
}

export default LandingPage;
