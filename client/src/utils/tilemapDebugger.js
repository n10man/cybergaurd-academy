/**
 * Tilemap Debugger Utility
 * Provides step-by-step debugging for tilemap loading and creation issues
 */

export const TilemapDebugger = {
  /**
   * Validate that all required tilesets are loaded
   * @param {Phaser.Scene} scene - The Phaser scene
   * @param {Array<string>} requiredTilesets - Array of tileset names to check
   */
  validateLoadedTilesets(scene, requiredTilesets) {
    console.group('🔍 TILESET VALIDATION');
    console.log(`📋 Checking ${requiredTilesets.length} required tilesets...`);
    
    const results = {
      loaded: [],
      missing: [],
      details: []
    };

    requiredTilesets.forEach(name => {
      const exists = scene.textures.exists(name);
      const texture = scene.textures.get(name);
      
      if (exists) {
        results.loaded.push(name);
        console.log(`✅ ${name}:`, {
          width: texture.getSourceImage().width,
          height: texture.getSourceImage().height
        });
        results.details.push({
          name,
          status: 'loaded',
          width: texture.getSourceImage().width,
          height: texture.getSourceImage().height
        });
      } else {
        results.missing.push(name);
        console.log(`❌ ${name}: NOT LOADED`);
        results.details.push({
          name,
          status: 'missing'
        });
      }
    });

    console.log(`\n📊 Summary: ${results.loaded.length}/${requiredTilesets.length} tilesets loaded`);
    if (results.missing.length > 0) {
      console.warn(`⚠️ Missing tilesets:`, results.missing);
    }
    console.groupEnd();
    
    return results;
  },

  /**
   * Validate tilemap JSON structure
   * @param {Object} mapData - The tilemap JSON data
   */
  validateMapJSON(mapData) {
    console.group('🔍 MAP JSON VALIDATION');
    
    const results = {
      valid: true,
      errors: [],
      warnings: [],
      info: {}
    };

    // Check basic structure
    if (!mapData) {
      results.valid = false;
      results.errors.push('Map data is null or undefined');
      console.groupEnd();
      return results;
    }

    // Check required properties
    const required = ['layers', 'tilesets', 'tilewidth', 'tileheight', 'width', 'height'];
    required.forEach(prop => {
      if (!(prop in mapData)) {
        results.valid = false;
        results.errors.push(`Missing required property: ${prop}`);
        console.log(`❌ Missing: ${prop}`);
      } else {
        console.log(`✅ Found: ${prop} = ${mapData[prop]}`);
      }
    });

    // Check tilesets array
    if (Array.isArray(mapData.tilesets)) {
      console.log(`\n🎨 Tilesets (${mapData.tilesets.length}):`);
      mapData.tilesets.forEach((ts, idx) => {
        console.log(`  [${idx}]:`, {
          firstgid: ts.firstgid,
          name: ts.name || 'UNNAMED',
          tilecount: ts.tilecount,
          image: ts.image || 'NO IMAGE PATH'
        });
        
        if (!ts.name) {
          results.warnings.push(`Tileset ${idx} has no name`);
        }
        if (!ts.image) {
          results.errors.push(`Tileset ${idx} has no image property`);
        }
      });
    } else {
      results.errors.push('Tilesets is not an array');
    }

    // Check layers
    if (Array.isArray(mapData.layers)) {
      console.log(`\n🎬 Layers (${mapData.layers.length}):`);
      mapData.layers.forEach((layer, idx) => {
        console.log(`  [${idx}]: "${layer.name || 'UNNAMED'}" (${layer.type})`);
        if (!layer.name) {
          results.warnings.push(`Layer ${idx} has no name`);
        }
      });
    } else {
      results.errors.push('Layers is not an array');
    }

    // Map info
    results.info = {
      dimensions: `${mapData.width}×${mapData.height} tiles`,
      tileSize: `${mapData.tilewidth}×${mapData.tileheight} pixels`,
      pixelDimensions: `${mapData.width * mapData.tilewidth}×${mapData.height * mapData.tileheight} pixels`,
      tilesetCount: mapData.tilesets?.length || 0,
      layerCount: mapData.layers?.length || 0
    };

    console.log(`\n📊 Map Info:`, results.info);
    console.log(`\n${results.valid ? '✅ MAP IS VALID' : '❌ MAP HAS ERRORS'}`);
    if (results.errors.length > 0) {
      console.error('Errors:', results.errors);
    }
    if (results.warnings.length > 0) {
      console.warn('Warnings:', results.warnings);
    }
    
    console.groupEnd();
    return results;
  },

  /**
   * Debug tilemap after it's created
   * @param {Phaser.Tilemaps.Tilemap} map - The created tilemap
   */
  debugTilemap(map) {
    console.group('🔍 TILEMAP DEBUG');
    console.log('Map object:', map);
    console.log('Dimensions:', {
      tiles: `${map.width}×${map.height}`,
      pixels: `${map.widthInPixels}×${map.heightInPixels}`
    });
    console.log('Tile size:', {
      width: map.tileWidth,
      height: map.tileHeight
    });
    console.log('Tilesets:', map.tilesets.length, map.tilesets);
    console.log('Layers:', map.layers.length);
    map.layers.forEach((layer, idx) => {
      console.log(`  Layer ${idx}: "${layer.tilemapLayer?.layer?.name || 'UNNAMED'}"`);
    });
    console.groupEnd();
  },

  /**
   * Log comprehensive scene state
   * @param {Phaser.Scene} scene - The scene to debug
   * @param {Array<string>} tilesetNames - Tileset names to check
   */
  logSceneState(scene, tilesetNames) {
    console.group('🔍 SCENE STATE');
    console.log('🎬 Scene:', {
      key: scene.scene.key,
      isActive: scene.scene.isActive(),
      isVisible: scene.scene.isVisible()
    });
    
    console.log('📦 Loaded Textures:', scene.textures.getTextureNames().length);
    tilesetNames.forEach(name => {
      const exists = scene.textures.exists(name);
      console.log(`  ${exists ? '✅' : '❌'} ${name}`);
    });
    
    console.groupEnd();
  },

  /**
   * Step-by-step debug helper during scene creation
   */
  createStepByStepDebugger() {
    return {
      step: 1,
      log(message, data = null) {
        const timestamp = new Date().toLocaleTimeString();
        console.log(`[${timestamp}] Step ${this.step}: ${message}`, data || '');
        this.step++;
      },
      logError(message, error) {
        console.error(`❌ ERROR: ${message}`, error);
      },
      logSuccess(message) {
        console.log(`✅ ${message}`);
      }
    };
  }
};

export default TilemapDebugger;
