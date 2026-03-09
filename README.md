# CyberGuard Academy

A gamified cybersecurity awareness training platform that teaches everyday people how to spot phishing attacks through interactive gameplay.

## About the Project

CyberGuard Academy is my Final Year Project — a web-based platform that proves cybersecurity training doesn't have to be boring. Instead of corporate slide decks, users explore a 2D top-down office environment built with Phaser 3, interact with NPCs like an HR Manager and a Senior Developer, and complete a phishing email classification challenge where they learn to distinguish real emails from malicious ones.

The core inspiration came from realizing that most cybersecurity tools are built for technical users. Nobody teaches everyday office workers how to protect themselves against the threats that actually target them. Phishing is statistically the most common entry point for breaches, yet awareness training is often dry, forgettable, and disconnected from reality. I built CyberGuard Academy to change that by making security training feel like a game rather than a chore.

The experience combines narrative-driven gameplay with hands-on learning. You walk through an office, talk to NPCs who explain security concepts, collect credentials, and then face a real challenge: process your inbox and identify phishing emails while real ones slip through and cost you points. It's immediate, it's engaging, and it actually teaches something valuable.

## Tech Stack

The frontend is built with React 19 paired with Phaser 3 as the game engine, React Router for navigation, and Google reCAPTCHA for bot protection during registration. The backend runs on Node.js with Express.js, PostgreSQL for persistent data storage, JWT for stateless authentication, bcryptjs for secure password hashing, and speakeasy to handle TOTP-based two-factor authentication. Security is reinforced through Helmet.js for HTTP headers and express-rate-limit to prevent brute force attacks. The whole stack deploys cleanly: Vercel hosts the frontend while Railway.app runs the backend and PostgreSQL database.

## Features

The game world is a fully interactive 2D office environment where you walk around, talk to NPCs, and complete objectives. Two-factor authentication is mandatory and uses time-based one-time passwords via Google Authenticator or Authy, ensuring accounts stay secure. The phishing email classification challenge presents randomized emails each session — you classify them as legitimate or phishing and earn points for correct decisions, creating a tangible learning outcome.

Authentication is hardened with bcrypt password hashing and reCAPTCHA verification during registration. Sessions are managed through JWT tokens without server-side storage, keeping the backend stateless and scalable. Your progress is automatically saved per user, so you can pick up right where you left off, with points, completed challenges, and position in the game world all persisted to the database.

## How to Run Locally

You'll need Node.js, npm, and PostgreSQL installed on your machine. Clone the repository and navigate into the project folder. Install dependencies separately for backend and frontend by running `npm install` in both the `server` and `client` directories.

In the `server` folder, create a `.env` file with your database connection details (DATABASE_URL or individual DB_HOST, DB_USER, DB_PASSWORD, DB_NAME), a strong JWT_SECRET, and your RECAPTCHA_SECRET_KEY if you want bot protection enabled. Set up the PostgreSQL database using the schema file provided in the server folder.

Start the backend with `node server.js` (it runs on port 5000), then in a separate terminal, start the frontend with `npm start` from the `client` folder (it runs on port 3000). Your browser will open automatically to `http://localhost:3000`. That's it — you're ready to play.

## Screenshots

**Login & Registration:** Screenshot of the login page with the 2FA code entry field, showing the secure authentication flow.
<img width="872" height="451" alt="image" src="https://github.com/user-attachments/assets/760a1891-4175-48f6-8638-e8f04dc05db4" />

**NPC Dialogue:** A close-up of the dialogue box showing conversation with the HR Manager or Senior Developer, with the typewriter text effect visible.
<img width="900" height="458" alt="image" src="https://github.com/user-attachments/assets/e79dbe1b-5a41-4826-9b4c-64b37f7dcec3" />

<img width="785" height="646" alt="image" src="https://github.com/user-attachments/assets/ef9de779-52b9-4085-bf94-cdef22e42f04" />


<img width="839" height="385" alt="image" src="https://github.com/user-attachments/assets/9b91226f-31e3-4369-a40b-54218ce7eb05" />

<img width="854" height="425" alt="image" src="https://github.com/user-attachments/assets/3e156818-e83c-44f1-b26c-ecc311759fae" />

## Future Improvements

I'm planning to add multi-language support starting with Arabic, French, Chinese, and Spanish. Statistically, non-English speaking users are targeted more frequently by phishing attacks, and making this platform accessible globally could genuinely help protect people who need it most.

The phishing module is ready to scale. I want to build a much larger library of hyper-realistic emails and implement a difficulty system that adapts as users progress, introducing increasingly sophisticated attacks that teach them to think more critically.

A SQL Injection awareness module is on my roadmap. Rather than explaining injection attacks in theory, users would interact with a simulated vulnerable login form and see firsthand how database injection works in a safe environment. It's learning through consequence without real risk.

I'd also like to add a Ransomware Simulation module that shows what happens when a user actually opens a malicious attachment. A realistic fake file encryption sequence and ransom note would make this devastating real-world attack tangible rather than abstract. People understand threats they've seen.

Beyond these, I'm seriously considering a major architectural shift: moving from a 2D top-down perspective to a full 3D first-person immersive experience. Imagine walking through a corporate office in full 3D, seeing phishing emails pop up on your desk monitor in real-time, noticing suspicious USB devices left by attackers, and encountering social engineering scenarios where you have to make split-second decisions. This would feel less like a training module and more like a genuine workplace experience.

The most exciting possibility is leveraging AI to dynamically generate phishing emails that are hyper-personalized and contextually relevant. Instead of a fixed set of 13 emails, an AI model could generate thousands of unique variations, learning from user performance to create emails that specifically target their weak points. It could adapt difficulty in real-time, introduce new attack patterns based on current real-world threats, and even generate personalized back-stories for convincing social engineering scenarios. This would make the training perpetually fresh and significantly more effective.

## Author

Ahmed Mohammed Khaled — BSc Computer Science (Cybersecurity) from Asia Pacific University of Technology and Innovation, Malaysia.

[LinkedIn](https://linkedin.com) | [GitHub](https://github.com)
