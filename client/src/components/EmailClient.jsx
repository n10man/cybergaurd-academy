import React, { useState, useEffect } from 'react';
import './EmailClient.css';
import { SAFE_EMAILS, PHISHING_EMAILS } from '../data/emailData';
import { getCredentials } from '../config/credentials';

const EmailClient = ({ isOpen, onClose }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [currentFolder, setCurrentFolder] = useState('all-emails');
  const [score, setScore] = useState(0);
  const [stats, setStats] = useState({ safe: 0, phishing: 0, inbox: 0 });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmails, setSelectedEmails] = useState(new Set());
  const [linkNotification, setLinkNotification] = useState(null);

  // Handle Escape key to close email client
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' || event.key === 'Esc') {
        if (isOpen) {
          onClose();
        }
      }
    };
    
    window.addEventListener('keydown', handleEscapeKey);
    return () => window.removeEventListener('keydown', handleEscapeKey);
  }, [isOpen, onClose]);

  // Get 6 real emails and 7 phishing (13 total as requested)
  useEffect(() => {
    const realEmails = SAFE_EMAILS.map(e => ({ ...e, isPhishing: false, folder: 'inbox', read: false }));
    const phishingEmails = PHISHING_EMAILS.map(e => ({ ...e, isPhishing: true, folder: 'inbox', read: false }));
    // Shuffle all 13 emails randomly
    const allEmails = [...realEmails, ...phishingEmails].sort(() => Math.random() - 0.5);
    setEmails(allEmails);
  }, []);

  // Update stats
  useEffect(() => {
    const newStats = {
      inbox: emails.filter(e => e.folder === 'inbox').length,
      safe: emails.filter(e => e.folder === 'safe').length,
      phishing: emails.filter(e => e.folder === 'phishing').length
    };
    setStats(newStats);
    
    // Save email state to localStorage so whiteboard can access it
    localStorage.setItem('emailState', JSON.stringify({
      inboxCount: newStats.inbox,
      safeCount: newStats.safe,
      phishingCount: newStats.phishing,
      totalProcessed: newStats.safe + newStats.phishing
    }));
  }, [emails]);

  // Disable Phaser keyboard input when modal is open to allow form input
  useEffect(() => {
    if (isOpen) {
      // Find all Phaser scenes and disable keyboard input
      const scenes = window.__PHASER_SCENES;
      if (scenes) {
        scenes.forEach(scene => {
          if (scene && scene.input && scene.input.keyboard) {
            scene.input.keyboard.enabled = false;
          }
        });
      }
      return () => {
        // Re-enable keyboard when modal closes
        if (scenes) {
          scenes.forEach(scene => {
            if (scene && scene.input && scene.input.keyboard) {
              scene.input.keyboard.enabled = true;
            }
          });
        }
      };
    }
  }, [isOpen]);

  const handleLogin = (e) => {
    e.preventDefault();
    const credentials = getCredentials();
    if (email === credentials.email && password === credentials.password) {
      setIsLoggedIn(true);
      setLoginError('');
      setEmail('');
      setPassword('');
    } else {
      setLoginError(`Invalid credentials. Try ${credentials.email} / ${credentials.password}`);
      setPassword('');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setEmail('');
    setPassword('');
    setSelectedEmail(null);
    setCurrentFolder('all-emails');
  };

  const handleKeepEmail = () => {
    if (!selectedEmail) return;
    
    const isCorrect = !selectedEmail.isPhishing;
    
    if (isCorrect) {
      setScore(prev => prev + 10);
      setFeedback({
        type: 'correct',
        title: 'Correct Option!',
        message: selectedEmail.feedbackCorrect
      });
    } else {
      setScore(prev => Math.max(0, prev - 10));
      setFeedback({
        type: 'incorrect',
        title: 'Wrong Option!',
        message: selectedEmail.feedbackIncorrect
      });
    }

    // Move to safe folder
    setEmails(emails.map(e => 
      e.id === selectedEmail.id ? { ...e, folder: 'safe' } : e
    ));
  };

  const handleDeleteEmail = () => {
    if (!selectedEmail) return;
    
    const isCorrect = selectedEmail.isPhishing;
    
    if (isCorrect) {
      setScore(prev => prev + 10);
      setFeedback({
        type: 'correct',
        title: 'Correct Option!',
        message: selectedEmail.feedbackCorrect
      });
    } else {
      setScore(prev => Math.max(0, prev - 10));
      setFeedback({
        type: 'incorrect',
        title: 'Wrong Option!',
        message: selectedEmail.feedbackIncorrect
      });
    }

    // Move to phishing folder
    setEmails(emails.map(e => 
      e.id === selectedEmail.id ? { ...e, folder: 'phishing' } : e
    ));
  };

  const filteredEmails = emails.filter(e => {
    if (currentFolder === 'all-emails') return e.folder === 'inbox';
    if (currentFolder === 'safe') return e.folder === 'safe';
    if (currentFolder === 'phishing') return e.folder === 'phishing';
    return e.folder === 'inbox';
  }).filter(e => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      e.from.toLowerCase().includes(term) ||
      e.subject.toLowerCase().includes(term) ||
      e.preview.toLowerCase().includes(term) ||
      e.fullContent.toLowerCase().includes(term)
    );
  });

  // Clear feedback when search term or folder changes
  useEffect(() => {
    setFeedback(null);
  }, [searchTerm, currentFolder]);

  // Clear feedback when opening a new email
  useEffect(() => {
    setFeedback(null);
  }, [selectedEmail]);

  const handleSelectEmail = (e, mailId) => {
    e.stopPropagation();
    const newSelected = new Set(selectedEmails);
    if (newSelected.has(mailId)) {
      newSelected.delete(mailId);
    } else {
      newSelected.add(mailId);
    }
    setSelectedEmails(newSelected);
  };

  const getAvatarColor = (senderEmail) => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
      '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B88B', '#82E0AA'
    ];
    let hash = 0;
    for (let i = 0; i < senderEmail.length; i++) {
      hash = senderEmail.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  // Function to render email content with clickable links
  const handleLinkClick = (e, url) => {
    e.preventDefault();
    setLinkNotification(`Clicked on: ${url}`);
    setTimeout(() => setLinkNotification(null), 3000); // Hide after 3 seconds
  };

  const renderEmailContent = (content) => {
    // Match patterns like:
    // - "Displayed Text (actual URL)"
    // - "Displayed Text: http://url"
    // - Just URLs: http://url
    
    const parts = [];
    let lastIndex = 0;
    
    // Regex to find both formatted and plain URLs
    const urlRegex = /([a-zA-Z0-9\s:@\-_]*?)?\(?https?:\/\/[^\s)]+\)?/g;
    let match;
    
    while ((match = urlRegex.exec(content)) !== null) {
      // Add text before the link
      if (match.index > lastIndex) {
        parts.push(content.substring(lastIndex, match.index));
      }
      
      const fullMatch = match[0];
      
      // Parse the display text and actual URL
      let displayText = '';
      let actualUrl = '';
      
      // Check for format: "Display Text (URL)" or "Display Text: URL"
      const textAndUrlMatch = fullMatch.match(/^([^(]*?)\s*\(?https?:\/\/([^\s)]+)\)?$/i);
      
      if (textAndUrlMatch && textAndUrlMatch[1]?.trim()) {
        displayText = textAndUrlMatch[1].trim().replace(/:$/, '');
        actualUrl = 'https://' + textAndUrlMatch[2];
      } else {
        // Plain URL - extract it
        const urlMatch = fullMatch.match(/(https?:\/\/[^\s)]+)/);
        actualUrl = urlMatch ? urlMatch[1] : fullMatch;
        displayText = actualUrl;
      }
      
      // Add the link element
      parts.push(
        <a
          key={`link-${lastIndex}`}
          href="#"
          onClick={(e) => handleLinkClick(e, actualUrl)}
          className="email-link"
          title={`Link: ${actualUrl}`}
        >
          {displayText}
        </a>
      );
      
      lastIndex = match.index + fullMatch.length;
    }
    
    // Add remaining text
    if (lastIndex < content.length) {
      parts.push(content.substring(lastIndex));
    }
    
    return parts.length > 0 ? parts : content;
  };

  const handleFolderClick = (folder) => {
    setCurrentFolder(folder);
    // If viewing an email, keep it open but switch folder view
    // The selected email will now show in context of new folder
  };

  if (!isOpen) return null;

  return (
    <div className="email-client-overlay" onClick={onClose}>
      <div className="email-client-window" onClick={(e) => e.stopPropagation()}>
        {linkNotification && (
          <div className="link-notification">
            {linkNotification}
          </div>
        )}
        {!isLoggedIn ? (
          // LOGIN SCREEN
          <div className="email-login-container">
            <div className="email-login-box">
              <h1>Gmail</h1>
              <form onSubmit={handleLogin}>
                <div className="email-login-field">
                  <label>Email:</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="xyz@gmail.com"
                    autoFocus
                  />
                </div>
                <div className="email-login-field">
                  <label>Password:</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="123"
                  />
                </div>
                {loginError && <div className="email-login-error">{loginError}</div>}
                <button type="submit" className="email-login-button">Sign In</button>
              </form>
            </div>
          </div>
        ) : (
          // EMAIL CLIENT SCREEN - Gmail Style
          <div className="email-client-main">
            {/* ESC Hint */}
            <div style={{ fontSize: '11px', color: '#666', paddingBottom: '5px', paddingRight: '10px', textAlign: 'right', fontStyle: 'italic' }}>
              Press ESC or X to exit
            </div>
            {/* Header */}
            <div className="email-client-header-bar">
              <div className="email-header-left">
                <button 
                  className="email-menu-btn"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  title="Toggle sidebar"
                >
                  ☰
                </button>
                <h1 className="email-logo">Phishing Academy</h1>
                <div className="email-search-bar">
                  <input 
                    type="text" 
                    placeholder="Search mail"
                    spellCheck="false"
                    autoComplete="off"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="email-header-right">
                <span className="email-score">Score: {score}</span>
                <button className="email-logout-btn" onClick={handleLogout}>Logout</button>
                <button className="email-close-btn" onClick={onClose}>Close</button>
              </div>
            </div>

            <div className="email-client-container">
              {/* Sidebar - Hidden when viewing email */}
              {!selectedEmail && (
                <div className={`email-sidebar ${!sidebarOpen ? 'collapsed' : ''}`}>
                  <nav className="email-sidebar-nav">
                    <button 
                      className={`email-nav-item ${currentFolder === 'all-emails' ? 'active' : ''}`}
                      onClick={() => handleFolderClick('all-emails')}
                    >
                      <span className="email-nav-icon">▌</span>
                      <span className="email-nav-label">All Emails</span>
                      <span className="email-nav-count">{stats.inbox}</span>
                    </button>
                    
                    <button 
                      className={`email-nav-item ${currentFolder === 'safe' ? 'active' : ''}`}
                      onClick={() => handleFolderClick('safe')}
                    >
                      <span className="email-nav-icon">✓</span>
                      <span className="email-nav-label">Safe</span>
                      <span className="email-nav-count">{stats.safe}</span>
                    </button>
                    
                    <button 
                      className={`email-nav-item ${currentFolder === 'phishing' ? 'active' : ''}`}
                      onClick={() => handleFolderClick('phishing')}
                    >
                      <span className="email-nav-icon">!</span>
                      <span className="email-nav-label">Phishing</span>
                      <span className="email-nav-count">{stats.phishing}</span>
                    </button>
                  </nav>
                </div>
              )}

              {/* Main Content */}
              <div className="email-content">
                {selectedEmail ? (
                  // EMAIL DETAIL VIEW
                  <div className="email-detail-view">
                    <div className="email-detail-header">
                      <button 
                        className="email-detail-back" 
                        onClick={() => setSelectedEmail(null)}
                      >
                        ← Back
                      </button>
                      <div className="email-detail-title">
                        <h2>{selectedEmail.subject}</h2>
                        <p className="email-detail-from">From: {selectedEmail.from}</p>
                      </div>
                    </div>

                    {/* Sidebar visible while reading email */}
                    <div className="email-detail-with-sidebar">
                      <div className="email-detail-body">
                        <div className="email-detail-content">
                          {renderEmailContent(selectedEmail.fullContent)}
                        </div>
                        {selectedEmail.attachments && selectedEmail.attachments.length > 0 && (
                          <div className="email-attachments-section">
                            <div className="email-attachments-header">
                              <span className="attachments-icon">[A]</span>
                              <span className="attachments-title">
                                {selectedEmail.attachments.length} attachment{selectedEmail.attachments.length !== 1 ? 's' : ''}
                              </span>
                            </div>
                            <div className="email-attachments-list">
                              {selectedEmail.attachments.map((attachment, index) => (
                                <div key={index} className="email-attachment-item">
                                  <div className="attachment-icon">
                                    {attachment.type === 'document' ? 'DOC' : 
                                     attachment.type === 'executable' ? 'EXE' : 
                                     attachment.type === 'archive' ? 'ZIP' : 'FILE'}
                                  </div>
                                  <div className="attachment-details">
                                    <div className="attachment-name">{attachment.name}</div>
                                    <div className="attachment-size">{attachment.size}</div>
                                  </div>
                                  <button className="attachment-download-btn">
                                    Download
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="email-action-buttons">
                          <button 
                            className="email-action-btn keep-btn"
                            onClick={handleKeepEmail}
                          >
                            Keep (Safe)
                          </button>
                          <button 
                            className="email-action-btn delete-btn"
                            onClick={handleDeleteEmail}
                          >
                            Delete (Phishing)
                          </button>
                        </div>

                        {/* Feedback Notification */}
                        {feedback && (
                          <div className={`email-feedback-notification ${feedback.type}`}>
                            <div className="feedback-header">
                              <h3>{feedback.title}</h3>
                              <button 
                                className="feedback-close"
                                onClick={() => setFeedback(null)}
                              >
                                ×
                              </button>
                            </div>
                            <p>{feedback.message}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  // EMAIL LIST VIEW
                  <div className="email-list-view">
                    <div className="email-list-header">
                      <span style={{flex: 1, fontSize: '12px', color: '#5f6368'}}>
                        {filteredEmails.length} email{filteredEmails.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    
                    {filteredEmails.length === 0 ? (
                      <div className="email-list-empty">
                        <p>No emails in this folder</p>
                      </div>
                    ) : (
                      <div className="email-list-items">
                        {filteredEmails.map((mail) => (
                          <div 
                            key={mail.id} 
                            className="email-list-item"
                            onClick={() => setSelectedEmail(mail)}
                          >
                            <div className="email-list-item-checkbox">
                              <input 
                                type="checkbox" 
                                checked={selectedEmails.has(mail.id)}
                                onChange={(e) => handleSelectEmail(e, mail.id)}
                              />
                            </div>
                            <div 
                              className="email-list-item-avatar"
                              style={{ backgroundColor: getAvatarColor(mail.from) }}
                            >
                              {mail.from.charAt(0).toUpperCase()}
                            </div>
                            <div className="email-list-item-content">
                              <p className="email-list-item-from">{mail.from}</p>
                              <div className="email-list-item-subject-preview">
                                <p className="email-list-item-subject">{mail.subject}</p>
                                <p className="email-list-item-preview">{mail.preview}</p>
                              </div>
                            </div>
                            <div className="email-list-item-date">
                              Today
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailClient;
