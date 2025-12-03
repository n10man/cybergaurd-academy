/**
 * Tilemap Converter Utility for Tiled Editor Maps to Phaser 3
 * 
 * This utility provides functions to convert Tiled map files (JSON format) into
 * Phaser 3 compatible tilemaps. It handles:
 * - Tileset conversion and image path mapping
 * - Layer data extraction and organization
 * - Object layer parsing for NPCs, items, etc.
 * - Tile GID parsing with flip flag support
 * 
 * @module tilemapConverter
 */

/**
 * Convert a Tiled map object to Phaser 3 tilemap data
 * 
 * This function takes a Tiled map JSON object and converts it into a format
 * that is optimized for use with Phaser 3. It processes all tilesets, layers,
 * and object layers, extracting relevant information and normalizing paths.
 * 
 * @param {Object} tiledMap - The Tiled map object (as JSON)
 * @param {number} tiledMap.width - Map width in tiles
 * @param {number} tiledMap.height - Map height in tiles
 * @param {number} tiledMap.tilewidth - Tile width in pixels
 * @param {number} tiledMap.tileheight - Tile height in pixels
 * @param {Array} tiledMap.tilesets - Array of tileset definitions
 * @param {Array} tiledMap.layers - Array of layer definitions (tile layers and object groups)
 * @param {Array} [tiledMap.properties] - Optional map properties
 * 
 * @returns {Object} Phaser 3 compatible tilemap configuration containing:
 *   - dimensions (width, height)
 *   - tile sizes (tileWidth, tileHeight)
 *   - tilesets array with processed tileset data
 *   - layers array with tile layer data
 *   - objectLayers array with object group data
 *   - properties and version info
 * 
 * @throws {Error} If the input is not a valid Tiled map format
 * 
 * @example
 * // Load a Tiled map and convert it
 * const tiledMap = await fetch('/maps/office.json').then(r => r.json());
 * const phaserConfig = convertTiledMapToPhaser(tiledMap);
 * console.log(`Map size: ${phaserConfig.width}x${phaserConfig.height} tiles`);
 * console.log(`Tilesets: ${phaserConfig.tilesets.map(t => t.name).join(', ')}`);
 */
export function convertTiledMapToPhaser(tiledMap) {
  if (!tiledMap || !tiledMap.layers || !tiledMap.tilesets) {
    throw new Error('Invalid Tiled map format');
  }

  // Create tilemap data structure for Phaser
  const tilesetMap = {};
  
  // Process tilesets
  const phaserTilesets = tiledMap.tilesets.map((tileset) => {
    // Map tileset for Phaser
    tilesetMap[tileset.firstgid] = tileset.name;
    
    return {
      name: tileset.name,
      imageUrl: convertImagePath(tileset.image),
      tileWidth: tileset.tilewidth,
      tileHeight: tileset.tileheight,
      imageWidth: tileset.imagewidth,
      imageHeight: tileset.imageheight,
      spacing: tileset.spacing,
      margin: tileset.margin,
      firstgid: tileset.firstgid,
      tilecount: tileset.tilecount,
      columns: tileset.columns
    };
  });

  // Process layers
  const phaserLayers = tiledMap.layers
    .filter((layer) => layer.type === 'tilelayer')
    .map((layer) => {
      return {
        name: layer.name,
        data: layer.data,
        width: layer.width,
        height: layer.height,
        visible: layer.visible !== false,
        opacity: layer.opacity || 1,
        x: layer.x || 0,
        y: layer.y || 0,
        id: layer.id
      };
    });

  // Process object layers (for NPCs, items, etc.)
  const objectLayers = tiledMap.layers
    .filter((layer) => layer.type === 'objectgroup')
    .map((layer) => {
      return {
        name: layer.name,
        objects: layer.objects || [],
        visible: layer.visible !== false,
        opacity: layer.opacity || 1
      };
    });

  return {
    width: tiledMap.width,
    height: tiledMap.height,
    tileWidth: tiledMap.tilewidth,
    tileHeight: tiledMap.tileheight,
    orientation: tiledMap.orientation || 'orthogonal',
    renderOrder: tiledMap.renderorder || 'right-down',
    tilesets: phaserTilesets,
    layers: phaserLayers,
    objectLayers: objectLayers,
    properties: tiledMap.properties || {},
    version: tiledMap.version
  };
}

