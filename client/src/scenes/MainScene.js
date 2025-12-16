import Phaser from 'phaser';
import { getCredentials } from '../config/credentials';

// 🎛️ MASTER SWITCH: Change this to 'office' or 'server_room' to switch maps!
const CURRENT_LEVEL = 'office'; 

class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' });
    this.player = null;
    this.cursors = null;
    this.wasdKeys = null;
    this.eKey = null;
    this.xKey = null;
    this.zKey = null;
    this.resetKeys = null;
    this.map = null;
    this.collisionsLayer = null;
    this.npcs = [];
    this.interactions = [];
    this.spawnX = 0;
    this.spawnY = 0;
    this.interactText = null;
    this.interactionRadius = 60;
    this.playerHitbox = null; // 🎯 Character hitbox
    this.dialogueBox = null; // 💬 Dialogue box at bottom
    this.whiteboardPage = 0; // 📋 Whiteboard page tracker (0=intro, 1=progress)
    this.whiteboardOpen = false; // 📋 Whiteboard is open
    
    // 🎮 Progression system - Load from localStorage or default to 'start'
    const savedProgress = localStorage.getItem('gameProgress');
    this.gameProgress = savedProgress || 'start'; // Progression states: start → hr_welcome → hr_whiteboard → senior_dev → unlocked
    this.isDialogueActive = false; // 🚫 Lock movement during dialogue
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
    
    // Load spritesheet for Player character (32x32, 4 frames for directions)
    this.load.spritesheet('player_character', '/assets/sprites/player_character.png', {
      frameWidth: 32,
      frameHeight: 32
    });
    
    // Load spritesheet for HR NPC (32x32 character)
    this.load.spritesheet('hr_character', '/assets/sprites/hr_character.png', {
      frameWidth: 32,
      frameHeight: 32
    });
    
    // Load spritesheet for Senior Dev NPC (32x32 character)
    this.load.spritesheet('senior_dev_character', '/assets/sprites/senior_dev_character.png', {
      frameWidth: 32,
      frameHeight: 32
    });
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

    // 🚫 Listen for dialogue state changes from React component
    window.addEventListener('dialogueOpened', (event) => {
      console.log('📂 Dialogue opened - locking movement');
      this.isDialogueActive = true;
    });

    window.addEventListener('dialogueClosed', (event) => {
      console.log('📂 Dialogue closed - unlocking movement');
      this.isDialogueActive = false;
    });

    // 🚫 Listen for Escape key to close dialogue
    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' || event.key === 'Esc') {
        if (this.isDialogueActive) {
          console.log('❌ Dialogue closed by ESC key');
          window.dispatchEvent(new CustomEvent('closeDialogue', {}));
          window.dispatchEvent(new CustomEvent('dialogueClosed', {}));
          this.isDialogueActive = false;
        }
      }
    });

    window.addEventListener('nextWhiteboardPage', (event) => {
      console.log('📋 Next whiteboard page event received - current page:', this.whiteboardPage);
      this.whiteboardPage = (this.whiteboardPage + 1) % 2; // Toggle between page 0 and 1
      console.log('📋 Whiteboard page toggled to:', this.whiteboardPage);
      this.showWhiteboardPage();
    });

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
    // Create animations for Player character
    // Layout: [column (y), row (x)] where column 0-7, rows 0-6+
    // Standing still: [0, 0] = frame 0
    if (!this.anims.exists('player_idle')) {
      this.anims.create({
        key: 'player_idle',
        frames: [{ key: 'player_character', frame: 0 }],
        frameRate: 1,
        repeat: -1
      });
    }
    
    // Walking right: test Row 2 frames 16-21
    if (!this.anims.exists('player_walk_right')) {
      this.anims.create({
        key: 'player_walk_right',
        frames: [
          { key: 'player_character', frame: 18 },
          { key: 'player_character', frame: 19 },
          { key: 'player_character', frame: 20 },
          { key: 'player_character', frame: 21 }
        ],
        frameRate: 8,
        repeat: -1
      });
    }
    
    // Walking up: [frames 32-35]
    if (!this.anims.exists('player_walk_up')) {
      this.anims.create({
        key: 'player_walk_up',
        frames: [
          { key: 'player_character', frame: 32 },
          { key: 'player_character', frame: 33 },
          { key: 'player_character', frame: 34 },
          { key: 'player_character', frame: 35 }
        ],
        frameRate: 8,
        repeat: -1
      });
    }
    
    // Walking left: same frames as right, but will be flipped
    if (!this.anims.exists('player_walk_left')) {
      this.anims.create({
        key: 'player_walk_left',
        frames: [
          { key: 'player_character', frame: 18 },
          { key: 'player_character', frame: 19 },
          { key: 'player_character', frame: 20 },
          { key: 'player_character', frame: 21 }
        ],
        frameRate: 8,
        repeat: -1
      });
    }
    // Walking down: use these 6 frames
    if (!this.anims.exists('player_walk_down')) {
      this.anims.create({
        key: 'player_walk_down',
        frames: [
          { key: 'player_character', frame: 8 },
          { key: 'player_character', frame: 9 },
          { key: 'player_character', frame: 10 },
          { key: 'player_character', frame: 11 },
        ],
        frameRate: 8,
        repeat: -1
      });
    }
    // Walking up: use Row 4 frames 32-35
    if (!this.anims.exists('player_walk_up')) {
      this.anims.create({
        key: 'player_walk_up',
        frames: [
          { key: 'player_character', frame: 32 },
          { key: 'player_character', frame: 33 },
          { key: 'player_character', frame: 34 },
          { key: 'player_character', frame: 35 }
        ],
        frameRate: 8,
        repeat: -1
      });
    }

    // Create animation for HR NPC - show only the first frame (top-left)
    if (!this.anims.exists('hr_character_idle')) {
      this.anims.create({
        key: 'hr_character_idle',
        frames: [{ key: 'hr_character', frame: 0 }], // Frame 0 is top-left
        frameRate: 1,
        repeat: -1
      });
    }

    // Create animation for Senior Dev NPC - show only the first frame (top-left)
    if (!this.anims.exists('senior_dev_character_idle')) {
      this.anims.create({
        key: 'senior_dev_character_idle',
        frames: [{ key: 'senior_dev_character', frame: 0 }], // Frame 0 is top-left
        frameRate: 1,
        repeat: -1
      });
    }

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

    this.player = this.physics.add.sprite(startX, startY, 'player_character');
    this.player.setDepth(10);
    this.player.setCollideWorldBounds(true);
    this.player.setScale(2.5); // 32x32 scaled to ~48px
    this.player.body.setDrag(0.99); // Add friction
    this.player.body.setMaxSpeed(300); // Cap speed
    
    // Play idle animation
    this.player.play('player_idle');
    
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

    // 🎯 Draw character hitbox (blue circle around player)
    this.playerHitbox = this.add.graphics();
    this.playerHitbox.lineStyle(2, 0x0099ff, 0.7);
    this.playerHitbox.strokeCircle(0, 0, 40); // 40px radius detection circle
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
          
          // Create visible sprite for NPCs
          if (layerName.toLowerCase().includes('npc')) {
            this.createSmartNPC(zoneX, zoneY, layerName, interactionData);
          }
          
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
    // Use specific character sprites for NPCs
    let spriteKey = 'npc';
    let useAnimation = false;
    let animationKey = '';
    
    if (name && name.toLowerCase().includes('hr')) {
      spriteKey = 'hr_character';
      animationKey = 'hr_character_idle';
      useAnimation = true;
      console.log('🎨 Creating HR NPC with character sprite at', x, y);
    } else if (name && name.toLowerCase().includes('senior dev')) {
      spriteKey = 'senior_dev_character';
      animationKey = 'senior_dev_character_idle';
      useAnimation = true;
      console.log('🎨 Creating Senior Dev NPC with character sprite at', x, y);
    }
    
    if (!this.textures.exists('npc')) {
        const g = this.add.graphics();
        g.fillStyle(0x0000ff, 1);
        g.fillRect(0, 0, 16, 16);
        g.generateTexture('npc', 16, 16);
        g.destroy();
    }
    
    // Debug: Check if sprite texture exists
    if (!this.textures.exists(spriteKey)) {
      console.error('❌ Texture missing:', spriteKey);
      console.log('Available textures:', this.textures.getTextureKeys());
      spriteKey = 'npc'; // Fallback to blue box
    } else {
      console.log('✅ Texture loaded:', spriteKey);
      const texture = this.textures.get(spriteKey);
      console.log('Texture frames:', texture.getFrameNames());
    }
    
    const npcSprite = this.physics.add.sprite(x, y, spriteKey);
    npcSprite.setDepth(6).setImmovable(true).setScale(useAnimation ? 2.5 : 1);
    
    // Play animation if using character sprites
    if (useAnimation && spriteKey !== 'npc') {
      if (this.anims.exists(animationKey)) {
        npcSprite.play(animationKey);
        console.log('▶️ Playing', animationKey, 'animation');
      } else {
        console.error('❌ Animation not found:', animationKey);
        console.log('Available animations:', this.anims.getKeys());
      }
    }
    
    const nW = npcSprite.width; const nH = npcSprite.height;
    console.log('NPC sprite dimensions:', nW, 'x', nH);
    npcSprite.body.setSize(nW * 0.4, nH * 0.2);
    npcSprite.body.setOffset((nW - nW * 0.4) / 2, nH - nH * 0.2);
    this.physics.add.collider(this.player, npcSprite);
    this.npcs.push({ sprite: npcSprite, data: data, name: name });
  }

  setupControls() {
    // Since Phaser keyboard is disabled, we'll use window keyboard events
    this.keysPressed = {};
    this.keysPressedLastFrame = {};
    
    window.addEventListener('keydown', (e) => {
      // Check if an input field is focused
      const activeElement = document.activeElement;
      const isInputFocused = activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA');
      
      // Only track game keys if not typing
      if (!isInputFocused) {
        if (!this.keysPressed[e.code]) {
          this.keysPressed[e.code] = true;
        }
        // Prevent default browser behavior for game keys ONLY (not for system shortcuts like Ctrl+R, F5)
        // Don't prevent if Ctrl, Alt, Meta, or Shift is pressed (system shortcuts)
        if (!e.ctrlKey && !e.altKey && !e.metaKey && !e.shiftKey) {
          if (['KeyW', 'KeyA', 'KeyS', 'KeyD', 'KeyE', 'KeyX', 'KeyZ', 'KeyR', 'KeyH', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
            e.preventDefault();
          }
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keysPressed[e.code] = false;
    });
  }

  // 💾 Save game progress to localStorage
  saveProgress(newProgress) {
    this.gameProgress = newProgress;
    localStorage.setItem('gameProgress', newProgress);
    console.log(`💾 Game progress saved: ${newProgress}`);
  }

  isKeyJustPressed(code) {
    return this.keysPressed[code] && !this.keysPressedLastFrame[code];
  }

  update() {
    if (!this.player) return;

    // Check if an input field is focused - if so, skip keyboard game controls
    const activeElement = document.activeElement;
    const isInputFocused = activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA');
    
    // 🚫 Prevent movement during dialogue
    if (isInputFocused || this.isDialogueActive) {
      // Don't process game keyboard input when typing or in dialogue
      this.player.setVelocity(0, 0);
      return;
    }

    // R + H to reset position
    if (this.keysPressed['KeyR'] && this.keysPressed['KeyH']) {
        this.player.setPosition(this.spawnX || 100, this.spawnY || 300);
        this.player.setVelocity(0, 0);
        return;
    }

    let vx = 0; let vy = 0; const speed = 150;
    
    // Check arrow keys and WASD keys
    if (this.keysPressed['ArrowLeft'] || this.keysPressed['KeyA']) vx = -speed;
    if (this.keysPressed['ArrowRight'] || this.keysPressed['KeyD']) vx = speed;
    if (this.keysPressed['ArrowUp'] || this.keysPressed['KeyW']) vy = -speed;
    if (this.keysPressed['ArrowDown'] || this.keysPressed['KeyS']) vy = speed;
    
    if (vx !== 0 && vy !== 0) { vx *= 0.7071; vy *= 0.7071; }
    this.player.setVelocity(vx, vy);
    
    // Play animations based on movement
    if (Math.abs(vx) > 0 || Math.abs(vy) > 0) {
      // Moving - play walking animations
      if (Math.abs(vx) > Math.abs(vy)) {
        // Horizontal movement
        if (vx > 0) {
          this.player.play('player_walk_right', true);
        } else {
          this.player.play('player_walk_left', true);
        }
      } else if (Math.abs(vy) > 0) {
        // Vertical movement
        if (vy > 0) {
          this.player.play('player_walk_down', true);
        } else {
          this.player.play('player_walk_up', true);
        }
      }
    } else {
      // Not moving - play idle animation
      this.player.play('player_idle', true);
    }

    // 🎯 Update character hitbox position to follow player
    if (this.playerHitbox) {
      this.playerHitbox.setPosition(this.player.x, this.player.y);
    }

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
            // Check if this interaction is allowed based on game progression
            if (!this.isInteractionAllowed(item.name)) {
                return; // Skip this interaction, it's not unlocked yet
            }
            
            if (!nearestTarget || distance < nearestTarget.distance) {
                nearestTarget = { zone: item.zone, distance: distance };
                nearestData = item;
            }
        }
    });
    
    // Update hover text
    if (nearestData && nearestTarget) {
        this.interactText.setVisible(true);
        this.interactText.setText(`Press E to interact with ${nearestData.name}`);
        this.currentHoveredObject = nearestData;
    } else {
        this.interactText.setVisible(false);
        this.currentHoveredObject = null;
    }

    if (this.isKeyJustPressed('KeyE')) this.handleInteraction();
    
    // Handle whiteboard page navigation
    if (this.whiteboardOpen) {
      if (this.isKeyJustPressed('KeyX')) {
        this.closeWhiteboard();
      }
      if (this.isKeyJustPressed('KeyZ')) {
        this.whiteboardPage = (this.whiteboardPage + 1) % 2;
        this.showWhiteboardPage();
      }
    }

    // Update keysPressedLastFrame for next frame
    this.keysPressedLastFrame = { ...this.keysPressed };
  }

  showWhiteboardPage() {
    console.log('📋 showWhiteboardPage called with page:', this.whiteboardPage);
    this.isDialogueActive = true; // 🚫 Lock movement
    if (this.whiteboardPage === 0) {
      // Page 1: Phishing attack warning
      const message = `⚠️  SECURITY ALERT ⚠️\n\nThe company is currently facing multiple phishing attack emails designed to compromise our security infrastructure.\n\nYour mission: Identify and filter these malicious emails to protect company data and employee accounts.\n\nBe vigilant. Stay focused.\n\n[Press X to close | Press Z for progress]`;
      window.dispatchEvent(new CustomEvent('showDialogue', { 
        detail: { 
          name: 'WHITEBOARD - Page 1/2', 
          text: message,
          isWhiteboard: true,
          onClose: () => this.closeWhiteboard()
        } 
      }));
    } else if (this.whiteboardPage === 1) {
      // Page 2: Show email count remaining
      const emailCountLeft = this.getEmailCountRemaining();
      const message = `📊 CURRENT PROGRESS 📊\n\nEmails remaining in Inbox:\n${emailCountLeft} email${emailCountLeft !== 1 ? 's' : ''} left to filter\n\nKeep working until your inbox is clear!\n\n[Press X to close | Press Z to go back]`;
      window.dispatchEvent(new CustomEvent('showDialogue', { 
        detail: { 
          name: 'WHITEBOARD - Page 2/2', 
          text: message,
          isWhiteboard: true,
          onClose: () => this.closeWhiteboard()
        } 
      }));
    }
  }

  getEmailCountRemaining() {
    // Get the email count from localStorage or session storage
    const emailState = JSON.parse(localStorage.getItem('emailState') || '{}');
    const inboxEmails = emailState.inboxCount || 0;
    return inboxEmails;
  }

  // Check if we've reached halfway (7 or fewer emails left)
  isHalfwayDone() {
    const remaining = this.getEmailCountRemaining();
    return remaining <= 7 && remaining > 0; // More than 0 to avoid triggering on completion
  }

  // Track if we've already shown the halfway message
  hasShownHalfwayMessage() {
    return this.halfwayMessageShown || false;
  }

  markHalfwayMessageShown() {
    this.halfwayMessageShown = true;
  }

  closeWhiteboard() {
    this.whiteboardOpen = false;
    this.whiteboardPage = 0;
    this.isDialogueActive = false; // 🚫 Unlock movement
    window.dispatchEvent(new CustomEvent('closeDialogue', {}));
    window.dispatchEvent(new CustomEvent('dialogueClosed', {})); // Emit both events to ensure dialogue is closed
  }

  // 🎮 Check if an interaction is allowed based on current game progression
  isInteractionAllowed(interactionName) {
    // 🚀 DEVELOPER MODE: Allow all interactions regardless of progression
    return true;
  }

  handleInteraction() {
    if (!this.currentHoveredObject) {
      console.log('❌ No hovered object');
      return;
    }

    // Stop player movement and set to idle animation
    this.player.setVelocity(0, 0);
    this.player.play('player_idle');
    this.isDialogueActive = true;

    const item = this.currentHoveredObject;
    const props = item.properties || {};
    
    console.log('🎯 Interaction triggered with:', item.name, props);
    console.log('📊 Current progress:', this.gameProgress);
    
    // Get username from localStorage for personalized messages
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const username = user.username || 'Employee';

    // Special handler for HR manager
    if (item.name === 'NPC#1 HR manager') {
      console.log('💬 Showing HR Manager dialogue...');
      
      // Check if halfway done
      if (this.isHalfwayDone() && !this.hasShownHalfwayMessage()) {
        const halfwayMessage = `Great work! You're halfway through the emails. You've caught quite a few phishing attempts already. Keep up the good work - when you finish analyzing all the emails, come back and let me know so I can show you what to do next.`;
        
        window.dispatchEvent(new CustomEvent('showDialogue', { 
          detail: { 
            name: 'HR Manager', 
            text: halfwayMessage,
            onClose: () => {
              this.markHalfwayMessageShown();
              this.isDialogueActive = false; // 🚫 Unlock movement
            }
          } 
        }));
      } else if (this.gameProgress === 'start') {
        // First interaction with HR - welcome message
        const welcomeMessage = `Hi ${username}! Welcome to CyberGuard Academy!\n\nYou'll be working on phishing email detection and cybersecurity awareness. It's a critical role in protecting our organization from cyber threats and keeping our employees safe from social engineering attacks.\n\nWe need sharp eyes and careful analysis to identify malicious emails before they can cause damage.`;
        
        window.dispatchEvent(new CustomEvent('showDialogue', { 
          detail: { 
            name: 'HR Manager', 
            text: welcomeMessage,
            onClose: () => {
              console.log('🔄 Moving to hr_welcome state');
              this.saveProgress('hr_welcome');
              this.isDialogueActive = false; // 🚫 Unlock movement
            }
          } 
        }));
      } else if (this.gameProgress === 'hr_welcome') {
        // Second interaction with HR - whiteboard pointer
        const whiteboardMessage = `One more thing - you can check the whiteboard at the top of the office to see your progress and any incomplete tasks. It'll help you stay organized and see what still needs to be done.\n\nGood luck!`;
        
        window.dispatchEvent(new CustomEvent('showDialogue', { 
          detail: { 
            name: 'HR Manager', 
            text: whiteboardMessage,
            onClose: () => {
              console.log('🔄 Moving to hr_whiteboard state');
              this.saveProgress('hr_whiteboard');
              this.isDialogueActive = false; // 🚫 Unlock movement
            }
          } 
        }));
      } else if (this.gameProgress === 'hr_whiteboard') {
        // Check if halfway done - if so, show halfway message and mark it as shown
        if (this.isHalfwayDone() && !this.hasShownHalfwayMessage()) {
          const halfwayMessage = `Great work! You're halfway through the emails. You've caught quite a few phishing attempts already. Keep up the good work - when you finish analyzing all the emails, come back and let me know so I can show you what to do next.`;
          
          window.dispatchEvent(new CustomEvent('showDialogue', { 
            detail: { 
              name: 'HR Manager', 
              text: halfwayMessage,
              onClose: () => {
                this.markHalfwayMessageShown();
                this.isDialogueActive = false; // 🚫 Unlock movement
              }
            } 
          }));
        } else {
          // Repeat the second dialogue (whiteboard message) until halfway done
          const whiteboardMessage = `One more thing - you can check the whiteboard at the top of the office to see your progress and any incomplete tasks. It'll help you stay organized and see what still needs to be done.\n\nGood luck!`;
          
          window.dispatchEvent(new CustomEvent('showDialogue', { 
            detail: { 
              name: 'HR Manager', 
              text: whiteboardMessage,
              onClose: () => {
                this.isDialogueActive = false; // 🚫 Unlock movement
              }
            } 
          }));
        }
      }
    }
    // Special handler for Senior Dev - unlocks more interactions
    else if (item.name === 'NPC#3 The Senior Dev') {
      console.log('💬 Showing Senior Dev dialogue...');
      
      // Check if this is first interaction
      const hasMetSeniorDev = localStorage.getItem('metSeniorDev') === 'true';
      
      let devMessage;
      if (!hasMetSeniorDev) {
        // First interaction - full introduction
        devMessage = `Hey! I'm David, the Senior Developer. I work here on the cybersecurity team.\n\nMy email is: david.tan@company.com\n\nThe login credentials you will need to access the company's email are on the sticky note on my table.`;
        localStorage.setItem('metSeniorDev', 'true');
      } else {
        // Repeat interactions - just point to the sticky note and computer
        devMessage = `Don't forget - the login credentials are on that sticky note right there. You'll need them to access the email on the main computer.`;
      }
      
      window.dispatchEvent(new CustomEvent('showDialogue', { 
        detail: { 
          name: 'Senior Dev - David', 
          text: devMessage,
          onClose: () => {
            this.isDialogueActive = false; // 🚫 Unlock movement
          }
        } 
      }));
    }
    // Special handler for the note - shows login credentials
    else if (item.name === 'note') {
      console.log('📝 Showing sticky note with credentials...');
      const credentials = getCredentials();
      window.dispatchEvent(new CustomEvent('showStickyNote', {
        detail: {
          loginEmail: credentials.email,
          loginPassword: credentials.password,
          devEmail: credentials.devEmail
        }
      }));
      this.isDialogueActive = false;
    }
    // Special handler for main computer - open email client
    else if (item.name === 'main computer') {
      console.log('💻 Opening Email Client...');
      window.dispatchEvent(new CustomEvent('openEmailClient', { 
        detail: {} 
      }));
    }
    // Special handler for whiteboard - show two-page dialogue
    else if (item.name === 'whiteboard') {
      console.log('📋 Opening Whiteboard...');
      this.whiteboardOpen = true;
      this.whiteboardPage = 0;
      // Dispatch event to show progress button
      window.dispatchEvent(new CustomEvent('showBoard', { detail: {} }));
      this.showWhiteboardPage();
    }
    // Bookshelf interaction
    else if (item.name === 'Bookshelves') {
      console.log('📚 Opening Phishing Wiki Guide...');
      window.dispatchEvent(new CustomEvent('openPhishingWiki', { 
        detail: {} 
      }));
      this.isDialogueActive = true; // 🚫 Lock movement
    }
    else if (props.module) {
      console.log('📂 Opening module:', props.module);
      window.dispatchEvent(new CustomEvent('openModule', { detail: { module: props.module } }));
    } else if (props.dialogue || props.message1) {
      const dialogueText = props.dialogue || props.message1;
      console.log('💬 Showing dialogue:', dialogueText);
      window.dispatchEvent(new CustomEvent('showDialogue', { 
        detail: { 
          name: item.name, 
          text: dialogueText 
        } 
      }));
    } else if (props.clue) {
      console.log('💡 Showing clue:', props.clue);
      window.dispatchEvent(new CustomEvent('showDialogue', { 
        detail: { 
          name: item.name, 
          text: props.clue 
        } 
      }));
    } else {
      console.log(`⚠️ Interacted with: ${item.name}`, props);
    }
  }
}

export default MainScene;