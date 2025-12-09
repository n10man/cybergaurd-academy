# ✅ EXACT SETUP CHECKLIST - What You Need to Do

## For Perfect Hitbox Alignment with Tiled

### Current Situation:
- Your Tiled map: `first_map.json` has 6 interactable objects across different layers
- The code now reads **directly from your Tiled map** instead of hardcoding positions
- Hitboxes are drawn in **GREEN** so you can see them

---

## What I Need From You (Step by Step):

### **OPTION A: Verify Current Setup** ✅ (Recommended First Step)

1. **Open your browser** at `http://localhost:3000`
   - If npm start isn't running, do: `cd d:\projects\cybergaurd-academy\client && npm start`

2. **Look for GREEN BOXES** on the game map
   - You should see 6 green rectangles
   - These represent your 6 interactable objects from Tiled

3. **Open browser console** (Press F12)
   - Click "Console" tab
   - Scroll to top and look for messages like:
     ```
     🔍 Reading interactables from Tiled map object layers
     ✓ main computer at (256.0, 36.0) - Size: 156.0x80.0
     ...etc
     ✅ Total interactable zones: 6
     ```

4. **Report back what you see:**
   - Are there exactly 6 green boxes?
   - Do the console messages show all 6 objects?
   - Are the green boxes in the right visual locations?

---

### **OPTION B: If Hitboxes Don't Show Up**

This would mean Tiled layer names don't match. If this happens, I need:

1. **Open your Tiled map** (`first_map.json` in editor)
2. **Look at ALL object layers** (the ones that look like folders with boxes inside)
3. **Give me a list** of:
   - Every layer name (exactly as shown)
   - What objects are in each layer
   - The exact spelling/capitalization

**Example format:**
```
- Layer: "main computer" → contains 1 object
- Layer: "Bookshelves" → contains 1 object
- Layer: "note" → contains 1 object
... etc
```

---

### **OPTION C: If Boxes Are in Wrong Places**

If the green boxes don't line up with your Tiled objects, I need:

1. **Take a screenshot** of your Tiled map showing:
   - The object layer visible (check the eye icon)
   - The objects highlighted
   - The coordinate/position info shown

2. **Tell me which boxes are wrong:**
   - "The whiteboard box is too far left"
   - "The computer box is in a completely different spot"
   - Etc.

---

## What the Code is Doing Now:

```javascript
// This reads your Tiled map object layers:
const layerNames = [
  'main computer',      // ← These MUST match exactly
  'Bookshelves',        // ← Capitalization matters
  'note',               // ← Exact spelling required
  'whiteboard',
  'NPC#1 HR manager',
  'NPC#3 The Senior Dev'
];

// For each layer, it:
// 1. Finds the object layer in Tiled: this.map.getObjectLayer(layerName)
// 2. Gets the exact X, Y, width, height from Tiled
// 3. Creates a zone (hitbox) at those positions
// 4. Draws it GREEN: lineStyle(3, 0x00ff00, 0.7)
```

---

## The Perfect Setup (Final Result):

When everything is correct, you'll have:

✅ **6 green rectangles** visible in your game  
✅ **Exactly matching** Tiled object positions  
✅ **Console shows** all 6 objects loaded  
✅ **Moving player** shows hover text when within 80px  
✅ **Pressing SPACE** triggers the object's interaction  

---

## Quick Reference: Layer Names (Case-Sensitive)

These must appear EXACTLY in your Tiled map:

```
main computer
Bookshelves
note
whiteboard
NPC#1 HR manager
NPC#3 The Senior Dev
```

**If your Tiled has:**
- `Main Computer` (capital M) ❌ Won't work
- `bookshelves` (lowercase) ❌ Won't work  
- `NPC 1 HR manager` (spaces instead of #) ❌ Won't work

---

## Next Steps After Verification:

Once hitboxes are showing correctly:

1. ✅ Move player around with WASD
2. ✅ Get within 80px of a green box
3. ✅ Confirm "Press SPACE to interact" text appears
4. ✅ Press SPACE and confirm interaction triggers
5. ✅ Report any interactions that don't work

Then I can help with any final adjustments!
