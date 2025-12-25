import React from 'react';
import { useNavigate } from 'react-router-dom';
import GameCanvas from '../components/GameCanvas';
import EmailClient from '../components/EmailClient';
import ComputerScreen from '../components/ComputerScreen';
import StickyNote from '../components/StickyNote';
import Guidelines from '../components/Guidelines';
import { SAFE_EMAILS, PHISHING_EMAILS } from '../data/emailData';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [showEmailClient, setShowEmailClient] = React.useState(false);

  // Initialize email state on dashboard load so whiteboard shows correct count before login
  React.useEffect(() => {
    // Only initialize if not already set
    if (!localStorage.getItem('emailState')) {
      const realEmailsCount = SAFE_EMAILS.length;
      const phishingEmailsCount = PHISHING_EMAILS.length;
      const totalEmails = realEmailsCount + phishingEmailsCount;
      
      localStorage.setItem('emailState', JSON.stringify({
        inboxCount: totalEmails,
        safeCount: 0,
        phishingCount: 0,
        totalProcessed: 0
      }));
      console.log('📧 Initialized email state:', { inboxCount: totalEmails });
    }
  }, []);

  React.useEffect(() => {
    const handleOpenEmailClient = () => {
      console.log('📧 Opening email client from game');
      setShowEmailClient(true);
    };
    window.addEventListener('openEmailClient', handleOpenEmailClient);
    return () => window.removeEventListener('openEmailClient', handleOpenEmailClient);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>CyberGuard Academy</h1>
        <div className="header-right">
          <span className="welcome-text">Welcome, {user.username || 'User'}!</span>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </div>
      <div className="dashboard-content">
        <Guidelines />
        <div className="game-section">
          <GameCanvas />
        </div>
      </div>
      
      {/* 📧 Email Client Modal */}
      <EmailClient isOpen={showEmailClient} onClose={() => setShowEmailClient(false)} />
      
      {/* 💻 Computer Screen Modal - handles whiteboard dialogues and always listens for events */}
      <ComputerScreen isOpen={false} onClose={() => {}} />
      
      {/* 📝 Sticky Note Popup - displays login credentials */}
      <StickyNote />
    </div>
  );
}

export default Dashboard;


