# Tilesets Directory

This directory contains tileset images used in the game maps.

## Expected Files

- `office-tiles.png` - Office tileset image

## Format

Tileset images should be PNG format and match the tileset configuration in the Tiled map editor.

## Usage

Tilesets are loaded in MainScene.js using:
```javascript
this.load.image('tiles', '/assets/tilesets/office-tiles.png');
```

