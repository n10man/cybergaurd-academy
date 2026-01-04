# CyberGuard Academy

A fun, interactive cybersecurity training game that teaches you how to spot phishing emails, stay safe online, and level up your security skills!

---

## What Is This?

**CyberGuard Academy** is a game where you learn real cybersecurity skills by:
- Walking around a virtual office as a character
- Talking to NPCs (Non-Player Characters) who teach you security lessons
- Identifying phishing emails (fake emails trying to trick you)
- Completing security challenges and earning points
- Learning best practices for staying safe online

Think of it like a video game mixed with a security training course!

---

## Quick Start (5 minutes)

### What You Need
- **Windows**, **Mac**, or **Linux** computer
- **Node.js** installed (download from https://nodejs.org - choose the LTS version)
- **PostgreSQL** (optional - for storing user accounts, see advanced setup)
- **Git** (optional - to download this project)

### Step 1: Download the Project

**Option A: Using Git (recommended if you have Git installed)**
```bash
git clone https://github.com/your-username/cybergaurd-academy.git
cd cybergaurd-academy
```

**Option B: Download as ZIP**
- Click the green "Code" button on GitHub and select "Download ZIP"
- Unzip the folder on your computer
- Open a terminal/command prompt and navigate to the folder

### Step 2: Start the Game

Open your terminal/command prompt and type:

```bash
cd client
npm install
npm start
```

This will:
1. Download everything the game needs
2. Start the game automatically
3. Open it in your browser (usually http://localhost:3000)

**That's it!** The game should now be running. You can walk around, talk to NPCs, and start learning!

---

## How to Play

### Controls
| Action | Key |
|--------|-----|
| Move Up | **W** or **↑** Arrow Key |
| Move Down | **S** or **↓** Arrow Key |
| Move Left | **A** or **←** Arrow Key |
| Move Right | **D** or **→** Arrow Key |
| Talk to NPC / Interact | **E** Key |

### Game Flow

1. **You start in an office** - Walk around to explore
2. **Find NPCs** - Look for characters to talk to
3. **Listen to their lessons** - They'll teach you about security
4. **Complete challenges** - Identify phishing emails and other tasks
5. **Earn points** - Get rewarded for correct answers
6. **Progress** - Unlock new areas and harder challenges

### The Email Training
When an NPC gives you the email challenge:
- You'll see a list of emails
- Each email is either **safe** (keep it) or **phishing** (delete it)
- Look for red flags like suspicious sender addresses, urgency tactics, or requests for passwords
- Click "Keep" or "Delete" to make your choice
- You get **+10 points** for correct decisions
- You lose **-10 points** for wrong decisions

---

## Setup With User Accounts (Advanced)

The basic game works offline, but if you want user accounts, login, and progress tracking, follow these steps:

### Prerequisites
- PostgreSQL installed and running (download from https://www.postgresql.org/download/)
- Terminal/Command Prompt open

### Step 1: Setup the Database

1. **Create a database folder** (or use a terminal database tool)
2. **Create a `.env` file** in the `server` folder:

```bash
cd server
```

Create a new file called `.env` and add:

```
PORT=5000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/cybergaurd
JWT_SECRET=your_secret_key_here_make_it_long_and_random
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
RECAPTCHA_SECRET_KEY=your_recaptcha_key
```

### Step 2: Get Email Working (Optional)

To send verification emails:

1. Go to https://myaccount.google.com/apppasswords
2. Create an **App Password** for Gmail
3. Copy that password and add it to your `.env` file as `EMAIL_PASSWORD`

### Step 3: Get CAPTCHA Working (Optional)

To prevent bots from creating fake accounts:

1. Go to https://www.google.com/recaptcha/admin
2. Create a new reCAPTCHA project
3. Set it to **"reCAPTCHA v2"** with **"I'm not a robot"** checkbox
4. Add `localhost` as a domain
5. Copy your Secret Key and add it to the `.env` file

### Step 4: Start the Server

In a new terminal:

```bash
cd server
npm install
node server.js
```

### Step 5: Start the Client

In another terminal:

```bash
cd client
npm start
```

Now the game has:
- User registration and login
- Email verification
- Two-factor authentication (2FA)
- Progress tracking
- Score saving

---

## Project Structure

Here's where everything is:

```
cybergaurd-academy/
├── client/                  ← The game (React + Phaser)
│   ├── public/              ← Game files (maps, graphics, sounds)
│   ├── src/
│   │   ├── components/      ← Game screens and UI
│   │   ├── pages/           ← Login, Register, Dashboard
│   │   ├── services/        ← Connect to server
│   │   └── scenes/          ← Game scenes
│   └── package.json         ← Game dependencies
│
└── server/                  ← The backend (Node.js)
    ├── routes/              ← API endpoints
    ├── middleware/          ← Security checks
    ├── utils/               ← Email service
    └── package.json         ← Server dependencies
```

---

## Common Commands

### Run the Game
```bash
cd client
npm start
```
Opens the game in your browser

### Run the Server
```bash
cd server
npm install
node server.js
```
Starts the backend API

### Stop the Game
Press `CTRL + C` in the terminal

### Clear Cache (if having issues)
```bash
cd client
rm -rf node_modules
npm install
npm start
```

---

## Troubleshooting

### "npm: command not found"
- **Solution**: Install Node.js from https://nodejs.org
- Restart your terminal after installing

### Game doesn't start
- **Solution**: Make sure you're in the `client` folder and run `npm install` first
- Try clearing your browser cache (Ctrl+Shift+Delete)

### "Port 3000 is already in use"
- **Solution**: Another app is using that port
- Either close the other app, or change the port in `package.json`

### Emails not sending
- **Solution**: Check your Gmail app password and `.env` file
- Make sure you enabled 2-Factor Authentication on your Gmail account

### Database connection error
- **Solution**: Make sure PostgreSQL is installed and running
- Check that `DATABASE_URL` in `.env` is correct

### Still stuck?
- Check the browser console (Press F12) for error messages
- Look at the terminal output where you ran `npm start`
- Check the server terminal for backend errors

---

## What You'll Learn

Playing through CyberGuard Academy teaches you:

- **Phishing Detection** - Spot fake emails trying to steal your password
- **Social Engineering** - Understand how attackers manipulate people
- **Password Security** - Why strong passwords matter
- **Email Red Flags** - Suspicious sender addresses, urgent language, etc.
- **2-Factor Authentication** - Adding an extra layer of security
- **Safe Online Practices** - General cybersecurity best practices  

---

## Features

- **Interactive Game World** - Walk around an office and talk to NPCs
- **Email Training** - Learn to identify phishing emails
- **Point System** - Earn points for correct decisions
- **User Accounts** - Save your progress (optional)
- **Security Features** - 2FA, password hashing, CAPTCHA
- **Expandable Maps** - Add new areas and challenges
- **Progress Tracking** - See how much you've learned

---

## Technology Used

**Frontend (The Game)**
- React - User interface
- Phaser 3 - Game engine
- CSS - Styling and animations

**Backend (The Server)**
- Node.js - Server runtime
- Express - Web server framework
- PostgreSQL - Database (optional)
- JWT - User authentication
- Nodemailer - Email sending

---

## License

This project is [add your license type here - e.g., MIT, Apache 2.0]

---

## Contributing

Want to help? You can:
- Report bugs on GitHub
- Suggest new features
- Add new NPCs or lessons
- Improve the game design
- Fix typos or improve documentation

---

## FAQ

**Q: Do I need to create an account to play?**  
A: No! The game works without an account. Creating an account is optional if you want to save your progress.

**Q: Is this a real game company project?**  
A: This is an educational project designed to teach cybersecurity in a fun, interactive way.

**Q: Can I add my own lessons?**  
A: Yes! The code is open and you can customize NPCs, emails, and lessons to teach different topics.

**Q: How long does it take to complete?**  
A: About 30-60 minutes depending on how you play and read the lessons.

**Q: Will this teach me real security skills?**  
A: Yes! The lessons are based on real cybersecurity practices and threats.

---

## Support

- Email: [add your email]
- Discord: [add your Discord link]
- GitHub Issues: [add GitHub issues link]

---

## Ready to Play?

Run these commands and you're done:

```bash
cd client
npm install
npm start
```

Enjoy learning and have fun saving the office from cybersecurity threats!

---

**Last Updated**: January 2026  
**Version**: 1.0.0
