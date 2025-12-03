import Phaser from 'phaser';

class ServerRoomScene extends Phaser.Scene {
  constructor() {
    super({ key: 'ServerRoomScene' });
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
  }

  preload() {
    console.log('🎮 ServerRoomScene: Preloading MAP 2 (Server Room)...');
    
    // Load the Server Room map JSON
    this.load.tilemapTiledJSON('server_map', '/assets/maps/second_map.json');

    // Load tileset images used by the map
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

    tilesetNames.forEach(name => this.load.image(name, `/assets/tilesets/${name}.png`));

    // Player & NPC placeholder sprites
    this.load.image('player', '/assets/sprites/player.png');
    this.load.image('npc', '/assets/sprites/npc.png');
  }

  create() {
    console.log('🗺️ ServerRoomScene: Creating MAP 2');
    this.physics.world.TILE_BIAS = 48;

    // Create tilemap
    this.map = this.make.tilemap({ key: 'server_map' });

    // Add tilesets
    const tilesetKeys = [
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

    const tilesets = [];
    tilesetKeys.forEach(k => {
      try {
        const t = this.map.addTilesetImage(k, k);
        if (t) tilesets.push(t);
      } catch (e) {
        console.warn('Tileset add failed:', k, e.message);
      }
    });

    // Server Room-specific visual layers
    const visualLayerNames = [
      'Bottom of map floor',
      'Top of map floor',
      'Exterior most wall',
      'Bottom of map walls',
      'Top of map walls',
      'Top of map background chairs',
      'Top of map tables',
      'Top floor table extension',
      'Top of map objects on background tables',
      'Top floor wall / background objects',
      'Top of map table divider 1',
      'Top of map table divider 2',
      'Top of map objects on main tables',
      'Top of map main chairs',
      'Bottom floor paintings',
      'Bottom floor objects',
      'Bottom floor table extension',
      'Bottom floor chairs',
      'Bottom floor tables',
      'Bottom floor on table objects'
    ];

    visualLayerNames.forEach(name => {
      const layer = this.map.createLayer(name, tilesets, 0, 0);
      if (layer) {
        if (name.toLowerCase().includes('top') || name.toLowerCase().includes('object') || name.toLowerCase().includes('chair')) {
          layer.setDepth(5);
        } else if (name.toLowerCase().includes('wall')) {
          layer.setDepth(1);
        } else {
          layer.setDepth(0);
        }
      } else {
        console.warn(`Layer not found in ServerRoomScene: ${name}`);
      }
    });

    // Collision layer
    this.collisionsLayer = this.map.createLayer('collisions', tilesets, 0, 0);
    if (this.collisionsLayer) {
      this.collisionsLayer.setVisible(false);
      this.collisionsLayer.setDepth(100);
      this.collisionsLayer.setCollisionBetween(1, 100000);
      console.log('✅ ServerRoomScene: Collisions layer enabled');
    } else {
      console.error("❌ ServerRoomScene: 'collisions' layer not found");
    }

    // Player setup
    this.createPlayerAndCamera();

    // Interactions and NPCs
    this.setupInteractions();

    // Controls
    this.setupControls();

    // Debug graphics: ENABLED - Orange for walls, Purple for colliding tiles
    this.physics.world.createDebugGraphic();
    const graphics = this.add.graphics().setAlpha(0.75).setDepth(9999);
    if (this.collisionsLayer) {
      this.collisionsLayer.renderDebug(graphics, {
        tileColor: new Phaser.Display.Color(255, 165, 0, 100), // Orange for walls
        collidingTileColor: new Phaser.Display.Color(160, 32, 240, 255), // Purple for colliding
        faceColor: new Phaser.Display.Color(40, 39, 37, 255)
      });
    }
    console.log('✅ ServerRoomScene: Debug graphics ENABLED');
  }

  createPlayerAndCamera() {
    if (!this.textures.exists('player')) {
      const g = this.add.graphics();
      g.fillStyle(0xff9900, 1);
      g.fillRect(0, 0, 16, 16);
      g.generateTexture('player', 16, 16);
      g.destroy();
    }

    this.spawnX = (this.map.width / 2) * this.map.tileWidth;
    this.spawnY = (this.map.height / 2) * this.map.tileHeight;

    this.player = this.physics.add.sprite(this.spawnX, this.spawnY, 'player');
    this.player.setDepth(10);
    this.player.setCollideWorldBounds(true);
    
    // Player scale 0.5, centered hitbox
    this.player.setScale(0.5);
    const width = this.player.width;
    const height = this.player.height;
    this.player.body.setSize(width * 0.5, height * 0.5);
    this.player.body.setOffset((width - (width * 0.5)) / 2, (height - (height * 0.5)) / 2);

    if (this.collisionsLayer) {
      this.physics.add.collider(this.player, this.collisionsLayer);
    }

    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setZoom(1.0);
  }

  setupInteractions() {
    // Parse object layers for NPCs and interactive objects
    if (this.map.objects) {
      this.map.objects.forEach(layer => {
        const lname = (layer.name || '').toLowerCase();
        if (lname.includes('npc')) {
          (layer.objects || []).forEach(obj => this.createSmartNPC(obj.x, obj.y, layer.name, obj));
        } else {
          (layer.objects || []).forEach(obj => {
            this.interactions.push({ x: obj.x || 0, y: obj.y || 0, data: obj, name: layer.name || 'object' });
          });
        }
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
    const nW = npcSprite.width;
    const nH = npcSprite.height;
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

  getObjectProperty(obj, propName) {
    if (!obj) return undefined;
    if (obj.properties) {
      const p = obj.properties.find(p => p.name === propName);
      if (p) return p.value;
    }
    if (obj[propName] !== undefined) return obj[propName];
    return undefined;
  }

  update() {
    if (!this.player || !this.cursors) return;

    if (this.resetKeys.R.isDown && this.resetKeys.H.isDown) {
      this.player.setPosition(this.spawnX, this.spawnY);
      this.player.setVelocity(0, 0);
      return;
    }

    let vx = 0;
    let vy = 0;
    const speed = 150;
    
    if (this.cursors.left.isDown || this.wasdKeys.A.isDown) vx = -speed;
    if (this.cursors.right.isDown || this.wasdKeys.D.isDown) vx = speed;
    if (this.cursors.up.isDown || this.wasdKeys.W.isDown) vy = -speed;
    if (this.cursors.down.isDown || this.wasdKeys.S.isDown) vy = speed;

    if (vx !== 0 && vy !== 0) {
      vx *= 0.7071;
      vy *= 0.7071;
    }
    this.player.setVelocity(vx, vy);

    // Find nearest NPC for interaction hint
    const interactionRadius = 40;
    let nearestNPC = null;
    this.npcs.forEach((npc) => {
      if (Phaser.Math.Distance.Between(this.player.x, this.player.y, npc.sprite.x, npc.sprite.y) < interactionRadius) {
        nearestNPC = npc.sprite;
      }
    });

    // Find nearest interaction object
    let nearestInteraction = null;
    let nearestInteractionData = null;
    let nearestDist = Infinity;
    this.interactions.forEach((it) => {
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, it.x, it.y);
      if (dist < nearestDist && dist < interactionRadius) {
        nearestDist = dist;
        nearestInteraction = it;
        nearestInteractionData = it.data;
      }
    });

    const nearestTarget = nearestNPC || (nearestInteraction ? { x: nearestInteraction.x, y: nearestInteraction.y } : null);

    if (nearestTarget) {
      this.interactText.setVisible(true);
      this.interactText.setPosition(this.player.x, this.player.y - 20);

      if (this.spaceKey.isDown) {
        // Check if interaction object has targetScene property (e.g., door back to OfficeScene)
        if (nearestInteractionData) {
          const targetScene = this.getObjectProperty(nearestInteractionData, 'targetScene') || nearestInteractionData.targetScene;
          if (targetScene) {
            console.log(`🚪 ServerRoomScene: Transitioning to ${targetScene}`);
            this.scene.start(targetScene);
            return;
          }
        }

        // Otherwise, interact with NPC (placeholder: blink NPC)
        if (nearestNPC) {
          nearestNPC.setTint(0xffff00);
          this.time.delayedCall(200, () => nearestNPC.clearTint());
        }
      }
    } else {
      this.interactText.setVisible(false);
    }
  }
}

export default ServerRoomScene;