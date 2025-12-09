import React, { useState, useEffect } from 'react';
import './StickyNote.css';

const StickyNote = () => {
  const [isVisible, setIsVisible] = useState(false); // Only appears after dev note interaction
  const [shouldGlow, setShouldGlow] = useState(false); // Track if we should show glow effect

  // Listen for the login credentials board being shown (dev note interaction)
  useEffect(() => {
    const handleShowBoard = (event) => {
      // Only show the sticky note indicator if this is the login credentials board
      if (event.detail && event.detail.isLoginNote) {
        console.log('Sticky Note Status Indicator Visible');
        setIsVisible(true);
        setShouldGlow(true);
        // Stop glowing after 5 seconds
        setTimeout(() => setShouldGlow(false), 5000);
      }
    };

    window.addEventListener('showBoard', handleShowBoard);
    return () => window.removeEventListener('showBoard', handleShowBoard);
  }, []);

  return (
    <>
      {isVisible && (
        <div 
          className={`sticky-note-status-indicator ${shouldGlow ? 'glow' : ''}`}
          title="Login credentials are available - check the bottom right button"
        >
          <i className="fas fa-note-sticky"></i>
          <span className="status-label">Credentials Available</span>
        </div>
      )}
    </>
  );
};

export default StickyNote;
