import React, { useState, useEffect } from 'react';
import './StickyNote.css';
import { getCredentials } from '../config/credentials';

const StickyNote = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [credentials, setCredentials] = useState(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [emailProgress, setEmailProgress] = useState({ inbox: 0, processed: 0, total: 13 });
  const [whiteboardUnlocked, setWhiteboardUnlocked] = useState(false);

  // Handle Escape key to close sticky note
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' || event.key === 'Esc') {
        if (isVisible) {
          setIsVisible(false);
        }
      }
    };
    
    window.addEventListener('keydown', handleEscapeKey);
    return () => window.removeEventListener('keydown', handleEscapeKey);
  }, [isVisible]);

  // Listen for whiteboard opened event - unlock progress button visibility
  useEffect(() => {
    const handleShowBoard = (event) => {
      console.log('📋 Whiteboard opened - unlocking progress button');
      setWhiteboardUnlocked(true);
    };

    window.addEventListener('showBoard', handleShowBoard);
    return () => window.removeEventListener('showBoard', handleShowBoard);
  }, []);

  // Listen for the sticky note event from MainScene
  useEffect(() => {
    const handleShowStickyNote = (event) => {
      console.log('📝 Showing sticky note popup:', event.detail);
      // Use credentials from event, but ensure they're fresh from localStorage
      const currentCreds = getCredentials();
      setCredentials(currentCreds);
      setIsVisible(true);
      setIsMinimized(false);
    };

    window.addEventListener('showStickyNote', handleShowStickyNote);
    return () => window.removeEventListener('showStickyNote', handleShowStickyNote);
  }, []);

  // Listen for credential changes in localStorage
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'training_credentials' && isVisible) {
        console.log('🔄 Credentials updated, refreshing sticky note');
        const updatedCreds = getCredentials();
        setCredentials(updatedCreds);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [isVisible]);

  // Listen for email count updates and initialize from localStorage
  useEffect(() => {
    const handleEmailCountUpdated = (event) => {
      console.log('📊 Email progress updated:', event.detail);
      setEmailProgress(event.detail);
    };

    // Also listen for showDialogue to get initial email count from localStorage
    const handleShowDialogue = (event) => {
      const emailState = localStorage.getItem('emailState');
      if (emailState) {
        try {
          const state = JSON.parse(emailState);
          setEmailProgress({
            inbox: state.inboxCount || 0,
            processed: 13 - (state.inboxCount || 0),
            total: 13
          });
          console.log('📊 Initialized email progress from localStorage:', state.inboxCount);
        } catch (e) {
          console.error('Error parsing emailState:', e);
        }
      }
    };

    window.addEventListener('emailCountUpdated', handleEmailCountUpdated);
    window.addEventListener('showDialogue', handleShowDialogue);
    
    // Initialize from localStorage on mount
    const emailState = localStorage.getItem('emailState');
    if (emailState) {
      try {
        const state = JSON.parse(emailState);
        setEmailProgress({
          inbox: state.inboxCount || 0,
          processed: 13 - (state.inboxCount || 0),
          total: 13
        });
      } catch (e) {
        console.error('Error parsing emailState:', e);
      }
    }

    return () => {
      window.removeEventListener('emailCountUpdated', handleEmailCountUpdated);
      window.removeEventListener('showDialogue', handleShowDialogue);
    };
  }, []);

  const handleMinimize = () => {
    setIsMinimized(true);
  };

  const handleExpand = () => {
    setIsMinimized(false);
  };

  const handleProgressClick = () => {
    // Read fresh email count from localStorage
    let inboxCount = 0;
    const emailState = localStorage.getItem('emailState');
    if (emailState) {
      try {
        const state = JSON.parse(emailState);
        inboxCount = state.inboxCount || 0;
      } catch (e) {
        console.error('Error parsing emailState:', e);
      }
    }

    // Dispatch the whiteboard page 2 dialogue directly with fresh count
    const message = `📊 CURRENT PROGRESS 📊\n\nEmails remaining in Inbox:\n${inboxCount} email${inboxCount !== 1 ? 's' : ''} left to filter\n\nKeep working until your inbox is clear!\n\n[Press X to close | Press Z to go back]`;
    window.dispatchEvent(new CustomEvent('showDialogue', { 
      detail: { 
        name: 'WHITEBOARD - Page 2/2', 
        text: message,
        isWhiteboard: true,
        onClose: () => {
          // Close the whiteboard
          window.dispatchEvent(new CustomEvent('dialogueClosed', { detail: { isOpen: false } }));
        }
      } 
    }));
  };

  return (
    <>
      {/* Progress Button - always visible after whiteboard is unlocked, synced with email count */}
      {whiteboardUnlocked && (
        <button className="progress-tracker-button" onClick={handleProgressClick} title="View email progress">
          📧
        </button>
      )}
      
      {/* Sticky Note Button (minimized) */}
      {isVisible && isMinimized && (
        <button 
          className="sticky-note-button" 
          onClick={handleExpand}
          title="Click to view credentials"
        >
          📝
        </button>
      )}
      
      {/* Sticky Note Popup */}
      {isVisible && !isMinimized && credentials && (
      <div className="sticky-note-container">
        <div className="sticky-note-popup">
          <button className="sticky-note-minimize" onClick={handleMinimize}>−</button>
          
          <div style={{ fontSize: '11px', color: '#666', marginBottom: '8px', fontStyle: 'italic', textAlign: 'center' }}>
            Press ESC to close
          </div>
          
          <div className="sticky-note-header">Login Credentials</div>
          
          <div className="sticky-note-content">
            <div className="credential-item">
              <label>Email:</label>
              <code>{credentials.email}</code>
            </div>
            
            <div className="credential-item">
              <label>Password:</label>
              <code>{credentials.password}</code>
            </div>
            
            <div className="credential-divider"></div>
            
            <div className="credential-item">
              <label>Senior Dev's Email:</label>
              <code>{credentials.devEmail}</code>
            </div>
          </div>
          
          <div className="sticky-note-footer">
            Click minimize (−) to collapse
          </div>
        </div>
      </div>
      )}
    </>
  );
};

export default StickyNote;
