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
      scene: [MainScene]
    };

    // Create Phaser game instance
    phaserGameRef.current = new Phaser.Game(config);

    console.log('GameCanvas: Phaser game initialized');

    // Cleanup function to destroy game instance on unmount
    return () => {
      console.log('GameCanvas: Destroying Phaser game instance...');
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

