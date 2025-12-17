import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import MainScene from '../scenes/MainScene';
import './GameCanvas.css';

function GameCanvas() {
  const gameRef = useRef(null);
  const phaserGameRef = useRef(null);

  useEffect(() => {
    console.log('GameCanvas: Initializing Phaser game...');

    // Game configuration
    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: 'game-container',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
          debug: false
        }
      },
      input: {
        keyboard: false  // Disable Phaser's keyboard manager completely
      },
      scene: [MainScene]
    };

    // Create Phaser game instance
    phaserGameRef.current = new Phaser.Game(config);

    // Store scenes globally for keyboard control
    window.__PHASER_GAME = phaserGameRef.current;
    if (phaserGameRef.current && phaserGameRef.current.scene) {
      window.__PHASER_SCENES = phaserGameRef.current.scene.scenes;
    }

    console.log('GameCanvas: Phaser game initialized');

    // Add page refresh warning
    const handleBeforeUnload = (event) => {
      const hasProgress = localStorage.getItem('hrInteracted') === 'true' || 
                         localStorage.getItem('seniorDevInteracted') === 'true' ||
                         localStorage.getItem('computerAccessed') === 'true';
      
      if (hasProgress) {
        event.preventDefault();
        event.returnValue = 'Your progress may not be saved. Are you sure you want to leave?';
        return 'Your progress may not be saved. Are you sure you want to leave?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup function to destroy game instance on unmount
    return () => {
      console.log('GameCanvas: Destroying Phaser game instance...');
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (phaserGameRef.current) {
        phaserGameRef.current.destroy(true);
        phaserGameRef.current = null;
      }
    };
  }, []);

  return (
    <div className="game-canvas-container">
      <div id="game-container" ref={gameRef}></div>
    </div>
  );
}

export default GameCanvas;

