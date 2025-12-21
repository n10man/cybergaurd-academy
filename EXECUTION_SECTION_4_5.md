# 4.5 Execution

This section describes the implementation of CyberGuard Academy, the technologies utilized, the execution of game logic and interactive systems, and the development and operational methodologies involved in the system's implementation. The project employs a full-stack architecture with a React.js frontend integrated with Phaser 3 game engine for interactive gameplay, supported by a Node.js/Express backend and PostgreSQL database. The system is designed to deliver immersive cybersecurity training through gamification, real-time dialogue interactions, and hands-on email classification exercises.

---

## 4.5.1 Technology Implementation

CyberGuard Academy was implemented using a modern full-stack JavaScript architecture comprising three primary layers: frontend, backend, and database.

### Frontend Architecture

**React.js (v19.2.0)** serves as the primary UI framework for rendering interactive components, managing application state, and handling user navigation. React's component-based architecture enables the development of modular, reusable interfaces across multiple training modules (login, dashboard, email client, dialogue boxes). The virtual DOM ensures efficient re-rendering and smooth user experience during real-time game updates and state transitions.

**Phaser 3 (v3.90.0)** is the core game engine, responsible for:
- 2D sprite-based world rendering with 32×32 pixel resolution
- Arcade physics for collision detection and player movement
- Camera management and viewport control
- Tiled map integration for loading complex game environments
- Animation state machines for NPC dialogue and character interactions
- Event system for inter-scene communication

**React Router DOM (v6.30.1)** manages multi-page navigation between login, registration, dashboard, and game areas, enabling seamless routing without full page reloads.

**Custom CSS Architecture** replaces traditional CSS frameworks to maintain lightweight implementation and precise control over visual design. Progress bars, dialogue boxes, email interfaces, and game overlays are all custom-styled for consistency with the cybersecurity training aesthetic.

### Backend Architecture

**Node.js with Express.js (v5.1.0)** implements the RESTful API server handling:
- User authentication and session management via JWT tokens
- Email verification workflows
- Two-factor authentication (2FA) setup and verification
- Progress tracking and data persistence
- Input validation and security middleware

**Express Middleware Stack**:
- **Helmet (v7.2.0)**: Protects against common web vulnerabilities (XSS, CSRF, clickjacking)
- **express-validator (v7.3.0)**: Comprehensive input validation and sanitization
- **express-rate-limit (v7.5.1)**: Prevents brute force attacks on authentication endpoints
- **CORS (v2.8.5)**: Enables secure cross-origin communication between frontend and backend

### Authentication & Security Layer

**JWT Authentication (jsonwebtoken v9.0.2)**:
- Stateless token-based authentication
- 7-day token expiration for session security
- Token refresh mechanism for extended sessions
- Secure httpOnly cookies for production deployment

**Password Security (bcryptjs v3.0.3)**:
- Bcrypt hashing with 10 salt rounds
- Prevents rainbow table attacks
- Secure storage in PostgreSQL database
- Comparison without exposing original hash

**Two-Factor Authentication (2FA)**:
- **Speakeasy (v2.0.0)**: TOTP (Time-based One-Time Password) generation
- **QRCode (v1.5.4)**: QR code generation for authenticator app setup
- 10 backup codes for emergency account recovery
- Support for Google Authenticator, Microsoft Authenticator, Authy

**Registration & 2FA Setup**:
- Direct account creation upon registration
- Immediate QR code generation for 2FA
- No email verification step required
- 2FA setup mandatory before account access

### Database Layer

**PostgreSQL (v12+)** provides ACID-compliant relational data storage with:
- Users table: Authentication credentials, email verification, 2FA secrets
- User_progress table: Learning progress, completed modules, points, game state
- Parameterized queries for SQL injection prevention
- Foreign key constraints for referential integrity
- Strategic indexing on frequently queried columns (email, username, user_id)

---

## 4.5.2 Concept and Analysis Logic

### Game Loop Architecture

The core concept of CyberGuard Academy centers on **experiential cybersecurity learning through interactive roleplay**. Players progress through a narrative-driven office environment, encountering NPCs who guide them through phishing awareness training while building investment in their learning journey.

**Game Progression Flow**:

1. **Map-Based Navigation** (Phaser 3 MainScene)
   - Player spawns in office environment
   - WASD controls movement across Tiled map
   - Collision detection prevents off-map movement
   - Camera follows player for viewport management

2. **NPC Interaction System**
   - Interactive hotspots (80-pixel radius) trigger proximity detection
   - Dialogue boxes display character conversations
   - State management tracks which NPCs have been encountered
   - Branching dialogue supports conditional interactions

