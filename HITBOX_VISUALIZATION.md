# 🎯 Hitbox Visualization Guide

## Current Status

The hitboxes are now **VISUALIZED IN GREEN** in the Phaser game. Here's what I've updated:

### What Changed:
1. ✅ **Hitboxes are now drawn in GREEN** - They will appear as green rectangles on your game world
2. ✅ **Reading directly from Tiled map** - No more hardcoded positions
3. ✅ **All 6 interactables loaded exactly as they are in Tiled**

### How to See the Hitboxes:

**Open the game in your browser at `http://localhost:3000`**

You should see:
- 🟩 **Green box** at the main computer (top-left area)
- 🟩 **Green box** at the bookshelves (top-middle area)  
- 🟩 **Green box** at the note (middle-right area)
- 🟩 **Green box** at the whiteboard (top-center area)
- 🟩 **Green box** at HR manager (bottom-left area)
- 🟩 **Green box** at Senior Dev (bottom-middle area)

---

## Exact Coordinates from Your Tiled Map

| Object Name | Tiled X | Tiled Y | Width | Height | Center X | Center Y |
|-------------|---------|---------|-------|--------|----------|----------|
| main computer | 178 | -4 | 156 | 80 | 256 | 36 |
| Bookshelves | 350 | 18 | 164.667 | 58.6667 | 432.3 | 47.3 |
| note | 601.333 | 280 | 88.6667 | 42 | 645.7 | 301 |
| whiteboard | 525.333 | 1 | 103.667 | 85 | 577.2 | 43.5 |
| NPC#1 HR manager | 153.334 | 449.334 | 56 | 74.6667 | 181.3 | 486.7 |
| NPC#3 The Senior Dev | 476.667 | 449.667 | 69 | 77.3333 | 511.2 | 488.3 |

---

## Browser Console Output

When the game loads, check the browser console (F12 → Console tab) for these messages:

```
🔍 Reading interactables from Tiled map object layers
✓ main computer at (256.0, 36.0) - Size: 156.0x80.0
✓ Bookshelves at (432.3, 47.3) - Size: 164.7x58.7
✓ note at (645.7, 301.0) - Size: 88.7x42.0
✓ whiteboard at (577.2, 43.5) - Size: 103.7x85.0
✓ NPC#1 HR manager at (181.3, 486.7) - Size: 56.0x74.7
✓ NPC#3 The Senior Dev at (511.2, 488.3) - Size: 69.0x77.3
✅ Total interactable zones: 6
```

If you see warnings like `⚠️ Layer "..." not found`, that means the layer name doesn't match your Tiled map exactly.

---

## How the Hitbox System Works Now

1. **MainScene.js reads directly from Tiled map**
   - Uses `this.map.getObjectLayer(layerName)` to find each object layer
   - Extracts exact X, Y, width, height from Tiled JSON

2. **Green rectangles drawn for debugging**
   - `this.physics.world.debugGraphics.lineStyle(3, 0x00ff00, 0.7)` sets green color
   - `this.physics.world.debugGraphics.strokeRectShape(zone.body)` draws the box

3. **80px detection radius**
   - When player is within 80px of a hitbox, "Press SPACE to interact" appears
   - The green text shows exactly which object you can interact with

---

## If Hitboxes Don't Appear:

1. **Check browser console** (F12) for error messages
2. **Reload the page** - Hot reload should have compiled the changes
3. **Check object layer names in Tiled** - Names must match EXACTLY:
   - `main computer` ✅
   - `Bookshelves` ✅
   - `note` ✅
   - `whiteboard` ✅
   - `NPC#1 HR manager` ✅
   - `NPC#3 The Senior Dev` ✅

---

## If You Add New Objects to Tiled:

1. Add them as a new **Object Layer** in Tiled
2. Add the layer name to the `layerNames` array in `MainScene.js` line 202
3. Save Tiled map (exports to `first_map.json`)
4. The hitbox will automatically appear in the game!

---

## Debug Console Commands

In the browser console, you can run:
```javascript
// Get all current interactions
scene.interactions.forEach(i => console.log(i.name, i.x, i.y))

// Check distance to specific object
const dist = Phaser.Math.Distance.Between(scene.player.x, scene.player.y, scene.interactions[0].zone.x, scene.interactions[0].zone.y)
console.log('Distance to first object:', dist)
```
