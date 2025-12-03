import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ModuleTransition.css';

function ModuleTransition({ toModule, onComplete, children }) {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isFadingIn, setIsFadingIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (toModule) {
      // Start fade out
      setIsFadingOut(true);
      
      // After fade out completes, navigate
      const fadeOutTimer = setTimeout(() => {
        setIsFadingOut(false);
        if (onComplete) {
          onComplete();
        }
        if (toModule) {
          navigate(`/module/${toModule}`);
        }
        // Start fade in
        setIsFadingIn(true);
        setTimeout(() => {
          setIsFadingIn(false);
        }, 500);
      }, 500);

      return () => clearTimeout(fadeOutTimer);
    }
  }, [toModule, navigate, onComplete]);

  const handleReturnToMap = (completedModule, earnedBadge) => {
    setIsFadingOut(true);
    
    setTimeout(() => {
      setIsFadingOut(false);
      navigate('/dashboard');
      setIsFadingIn(true);
      setTimeout(() => {
        setIsFadingIn(false);
      }, 500);
    }, 500);
  };

  return (
    <div 
      className={`module-transition ${isFadingOut ? 'fade-out' : ''} ${isFadingIn ? 'fade-in' : ''}`}
    >
      {children}
    </div>
  );
}

export default ModuleTransition;