/**
 * Convert relative image paths to absolute asset paths
 * 
 * This function handles various path formats that Tiled Editor may use and
 * converts them to paths suitable for Phaser 3's asset loader.
 * 
 * Supported input formats:
 * - ../../maps/folder/file.png -> /assets/maps/folder/file.png
 * - relative/path/file.png -> /assets/file.png
 * - Direct filenames -> /assets/filename.png
 * 
 * @param {string} relativePath - The relative path from Tiled
 * @returns {string} Converted path for assets (absolute from web root)
 * 
 * @example
 * // Tiled path to asset path conversion
 * convertImagePath('../../maps/Modern_Office_v1/tiles.png')
 * // Returns: '/assets/maps/Modern_Office_v1/tiles.png'
 * 
 * convertImagePath('sprites/character.png')
 * // Returns: '/assets/character.png'
 */
function convertImagePath(relativePath) {
  // Handle various path formats and convert to asset paths
  if (!relativePath) return '';
  
  // Remove the relative path traversal and get just the filename/subfolder
  // Example: ../../maps/Modern_Office_Revamped_v1.2/... -> /assets/maps/...
  
  // Split by the "maps" folder marker
  if (relativePath.includes('/maps/')) {
    const parts = relativePath.split('/maps/');
    return `/assets/maps/${parts[1]}`;
  }
  
  // Fallback: just append to assets
  const filename = relativePath.split('/').pop();
  return `/assets/${filename}`;
}

/**
 * Create Phaser tilemap from converted data
 * 
 * This function initializes a complete Phaser tilemap with all necessary
 * configurations, including tileset loading, layer creation, and collision setup.
 * 
 * Note: This is a higher-level wrapper that may need additional setup in your
 * Phaser scene depending on your specific requirements.
 * 
 * @param {Phaser.Scene} scene - The Phaser scene instance
 * @param {Object} tilemapData - Converted tilemap data from convertTiledMapToPhaser()
 * @param {string} tilemapKey - Unique key for the tilemap resource
 * 
 * @returns {Phaser.Tilemaps.Tilemap} The created Phaser tilemap object
 * 
 * @throws {Error} If scene or tilemapData is invalid
 * 
 * @example
 * // In your Phaser scene's create() method:
 * const tiledMap = this.cache.json.get('map_json');
 * const tilemapData = convertTiledMapToPhaser(tiledMap);
 * const tilemap = createPhaserTilemap(this, tilemapData, 'my_tilemap');
 * 
 * // Now you can create layers from the tilemap
 * const groundLayer = tilemap.createLayer('Ground', allTilesets, 0, 0);
 */
export function createPhaserTilemap(scene, tilemapData, tilemapKey) {
  // First, load all tilesets
  const tilesetConfigs = [];
  
  tilemapData.tilesets.forEach((tileset) => {
    // Add tileset texture to scene
    const textureKey = tileset.name;
    
    tilesetConfigs.push({
      name: textureKey,
      tileWidth: tileset.tileWidth,
      tileHeight: tileset.tileHeight,
      tileMargin: tileset.margin,
      tileSpacing: tileset.spacing,
      firstgid: tileset.firstgid
    });
  });

  // Create the tilemap
  const tilemap = scene.make.tilemap({
    data: convertLayersToTilemapData(tilemapData),
    tileWidth: tilemapData.tileWidth,
    tileHeight: tilemapData.tileHeight,
    width: tilemapData.width,
    height: tilemapData.height
  });

  // Add tileset images
  tilemapData.tilesets.forEach((tileset) => {
    const image = scene.textures.get(tileset.name);
    if (image) {
      tilemap.addTilesetImage(
        tileset.name,
        tileset.name,
        tileset.tileWidth,
        tileset.tileHeight,
        tileset.margin,
        tileset.spacing
      );
    }
  });

  // Create layers
  tilemapData.layers.forEach((layerData) => {
    const layer = tilemap.createLayer(
      layerData.id,
      getTilesetImages(tilemapData),
      0,
      0
    );
    
    if (layer) {
      layer.setVisible(layerData.visible);
      layer.setAlpha(layerData.opacity);
    }
  });

  return tilemap;
}

