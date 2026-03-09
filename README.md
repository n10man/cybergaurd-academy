# CyberGuard Academy

A gamified cybersecurity awareness training platform that teaches everyday people how to spot phishing attacks through interactive gameplay.

## About the Project

CyberGuard Academy is my Final Year Project. It is a web-based platform that provides users with a sequence based game, that contains a 2D top-down office environment built with Phaser 3, interact with NPCs like the HR Manager and a Senior Developer, and complete a phishing email classification challenge where they learn to distinguish real emails from malicious ones.

The core inspiration came from my passion of education and teaching combined with my cybersecurity education and the concept of trying to combine education of what i am learning in a game, so that i can help educate and teach multiple people, especially ones who aren't very technical or have a computer science / CYB background. The main module of the project is phishing. This is because phishing is statistically the most common entry point for breaches, and i wanted to prioritize the most common risk first, then branch out to multiple other areas and modules. I built CyberGuard Academy both as a final year project and as a passion project that could hopefully develop into a future education space for everybody to use, allowing everybody to learn through games. 

The experience combines narrative-driven gameplay with hands-on learning. You walk through an office, talk to NPCs who explain security concepts, collect credentials, and then the real challenge gets revealed, you must process your inbox and identify phishing emails while real ones slip through and cost you points.


## Tech Stack

The frontend is built with React 19 paired with Phaser 3 as the game engine, React Router for navigation, and Google reCAPTCHA for bot protection during registration. The backend runs on Node.js with Express.js, PostgreSQL for persistent data storage, JWT for stateless authentication, bcryptjs for secure password hashing, and speakeasy to handle TOTP-based two-factor authentication. Security is reinforced through Helmet.js for HTTP headers and express-rate-limit to prevent brute force attacks. The whole stack deploys cleanly using Vercel hosts the frontend while Railway.app runs the backend and PostgreSQL database.

## Features

The game world is an interactive 2D office environment where you walk around, talk to NPCs, and complete objectives. Two-factor authentication is mandatory and uses time-based one-time passwords via Google Authenticator, ensuring accounts stay secure. The phishing email classification challenge presents randomized emails each session — you classify them as legitimate or phishing and earn points for correct decisions, creating a tangible learning outcome.

Authentication is hardened with bcrypt password hashing and reCAPTCHA verification during registration. Sessions are managed through JWT tokens without server-side storage, keeping the backend stateless and scalable. Your progress is automatically saved per user, so you can pick up right where you left off, with points, completed challenges, and position in the game world all persisted to the database.

## How to Run Locally

You'll need Node.js, npm, and PostgreSQL installed on your machine. Clone the repository and navigate into the project folder. Install dependencies separately for backend and frontend by running `npm install` in both the `server` and `client` directories.

In the `server` folder, create a `.env` file with your database connection details (DATABASE_URL or individual DB_HOST, DB_USER, DB_PASSWORD, DB_NAME), a strong JWT_SECRET, and your RECAPTCHA_SECRET_KEY if you want bot protection enabled. Set up the PostgreSQL database using the schema file provided in the server folder.

Start the backend with `node server.js` (it runs on port 5000), then in a separate terminal, start the frontend with `npm start` from the `client` folder (it runs on port 3000). Your browser will open automatically to `http://localhost:3000`. That's it — you're ready to play.

## Screenshots

**Login & Registration:** Screenshot of the main dashboard of Cybergaurd.
<img width="872" height="451" alt="image" src="https://github.com/user-attachments/assets/760a1891-4175-48f6-8638-e8f04dc05db4" />

**NPC Dialogue:** A close-up of the dialogue box showing conversation with the HR Manager with the text visible.
<img width="900" height="458" alt="image" src="https://github.com/user-attachments/assets/e79dbe1b-5a41-4826-9b4c-64b37f7dcec3" />

**The phishing practical guide: ** Page 4 of the phishing guide, on "Warning Signs" when looking through emails
<img width="785" height="646" alt="image" src="https://github.com/user-attachments/assets/ef9de779-52b9-4085-bf94-cdef22e42f04" />

**Phishing Academy Email** Main dashboard for all the emails on the system.
<img width="839" height="385" alt="image" src="https://github.com/user-attachments/assets/9b91226f-31e3-4369-a40b-54218ce7eb05" />

**Email content** Content inside one of the 13 emails
<img width="854" height="425" alt="image" src="https://github.com/user-attachments/assets/3e156818-e83c-44f1-b26c-ecc311759fae" />

## Future Improvements

I'm planning to add multi-language support starting with Arabic, French, Chinese, and Spanish. This is to help non-English speaking users be more informred and eudcated in order to not be targeted more frequently by phishing attacks, as well as  making this platform accessible globally to people all around the world.

The phishing module is also going to be scaled. I will be expanding to a much larger library of hyper-realistic emails and implement a difficulty system that adapts as users progress, introducing increasingly sophisticated attacks that teach them to think more critically.

A SQL Injection awareness module is also in the works. Rather than explaining injection attacks in theory, users would interact with a simulated vulnerable login form and see firsthand how database injection works in a safe environment. It's learning through consequence without real risk.

I'm also going to add a Ransomware Simulation module that shows what happens when a user actually opens a malicious attachment.This would show everything that goes on behind the scenes in detail in a very simple and digestable manner, allowing users to understand it more clearly and more visually.

I'm also considering a major architectural shift, in moving from a 2D top-down perspective to a full 3D first-person immersive experience.

The most exciting possibility is leveraging my AI knowledge and future education to dynamically generate phishing emails that are hyper-personalized and contextually relevant. Instead of a fixed set of 13 emails, an AI model could generate thousands of unique variations, learning from user performance to create emails that specifically target their weak points. It could adapt difficulty in real-time, introduce new attack patterns based on current real-world threats, and even generate personalized back-stories for convincing social engineering scenarios. This would make the training perpetually fresh and significantly more effective.

The SQL Injection awareness module would use AI to dynamically generate vulnerable database queries and realistic company data schemas that users interact with. An AI model could create contextually relevant databases (e-commerce platforms, banking systems, healthcare records) and generate injection payloads of varying complexity. The system would analyze user attempts, explain why their injection succeeded or failed, and generate new scenarios on-the-fly so users can't memorize patterns. It could even simulate realistic error messages and database responses to make the learning experience feel like attacking a real system.

For the Ransomware Simulation module, AI would generate hyper-realistic file structures and data that appears encrypted. Instead of showing the same fake files every time, an AI model would generate thousands of unique filenames, folder structures, and file types that users would recognize from their "company", presentations with their name, spreadsheets with realistic data, project files they supposedly created. The ransom note itself could be dynamically generated with authentic-looking attacker branding, Bitcoin wallet addresses (non-functional for education), and threats tailored to the fake company context.
