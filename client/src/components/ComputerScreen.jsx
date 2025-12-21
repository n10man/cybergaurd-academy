import React, { useEffect, useState } from 'react';
import './ComputerScreen.css';
import { getRandomizedEmails } from '../data/emailData.js';
import { getCredentials } from '../config/credentials.js';
import PhishingWikiGuide from './PhishingWikiGuide';

const ComputerScreen = ({ isOpen, onClose }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Use credentials from config
  const correctCredentials = getCredentials();

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginEmail === correctCredentials.email && loginPassword === correctCredentials.password) {
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Invalid email or password. Check the sticky note for credentials.');
      setLoginPassword('');
    }
  };

  const [emails, setEmails] = useState(() => getRandomizedEmails());

  const [selectedEmail, setSelectedEmail] = useState(null);
  const [score, setScore] = useState(0);
  const [currentFolder, setCurrentFolder] = useState('all-emails');
  const [sidebarWidth, setSidebarWidth] = useState(220);
  const [notification, setNotification] = useState(null);
  const [showFlash, setShowFlash] = useState(false);
  const [dialogue, setDialogue] = useState(null); // 💬 Dialogue box state
  const [displayedText, setDisplayedText] = useState(''); // Typewriter effect
  const [isTyping, setIsTyping] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(60); // ms per character
  const [showPhishingWiki, setShowPhishingWiki] = useState(false); // 📚 Wiki guide state
  const sidebarRef = React.useRef(null);
  const typewriterRef = React.useRef(null);

  // Disable Phaser keyboard input when typing in input fields
  useEffect(() => {
    const handleInputFocus = () => {
      const scenes = window.__PHASER_SCENES;
      if (scenes) {
        scenes.forEach(scene => {
          if (scene && scene.input && scene.input.keyboard) {
            scene.input.keyboard.enabled = false;
          }
        });
      }
    };

    const handleInputBlur = () => {
      const scenes = window.__PHASER_SCENES;
      if (scenes) {
        scenes.forEach(scene => {
          if (scene && scene.input && scene.input.keyboard) {
            scene.input.keyboard.enabled = true;
          }
        });
      }
    };

    // Add listeners to all input fields
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('focus', handleInputFocus);
      input.addEventListener('blur', handleInputBlur);
    });

    return () => {
      inputs.forEach(input => {
        input.removeEventListener('focus', handleInputFocus);
        input.removeEventListener('blur', handleInputBlur);
      });
    };
  }, []);

  // Disable Phaser keyboard input when ComputerScreen modal is open
  useEffect(() => {
    if (isOpen) {
      const scenes = window.__PHASER_SCENES;
      if (scenes) {
        scenes.forEach(scene => {
          if (scene && scene.input && scene.input.keyboard) {
            scene.input.keyboard.enabled = false;
          }
        });
      }
      return () => {
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

  // Handle sidebar resize
  useEffect(() => {
    const handleMouseDown = (e) => {
      if (e.target.className?.includes('gmail-sidebar') && e.clientX > e.target.offsetLeft + e.target.offsetWidth - 10) {
        const startX = e.clientX;
        const startWidth = sidebarWidth;

        const handleMouseMove = (e) => {
          const diff = e.clientX - startX;
          const newWidth = Math.max(150, Math.min(400, startWidth + diff));
          setSidebarWidth(newWidth);
        };

        const handleMouseUp = () => {
          document.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
      }
    };

    if (sidebarRef.current) {
      sidebarRef.current.addEventListener('mousedown', handleMouseDown);
    }

    return () => {
      if (sidebarRef.current) {
        sidebarRef.current.removeEventListener('mousedown', handleMouseDown);
      }
    };
  }, [sidebarWidth]);

  // 💬 Listen for dialogue events from the game
  useEffect(() => {
    const handleDialogueEvent = (event) => {
      console.log('📥 Dialogue event received:', event.detail);
      const { name, text, isWhiteboard, onClose: onDialogueClose } = event.detail;
      setDialogue({ name, text, isWhiteboard: isWhiteboard || false, onClose: onDialogueClose });
      setDisplayedText(''); // Reset typewriter
      setIsTyping(true);
      setTypingSpeed(60); // Reset speed
      console.log('💾 Dialogue state set to:', { name, isWhiteboard, textLength: text.length });
      if (isWhiteboard) {
        console.log('🔄 Whiteboard dialogue updated - Page:', name);
      }
      // 🚫 Tell the scene that dialogue is now active
      window.dispatchEvent(new CustomEvent('dialogueOpened', { detail: { isOpen: true } }));
    };

    const handleCloseDialogue = () => {
      console.log('📤 Close dialogue event received');
      // 🚫 Tell the scene that dialogue is now closed
      window.dispatchEvent(new CustomEvent('dialogueClosed', { detail: { isOpen: false } }));
      setDialogue(null);
    };

    window.addEventListener('showDialogue', handleDialogueEvent);
    window.addEventListener('closeDialogue', handleCloseDialogue);
    console.log('✅ showDialogue & closeDialogue listeners registered');
    
    // 📚 Listen for wiki guide open event
    const handleOpenWiki = (event) => {
      console.log('📚 Phishing Wiki Guide opened');
      setShowPhishingWiki(true);
      window.dispatchEvent(new CustomEvent('dialogueOpened', { detail: { isOpen: true } }));
    };
    
    window.addEventListener('openPhishingWiki', handleOpenWiki);
    
    return () => {
      window.removeEventListener('showDialogue', handleDialogueEvent);
      window.removeEventListener('closeDialogue', handleCloseDialogue);
      window.removeEventListener('openPhishingWiki', handleOpenWiki);
    };
  }, []);

  // 🎨 Typewriter effect
  useEffect(() => {
    if (!dialogue || dialogue.isWhiteboard || !isTyping) return;

    const fullText = dialogue.text;
    
    if (displayedText.length < fullText.length) {
      typewriterRef.current = setTimeout(() => {
        setDisplayedText(fullText.slice(0, displayedText.length + 1));
      }, typingSpeed);

      return () => clearTimeout(typewriterRef.current);
    } else {
      setIsTyping(false);
    }
  }, [displayedText, dialogue, isTyping, typingSpeed]);

  // ⚡ Handle X key to speed up dialogue (only when dialogue is visible and typing)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (dialogue && !dialogue.isWhiteboard && isTyping && (e.key === 'x' || e.key === 'X')) {
        e.preventDefault();
        setTypingSpeed(10); // Speed up typing
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === 'x' || e.key === 'X') {
        setTypingSpeed(60); // Reset to normal speed
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [dialogue, isTyping]);

  // 📊 Track email changes and dispatch count updates
  useEffect(() => {
    if (isLoggedIn) {
      const remainingCount = emails.filter(e => e.folder === 'inbox' || e.folder === 'starred').length;
      console.log('📧 Email count updated:', remainingCount);
      
      // Update localStorage so MainScene can access the email count
      localStorage.setItem('emailState', JSON.stringify({
        inboxCount: remainingCount
      }));
      
      // Dispatch event to StickyNote component
      window.dispatchEvent(new CustomEvent('emailCountUpdated', { 
        detail: { 
          inbox: remainingCount, 
          processed: 13 - remainingCount,
          total: 13
        } 
      }));
    }
  }, [emails, isLoggedIn]);

  const analyzeEmail = (email) => {
    setSelectedEmail(email);
    
    // Mark as read
    setEmails(emails.map(e => 
      e.id === email.id ? { ...e, read: true } : e
    ));
  };

  const deleteEmail = (email) => {
    let isCorrect = email.isPhishing;
    let reason = '';
    
    // Deleting phishing = +10 points (good decision)
    // Deleting safe = -10 points (bad decision)
    if (email.isPhishing) {
      setScore(prev => prev + 10);
      reason = '✓ Correctly identified and deleted phishing email!';
    } else {
      setScore(prev => Math.max(0, prev - 10));
      reason = '✗ This was a legitimate email - you should have kept it.';
    }
    
    // Show green flash if correct
    if (isCorrect) {
      setShowFlash(true);
      setTimeout(() => setShowFlash(false), 500);
    }
    
    // Show notification
    setNotification({ message: reason, isCorrect });
    setTimeout(() => setNotification(null), 3000);
    
    // Move email to phishing-emails folder
    const updatedEmails = emails.map(e => 
      e.id === email.id ? { ...e, folder: 'phishing-emails', read: true } : e
    );
    setEmails(updatedEmails);
    
    // Calculate remaining emails and emit to OfficeScene
    const remainingCount = updatedEmails.filter(e => e.folder === 'inbox' || e.folder === 'starred').length;
    window.dispatchEvent(new CustomEvent('emailCountUpdated', { 
      detail: { 
        inbox: remainingCount, 
        processed: 13 - remainingCount,
        total: 13
      } 
    }));
    
    setSelectedEmail(null);
  };

  const keepEmail = (email) => {
    let isCorrect = !email.isPhishing;
    let reason = '';
    
    // Keeping safe email = +10 points (good decision)
    // Keeping phishing = -10 points (bad decision)
    if (!email.isPhishing) {
      setScore(prev => prev + 10);
      reason = '✓ Correctly identified and kept safe email!';
    } else {
      setScore(prev => Math.max(0, prev - 10));
      reason = '✗ This was a phishing email - you should have deleted it.';
    }
    
    // Show green flash if correct
    if (isCorrect) {
      setShowFlash(true);
      setTimeout(() => setShowFlash(false), 500);
    }
    
    // Show notification
    setNotification({ message: reason, isCorrect });
    setTimeout(() => setNotification(null), 3000);
    
    // Move email to safe-emails folder
    const updatedEmails = emails.map(e => 
      e.id === email.id ? { ...e, folder: 'safe-emails', read: true } : e
    );
    setEmails(updatedEmails);
    
    // Calculate remaining emails and emit to OfficeScene
    const remainingCount = updatedEmails.filter(e => e.folder === 'inbox' || e.folder === 'starred').length;
    window.dispatchEvent(new CustomEvent('emailCountUpdated', { 
      detail: { 
        inbox: remainingCount, 
        processed: 13 - remainingCount,
        total: 13
      } 
    }));
    
    setSelectedEmail(null);
  };

  // Extract domain name from URL for friendly display
  const getFriendlyLinkText = (url) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace('www.', '');
    } catch (e) {
      return 'click here';
    }
  };

  // Extract downloadable files from email content
  const extractDownloadableFiles = (content) => {
    const filePattern = /attached\s+(?:file|spreadsheet|document|report)?:?\s*([^\n]+\.(xlsx?|pdf|doc|docx|txt|zip))/gi;
    const files = [];
    let match;
    while ((match = filePattern.exec(content)) !== null) {
      files.push(match[1].trim());
    }
    return files;
  };

  const renderEmailContent = (email) => {
    if (typeof email.fullContent === 'string') {
      const files = extractDownloadableFiles(email.fullContent);
      
      if (email.isPhishing) {
        // For phishing emails, convert URLs and [CLICK HERE] text to clickable links
        let content = email.fullContent;
        
        // First, remove all <a> tag markup but preserve the URLs and link text
        // This handles: <a href="url" style="...">text</a> -> text and url on next line
        content = content.replace(/<a\s+href="([^"]+)"[^>]*>([^<]*)<\/a>/g, (match, url, text) => {
          const linkText = text.trim() || url;
          return `${linkText}\n${url}`;
        });
        
        // Convert [TEXT] https://url patterns to clickable links with friendly domain name
        content = content.replace(/\[([^\]]+)\]\s*\n\s*https?:\/\/[^\s\n)]+/g, (match) => {
          const urlMatch = match.match(/https?:\/\/[^\s\n)]+/);
          const textMatch = match.match(/\[([^\]]+)\]/);
          if (urlMatch && textMatch) {
            const url = urlMatch[0];
            const linkDisplay = textMatch[1]; // Use the bracketed text as display
            return `<a href="#" class="suspicious-link" title="${url}" onclick="event.preventDefault();">${linkDisplay}</a>\n${url}`;
          }
          return match;
        });
        
        // Convert standalone https/http URLs to clickable links with friendly domain name
        content = content.replace(/https?:\/\/[^\s\n)]+/g, (url) => {
          const friendlyText = getFriendlyLinkText(url);
          return `<a href="#" class="suspicious-link" title="${url}" onclick="event.preventDefault();">${friendlyText}</a>`;
        });
        
        const contentDiv = <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />') }} />;
        
        // Return content with optional attachments box
        if (files.length > 0) {
          return (
            <div>
              {contentDiv}
              <div className="email-attachments-box">
                <div className="attachments-title">📎 Attachments ({files.length})</div>
                {files.map((file, idx) => (
                  <button key={idx} className="attachment-btn" title={file}>
                    📄 {file}
                  </button>
                ))}
              </div>
            </div>
          );
        }
        return contentDiv;
      } else {
        // For legitimate emails, convert URLs to clickable links too
        let content = email.fullContent;
        
        // First, remove all <a> tag markup but preserve the URLs and link text
        content = content.replace(/<a\s+href="([^"]+)"[^>]*>([^<]*)<\/a>/g, (match, url, text) => {
          const linkText = text.trim() || url;
          return `${linkText}\n${url}`;
        });
        
        // Convert standalone https/http URLs to clickable links with friendly domain name
        content = content.replace(/https?:\/\/[^\s\n)]+/g, (url) => {
          const friendlyText = getFriendlyLinkText(url);
          return `<a href="#" class="email-link" title="${url}" onclick="event.preventDefault();">${friendlyText}</a>`;
        });
        
        const contentDiv = (
          <div>
            {content.split('\n').map((line, idx) => (
              <div key={idx} dangerouslySetInnerHTML={{ __html: line || '<br />' }} />
            ))}
          </div>
        );
        
        // Return content with optional attachments box
        if (files.length > 0) {
          return (
            <div>
              {contentDiv}
              <div className="email-attachments-box">
                <div className="attachments-title">📎 Attachments ({files.length})</div>
                {files.map((file, idx) => (
                  <button key={idx} className="attachment-btn" title={file}>
                    📄 {file}
                  </button>
                ))}
              </div>
            </div>
          );
        }
        return contentDiv;
      }
    }
    return email.fullContent;
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoginEmail('');
    setLoginPassword('');
    setLoginError('');
  };



  useEffect(() => {
    console.log('⌨️ Keyboard effect running - Dialogue:', dialogue?.name);
    
    // Only set up keyboard handlers if dialogue is visible
    if (!dialogue) {
      console.log('⌨️ No dialogue active, skipping keyboard setup');
      return;
    }

    const handleKeyDown = (e) => {
      console.log('⌨️ Keydown event:', e.code, 'Target:', e.target.tagName, 'Dialogue:', dialogue?.name);
      
      // Don't interfere with form inputs
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        console.log('⌨️ Skipping key - input/textarea focused');
        return;
      }

      if (e.code === 'Escape') {
        onClose();
      }

      // Whiteboard keyboard controls
      if (dialogue && dialogue.isWhiteboard) {
        console.log('⌨️ Whiteboard is active');
        if (e.code === 'KeyX') {
          e.preventDefault();
          console.log('🔑 X key pressed - closing whiteboard');
          if (dialogue.onClose) dialogue.onClose();
          setDialogue(null);
        }
        if (e.code === 'KeyZ') {
          e.preventDefault();
          console.log('🔑 Z key pressed on whiteboard, dispatching nextWhiteboardPage event');
          // Dispatch event to MainScene for next page
          window.dispatchEvent(new CustomEvent('nextWhiteboardPage'));
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dialogue]);

  return (
    <>
      {isOpen && (
        <div className="computer-overlay" onClick={onClose}>
          <div className="computer-monitor" onClick={(e) => e.stopPropagation()}>
        {/* CRT Screen Bezel */}
        <div className="screen-bezel">
          <div className="screen-content">
            {!isLoggedIn ? (
              // Login Screen
              <div className="login-container">
                <div className="login-box">
                  <h1>Gmail Login</h1>
                  <form onSubmit={handleLogin}>
                    <div className="login-field">
                      <label>Email:</label>
                      <input
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="Enter your email"
                        autoFocus
                      />
                    </div>
                    <div className="login-field">
                      <label>Password:</label>
                      <input
                        type="password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="Enter your password"
                      />
                    </div>
                    {loginError && <div className="login-error">{loginError}</div>}
                    <button type="submit" className="login-button">Sign In</button>
                  </form>
                  <p className="login-hint">Hint: Check the sticky note for credentials</p>
                </div>
              </div>
            ) : (
              // Gmail Interface
              <div className="gmail-container">
                {/* Gmail Header */}
                <div className="gmail-header">
                  <div className="gmail-logo">Mail</div>
                  <div className="user-info">
                    <span className="user-name">{loginEmail}</span>
                    <button className="sign-out" onClick={handleLogout}>Sign out</button>
                  </div>
                </div>

                {/* Gmail Body */}
                <div className="gmail-body">
                  {/* Sidebar */}
                  <div className="gmail-sidebar" ref={sidebarRef} style={{ width: `${sidebarWidth}px` }}>
                    <button className="compose-btn">+ Compose</button>
                    <div className="sidebar-items">
                      <div className="sidebar-section-title">Mail</div>
                      <div 
                        className={`sidebar-item ${currentFolder === 'all-emails' ? 'active' : ''}`}
                        onClick={() => { setCurrentFolder('all-emails'); setSelectedEmail(null); }}
                        title="All Emails"
                      >
                        <span className="icon">📮</span>
                        <span className="label">All Emails</span>
                        <span className="count">{emails.filter(e => e.folder === 'inbox' || e.folder === 'starred').length}</span>
                      </div>
                      <div className="sidebar-section-title">Filtered Emails</div>
                      <div 
                        className={`sidebar-item ${currentFolder === 'phishing-emails' ? 'active' : ''}`}
                        onClick={() => { setCurrentFolder('phishing-emails'); setSelectedEmail(null); }}
                        title="Phishing Emails"
                      >
                        <span className="icon">⚠️</span>
                        <span className="label">Phishing Emails</span>
                        <span className="count">{emails.filter(e => e.folder === 'phishing-emails').length}</span>
                      </div>
                      <div 
                        className={`sidebar-item ${currentFolder === 'safe-emails' ? 'active' : ''}`}
                        onClick={() => { setCurrentFolder('safe-emails'); setSelectedEmail(null); }}
                        title="Safe Emails"
                      >
                        <span className="icon">✓</span>
                        <span className="label">Safe Emails</span>
                        <span className="count">{emails.filter(e => e.folder === 'safe-emails').length}</span>
                      </div>
                    </div>
                  </div>

                  {/* Email List or Detail */}
                  <div className="gmail-content">
                    {selectedEmail ? (
                      <div className="email-detail">
                        <div className="email-header">
                          <div className="folder-nav">
                            <button className={`folder-btn ${currentFolder === 'all-emails' ? 'active' : ''}`} onClick={() => { setSelectedEmail(null); setCurrentFolder('all-emails'); }}>← All Emails</button>
                            <button className={`folder-btn ${currentFolder === 'starred' ? 'active' : ''}`} onClick={() => { setSelectedEmail(null); setCurrentFolder('starred'); }}>★ Starred</button>
                          </div>
                          <div className="email-actions">
                            <button className="action-btn" title="Delete">🗑️</button>
                          </div>
                        </div>
                        <div className="email-meta">
                          <strong>From:</strong> <span className={`email-address ${selectedEmail.isPhishing ? 'phishing-email' : 'safe-email'}`}>{selectedEmail.from}</span>
                        </div>
                        <div className="email-meta">
                          <strong>Subject:</strong> {selectedEmail.subject}
                        </div>
                        <div className="email-body">
                          <div className="email-content-box">
                            {renderEmailContent(selectedEmail)}
                          </div>
                        </div>

                        <div className="email-footer">
                          <button 
                            className="action-primary keep-btn"
                            onClick={() => keepEmail(selectedEmail)}
                          >
                            Keep
                          </button>
                          <button 
                            className="action-primary delete-btn"
                            onClick={() => deleteEmail(selectedEmail)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="email-list">
                        {emails
                          .filter(email => {
                            if (currentFolder === 'all-emails') {
                              // Show all unprocessed emails (inbox + starred)
                              return email.folder === 'inbox' || email.folder === 'starred';
                            }
                            return email.folder === currentFolder;
                          })
                          .map((email) => (
                          <div
                            key={email.id}
                            className={`email-row ${email.read ? 'read' : 'unread'} ${email.isPhishing ? 'phishing-row' : 'safe-row'}`}
                            onClick={() => analyzeEmail(email)}
                          >
                            <div className="email-from">{email.from}</div>
                            <div className="email-subject">{email.subject}</div>
                            <div className="email-preview">{email.preview}</div>
                            <div className="email-time">12:34 PM</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Score Display - Top Right Corner */}
                <div className="score-display-top-right">
                  {score}
                </div>

                {/* Green Flash Overlay for Correct Answer */}
                {showFlash && <div className="correct-flash"></div>}

                {/* Notification Panel */}
                {notification && (
                  <div className={`email-notification ${notification.isCorrect ? 'success' : 'error'}`}>
                    <div className="notification-icon">
                      {notification.isCorrect ? '✓' : '✗'}
                    </div>
                    <div className="notification-message">
                      {notification.message}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Monitor Stand */}
        <div className="monitor-stand">
          <div className="stand-base"></div>
        </div>

        {/* Close Button */}
        <button className="screen-close" onClick={onClose} title="Close (ESC)">×</button>
          </div>
        </div>
      )}

      {/* 💬 Dialogue Box or Whiteboard Screen */}
      {dialogue && (
        dialogue.isWhiteboard ? (
          // Full-screen whiteboard
          <div className="whiteboard-overlay" onClick={() => {}}>
            <div className="whiteboard-screen">
              <div className="whiteboard-header">
                <h2>{dialogue.name}</h2>
                <button 
                  className="whiteboard-close" 
                  onClick={() => {
                    if (dialogue.onClose) dialogue.onClose();
                    setDialogue(null);
                  }}
                  title="Close (X)"
                >×</button>
              </div>
              <div className="whiteboard-content">
                {dialogue.text.split('\n').map((line, idx) => (
                  <div key={idx} className="whiteboard-line">{line}</div>
                ))}
              </div>
              <div className="whiteboard-footer">
                Press X to close | Press Z for next page
              </div>
            </div>
          </div>
        ) : (
          // Regular dialogue box at bottom
          <div className="dialogue-box-container">
            <div className="dialogue-speedup-hint">Press X to speed up</div>
            <div className="dialogue-box">
              <div className="dialogue-header">
                <strong>{dialogue.name}</strong>
                <button 
                  className="dialogue-close" 
                  onClick={() => {
                    if (dialogue.onClose) dialogue.onClose();
                    setDialogue(null);
                  }}
                  title="Close (ESC or X)"
                >×</button>
              </div>
              <div className="dialogue-text">
                {(displayedText || dialogue.text).split('\n').map((line, idx) => (
                  <div key={idx}>{line}</div>
                ))}
              </div>
            </div>
          </div>
        )
      )}

      {/* 📚 Phishing Wiki Guide Modal */}
      {showPhishingWiki && (
        <div className="wiki-modal-overlay">
          <div className="wiki-modal-container">
            <button 
              className="wiki-modal-close" 
              onClick={() => {
                setShowPhishingWiki(false);
                window.dispatchEvent(new CustomEvent('dialogueClosed', { detail: { isOpen: false } }));
              }}
              title="Close (ESC)"
            >×</button>
            <PhishingWikiGuide />
          </div>
        </div>
      )}
    </>
  );
};

export default ComputerScreen;

