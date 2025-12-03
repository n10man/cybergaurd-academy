import Phaser from 'phaser';

// 🎛️ MASTER SWITCH: Change this to 'office' or 'server_room' to switch maps!
const CURRENT_LEVEL = 'server_room'; 

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
        // VISIBLE FOR DEBUGGING
        this.collisionsLayer.setVisible(true); 
        this.collisionsLayer.setDepth(100);
        
        // BRUTE FORCE COLLISION
        this.collisionsLayer.setCollisionBetween(1, 100000);
    } else {
        console.error("⚠️ CRITICAL: 'collisions' layer not found!");
    }

    this.createPlayerAndCamera();
    this.setupInteractions();
    this.setupControls();

    // 5. Debug Graphics
    this.physics.world.createDebugGraphic();
    const graphics = this.add.graphics().setAlpha(0.75).setDepth(200);
    if (this.collisionsLayer) {
        this.collisionsLayer.renderDebug(graphics, {
            tileColor: null, 
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), 
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) 
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
    if (this.map.objects) {
        this.map.objects.forEach(layer => {
            if (layer.name.toLowerCase().includes('npc')) {
                layer.objects.forEach(obj => this.createSmartNPC(obj.x, obj.y, layer.name, obj));
            }
        });
    }
    
    const interactionsLayer = this.map.objects ? this.map.objects.find(o => o.name === 'Interactions') : null;
    if (interactionsLayer) {
        interactionsLayer.objects.forEach(obj => {
            const zoneX = obj.x + (obj.width / 2);
            const zoneY = obj.y + (obj.height / 2);
            const zone = this.add.zone(zoneX, zoneY, obj.width, obj.height);
            this.physics.world.enable(zone);
            zone.body.setAllowGravity(false);
            zone.body.setMoves(false);
            this.interactions.push({ zone: zone, name: obj.name, data: obj });
        });
    }

    this.interactText = this.add.text(0, 0, 'Press SPACE', { fontSize: '12px', backgroundColor: '#000', color: '#fff' });
    this.interactText.setDepth(100).setOrigin(0.5, 1.5).setVisible(false);
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

    const interactionRadius = 40;
    let nearestTarget = null;
    this.npcs.forEach((npc) => {
      if (Phaser.Math.Distance.Between(this.player.x, this.player.y, npc.sprite.x, npc.sprite.y) < this.interactionRadius) nearestTarget = npc.sprite;
    });
    if (!nearestTarget) {
        this.interactions.forEach((item) => {
            if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), item.zone.getBounds())) nearestTarget = item.zone;
        });
    }
    
    if (nearestTarget) {
        this.interactText.setVisible(true);
        this.interactText.setPosition(this.player.x, this.player.y - 20);
    } else {
        this.interactText.setVisible(false);
    }

    if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) this.handleInteraction();
  }

  handleInteraction() {
    let interactionFound = false;
    this.npcs.forEach((npc) => {
      if (Phaser.Math.Distance.Between(this.player.x, this.player.y, npc.sprite.x, npc.sprite.y) < this.interactionRadius) {
        const messageProp = npc.data.properties ? npc.data.properties.find(p => p.name.toLowerCase().includes('message')) : null;
        window.dispatchEvent(new CustomEvent('showDialogue', { detail: { name: npc.name, text: messageProp ? messageProp.value : "Hello!" } }));
        interactionFound = true;
      }
    });
    if (interactionFound) return;

    this.interactions.forEach((item) => {
        if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), item.zone.getBounds())) {
             const props = item.data.properties || [];
             const moduleProp = props.find(p => p.name === 'module');
             const clueProp = props.find(p => p.name === 'text' || p.name === 'clue');
             if (moduleProp) window.dispatchEvent(new CustomEvent('openModule', { detail: { module: moduleProp.value } }));
             else if (clueProp) window.dispatchEvent(new CustomEvent('showDialogue', { detail: { name: "System", text: clueProp.value } }));
        }
    });
  }
}

export default MainScene;