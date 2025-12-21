import React, { useEffect, useState } from 'react';
import './DialogueBox.css';

const DialogueBox = ({ isOpen, speaker, text, onClose, isWhiteboard = false }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [spaceCount, setSpaceCount] = useState(0);
  const [spaceTimer, setSpaceTimer] = useState(null);
  const [messageIndex, setMessageIndex] = useState(0);
  const [messages, setMessages] = useState(Array.isArray(text) ? text : [text]);

  // Handle Escape key to close dialogue
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

  // Reset messages and state when dialogue is opened or text changes
  useEffect(() => {
    if (isOpen) {
      setMessages(Array.isArray(text) ? text : [text]);
      setMessageIndex(0);
      setDisplayedText('');
      setIsComplete(false);
      setSpaceCount(0);
    }
  }, [isOpen, text]);

  // Typewriter effect
  useEffect(() => {
    if (!isOpen) {
      setDisplayedText('');
      setIsComplete(false);
      setSpaceCount(0);
      setMessageIndex(0);
      setMessages(Array.isArray(text) ? text : [text]);
      return;
    }

    setDisplayedText('');
    setIsComplete(false);
    setSpaceCount(0);
    let index = 0;
    const speed = 30;
    const currentMessage = messages[messageIndex] || '';

    const interval = setInterval(() => {
      if (index < currentMessage.length) {
        setDisplayedText(currentMessage.substring(0, index + 1));
        index++;
      } else {
        setIsComplete(true);
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [isOpen, messageIndex]);

  // Keyboard handlers
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      // Whiteboard mode - X closes, Z goes to next page
      if (isWhiteboard) {
        if (e.code === 'KeyX') {
          e.preventDefault();
          onClose();
        }
        if (e.code === 'KeyZ') {
          e.preventDefault();
          // Dispatch event to go to next whiteboard page
          const nextPageEvent = new KeyboardEvent('keydown', { code: 'KeyZ', key: 'z' });
          window.dispatchEvent(nextPageEvent);
        }
        return;
      }

      // Normal dialogue mode
      if (e.code === 'Space') {
        e.preventDefault();
        
        // Clear any existing timer
        if (spaceTimer) clearTimeout(spaceTimer);
        
        if (!isComplete) {
          // Speed up - complete the typewriter instantly
          setDisplayedText(messages[messageIndex]);
          setIsComplete(true);
        } else {
          // Text is already complete - go to next message or close
          if (messageIndex < messages.length - 1) {
            setMessageIndex(idx => idx + 1);
            setDisplayedText('');
            setIsComplete(false);
          } else {
            onClose();
          }
        }
      }
      // ESCAPE closes the dialogue
      if (e.code === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (spaceTimer) clearTimeout(spaceTimer);
    };
  }, [isOpen, isComplete, messages, messageIndex, onClose, spaceTimer, isWhiteboard]);

  if (!isOpen) return null;

  return (
    <div className="dialogue-box-container">
      <div className="dialogue-box">
        {/* Speaker Name and ESC hint */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div className="dialogue-speaker">{speaker}</div>
          <div style={{ fontSize: '12px', color: '#888', fontStyle: 'italic' }}>
            Press ESC to exit
          </div>
        </div>

        {/* Close Button */}
        <button className="dialogue-close-btn" onClick={onClose}>
          ✕
        </button>

        {/* Text Content */}
        <div className="dialogue-text">
          {displayedText}
          {!isComplete && <span className="dialogue-cursor">▌</span>}
        </div>

        {/* Continue Indicator */}
        {isComplete && (
          <div className="dialogue-continue">
            {isWhiteboard ? 'Press X to close | Press Z for next page' : 'Press SPACE to continue or close'}
          </div>
        )}
      </div>
    </div>
  );
};

export default DialogueBox;