3. **Module Transitions**
   - Email client opens via computer interaction
   - Sticky notes display credentials and hints
   - Whiteboard shows progress tracking
   - Phishing guide provides educational reference material

4. **Email Classification Training**
   - 13 emails (8 safe, 5 phishing) loaded from centralized data
   - Real-time points calculation (+10 for correct, -10 for incorrect)
   - Email classification results persisted to localStorage and backend
   - Progress bar updates reflect completion percentage

### Analysis Components

**Email Classification Logic**:
- Safe emails must be kept (+10 points)
- Phishing emails must be deleted (+10 points)
- Incorrect decisions deduct points (-10)
- Maximum score: 130 points (80 from safe + 50 from phishing)

**Progress Tracking**:
- 6 core objectives tracked: HR interaction, Senior Dev, sticky note, whiteboard, computer access, email completion
- Each completed objective = ~17% progress
- Real-time update via custom `updateGuidelines` event
- localStorage persists progress across sessions (only resets on first page load)

**Dialogue-Driven Progression**:
- HR Manager brief introduces job responsibilities
- Senior Dev provides login credentials
- Each interaction triggers state change and progress update
- Event system broadcasts updates to Guidelines component

---

## 4.5.3 APIs, External Tools and Dependencies

### Core Dependencies

**Frontend Packages**:
```
react (19.2.0)              - UI framework
react-dom (19.2.0)          - React rendering
react-router-dom (6.30.1)   - Page routing
phaser (3.90.0)             - Game engine
react-google-recaptcha (3.1.0) - Bot protection
react-icons (6.x)           - Icon library
yaml (2.4.2)                - Configuration parsing
```

**Backend Packages**:
```
express (5.1.0)             - Web server
jsonwebtoken (9.0.2)        - JWT authentication
bcryptjs (3.0.3)            - Password hashing
helmet (7.2.0)              - Security headers
express-validator (7.3.0)   - Input validation
express-rate-limit (7.5.1)  - Rate limiting
nodemailer (7.0.10)         - Email delivery
speakeasy (2.0.0)           - TOTP generation
qrcode (1.5.4)              - QR code generation
pg (8.16.3)                 - PostgreSQL driver
cors (2.8.5)                - CORS middleware
dotenv (17.2.3)             - Environment variables
axios (1.13.2)              - HTTP client
```

### API Endpoints

**Authentication Routes** (`/api/auth`):
- `POST /register` - User registration with CAPTCHA
- `GET /verify-email` - Email verification and auto-login
- `POST /login` - User login with credentials
- `GET /setup-2fa` - Generate QR code and 2FA secret
- `POST /verify-2fa` - Verify 2FA and save backup codes
- `POST /verify-2fa-login` - Login with 2FA verification
- `POST /verify-token` - Verify JWT token validity

**Progress Routes** (`/api/progress`):
- `GET /progress/:userId` - Retrieve user learning progress
- `POST /progress/:userId` - Save/update progress data
- `GET /verify-token` - Token validation for protected routes

### External Services

**Google reCAPTCHA v2**: Bot protection on registration form (site key: 6LfwRC0sAAAAAI4uY5mHJ699kTPFnNeZVrNz9sbh)

**Email Service**: SMTP configuration for Nodemailer (supports production email providers)

---

## 4.5.4 Resources, Software and Tools Used

### Development Tools

**Visual Studio Code** (Primary IDE):
- Integrated terminal for running npm commands
- IntelliSense for JavaScript/React autocomplete
- Debugging capabilities with Chrome DevTools integration
- Extensions: ES7+ snippets, Prettier, Thunder Client (API testing)

**Node.js & npm** (Runtime & Package Management):
- v18+ runtime for backend server execution
- npm 9+ for dependency management
- npm scripts for start, build, test commands

**Database Tools**:
- **pgAdmin**: PostgreSQL database administration and query execution
- **psql**: Command-line PostgreSQL client for schema deployment

**Testing & Debugging**:
- **Chrome DevTools**: DOM inspection, JavaScript console, network tab monitoring, performance profiling
- **Firefox Developer Tools**: Cross-browser testing, CSS compatibility verification
- **Postman/Thunder Client**: API endpoint testing and validation
- **React Developer Tools**: Component hierarchy inspection, state/props debugging

### Development Utilities

**Build & Deployment**:
- **react-scripts (5.0.1)**: Create React App build tooling (webpack, babel)
- **Docker**: Containerization for consistent development/deployment environments
- **Railway**: Deployment platform for backend server
- **Vercel**: Deployment platform for React frontend

