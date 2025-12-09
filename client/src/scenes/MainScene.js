import Phaser from 'phaser';

// 🎛️ MASTER SWITCH: Change this to 'office' or 'server_room' to switch maps!
const CURRENT_LEVEL = 'office'; 

class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' });
    this.player = null;
    this.cursors = null;
    this.wasdKeys = null;
    this.spaceKey = null;
    this.resetKeys = null;
    this.map = null;
    this.collisionsLayer = null;
    this.npcs = [];
    this.interactions = [];
    this.spawnX = 0;
    this.spawnY = 0;
    this.interactText = null;
    this.interactionRadius = 60; 
  }

  preload() {
    console.log(`🎮 MainScene: Preloading Level -> ${CURRENT_LEVEL}`);

    // 1. Load the correct map
    if (CURRENT_LEVEL === 'office') {
        this.load.tilemapTiledJSON('map_json', '/assets/maps/first_map.json');
    } else {
        this.load.tilemapTiledJSON('map_json', '/assets/maps/second_map.json');
    }

    // 2. Load Tilesets
    const tilesetNames = [
      'Modern_Office_MV_1_TILESETS_B-C-D-E',
      'Modern_Office_MV_2_TILESETS_B-C-D-E',
      'Modern_Office_MV_3_TILESETS_B-C-D-E',
      'Modern_Office_MV_Floors_TILESET_A2',
      'Modern_Office_MV_Walls_TILESET_A4',
      'Room_Builder_Office_16x16',
      'Interiors_free_16x16',
      'Interiors_free_32x32',
      'Interiors_free_48x48'
    ];

    tilesetNames.forEach(name => {
      this.load.image(name, `/assets/tilesets/${name}.png`);
    });

    this.load.image('player', '/assets/sprites/player.png');
    this.load.image('npc', '/assets/sprites/npc.png');
  }

  create() {
    console.log(`🗺️ MainScene: Creating Level -> ${CURRENT_LEVEL}`);
    this.physics.world.TILE_BIAS = 48;

    this.map = this.make.tilemap({ key: 'map_json' });

    const allTilesets = [
        this.map.addTilesetImage('Modern_Office_MV_1_TILESETS_B-C-D-E', 'Modern_Office_MV_1_TILESETS_B-C-D-E'),
        this.map.addTilesetImage('Modern_Office_MV_2_TILESETS_B-C-D-E', 'Modern_Office_MV_2_TILESETS_B-C-D-E'),
        this.map.addTilesetImage('Modern_Office_MV_3_TILESETS_B-C-D-E', 'Modern_Office_MV_3_TILESETS_B-C-D-E'),
        this.map.addTilesetImage('Modern_Office_MV_Floors_TILESET_A2', 'Modern_Office_MV_Floors_TILESET_A2'),
        this.map.addTilesetImage('Modern_Office_MV_Walls_TILESET_A4', 'Modern_Office_MV_Walls_TILESET_A4'),
        this.map.addTilesetImage('Room_Builder_Office_16x16', 'Room_Builder_Office_16x16'),
        this.map.addTilesetImage('Interiors_free_16x16', 'Interiors_free_16x16'),
        this.map.addTilesetImage('Interiors_free_32x32', 'Interiors_free_32x32'),
        this.map.addTilesetImage('Interiors_free_48x48', 'Interiors_free_48x48')
    ];

    // 3. Define Layers
    let visualLayerNames = [];

    if (CURRENT_LEVEL === 'office') {
        visualLayerNames = [
            'Bottom Of map floor', 'Top half of map floor', 'all map walls', 
            'sofas', 'chairs', 'Bottom floor objects', 'Top floor Tables', 
            'Top floor table extension', 'non-interactable objects', 
            'non-interactable computer', 'interactable computer', 
            'interactable top floor objects', 'non-interactable top floor objects', 
            'non-interactable paintings', 'interactable paintings', 
            'door to second map', 'Note from senior dev'
        ];
    } else {
        visualLayerNames = [
            'Bottom of map floor', 'Top of map floor', 'Exterior most wall',
            'Bottom of map walls', 'Top of map walls', 'Top of map background chairs',
            'Top of map tables', 'Top floor table extension', 'Top of map objects on background tables',
            'Top floor wall / background objects', 'Top of map table divider 1',
            'Top of map table divider 2', 'Top of map objects on main tables',
            'Top of map main chairs', 'Bottom floor paintings', 'Bottom floor objects',
            'Bottom floor table extension', 'Bottom floor chairs', 'Bottom floor tables',
            'Bottom floor on table objects'
        ];
    }

    // 🛑 ROBUST LAYER SORTING LOGIC 🛑
    visualLayerNames.forEach(name => {
        const layer = this.map.createLayer(name, allTilesets, 0, 0);
        if (layer) {
            const lowerName = name.toLowerCase();

            // PRIORITY 1: OBJECTS / FURNITURE (Depth 5)
            if (
                lowerName.includes('object') || 
                lowerName.includes('table') || 
                lowerName.includes('chair') || 
                lowerName.includes('computer') ||
                lowerName.includes('painting') ||
                lowerName.includes('sofa') ||
                lowerName.includes('divider') ||
                lowerName.includes('extension') ||
                lowerName.includes('door') ||
                lowerName.includes('note')
            ) {
                layer.setDepth(5);
            }
            // PRIORITY 2: WALLS (Depth 1)
            else if (lowerName.includes('wall')) {
                layer.setDepth(1);
            }
            // PRIORITY 3: FLOORS (Depth 0)
            else {
                layer.setDepth(0);
            }
        } else {
            console.warn(`⚠️ Layer not found: ${name}`);
        }
    });

    // 4. Collision Layer
    this.collisionsLayer = this.map.createLayer('collisions', allTilesets, 0, 0);
    
    if (this.collisionsLayer) {
        // HIDDEN - No orange collision highlights
        this.collisionsLayer.setVisible(false); 
        this.collisionsLayer.setDepth(100);
        
        // BRUTE FORCE COLLISION
        this.collisionsLayer.setCollisionBetween(1, 100000);
    } else {
        console.error("⚠️ CRITICAL: 'collisions' layer not found!");
    }

    this.createPlayerAndCamera();
    this.setupInteractions();
    this.drawHitboxes(); // 🎨 Draw green hitboxes after interactions are created
    this.setupControls();

    // 5. Debug Graphics - HIDDEN (no visual collision display)
    const graphics = this.add.graphics().setAlpha(0.75).setDepth(200);
    if (this.collisionsLayer) {
        this.collisionsLayer.renderDebug(graphics, {
            tileColor: null, 
            collidingTileColor: null,
            faceColor: null
        });
    }
  }

  createPlayerAndCamera() {
    if (!this.textures.exists('player')) {
        const g = this.add.graphics();
        g.fillStyle(0xff9900, 1);
        g.fillRect(0, 0, 16, 16);
        g.generateTexture('player', 16, 16);
        g.destroy();
    }

    // Default Spawn (Server Room)
    const startX = 100; 
    const startY = 300;

    this.player = this.physics.add.sprite(startX, startY, 'player');
    this.player.setDepth(10);
    this.player.setCollideWorldBounds(true);
    this.player.setScale(0.5);
    this.player.body.setDrag(0.99); // Add friction
    this.player.body.setMaxSpeed(300); // Cap speed
    
    const width = this.player.width;
    const height = this.player.height;
    this.player.body.setSize(width * 0.5, height * 0.25);
    this.player.body.setOffset((width - (width * 0.5)) / 2, height - (height * 0.25));

    if (this.collisionsLayer) {
      this.physics.add.collider(this.player, this.collisionsLayer);
    }

    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setZoom(1.0);
  }

  setupInteractions() {
    this.interactions = [];
    
    console.log('🔍 Reading interactables from Tiled map object layers');
    
    // Layer names to read from Tiled
    const layerNames = [
      'main computer',
      'Bookshelves',
      'note',
      'whiteboard',
      'NPC#1 HR manager',
      'NPC#3 The Senior Dev'
    ];

    // Read directly from Tiled object layers
    layerNames.forEach(layerName => {
      const objectLayer = this.map.getObjectLayer(layerName);
      
      if (objectLayer && objectLayer.objects && objectLayer.objects.length > 0) {
        objectLayer.objects.forEach(obj => {
          // Position zone at object center
          const zoneX = obj.x + obj.width / 2;
          const zoneY = obj.y + obj.height / 2;
          
          const zone = this.add.zone(zoneX, zoneY, obj.width, obj.height);
          this.physics.world.enable(zone);
          zone.body.setAllowGravity(false);
          
          // Store all relevant data
          const interactionData = {
            zone: zone,
            name: layerName,
            x: obj.x,
            y: obj.y,
            width: obj.width,
            height: obj.height,
            properties: {}
          };
          
          // Extract properties from object
          if (obj.properties && Array.isArray(obj.properties)) {
            obj.properties.forEach(prop => {
              interactionData.properties[prop.name] = prop.value;
            });
          }
          
          // Extract layer properties as fallback (properties might be an object, not array)
          if (objectLayer.properties && Array.isArray(objectLayer.properties)) {
            objectLayer.properties.forEach(prop => {
              if (!interactionData.properties[prop.name]) {
                interactionData.properties[prop.name] = prop.value;
              }
            });
          }
          
          this.interactions.push(interactionData);
          
          console.log(`✓ ${layerName} at (${zoneX.toFixed(1)}, ${zoneY.toFixed(1)}) - Size: ${obj.width.toFixed(1)}x${obj.height.toFixed(1)}`);
        });
      } else {
        console.warn(`⚠️ Layer "${layerName}" not found or has no objects`);
      }
    });

    console.log(`✅ Total interactable zones: ${this.interactions.length}`);

    // Create the interaction hover text with animation
    this.interactText = this.add.text(this.cameras.main.centerX, 30, '', {
        fontSize: '16px',
        backgroundColor: '#000000',
        color: '#00FF00',
        padding: { x: 10, y: 5 },
        align: 'center',
        fontStyle: 'bold'
    });
    this.interactText.setDepth(9999);
    this.interactText.setOrigin(0.5, 0);
    this.interactText.setVisible(false);
    this.interactText.setScrollFactor(0, 0); // Fixed to camera
    
    // Add floating animation
    this.tweens.add({
        targets: this.interactText,
        y: { from: 30, to: 35 },
        duration: 800,
        ease: 'Sine.inOut',
        loop: -1,
        yoyo: true
    });
    
    this.currentHoveredObject = null;
  }

  drawHitboxes() {
    // Draw green rectangles for all interactable zones
    const graphics = this.add.graphics();
    graphics.lineStyle(3, 0x00ff00, 0.7); // Green color, 3px width, 70% opacity
    graphics.setDepth(1000); // Above most objects but below UI
    
    this.interactions.forEach((item) => {
      // Draw rectangle at the zone position
      const x = item.x;
      const y = item.y;
      const width = item.width;
      const height = item.height;
      
      graphics.strokeRect(x, y, width, height);
      
      // Optional: Draw a small label at the top
      const text = this.add.text(x + width/2, y - 10, item.name, {
        fontSize: '12px',
        color: '#00FF00',
        backgroundColor: '#000000',
        padding: { x: 4, y: 2 }
      });
      text.setOrigin(0.5, 1);
      text.setDepth(1001);
    });
  }

  createSmartNPC(x, y, name, data) {
    if (!this.textures.exists('npc')) {
        const g = this.add.graphics();
        g.fillStyle(0x0000ff, 1);
        g.fillRect(0, 0, 16, 16);
        g.generateTexture('npc', 16, 16);
        g.destroy();
    }
    const npcSprite = this.physics.add.sprite(x, y, 'npc');
    npcSprite.setDepth(6).setImmovable(true).setScale(0.5);
    const nW = npcSprite.width; const nH = npcSprite.height;
    npcSprite.body.setSize(nW * 0.4, nH * 0.2);
    npcSprite.body.setOffset((nW - nW * 0.4) / 2, nH - nH * 0.2);
    this.physics.add.collider(this.player, npcSprite);
    this.npcs.push({ sprite: npcSprite, data: data, name: name });
  }

  setupControls() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasdKeys = this.input.keyboard.addKeys({ W: 87, A: 65, S: 83, D: 68 });
    this.spaceKey = this.input.keyboard.addKey(32);
    this.resetKeys = this.input.keyboard.addKeys({ R: 82, H: 72 });
  }

  update() {
    if (!this.player || !this.cursors) return;

    if (this.resetKeys.R.isDown && this.resetKeys.H.isDown) {
        this.player.setPosition(this.spawnX || 100, this.spawnY || 300);
        this.player.setVelocity(0, 0);
        return;
    }

    let vx = 0; let vy = 0; const speed = 150;
    if (this.cursors.left.isDown || this.wasdKeys.A.isDown) vx = -speed;
    if (this.cursors.right.isDown || this.wasdKeys.D.isDown) vx = speed;
    if (this.cursors.up.isDown || this.wasdKeys.W.isDown) vy = -speed;
    if (this.cursors.down.isDown || this.wasdKeys.S.isDown) vy = speed;
    
    if (vx !== 0 && vy !== 0) { vx *= 0.7071; vy *= 0.7071; }
    this.player.setVelocity(vx, vy);

    // Check for nearby interactable objects
    const interactionRadius = 80;
    let nearestTarget = null;
    let nearestData = null;

    // Check interaction zones
    this.interactions.forEach((item) => {
        const distance = Phaser.Math.Distance.Between(
            this.player.x, this.player.y,
            item.zone.x, item.zone.y
        );
        
        if (distance < interactionRadius) {
            if (!nearestTarget || distance < nearestTarget.distance) {
                nearestTarget = { zone: item.zone, distance: distance };
                nearestData = item;
            }
        }
    });
    
    // Update hover text
    if (nearestData && nearestTarget) {
        this.interactText.setVisible(true);
        this.interactText.setText(`Press SPACE to interact with ${nearestData.name}`);
        this.currentHoveredObject = nearestData;
    } else {
        this.interactText.setVisible(false);
        this.currentHoveredObject = null;
    }

    if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) this.handleInteraction();
  }

  handleInteraction() {
    if (!this.currentHoveredObject) return;

    const item = this.currentHoveredObject;
    const props = item.properties || {};
    
    // Dispatch event for ComputerScreen to handle
    if (props.module) {
      window.dispatchEvent(new CustomEvent('openModule', { detail: { module: props.module } }));
    } else if (props.dialogue || props.message1) {
      const dialogueText = props.dialogue || props.message1;
      window.dispatchEvent(new CustomEvent('showDialogue', { 
        detail: { 
          name: item.name, 
          text: dialogueText 
        } 
      }));
    } else if (props.clue) {
      window.dispatchEvent(new CustomEvent('showDialogue', { 
        detail: { 
          name: item.name, 
          text: props.clue 
        } 
      }));
    } else {
      console.log(`Interacted with: ${item.name}`, props);
    }
  }
}

export default MainScene;