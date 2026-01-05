import React from 'react';
import { useNavigate } from 'react-router-dom';
import GameCanvas from '../components/GameCanvas';
import EmailClient from '../components/EmailClient';
import ComputerScreen from '../components/ComputerScreen';
import StickyNote from '../components/StickyNote';
import Guidelines from '../components/Guidelines';
import { SAFE_EMAILS, PHISHING_EMAILS } from '../data/emailData';
import { loadProgress } from '../utils/gameUtils';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [showEmailClient, setShowEmailClient] = React.useState(false);
  const [isLoadingProgress, setIsLoadingProgress] = React.useState(true);

  // Load saved progress from database on dashboard load
  React.useEffect(() => {
    const restoreUserProgress = async () => {
      try {
        if (!user.id) {
          setIsLoadingProgress(false);
          return;
        }

        // Get token from localStorage
        const token = localStorage.getItem('token');
        if (!token) {
          setIsLoadingProgress(false);
          return;
        }

        console.log('📥 Loading progress from database for user:', user.id);
        const response = await loadProgress(user.id);
        
        if (response && response.progress && response.progress.length > 0) {
          const savedProgress = response.progress[0];
          console.log('📥 Restored progress from DB:', savedProgress);

          // Restore game progress to localStorage
          if (savedProgress.current_level) {
            localStorage.setItem('gameProgress', savedProgress.current_level);
          }

          // Restore position
          if (savedProgress.last_position_x !== null) {
            localStorage.setItem('lastPositionX', savedProgress.last_position_x);
          }
          if (savedProgress.last_position_y !== null) {
            localStorage.setItem('lastPositionY', savedProgress.last_position_y);
          }

          // Restore email state based on completed modules
          if (savedProgress.completed_modules) {
            try {
              const completedModules = typeof savedProgress.completed_modules === 'string' 
                ? JSON.parse(savedProgress.completed_modules) 
                : savedProgress.completed_modules;
              
              if (Array.isArray(completedModules) && completedModules.length > 0) {
                localStorage.setItem('emailState', JSON.stringify({
                  inboxCount: SAFE_EMAILS.length + PHISHING_EMAILS.length,
                  safeCount: completedModules.filter(m => m.type === 'safe').length || 0,
                  phishingCount: completedModules.filter(m => m.type === 'phishing').length || 0,
                  totalProcessed: completedModules.length
                }));
              }
            } catch (e) {
              console.error('Error parsing completed modules:', e);
            }
          }

          // Mark that progress was loaded from database (don't clear on scene create)
          localStorage.setItem('progressLoadedFromDB', 'true');
        } else {
          console.log('📥 No saved progress found, starting fresh game');
          localStorage.removeItem('progressLoadedFromDB');
        }
      } catch (error) {
        console.error('Error loading progress from database:', error);
        localStorage.removeItem('progressLoadedFromDB');
      } finally {
        setIsLoadingProgress(false);
      }
    };

    restoreUserProgress();
  }, [user.id]);

  // Initialize email state on dashboard load so whiteboard shows correct count before login
  React.useEffect(() => {
    // Only initialize if we didn't load progress from database
    if (!localStorage.getItem('progressLoadedFromDB') && !localStorage.getItem('emailStateInitialized')) {
      const realEmailsCount = SAFE_EMAILS.length;
      const phishingEmailsCount = PHISHING_EMAILS.length;
      const totalEmails = realEmailsCount + phishingEmailsCount;
      
      localStorage.setItem('emailState', JSON.stringify({
        inboxCount: totalEmails,
        safeCount: 0,
        phishingCount: 0,
        totalProcessed: 0
      }));
      localStorage.setItem('emailStateInitialized', 'true');
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
    // Clear ALL localStorage to reset for next login
    localStorage.clear();
    navigate('/');
  };

  if (isLoadingProgress) {
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
        <div className="dashboard-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
          <p>Loading your progress...</p>
        </div>
      </div>
    );
  }

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