**Security & Quality Assurance**:
- **npm audit**: Vulnerability scanning for dependencies
- **W3C HTML Validator**: Semantic HTML validation
- **W3C CSS Validator**: CSS standards compliance
- **ESLint**: JavaScript linting (via react-scripts)

### Hardware & Environment

**Development Machine**:
- Standard development laptop (Windows, macOS, or Linux)
- 8GB+ RAM recommended
- SSD storage for rapid compilation

**Runtime Environments**:
- **Local Development**: npm start (React), npm run dev (backend)
- **Production**: Cloud servers (Railway for backend, Vercel for frontend)
- **Database**: PostgreSQL 12+ running locally or in cloud

---

## 4.5.5 Procedure and Methodology of Development

### Phase 1: Project Initialization & Setup

1. **Repository Creation**: GitHub repository with node_modules gitignore
2. **Frontend Setup**: `npx create-react-app client` with React 19
3. **Backend Setup**: Express server initialization with middleware stack
4. **Database Schema**: PostgreSQL schema creation with users and user_progress tables
5. **Environment Configuration**: .env files for API URLs, JWT secrets, database connection strings

### Phase 2: Core Game Engine Implementation

1. **Phaser Configuration**: Game config with canvas renderer, physics, scenes
2. **Scene Setup**: MainScene for office environment, OfficeScene for gameplay
3. **Asset Loading**: Sprite sheets (player, NPCs), tilesets (9 different sets), map JSON loading
4. **Map Integration**: Tiled editor JSON export, layer creation, tileset mapping

### Phase 3: Frontend Components Development

1. **UI Components**: Login, Register, Dashboard, Email Client
2. **Styling**: Custom CSS for consistency without frameworks
3. **State Management**: React useState/useContext for global state
4. **Event System**: Custom event dispatching for cross-component communication

### Phase 4: Authentication & Security

1. **JWT Implementation**: Token generation on login, verification middleware
2. **Password Hashing**: bcryptjs integration for secure storage
3. **2FA Mandatory Setup**: Speakeasy TOTP generation, QR code rendering on registration
4. **Account Creation**: Direct account provisioning after 2FA verification

### Phase 5: Game Logic Implementation

1. **NPC Dialogue System**: Dialogue box component, state tracking for conversations
2. **Hotbox Detection**: 80-pixel interaction radius, proximity checking
3. **Progress Tracking**: localStorage for session-based persistence, backend for permanent storage
4. **Email Classification**: Points calculation, email state management

### Phase 6: Testing & Optimization

1. **Unit Testing**: Component rendering tests with React Testing Library
2. **Integration Testing**: API endpoint validation with Postman
3. **Browser Testing**: Chrome, Firefox, Safari compatibility
4. **Performance Optimization**: Code splitting, lazy loading, asset compression

### Phase 7: Deployment & Monitoring

1. **Backend Deployment**: Railway platform with environment variables
2. **Frontend Deployment**: Vercel with automated builds from git
3. **Database Migration**: PostgreSQL deployment to cloud provider
4. **Logging & Monitoring**: Server console logs, error tracking

---

## 4.5.6 Techniques of Asset Creation and Design

### Game Assets

**Sprite Creation**:
- Player character sprite sheet (4-directional animation frames)
- NPC sprites (HR Manager, Senior Dev, different expressions)
- Interactive object sprites (computer, bookshelves, whiteboard)
- All sprites use 32×32 pixel base tiles for consistency

**Map Development**:
- Tiled Editor used to create first_map.json and second_map.json
- 50×40 tile office layout
- Object layers for interactable hotspots with properties
- Collision layer for walkable/blocked areas

**Tileset Integration**:
- 9 different tilesets (Modern Office MV variants, free interior assets)
- Tileset images range from 16×16 to 48×48 pixels
- Gid (global tile ID) mapping for tile layer rendering

### UI Components

**Custom Styling Techniques**:
- **Progress Bars**: CSS gradient backgrounds with animated width transitions
- **Dialogue Boxes**: Positioned absolutely with z-index layering, smooth fade-in animations
- **Email Interface**: Gmail-like layout with CSS grid for sidebar, email list, content area
- **Modal Overlays**: Semi-transparent backgrounds (rgba) for focus management

**Interactive Elements**:
- Buttons with hover/active states using CSS transitions
- Input fields with focus states and validation feedback
- Toggle switches for theme/settings without external libraries
- Dropdown menus with custom styling