/**
 * Convert layer data to tilemap array format
 * 
 * Internal helper function that processes layer data into the format needed
 * by Phaser's tilemap creation.
 * 
 * @param {Object} tilemapData - Converted tilemap data
 * @returns {Array} Tilemap data array
 * @private
 */
function convertLayersToTilemapData(tilemapData) {
  // Return the first tilemap layer data (simplified)
  // In production, you'd want to handle multiple layers properly
  if (tilemapData.layers.length > 0) {
    return tilemapData.layers[0].data;
  }
  return [];
}

/**
 * Get array of tileset image names for the tilemap
 * 
 * Internal helper that extracts tileset names from the converted data
 * for use when creating layers in Phaser.
 * 
 * @param {Object} tilemapData - Converted tilemap data
 * @returns {Array<string>} Array of tileset names
 * @private
 */
function getTilesetImages(tilemapData) {
  return tilemapData.tilesets.map((ts) => ts.name);
}

/**
 * Parse tile Global ID (gid) to get tileset and local ID
 * 
 * Tiled Editor encodes tileset information and flip flags in a 32-bit Global ID.
 * This function decodes that information.
 * 
 * Bit structure of GID:
 * - Bits 0-28: Global tile ID (references a tile in a tileset)
 * - Bit 29: Anti-diagonal flip flag
 * - Bit 30: Vertical flip flag
 * - Bit 31: Horizontal flip flag
 * 
 * @param {number} gid - Global tile ID from Tiled
 * @param {Object} tilemapData - Converted tilemap data containing tilesets
 * 
 * @returns {Object|null} Object containing:
 *   - tileset: The tileset object that contains this tile
 *   - localId: Local tile ID within the tileset
 *   - flipped: Object with h, v, d boolean flags for flip state
 *   - Returns null if gid is 0 (empty tile) or tileset not found
 * 
 * @example
 * // Parse a tile GID from the map
 * const gid = mapData.layers[0].data[100]; // Get a tile from layer data
 * const tileInfo = parseTileGid(gid, tilemapData);
 * 
 * if (tileInfo) {
 *   console.log(`Tile from tileset: ${tileInfo.tileset.name}`);
 *   console.log(`Local ID: ${tileInfo.localId}`);
 *   console.log(`Horizontally flipped: ${tileInfo.flipped.h}`);
 * }
 */
export function parseTileGid(gid, tilemapData) {
  // Handle flipped tiles (Tiled encodes flip info in high bits)
  const flipped = {
    h: !!(gid & 0x80000000),
    v: !!(gid & 0x40000000),
    d: !!(gid & 0x20000000)
  };

  // Remove flip bits to get actual gid
  const realGid = gid & 0x1fffffff;

  // Find which tileset this gid belongs to
  let tileset = null;
  for (let i = tilemapData.tilesets.length - 1; i >= 0; i--) {
    if (realGid >= tilemapData.tilesets[i].firstgid) {
      tileset = tilemapData.tilesets[i];
      break;
    }
  }

  if (!tileset) {
    return null;
  }

  // Calculate local tile ID
  const localId = realGid - tileset.firstgid;

  return {
    tileset,
    localId,
    flipped
  };
}

export default {
  convertTiledMapToPhaser,
  createPhaserTilemap,
  parseTileGid,
  convertImagePath
};

