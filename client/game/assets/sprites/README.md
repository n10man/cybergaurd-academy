# Sprites Directory

This directory contains character and object sprite sheets.

## Expected Files

- `character.png` - Player character sprite sheet

## Format

Sprite sheets should be PNG format with:
- Frame width: 32 pixels
- Frame height: 32 pixels
- Multiple frames arranged in a grid

## Usage

Sprites are loaded in MainScene.js using:
```javascript
this.load.spritesheet('player', '/assets/sprites/character.png', {
  frameWidth: 32,
  frameHeight: 32
});
```

