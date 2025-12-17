import React, { useEffect, useState } from 'react';
import './BoardView.css';

const BoardView = ({ isOpen, content, onClose }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [isViewTasks, setIsViewTasks] = useState(false);
  const [isLoginNote, setIsLoginNote] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setDisplayedText('');
      setIsComplete(false);
      setIsViewTasks(false);
      setIsLoginNote(false);
      return;
    }

    // Check if this is a View Tasks request or login note
    const isTasksView = typeof content === 'object' && content.isViewTasks;
    const isLogin = typeof content === 'object' && content.isLoginNote;
    
    setIsViewTasks(isTasksView);
    setIsLoginNote(isLogin);

    // Use dynamic content based on view type
    let textToDisplay = content;
    if (typeof content === 'object') {
      textToDisplay = content.content || '';
    }

    setDisplayedText('');
    setIsComplete(false);
    let index = 0;
    const speed = 20;

    const interval = setInterval(() => {
      if (index < textToDisplay.length) {
        setDisplayedText(textToDisplay.substring(0, index + 1));
        index++;
      } else {
        setIsComplete(true);
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [isOpen, content]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      // Don't interfere with form inputs
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      if (e.code === 'Escape' || (e.code === 'Space' && isComplete)) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isComplete, onClose]);

  if (!isOpen) return null;

  const headerText = isLoginNote ? 'Login Credentials' : (isViewTasks ? 'Current Progress' : 'Board Notice');

  return (
    <div className="board-overlay" onClick={onClose}>
      <div className="board-container" onClick={(e) => e.stopPropagation()}>
        <div className="board-header">
          <h2>{headerText}</h2>
          <button className="board-close" onClick={onClose}>✕</button>
        </div>
        <div className="board-content">
          <div className="board-text">
            {displayedText}
            {!isComplete && <span className="board-cursor">▊</span>}
          </div>
        </div>
        <div className="board-footer">
          {isComplete && <p className="board-hint">Press SPACE or ESC to close</p>}
        </div>
      </div>
    </div>
  );
};

export default BoardView;
