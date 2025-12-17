import React from 'react';
import './LoadingScreen.css';

function LoadingScreen({ progress = 0 }) {
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="loading-spinner"></div>
        <h2>Loading...</h2>
        <div className="progress-bar-container">
          <div 
            className="progress-bar" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="progress-text">{Math.round(progress)}%</p>
      </div>
    </div>
  );
}

export default LoadingScreen;

