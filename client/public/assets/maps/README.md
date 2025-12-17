# Maps Directory

This directory contains tilemap JSON files exported from Tiled map editor.

## Expected Files

- `office.json` - Main office map tilemap

## Format

Maps should be exported from Tiled as JSON format and include:
- Ground layer
- Walls layer (with collision)
- Decorations layer (optional)

## Usage

Maps are loaded in MainScene.js using:
```javascript
this.load.tilemapTiledJSON('map', '/assets/maps/office.json');
```

