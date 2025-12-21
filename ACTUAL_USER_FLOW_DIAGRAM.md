# CyberGuard Academy - Actual User Activity Flow Diagram

## 🔍 Key Findings from Code Analysis

### Email Verification Status
- **NO EMAIL VERIFICATION CODE** ✅
- Email is **AUTO-VERIFIED on registration** (signup → `email_verified = true`)
- No verification email sent, no token required
- User auto-logs in immediately after registration

### Game Flow
- User goes **directly into the game** (Phaser-based)
- Game has progression system tracking NPC interactions
- User must interact with NPCs in specific order to unlock content
- Email client is triggered from game interactions

---

## 📊 Activity Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          START: CyberGuard Academy                          │
└────────────────────────────────────┬──────────────────────────────────────────┘
                                     │
                    ┌────────────────▼────────────────┐
                    │  User on Landing Page           │
                    │  [LandingPage.js]               │
                    └────────────────┬────────────────┘
                                     │
                    ┌────────────────▼────────────────┐
                    │  User Selects Action:           │
                    │  Login OR Register              │
                    └────────┬──────────────┬─────────┘
                             │              │
                    ┌────────▼─┐      ┌─────▼────────┐
                    │  LOGIN   │      │  REGISTER    │
                    │ Existing │      │  New User    │
                    │  Users   │      │              │
                    └────────┬─┘      └─────┬────────┘
                             │              │
        ┌────────────────────▼──────────────▼────────────────────┐
        │  User Submits Email + Password (+ CAPTCHA for Register)│
        │  [Login.js / Register.js]                              │
        └────────────────┬─────────────────────────────────────────┘
                         │
        ┌────────────────▼──────────────────────────────────────┐
        │  Login: Verify Email + Password                       │
        │  [POST /api/auth/login]                               │
        │                                                        │
        │  Register: Hash Password + AUTO-VERIFY EMAIL ✅        │
        │  [POST /api/auth/register]                            │
        │  email_verified = true (NO EMAIL SENT!)               │
        └────┬──────────────────────────────────┬────────────────┘
             │                                  │
        ┌────▼──────────────────┐    ┌─────────▼───────────────┐
        │  2FA ENABLED?          │    │  2FA NOT ENABLED?       │
        │  ✅ Check Database     │    │  ❌ Require Setup       │
        └────┬──────────────────┘    └─────────┬───────────────┘
             │                                 │
        ┌────▼──────────────────┐    ┌────────▼────────────────┐
        │  YES: Prompt 2FA Code  │    │  SETUP 2FA REQUIRED     │
        │  [Login.js - show 2FA] │    │  [Setup2FA.js]          │
        └────┬──────────────────┘    │                         │
             │                       │  1. Generate QR Code    │
        ┌────▼──────────────────┐    │  2. User Scans QR       │
        │  User Enters 2FA Code  │    │  3. Verify 6-Digit Code │
        │  (6-digit or backup)   │    │  4. Get Backup Codes    │
        │  [Login.js form]       │    │                         │
        └────┬──────────────────┘    └────────┬────────────────┘
             │                                 │
        ┌────▼──────────────────┐    ┌────────▼────────────────┐
        │  POST /verify-2fa-login│    │  POST /verify-2fa       │
        │  Server validates TOTP │    │  Server validates TOTP  │
        │  + Backup Code Check   │    │  + Saves 2FA Secret     │
        └────┬──────────────────┘    └────────┬────────────────┘
             │                                 │
             │                        ┌────────▼─────────┐
             │                        │ 2FA Setup        │
             │                        │ Complete ✅      │
             │                        └────────┬─────────┘
             │                                 │
             └─────────────────┬───────────────┘
                               │
        ┌──────────────────────▼──────────────────────┐
        │  JWT Token Generated + Stored               │
        │  localStorage.setItem('token', token)       │
        │  localStorage.setItem('user', userInfo)     │
        └──────────────────────┬──────────────────────┘
                               │
        ┌──────────────────────▼──────────────────────┐
        │  REDIRECT TO DASHBOARD                      │
        │  [/dashboard route]                         │
        │  navigate('/dashboard')                     │
        └──────────────────────┬──────────────────────┘
                               │
        ┌──────────────────────▼──────────────────────┐
        │  DASHBOARD COMPONENT LOADS                  │
        │  [Dashboard.js]                             │
        │  - Header with Welcome + Logout             │
        │  - Guidelines Section                       │
        │  - GameCanvas Component                     │
        │  - EmailClient Modal (hidden initially)     │
        └──────────────────────┬──────────────────────┘
                               │
        ┌──────────────────────▼──────────────────────┐
        │  PHASER GAME INITIALIZES                    │
        │  [GameCanvas.js → MainScene.js]             │
        │  - Load Map & Tilesets                      │
        │  - Create Player Character                  │
        │  - Position NPCs:                           │
        │    • HR Manager (unlocked from start)       │
        │    • Senior Dev (unlock after HR)           │
        │  - Create Collision Layers                  │
        │  - Load Sticky Note Popup                   │
        └──────────────────────┬──────────────────────┘
                               │
        ┌──────────────────────▼──────────────────────┐
        │  PLAYER IN GAME (PHASER)                    │
        │  [MainScene.js]                             │
        │                                              │
        │  Current Game Progress Tracking:            │
        │  - gameProgress = 'start'                   │
        │  - Interaction Order System                 │
        └──────────────────────┬──────────────────────┘
                               │
        ┌──────────────────────▼──────────────────────┐
        │  USER CONTROLS PLAYER CHARACTER             │
        │  Movement: WASD Keys or Arrow Keys          │
        │  Interact: E Key                            │
        │  [MainScene.js - keyboard input]            │
        │                                              │
        │  Movement Range: Office/Server Room         │
        │  Collision Detection: Enabled               │
        └──────────────────────┬──────────────────────┘
                               │
        ┌──────────────────────▼──────────────────────┐
        │  INTERACTION PROGRESSION SYSTEM             │
        │                                              │
        │  Unlocked from START:                       │
        │  ✅ NPC#1 HR Manager                        │
        │                                              │
        │  Locked (unlock after HR):                  │
        │  🔒 NPC#3 Senior Dev                        │
        │  🔒 Sticky Note                             │
        │  🔒 Whiteboard                              │
        │  🔒 Main Computer                           │
        │  🔒 Bookshelves                             │
        └──────────────────────┬──────────────────────┘
                               │
        ┌──────────────────────▼──────────────────────┐
        │  PLAYER APPROACHES NPC#1 (HR MANAGER)       │
        │  Within Interaction Radius (60px)           │
        │  [MainScene.js - interactionRadius check]   │
        └──────────────────────┬──────────────────────┘
                               │
        ┌──────────────────────▼──────────────────────┐
        │  INTERACT PROMPT APPEARS                    │
        │  Press "E" to interact                      │
        │  [MainScene.js - interactText.visible=true] │
        └──────────────────────┬──────────────────────┘
                               │
        ┌──────────────────────▼──────────────────────┐
        │  PLAYER PRESSES "E" KEY                     │
        │  [MainScene.js - eKey.isDown check]         │
        └──────────────────────┬──────────────────────┘
                               │
        ┌──────────────────────▼──────────────────────┐
        │  DIALOGUE SYSTEM ACTIVATES                  │
        │  [DialogueBox.jsx - triggered event]        │
        │                                              │
        │  HR Manager Messages:                       │
        │  1. "Welcome! Meet the team..."             │
        │  2. "You need to meet the Senior Dev"       │
        │  3. Info about cybersecurity                │
        │                                              │
        │  Movement LOCKED during dialogue            │
        │  [isDialogueActive = true]                  │
        └──────────────────────┬──────────────────────┘
                               │
        ┌──────────────────────▼──────────────────────┐
        │  PLAYER READS DIALOGUE                      │
        │  Click/Press to advance dialogue            │
        │  [DialogueBox.jsx]                          │
        └──────────────────────┬──────────────────────┘
                               │
        ┌──────────────────────▼──────────────────────┐
        │  DIALOGUE COMPLETE                          │
        │  NPC#1 Interaction Marked Complete          │
        │  localStorage.setItem('hrInteracted', true) │
        │                                              │
        │  NEW CONTENT UNLOCKED:                      │
        │  ✅ NPC#3 Senior Dev (now available)        │
        │  ✅ Sticky Note                             │
        │  ✅ Whiteboard                              │
        └──────────────────────┬──────────────────────┘
                               │
        ┌──────────────────────▼──────────────────────┐
        │  PLAYER CAN NOW:                            │
        │  • View Sticky Note Popup                   │
        │  • Interact with Senior Dev NPC             │
        │  • Access Whiteboard                        │
        │  • Continue exploring                       │
        └──────────────────────┬──────────────────────┘
                               │
        ┌──────────────────────▼──────────────────────┐
        │  PLAYER INTERACTS WITH SENIOR DEV NPC       │
        │  (OR WHITEBOARD - unlocked from HR)         │
        │  [MainScene.js - NPC#3 interaction]         │
        │                                              │
        │  Senior Dev Dialogue:                       │
        │  - Info about cybersecurity threats         │
        │  - "Check the computer..."                  │
        │  - Reference to phishing emails             │
        └──────────────────────┬──────────────────────┘
                               │
        ┌──────────────────────▼──────────────────────┐
        │  DIALOGUE COMPLETE                          │
        │  localStorage.setItem(                      │
        │    'seniorDevInteracted', true)             │
        │  localStorage.setItem(                      │
        │    'seniorDevProgress', 'first')            │
        │                                              │
        │  NEW CONTENT UNLOCKED:                      │
        │  ✅ Main Computer (now accessible)          │
        │  ✅ Bookshelves                             │
        └──────────────────────┬──────────────────────┘
                               │
        ┌──────────────────────▼──────────────────────┐
        │  PLAYER ACCESSES MAIN COMPUTER              │
        │  Within interaction radius                  │
        │  Press "E" Key                              │
        │  [MainScene.js - computer interaction]      │
        └──────────────────────┬──────────────────────┘
                               │
        ┌──────────────────────▼──────────────────────┐
        │  🚨 EMAIL CLIENT MODAL OPENS 🚨             │
        │  [EmailClient.jsx - showEmailClient=true]   │
        │                                              │
        │  Triggered via:                             │
        │  window.dispatchEvent(                      │
        │    new CustomEvent('openEmailClient'))      │
        │                                              │
        │  Movement LOCKED to modal                   │
        │  Phaser keyboard input DISABLED             │
        └──────────────────────┬──────────────────────┘
                               │
        ┌──────────────────────▼──────────────────────┐
        │  EMAIL CLIENT LOGIN SCREEN                  │
        │  [EmailClient.jsx - Login Form]             │
        │                                              │
        │  Credentials Required:                      │
        │  Username: (from getCredentials())          │
        │  Password: (from getCredentials())          │
        │                                              │
        │  Sticky Note shows these credentials        │
        │  [StickyNote.jsx - displayed on dashboard]  │
        └──────────────────────┬──────────────────────┘
                               │
        ┌──────────────────────▼──────────────────────┐
        │  USER ENTERS CREDENTIALS                    │
        │  Matches credentials from Sticky Note       │
        │  [EmailClient.jsx - handleLogin()]          │
        └──────────────────────┬──────────────────────┘
                               │
        ┌──────────────────────▼──────────────────────┐
        │  LOGIN VALIDATION                           │
        │  email === credentials.email &&             │
        │  password === credentials.password          │
        │  [EmailClient.jsx - credential check]       │
        └────┬──────────────────┬────────────────────┘
             │                  │
        ┌────▼────┐    ┌────────▼──────────┐
        │ CORRECT  │    │  INCORRECT        │
        │ LOGIN ✅ │    │  Show Error Hint ❌│
        └────┬────┘    └────────────────────┘
             │
        ┌────▼──────────────────────────────┐
        │  EMAIL CLIENT DASHBOARD OPENS     │
        │  [EmailClient.jsx - main content] │
        │                                    │
        │  Shows:                           │
        │  • Inbox (13 total emails)        │
        │  • 6 Safe Emails                  │
        │  • 7 Phishing Emails              │
        │  • Safe & Phishing Folders        │
        │  • Score & Stats                  │
        └────┬──────────────────────────────┘
             │
        ┌────▼──────────────────────────────┐
        │  PLAYER REVIEWS EMAILS             │
        │  Click to open individual email    │
        │  [EmailClient.jsx - email list]   │
        │                                    │
        │  For each email:                  │
        │  • From, Subject, Content          │
        │  • Links (clickable - phishing)    │
        │  • Action buttons:                 │
        │    - Keep Email (safe folder)      │
        │    - Delete Email (phishing folder)│
        └────┬──────────────────────────────┘
             │
        ┌────▼──────────────────────────────┐
        │  PLAYER IDENTIFIES PHISHING EMAIL │
        │  AND TAKES ACTION                 │
        │  [EmailClient.jsx - handleKeep/   │
        │                      handleDelete]│
        │                                    │
        │  Keep Email (clicked):            │
        │  If safe → +10 points ✅          │
        │  If phishing → -10 points ❌      │
        │  Moves to Safe Folder             │
        │                                    │
        │  Delete Email (clicked):          │
        │  If phishing → +10 points ✅      │
        │  If safe → -10 points ❌          │
        │  Moves to Phishing Folder         │
        │                                    │
        │  Feedback shown to user           │
        │  [feedback state]                 │
        └────┬──────────────────────────────┘
             │
        ┌────▼──────────────────────────────┐
        │  SCORE CALCULATION                │
        │  Total possible: 130 points       │
        │  (13 emails × 10 points)          │
        │                                    │
        │  Points saved to:                 │
        │  localStorage.setItem(            │
        │    'emailState', {...})           │
        └────┬──────────────────────────────┘
             │
        ┌────▼──────────────────────────────┐
        │  PLAYER PROCESSES ALL 13 EMAILS   │
        │  Loops through email list         │
        │  Makes decisions on each          │
        │  Final score calculated           │
        │  [EmailClient.jsx - score state]  │
        └────┬──────────────────────────────┘
             │
        ┌────▼──────────────────────────────┐
        │  ALL EMAILS PROCESSED             │
        │  Inbox = 0                        │
        │  Safe & Phishing folders filled   │
        │  Final Score: X / 130             │
        │  [stats updated]                  │
        └────┬──────────────────────────────┘
             │
        ┌────▼──────────────────────────────┐
        │  PLAYER CLOSES EMAIL CLIENT       │
        │  Click close button or            │
        │  Press Escape key                 │
        │  [EmailClient.jsx - handleClose] │
        │  onClose() → setShowEmailClient   │
        └────┬──────────────────────────────┘
             │
        ┌────▼──────────────────────────────┐
        │  EMAIL CLIENT MODAL CLOSES        │
        │  [Dashboard.js]                   │
        │                                    │
        │  Dispatch event to MainScene:     │
        │  window.dispatchEvent(            │
        │    new CustomEvent('dialogueClosed'))      │
        │                                    │
        │  Movement UNLOCKED in game        │
        │  Phaser keyboard input RE-ENABLED │
        └────┬──────────────────────────────┘
             │
        ┌────▼──────────────────────────────┐
        │  BACK IN GAME                     │
        │  Player can move again            │
        │  Score persisted in localStorage  │
        │  [MainScene.js]                   │
        │                                    │
        │  Player can:                      │
        │  • Continue exploring             │
        │  • Re-access computer (email      │
        │    system is resettable)          │
        │  • Talk to NPCs again             │
        │  • View other game areas          │
        └────┬──────────────────────────────┘
             │
        ┌────▼──────────────────────────────┐
        │  LOGOUT                           │
        │  User clicks Logout button        │
        │  [Dashboard.js - handleLogout]    │
        │                                    │
        │  localStorage.removeItem('token') │
        │  localStorage.removeItem('user')  │
        │  navigate('/')                    │
        └────┬──────────────────────────────┘
             │
        ┌────▼──────────────────────────────┐
        │  REDIRECT TO LANDING PAGE         │
        │  [/]                              │
        │  User can login again             │
        └────▼──────────────────────────────┘
             │
        ┌────▼──────────────────────────────┐
        │              END                  │
        └──────────────────────────────────┘
```

---

## 🎮 Game Progression States

```
START: gameProgress = 'start'
├─ Player can interact with: NPC#1 (HR Manager)
│
├─ After HR interaction: gameProgress transitions
│  └─ Unlocked: Senior Dev NPC, Sticky Note, Whiteboard
│
└─ After Senior Dev interaction
   └─ Unlocked: Main Computer, Bookshelves
      └─ Computer access → EMAIL CLIENT triggered
```

---

## 📋 Key Implementation Details

### No Email Verification
- **Registration endpoint** (`POST /api/auth/register`):
  ```javascript
  email_verified = true  // ✅ AUTO-VERIFIED
  verification_token = null
  token_expiry = null
  ```
- User auto-logs in immediately after registration
- Redirected to Setup2FA page

### 2FA Setup (Mandatory)
1. User scans QR code with authenticator app
2. User enters 6-digit code to verify
3. Server generates 10 backup codes
4. User can download backup codes
5. User redirected to Dashboard/Game

### Login Flow
1. Email + Password validation
2. Check if 2FA enabled
3. If YES: Prompt for 2FA code
4. If NO: Force user to Setup2FA first
5. Both regular TOTP codes and backup codes accepted

### Game Components
- **Phaser Game Engine**: Handles player movement, NPCs, collisions
- **MainScene.js**: Manages progression, dialogue, NPC interactions
- **Progression System**: Tracks NPC interactions via localStorage
- **Email Client**: Modal that opens from game (computer interaction)

### Email Training Features
- 13 emails total (6 safe + 7 phishing)
- Player classifies each email
- Points: +10 correct, -10 incorrect
- Max score: 130 points
- Score persisted in localStorage

---

## 🔑 localStorage Keys Used

```javascript
// User Data
localStorage.getItem('token')           // JWT token
localStorage.getItem('user')            // User object {id, username, email}

// Game Progress
localStorage.getItem('gameProgress')    // Current game state
localStorage.getItem('seniorDevProgress') // NPC progression state
localStorage.getItem('hrInteracted')    // Boolean - HR NPC talked to
localStorage.getItem('seniorDevInteracted') // Boolean - Senior Dev talked to
localStorage.getItem('stickyNoteViewed') // Boolean - Sticky note seen
localStorage.getItem('whiteboardInteracted') // Boolean - Whiteboard accessed
localStorage.getItem('computerAccessed') // Boolean - Computer accessed
localStorage.getItem('metSeniorDev')    // Boolean - Met Senior Dev

// Email Training
localStorage.getItem('emailState')      // Email stats: inboxCount, safeCount, etc.
```

---

## ✅ Summary

**The actual user flow is:**
1. Register (NO email verification) → Auto-login
2. Setup 2FA (scan QR, verify code)
3. Redirect to Dashboard
4. Enter game (Phaser)
5. Move around, interact with NPCs in order
6. Access computer → Open Email Client
7. Log into email with credentials from Sticky Note
8. Classify 13 emails (6 safe + 7 phishing)
9. Get score and feedback
10. Close email client, continue game or logout