### Data Assets

**Email Training Data** (`emailData.js`):
- 13 pre-written emails with realistic phishing/safe content
- Structured with: id, from, subject, preview, fullContent, isPhishing flag
- Red flags array for educational guidance
- Randomization function for testing variety

**Dialogue Trees**:
- NPC conversations stored as JavaScript objects
- Branching dialogue based on game state
- Character names, sprites, and multiple message options

**Progress Data**:
- Serialized to JSON for localStorage and PostgreSQL
- Tracks completed modules, badges, points, last position
- Enables resume functionality across sessions

---

## 4.5.7 Integration with System Design Documents

### Use Case Diagram Integration

The use case model's actors and scenarios directly map to implemented features:

- **User (Student)**: Registers with email/password, sets up 2FA, plays game, completes email training
- **System (Administrator)**: Manages user progress, validates credentials, tracks completion

Each use case becomes a React component or Phaser scene:
- `Use Case: Register` → Register.js component with bcryptjs backend validation + 2FA setup
- `Use Case: Setup 2FA` → 2FA component with Speakeasy QR generation
- `Use Case: Play Game` → MainScene Phaser scene with NPC interaction
- `Use Case: Classify Emails` → EmailClient.jsx component with points calculation

### Activity Diagram Alignment

The activity flow showing authentication → game entry → email training is reflected in:
- **Activity 1 (Auth Flow)**: Login → Verify Token → Dashboard redirect
- **Activity 2 (Game Loop)**: Spawn → Move → Interact → Update Progress
- **Activity 3 (Email Training)**: Select Email → Read → Classify → Calculate Points

The event-driven architecture in React/Phaser mirrors activity diagram decision points:
```
[User Input] → [Event Listener] → [State Update] → [Render Change]
```

### Data Flow Diagram (DFD) Realization

Level 1 DFD shows data movement between actors and system processes:

```
User Input (keyboard/mouse)
    ↓
[Event Handler in React/Phaser]
    ↓
[Game Logic/API Call]
    ↓
[Database Update/localStorage]
    ↓
[Component Re-render/Screen Update]
    ↓
[Visual Feedback to User]
```

This flow is implemented through:
- Event listeners: `window.addEventListener('keydown')`, `input.onChange()`
- Logic processing: Game scene methods, API service functions
- Data persistence: PostgreSQL saves, localStorage caching
- Rendering: React render cycle, Phaser sprite updates

### Sequence Diagram Implementation

Character interactions shown in sequence diagrams become actual dialogue sequences:

```
Player → [Approach NPC]
Player → [Trigger Dialogue Event]
NPC → [Render Dialogue Box]
Player → [Read Message]
Player → [Confirm/Continue]
NPC → [Update Progress State]
System → [Dispatch updateGuidelines Event]
UI → [Refresh Progress Bar]
```

This is implemented through:
- Dialogue trigger: Hotbox collision detection
- Dialogue render: DialogueBox component
- State update: localStorage.setItem() + custom events
- UI update: Guidelines component listener

### UI Mockup Realization

Design mockups from section 4.4 are built as actual React components:
- **Login Screen**: Matches mockup with email/password fields, "Forgot Password" link, registration link
- **Email Client**: Gmail-like interface with sidebar, email list, preview pane as designed
- **Sticky Note**: Objectives card with progress bar (17% → 100% progression)
- **Dialogue Box**: Text-based interactions matching narrative flow mockup

### State Management Integration

System state flow (user → authenticated → progressed → completed) is managed:
- **Global State**: React Context for user info, authentication status
- **Local State**: Component-level useState for UI elements
- **Persistent State**: localStorage for session resumption, PostgreSQL for permanent records
- **Event-Driven Updates**: Custom events propagate progress changes across components

---

## Summary

CyberGuard Academy's execution phase successfully translated design specifications into a fully functional, educational cybersecurity training platform. The technology stack—React for UI, Phaser for game mechanics, Express for backend services, and PostgreSQL for data persistence—creates a cohesive system enabling immersive, measurable cybersecurity awareness training. 

The implementation prioritizes:
- **User Experience**: Smooth game controls, responsive dialogue, real-time feedback
- **Security**: Encrypted passwords, JWT tokens, 2FA, parameterized database queries
- **Scalability**: Stateless architecture, connection pooling, indexed databases
- **Maintainability**: Modular components, consistent styling, clear separation of concerns

The seamless integration between design documents and executed features ensures that conceptual specifications manifest as functional, production-ready training software aligned with modern web development best practices.
