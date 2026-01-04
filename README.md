# CyberGuard Academy

An interactive game where you learn to identify and eliminate phishing emails.

---

## What Is This?

CyberGuard Academy is a cybersecurity training game focused on one core skill: **identifying phishing emails**. You explore an office environment, talk to NPCs, and complete email classification challenges to earn points.

It's a fun, gamified way to learn how to spot fake emails trying to trick you.

---

## Quick Start (5 minutes)

### What You Need
- Windows, Mac, or Linux computer
- Node.js installed (download from https://nodejs.org - choose the LTS version)

### Step 1: Download the Project

**Option A: Using Git**
```bash
git clone https://github.com/n10man/cybergaurd-academy.git
cd cybergaurd-academy
```

**Option B: Download as ZIP**
- Click the green "Code" button on GitHub and select "Download ZIP"
- Unzip the folder
- Open a terminal and navigate to the folder

### Step 2: Start the Game

```bash
cd client
npm install
npm start
```

The game will open at http://localhost:3000. Start playing immediately!

---

## How to Play

### Controls
| Action | Key |
|--------|-----|
| Move Up | W or Up Arrow |
| Move Down | S or Down Arrow |
| Move Left | A or Left Arrow |
| Move Right | D or Right Arrow |
| Talk to NPC / Interact | E |

### Game Flow

1. Walk around the office environment
2. Find NPCs and talk to them to learn about phishing
3. Complete the email challenge when ready
4. Identify phishing emails vs safe emails
5. Earn points for correct decisions
6. Progress through the game

### Email Challenge

When you get the email challenge:
- You'll see a list of emails in an email client
- Each email is either SAFE (keep it) or PHISHING (delete it)
- Click "Keep" for safe emails or "Delete" for phishing
- Correct decisions: +10 points
- Wrong decisions: -10 points
- Maximum score: 130 points

Common phishing red flags to look for:
- Suspicious sender email addresses
- Urgent language ("Act now!", "Verify immediately!")
- Requests for personal information or passwords
- Mismatched links or incorrect domains
- Poor spelling or grammar

---

## Setup With User Accounts (Advanced)

The game works offline by default. To add user registration, login, and progress saving:

### Prerequisites
- PostgreSQL installed and running (https://www.postgresql.org/download/)

### Step 1: Create .env File

In the `server` folder, create a `.env` file with:

```
PORT=5000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/cybergaurd
JWT_SECRET=your_secret_key_make_it_random
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
RECAPTCHA_SECRET_KEY=your_key
```

### Step 2: Email Verification (Optional)

1. Go to https://myaccount.google.com/apppasswords
2. Create an App Password for Gmail
3. Add it to `.env` as EMAIL_PASSWORD

### Step 3: CAPTCHA Protection (Optional)

1. Go to https://www.google.com/recaptcha/admin
2. Create a new reCAPTCHA v2 project
3. Add `localhost` as a domain
4. Copy the Secret Key to `.env` as RECAPTCHA_SECRET_KEY

### Step 4: Start the Server

```bash
cd server
npm install
node server.js
```

### Step 5: Start the Client

```bash
cd client
npm start
```

Features with user accounts:
- User registration and login
- Email verification
- Two-factor authentication (2FA)
- Score and progress tracking

---

## Project Structure

```
cybergaurd-academy/
├── client/                  <- Game (React + Phaser)
│   ├── public/              <- Game files (maps, sprites)
│   ├── src/
│   │   ├── components/      <- UI components
│   │   ├── pages/           <- Login, Register, Dashboard
│   │   ├── services/        <- API communication
│   │   └── scenes/          <- Game scenes
│   └── package.json
│
└── server/                  <- Backend (Node.js)
    ├── routes/              <- API endpoints
    ├── middleware/          <- Security
    ├── utils/               <- Email service
    └── package.json
```

---

## Common Commands

### Run the Game
```bash
cd client
npm start
```

### Run the Server
```bash
cd server
npm install
node server.js
```

### Stop the Game
Press CTRL + C in terminal

### Clear Cache
```bash
cd client
rm -rf node_modules
npm install
npm start
```

---

## Troubleshooting

### "npm: command not found"
- Install Node.js from https://nodejs.org
- Restart your terminal

### Game doesn't start
- Make sure you're in the `client` folder
- Run `npm install` first
- Clear browser cache (Ctrl+Shift+Delete)

### "Port 3000 is already in use"
- Close the app using that port
- Or change the port in package.json

### Emails not sending
- Check your Gmail app password in .env
- Verify 2FA is enabled on your Gmail

### Database connection error
- Make sure PostgreSQL is running
- Check DATABASE_URL in .env

### Still having issues?
- Press F12 to open browser console for errors
- Check terminal output where you ran npm start

---

## What You'll Learn

- How to spot phishing emails
- Common phishing tactics and red flags
- Email sender verification
- How attackers use urgency and social pressure
- Safe email practices

---

## Features

- Interactive office environment to explore
- NPC-based learning system
- Email classification challenges
- Point-based scoring system
- User accounts and progress tracking (optional)
- 2FA for account security
- CAPTCHA bot protection

---

## Technology Stack

**Frontend**
- React - User interface
- Phaser 3 - Game engine
- CSS - Styling

**Backend**
- Node.js - Server runtime
- Express - Web framework
- PostgreSQL - Database (optional)
- JWT - Authentication
- Nodemailer - Email sending

---

## License

This project is [add your license type here - e.g., MIT, Apache 2.0]

---

## Contributing

Want to help? You can:
- Report bugs
- Suggest new phishing scenarios
- Add new NPCs with different lessons
- Improve email examples
- Improve documentation

---

## FAQ

**Q: Do I need an account to play?**  
A: No, the game works offline. Accounts are optional for saving progress.

**Q: How long does it take to complete?**  
A: About 20-30 minutes depending on how you play.

**Q: Will this make me an expert at spotting phishing?**  
A: This covers the basics and common tactics. Real phishing can be sophisticated, so always stay cautious.

**Q: Can I add my own emails to the game?**  
A: Yes! The code is open source. You can edit email data and add custom scenarios.

---

## Support

- Email: [add your email]
- Discord: [add your Discord link]
- GitHub Issues: [add GitHub issues link]

---

## Ready to Play?

```bash
cd client
npm install
npm start
```

Have fun learning to spot phishing emails!

---

**Last Updated**: January 2026  
**Version**: 1.0.0