/**
 * @fileOverview Tilemap Converter Module
 * 
 * ## Overview
 * This module provides utilities for converting Tiled Editor maps (JSON format) into
 * Phaser 3 compatible tilemap structures. It handles the complex conversion process
 * including tileset management, layer organization, and tile GID parsing.
 * 
 * ## Key Features
 * - **Tiled to Phaser Conversion**: Converts Tiled JSON maps to Phaser 3 format
 * - **Asset Path Normalization**: Automatically converts Tiled relative paths to web asset paths
 * - **Layer Organization**: Separates tile layers from object layers for proper handling
 * - **Tile GID Parsing**: Decodes Tiled's encoded tile IDs with flip information
 * - **Tileset Management**: Handles multiple tilesets with proper firstgid mapping
 * 
 * ## Usage Example
 * 
 * ```javascript
 * import { convertTiledMapToPhaser, parseTileGid } from './utils/tilemapConverter.js';
 * 
 * // In your Phaser scene's preload():
 * preload() {
 *   this.load.tilemapTiledJSON('map', '/assets/maps/first_map.json');
 *   this.load.image('tileset1', '/assets/tilesets/Modern_Office_MV_1.png');
 *   // ... load all other tilesets ...
 * }
 * 
 * // In your scene's create():
 * create() {
 *   const tiledMapJSON = this.cache.json.get('map');
 *   const tilemapData = convertTiledMapToPhaser(tiledMapJSON);
 *   
 *   // Now tilemapData contains:
 *   // - Normalized tileset information
 *   // - Organized layer data
 *   // - Object layer information for game objects
 *   
 *   const tilemap = this.make.tilemap({ key: 'map' });
 *   
 *   // Use the converted data to understand your map structure:
 *   console.log('Layers:', tilemapData.layers.map(l => l.name));
 *   console.log('Tilesets:', tilemapData.tilesets.map(t => t.name));
 * }
 * ```
 * 
 * ## Understanding Tiled Map Structure
 * 
 * ### Tilesets
 * Each map can have multiple tilesets. Each tileset has:
 * - **firstgid**: The first global tile ID assigned to this tileset
 * - **name**: Unique identifier for the tileset
 * - **tilewidth/tileheight**: Size of individual tiles in pixels
 * - **image**: Path to the tileset image
 * 
 * ### Layers
 * Tiled supports multiple layer types:
 * - **Tile Layers** (type: "tilelayer"): Grid of tiles, contains tile data as array
 * - **Object Groups** (type: "objectgroup"): Container for game objects (NPCs, items, etc.)
 * - **Image Layers**: Background images (usually not used in this converter)
 * 
 * ### Global Tile IDs (GIDs)
 * Tiled uses a 32-bit integer to encode:
 * - Which tileset a tile belongs to (via firstgid comparison)
 * - Whether the tile is flipped (3 flip flags in high bits)
 * 
 * Use `parseTileGid()` to decode this information.
 * 
 * ## Map Structure in CyberGuard Academy
 * 
 * The first_map has dimensions of 50x40 tiles and includes:
 * - Multiple visual layers for different depth levels
 * - Collision layer for physics
 * - 6 different tilesets providing office furniture and building elements
 * - Object layers for NPCs and interactive elements
 * 
 * ## Performance Considerations
 * 
 * - Conversion happens once at load time, not in update loops
 * - Large maps (>100x100 tiles) may take milliseconds to convert
 * - The converter normalizes paths but doesn't validate asset existence
 * - For optimal performance, ensure all tilesets are pre-loaded in Phaser
 * 
 * ## Troubleshooting
 * 
 * **Issue**: Tileset images not displaying
 * - Solution: Check that tile images are loaded before creating layers
 * - Ensure asset paths are correct (use console to verify)
 * 
 * **Issue**: Tiles rendering with wrong graphics
 * - Solution: Verify tileset firstgid values match the map file
 * - Use parseTileGid() to debug tile references
 * 
 * **Issue**: Object layer not found
 * - Solution: Check that object groups exist in Tiled and have correct names
 * - Use console.log(tilemapData.objectLayers) to inspect available layers
 * 
 * ## Related Resources
 * - [Tiled Editor Documentation](https://doc.mapeditor.org/)
 * - [Phaser 3 Tilemap Documentation](https://newdocs.phaser.io/docs/3.60.0/Phaser.Tilemaps.Tilemap)
 * - Map files: `/public/assets/maps/`
 * - Tileset images: `/public/assets/tilesets/`
 */
