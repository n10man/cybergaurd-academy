import React, { useState } from 'react';
import './PhishingWikiGuide.css';

const PhishingWikiGuide = () => {
  const [activeSection, setActiveSection] = useState('overview');

  return (
    <div className="wiki-container">
      <div className="wiki-header">
        <h1>Phishing: A Practical Guide</h1>
        <p className="wiki-subtitle">Understanding phishing attacks and how to protect yourself</p>
      </div>

      <div className="wiki-content-wrapper">
        {/* Sidebar Navigation */}
        <div className="wiki-sidebar">
          <div className="wiki-toc">
            <h3>Contents</h3>
            <ul>
              <li><a onClick={() => setActiveSection('walkthrough')} className={activeSection === 'walkthrough' ? 'active' : ''}>0. Game Walkthrough (START HERE!)</a></li>
              <li><a onClick={() => setActiveSection('overview')} className={activeSection === 'overview' ? 'active' : ''}>1. What is Phishing?</a></li>
              <li><a onClick={() => setActiveSection('mechanics')} className={activeSection === 'mechanics' ? 'active' : ''}>2. How It Works</a></li>
              <li><a onClick={() => setActiveSection('types')} className={activeSection === 'types' ? 'active' : ''}>3. Common Types</a></li>
              <li><a onClick={() => setActiveSection('red-flags')} className={activeSection === 'red-flags' ? 'active' : ''}>4. Warning Signs</a></li>
              <li><a onClick={() => setActiveSection('defense')} className={activeSection === 'defense' ? 'active' : ''}>5. How to Protect Yourself</a></li>
              <li><a onClick={() => setActiveSection('examples')} className={activeSection === 'examples' ? 'active' : ''}>6. Real Examples</a></li>
              <li><a onClick={() => setActiveSection('response')} className={activeSection === 'response' ? 'active' : ''}>7. What To Do If Phished</a></li>
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="wiki-main-content">
          
          {/* Walkthrough */}
          {activeSection === 'walkthrough' && (
            <div className="wiki-section">
              <h2>0. Game Walkthrough - Step by Step</h2>
              <p><strong>Welcome! Follow this guide exactly to complete CyberGuard Academy. This is your complete spoon-fed walkthrough from start to finish!</strong></p>

              <div className="wiki-highlight">
                <strong>START HERE:</strong> You begin in the office. Look at your Objectives panel on the LEFT side of the screen - it will always show you what to do next!
              </div>

              <h3>👉 ACTION 1: Find and Talk to HR Manager</h3>
              <p><strong>Location:</strong> HR Manager is standing near the top-left area of the office at a desk.</p>
              <p><strong>What to do:</strong></p>
              <ol>
                <li>Move your character towards the HR Manager (top-left area)</li>
                <li>Get close to them and press <strong>E</strong> to interact</li>
                <li>They will welcome you and explain your mission to analyze phishing emails</li>
                <li>Press <strong>SPACE</strong> to speed up the text or click the <strong>Close (✕)</strong> button when done</li>
              </ol>
              <p>✅ <strong>AFTER YOU'RE DONE:</strong> Go back down to talk to HR Manager AGAIN. He has more info for you.</p>

              <h3>👉 ACTION 2: Talk to HR Manager Again (Second Conversation)</h3>
              <p><strong>Location:</strong> Same HR Manager, top-left area</p>
              <p><strong>What to do:</strong></p>
              <ol>
                <li>Go back to the HR Manager</li>
                <li>Press <strong>E</strong> to interact again</li>
                <li>This time they'll tell you about the Whiteboard at the top of the office</li>
                <li>Press <strong>SPACE</strong> or close when done</li>
              </ol>
              <p>✅ <strong>AFTER YOU'RE DONE:</strong> You've automatically unlocked the Senior Developer! Now go find him in the office.</p>

              <h3>👉 ACTION 3: Find and Talk to Senior Developer (First Conversation)</h3>
              <p><strong>Location:</strong> Senior Developer "David" is somewhere in the office. Look for him!</p>
              <p><strong>What to do:</strong></p>
              <ol>
                <li>Move around the office until you find the Senior Developer</li>
                <li>Press <strong>E</strong> to interact with him</li>
                <li>He'll introduce himself as David and mention that login credentials are on a sticky note</li>
                <li>Press <strong>SPACE</strong> or close when done</li>
              </ol>
              <p>✅ <strong>AFTER YOU'RE DONE:</strong> By talking to him, you unlocked the Sticky Note and Whiteboard! Now look around near the Senior Developer to find the sticky note on his table.</p>

              <h3>👉 ACTION 4: Get Login Credentials from Sticky Note</h3>
              <p><strong>Location:</strong> On or near the Senior Developer's desk/table</p>
              <p><strong>What to do:</strong></p>
              <ol>
                <li>Look around the Senior Developer's area for a sticky note</li>
                <li>Press <strong>E</strong> to interact with the sticky note</li>
                <li>A popup will appear showing the login credentials:</li>
                <li style={{ fontFamily: 'monospace', margin: '10px 0', padding: '10px', background: '#f0f0f0' }}>
                  Username: (shown here)<br/>
                  Password: (shown here)
                </li>
                <li><strong>Write these down or remember them!</strong> You'll need them soon</li>
                <li>Close the popup</li>
              </ol>
              <p>✅ <strong>AFTER YOU'RE DONE:</strong> Now go find the Main Computer in the office. Look around the desks!</p>

              <h3>👉 ACTION 5: Find and Access the Main Computer</h3>
              <p><strong>Location:</strong> Main Computer is somewhere in the office at a desk</p>
              <p><strong>What to do:</strong></p>
              <ol>
                <li>Walk around the office until you find the computer</li>
                <li>Press <strong>E</strong> to interact with it</li>
                <li>The Email Client window will open on your screen</li>
              </ol>
              <p>✅ <strong>AFTER YOU'RE DONE:</strong> You'll see a login screen. Use the credentials from the sticky note!</p>

              <h3>👉 ACTION 6: Log Into the Email Client</h3>
              <p><strong>Location:</strong> The email login screen (on your computer monitor)</p>
              <p><strong>What to do:</strong></p>
              <ol>
                <li>You'll see two fields: "Email" and "Password"</li>
                <li>Type the username from the sticky note into the "Email" field</li>
                <li>Type the password from the sticky note into the "Password" field</li>
                <li>Click the <strong>Login</strong> button</li>
              </ol>
              <p>✅ <strong>AFTER YOU'RE DONE:</strong> You're now logged in! Time for the main task!</p>

              <h3>👉 ACTION 7: ANALYZE ALL 13 EMAILS - YOUR MAIN MISSION!</h3>
              <p><strong>Location:</strong> Email inbox (13 emails waiting for you)</p>
              <p><strong>IMPORTANT:</strong> This is the core training! You have 13 emails to analyze.</p>
              <p><strong>What to do:</strong></p>
              <ol>
                <li>Look at your inbox - you'll see 13 emails listed</li>
                <li>Click on the first email to read it</li>
                <li><strong>CAREFULLY READ</strong> the entire email - look for red flags!</li>
                <li>Ask yourself:
                  <ul>
                    <li>Does the sender address look official?</li>
                    <li>Is there urgency or threats?</li>
                    <li>Does it ask for sensitive information (passwords, credit cards, SSN)?</li>
                    <li>Do links look suspicious?</li>
                    <li>Are there grammar mistakes?</li>
                  </ul>
                </li>
                <li>After reading, click either:
                  <ul>
                    <li><strong>"This is Safe"</strong> if it looks legitimate</li>
                    <li><strong>"This is Phishing"</strong> if it looks like an attack</li>
                  </ul>
                </li>
                <li><strong>You'll get instant feedback:</strong> The game will tell you if you were right or WRONG, and explain WHY!</li>
                <li>The email will move to either "Safe" or "Phishing" folder</li>
                <li><strong>Repeat this for ALL 13 EMAILS</strong> one by one</li>
              </ol>
              <p><strong>💡 HINTS:</strong> Refer to Section 6 of this guide ("Real Examples") to see examples of phishing attacks and what to look for!</p>
              <p>✅ <strong>AFTER YOU FINISH ALL 13:</strong> Close the email client and check the whiteboard to see your final score!</p>

              <h3>👉 ACTION 8: Close Email Client and Check Whiteboard</h3>
              <p><strong>Location:</strong> Email Client window</p>
              <p><strong>What to do:</strong></p>
              <ol>
                <li>When you've finished all 13 emails, click the <strong>Close</strong> button to exit the email client</li>
                <li>You'll be back in the game office</li>
                <li>Look for the Whiteboard - it's at the TOP of the office</li>
                <li>Press <strong>E</strong> to interact with the whiteboard</li>
                <li>You'll see your progress and final score</li>
                <li>Press <strong>Z</strong> to see the next page of the whiteboard</li>
                <li>Press <strong>X</strong> to close the whiteboard</li>
              </ol>
              <p>✅ <strong>AFTER YOU CHECK:</strong> By completing the whiteboard, you unlock the Bookshelves!</p>

              <h3>👉 ACTION 9: Access the Bookshelves (Optional - Learn More!)</h3>
              <p><strong>Location:</strong> Bookshelves somewhere in the office</p>
              <p><strong>What to do:</strong></p>
              <ol>
                <li>Find the Bookshelves in the office</li>
                <li>Press <strong>E</strong> to interact with them</li>
                <li>This opens the Phishing Wiki Guide (this book you're reading!)</li>
                <li>You can read more about phishing attacks and how to protect yourself</li>
              </ol>

              <h3>🎉 YOU'RE DONE! CONGRATULATIONS!</h3>
              <p>You've completed CyberGuard Academy training! You now understand:</p>
              <ul>
                <li>✅ How phishing attacks work</li>
                <li>✅ How to spot red flags in suspicious emails</li>
                <li>✅ The difference between safe and phishing emails</li>
                <li>✅ How to protect yourself and your company</li>
              </ul>

              <div className="wiki-highlight">
                <strong>QUICK CONTROLS REMINDER:</strong><br/>
                • <strong>E</strong> = Interact with people/objects<br/>
                • <strong>SPACE</strong> = Speed up dialogue/continue text<br/>
                • <strong>ESC</strong> = Close dialogue/cancel<br/>
                • <strong>Arrow Keys</strong> = Move around<br/>
                • <strong>X</strong> = Close whiteboard<br/>
                • <strong>Z</strong> = Next page on whiteboard
              </div>

              <div className="wiki-warning">
                <strong>STUCK?</strong> Check your Objectives panel (left side) - it always shows what to do next!<br/>
                <strong>WANT TO RESTART?</strong> Just refresh the page and all progress resets!
              </div>
            </div>
          )}
          
          {/* Overview */}
          {activeSection === 'overview' && (
            <div className="wiki-section">
              <h2>1. What is Phishing?</h2>
              <p>Phishing is when someone tricks you into revealing sensitive information by pretending to be someone trustworthy. Usually it happens through email, but it can also happen through text messages, phone calls, or fake websites. The attacker's goal is to steal your passwords, financial information, or personal data.</p>
              
              <div className="wiki-infobox">
                <h4>The Basics</h4>
                <ul>
                  <li>Most common attack method: Email</li>
                  <li>Goal: Steal your credentials or personal data</li>
                  <li>Success rate: About 3-5% of people fall for it</li>
                  <li>Why it works: It targets human trust, not technical flaws</li>
                </ul>
              </div>

              <h3>Why Does Phishing Work?</h3>
              <p>Phishing works because it exploits basic human psychology. Attackers use a few key tactics:</p>
              <ul>
                <li>Pretending to be from a company or person you trust</li>
                <li>Creating a sense of urgency or panic (Act now or lose access)</li>
                <li>Using fear and threats (Your account will be closed)</li>
                <li>Looking official and legitimate at first glance</li>
                <li>Making requests that seem reasonable from a trusted source</li>
              </ul>
            </div>
          )}

          {/* How It Works */}
          {activeSection === 'mechanics' && (
            <div className="wiki-section">
              <h2>2. How It Works</h2>
              <p>Phishing attacks follow a predictable pattern. Understanding these steps helps you spot them.</p>

              <h3>The Basic Attack</h3>
              <ol>
                <li>Attacker does research on the target or company</li>
                <li>Attacker creates a convincing fake email or website that looks like the real thing</li>
                <li>Attacker sends it to potential victims</li>
                <li>Victim clicks a link, downloads something, or replies with information</li>
                <li>Attacker captures credentials, personal data, or installs malware</li>
                <li>Attacker uses the stolen information to access real accounts or systems</li>
              </ol>

              <h3>A Simple Example</h3>
              <p>You receive an email that appears to be from your bank. It says unusual activity has been detected and asks you to verify your identity by clicking a link. You click the link, and it takes you to what looks like your bank's website. You enter your username and password to log in. After you hit enter, you see an error message. What you don't know is that the link actually took you to a fake website, and the attacker just captured your real bank credentials.</p>

              <div className="wiki-warning">
                Important: Even careful, tech-savvy people can fall for phishing because it exploits trust and psychology, not technical weaknesses.
              </div>
            </div>
          )}

          {/* Types */}
          {activeSection === 'types' && (
            <div className="wiki-section">
              <h2>3. Common Types of Phishing</h2>

              <h3>Mass Phishing</h3>
              <p>Attackers send the same email to thousands of people, hoping some will respond. These are usually generic and vague because they're sent to anyone, not specific targets.</p>

              <h3>Targeted Phishing (Spear Phishing)</h3>
              <p>Attackers research you specifically and create a personalized email just for you. They might know your name, your company, or recent transactions. This makes it seem more legitimate.</p>

              <h3>Whaling</h3>
              <p>This is targeted phishing aimed at high-level executives or important people. Often involves an attacker pretending to be a company CEO requesting wire transfers or sensitive data.</p>

              <h3>Email from Fake Companies</h3>
              <p>Attackers impersonate real companies like banks, delivery services, or payment processors. The email looks official but comes from a slightly different domain.</p>

              <h3>Malware Distribution</h3>
              <p>Phishing emails contain attachments or links that install malware on your computer. Sometimes the email claims to be a security update or software patch.</p>

              <h3>Phone Phishing (Vishing)</h3>
              <p>Someone calls you claiming to be from a company and tries to get you to reveal information or access your account. The caller might use official-sounding language and know some basic information about you.</p>

              <h3>Text Message Phishing (Smishing)</h3>
              <p>Similar to email phishing but through text messages. Often includes a link to a malicious website or asks you to reply with information.</p>
            </div>
          )}

          {/* Red Flags */}
          {activeSection === 'red-flags' && (
            <div className="wiki-section">
              <h2>4. Warning Signs</h2>
              <p>Learning to spot these signs is your best defense against phishing.</p>

              <h3>Check the Sender</h3>
              <ul>
                <li>The email address doesn't match the company name (for example, support@amazon-secure.net instead of amazon.com)</li>
                <li>Generic greeting like "Dear Customer" instead of your actual name</li>
                <li>Company name is spelled slightly differently or uses a different ending (.net instead of .com)</li>
                <li>Look at the actual email address, not just the display name. That's what matters.</li>
              </ul>

              <h3>Suspicious Content</h3>
              <ul>
                <li>The email creates pressure to act immediately (Action required within 24 hours)</li>
                <li>Threats about account closure or legal action</li>
                <li>Requests for your password, PIN, credit card number, or social security number</li>
                <li>No legitimate company asks for these things via email</li>
                <li>Strange grammar or spelling mistakes</li>
                <li>The message could apply to anyone, not specifically to you</li>
              </ul>

              <h3>Links and URLs</h3>
              <ul>
                <li>Hover over a link. If the displayed text says amazon.com but the actual URL is different, it's phishing</li>
                <li>Look for suspicious URLs like amaz0n.com (zero instead of the letter O) or extra dots</li>
                <li>Shortened links that hide where they actually go</li>
                <li>URLs starting with http:// instead of https://</li>
              </ul>

              <h3>Attachments and Downloads</h3>
              <ul>
                <li>Unexpected attachments, especially .exe, .zip, or .scr files</li>
                <li>Word or Excel documents that ask you to enable macros</li>
                <li>Requests to download security updates via email (Real updates come through the software itself)</li>
              </ul>

              <h3>Unusual Requests</h3>
              <ul>
                <li>Email asks you to verify or confirm information you already provided</li>
                <li>Request to click a link to update your profile or payment information</li>
                <li>Asking you to wire money or make an unusual payment</li>
                <li>Request comes from an unexpected source or in an unusual format</li>
              </ul>

              <div className="wiki-checklist">
                <h4>Quick Check</h4>
                <ul>
                  <li>Is the sender address from the official domain?</li>
                  <li>Is there urgency or threats?</li>
                  <li>Does it ask for sensitive information?</li>
                  <li>Do links go where they claim to go?</li>
                  <li>Are there suspicious attachments?</li>
                  <li>Is the grammar correct?</li>
                  <li>Did I actually order or request this?</li>
                </ul>
              </div>
            </div>
          )}

          {/* Defense */}
          {activeSection === 'defense' && (
            <div className="wiki-section">
              <h2>5. How to Protect Yourself</h2>

              <h3>Email Safety</h3>
              <ul>
                <li>Always check the sender's actual email address, not just the display name</li>
                <li>Hover over links before clicking to see where they really go</li>
                <li>If you get a suspicious email from a company, go directly to their official website instead of clicking the email link</li>
                <li>Enable spam filters on your email account</li>
                <li>Create email rules to flag suspicious domains</li>
              </ul>

              <h3>Strong Authentication</h3>
              <ul>
                <li>Use two-factor authentication (2FA) whenever possible. Even if someone gets your password, they can't access your account without the second factor</li>
                <li>Use strong, unique passwords for each account</li>
                <li>Use a password manager to create and store complex passwords</li>
                <li>Change passwords immediately if you think you've been compromised</li>
              </ul>

              <h3>Technical Protection</h3>
              <ul>
                <li>Keep your software updated with the latest security patches</li>
                <li>Use antivirus or anti-malware software</li>
                <li>Use browser security extensions</li>
                <li>Use DNS filtering services that block known phishing domains</li>
              </ul>

              <h3>Your Best Defense: Thinking Before Acting</h3>
              <ul>
                <li>Be naturally skeptical of unexpected emails, even if they look official</li>
                <li>If an email asks you to verify something, call the company using a phone number from their official website, don't use the number in the email</li>
                <li>Take a moment to think. Does this make sense? Am I expecting this email?</li>
                <li>Report phishing attempts to your IT department or the company being impersonated</li>
              </ul>
            </div>
          )}

          {/* Examples */}
          {activeSection === 'examples' && (
            <div className="wiki-section">
              <h2>6. Real Examples</h2>

              <h3>Example 1: Fake Security Update</h3>
              <div className="wiki-example">
                <p><strong>What happens:</strong> You get an email from something like support@microsoft-updates.net saying your Windows computer needs an urgent security update.</p>
                <p><strong>Red flags:</strong></p>
                <ul>
                  <li>The sender domain is microsoft-updates.net, not microsoft.com</li>
                  <li>Creates panic by saying your system will be compromised in 24 hours</li>
                  <li>Asks you to download and run an .exe file (a common way to spread malware)</li>
                  <li>Real Microsoft updates come through Windows Update, not email</li>
                </ul>
                <p><strong>Why it works:</strong> People expect security updates and are used to installing patches. The urgency makes them act without thinking.</p>
                <p><strong>What to do:</strong> Never download security patches from unsolicited emails. Go directly to the official website to download updates.</p>
              </div>

              <h3>Example 2: Fake Delivery Notification</h3>
              <div className="wiki-example">
                <p><strong>What happens:</strong> An email from delivery@fedex-package-trace.com says your package couldn't be delivered and you need to provide your personal information to reschedule.</p>
                <p><strong>Red flags:</strong></p>
                <ul>
                  <li>The domain is fedex-package-trace.com, not fedex.com</li>
                  <li>Urgency: Your package will be returned in 3 days</li>
                  <li>Asks for personal information like your address, phone, and email</li>
                  <li>Links appear to go to fedex.com but actually go to the fake domain</li>
                </ul>
                <p><strong>Why it works:</strong> Most people have ordered packages. The attacker uses this against them.</p>
                <p><strong>What to do:</strong> Always go directly to fedex.com or use the FedEx app to track packages. Never click links in delivery emails.</p>
              </div>

              <h3>Example 3: Fake Account Compromise Alert</h3>
              <div className="wiki-example">
                <p><strong>What happens:</strong> You get an email from security-alert@amaz0n-account.com saying your Amazon account has been compromised and you need to verify your identity immediately.</p>
                <p><strong>Red flags:</strong></p>
                <ul>
                  <li>Notice the domain uses amaz0n (zero) instead of amazon (letter O)</li>
                  <li>Creates fear by saying your account is compromised and suspended</li>
                  <li>Asks for your password, credit card number, and CVV code</li>
                  <li>Real Amazon never asks for this information via email</li>
                  <li>Uses a 24-hour deadline to force quick action</li>
                </ul>
                <p><strong>Why it works:</strong> Account compromise is scary. People act fast without thinking when they believe their account is at risk.</p>
                <p><strong>What to do:</strong> Amazon and other companies never request passwords or full credit card info via email. Go directly to amazon.com and check your account.</p>
              </div>

              <h3>Example 4: Banking Alert with Link Spoofing</h3>
              <div className="wiki-example">
                <p><strong>What happens:</strong> An email from account-security@maybank3-alert.com says unusual activity was detected on your bank account. The link displayed looks like it goes to maybank.com, but it actually goes somewhere else.</p>
                <p><strong>Red flags:</strong></p>
                <ul>
                  <li>The sender domain (maybank3-alert.com) is not the real banking domain</li>
                  <li>Link text displays one URL but actually goes to a different one (this is called link spoofing)</li>
                  <li>Urgency: You have 12 hours to verify or your account will be closed</li>
                  <li>Asks for your username, password, and PIN</li>
                  <li>Banks never request PINs via email</li>
                </ul>
                <p><strong>Why it works:</strong> The displayed link text looks legitimate, so many people don't check where it actually goes.</p>
                <p><strong>What to do:</strong> Always hover over links before clicking. For banking alerts, call your bank directly or log in through their app, not through email links.</p>
              </div>

              <h3>Example 5: Fake Coworker Requesting Access Credentials</h3>
              <div className="wiki-example">
                <p><strong>What happens:</strong> You receive an email from tanDav1d@yahoo.ru claiming to be a Senior Developer from your company. The email says they need your password urgently to add you to a critical project and tells you not to tell anyone.</p>
                <p><strong>Red flags:</strong></p>
                <ul>
                  <li>The sender uses a personal Yahoo email instead of your company domain</li>
                  <li>Requests your current system password directly (HUGE red flag)</li>
                  <li>Creates pressure with tight deadline (needs it within 2 hours)</li>
                  <li>Demands secrecy ("don't discuss this with anyone, not even your manager")</li>
                  <li>Claims high-profile project to make the request seem more important</li>
                  <li>No legitimate company or coworker ever asks for passwords via email</li>
                </ul>
                <p><strong>Why it works:</strong> This exploits trust in colleagues and workplace authority. People want to help teammates and fear missing out on important projects.</p>
                <p><strong>What to do:</strong> Never give your password to anyone, period. If you get this email, verify directly with that person through a phone call or in-person. Better yet, contact your IT security team.</p>
              </div>

              <h3>Example 6: Fake Bank Fraud Alert with Malware</h3>
              <div className="wiki-example">
                <p><strong>What happens:</strong> An email from fraud-detection@citibank-secure.net claims fraud was detected on your credit card and asks you to download a "fraud verification report" as a ZIP file.</p>
                <p><strong>Red flags:</strong></p>
                <ul>
                  <li>Sender domain is citibank-secure.net, not the real Citibank domain</li>
                  <li>Suspicious 8.7 MB ZIP file (why would a report be so large?)</li>
                  <li>Asks for complete financial data: SSN, card number, CVV, PIN, account number</li>
                  <li>Banks NEVER ask for credit card CVV or PIN via email or downloadable documents</li>
                  <li>Six-hour deadline creates panic and rushed decision-making</li>
                  <li>The ZIP file likely contains malware disguised as a form</li>
                </ul>
                <p><strong>Why it works:</strong> Fraud alerts trigger fear. The large attachment file looks official, and people are trained to follow bank instructions.</p>
                <p><strong>What to do:</strong> Banks never send reports via email downloads. If you see fraud, call the number on the back of your card or go directly to their website.</p>
              </div>

              <h3>Example 7: Fake HR/Payroll System Update</h3>
              <div className="wiki-example">
                <p><strong>What happens:</strong> An email from payroll@company-hrsystem.kp says your company's payroll system is being upgraded and all employees must resubmit their direct deposit information including banking details, Social Security Number, and scans of government-issued ID.</p>
                <p><strong>Red flags:</strong></p>
                <ul>
                  <li>The domain uses .kp (a suspicious country code), not your company domain</li>
                  <li>Requests complete identity theft information: SSN, bank routing number, full account number</li>
                  <li>Asks for government ID scans (driver's license or passport) via email</li>
                  <li>Creates urgency about paycheck delays (threatens to hold paychecks if not updated by deadline)</li>
                  <li>Contains intentional grammar mistakes ("take 24-48 hour" instead of "takes 24-48 hours")</li>
                  <li>Your HR department already has this information - they would never ask you to resubmit via email</li>
                </ul>
                <p><strong>Why it works:</strong> This is a complete identity theft attack. Paycheck threats work because people need their income. The grammar mistakes might make it seem less suspicious to automated filters.</p>
                <p><strong>What to do:</strong> Never send SSN, bank info, or ID scans via email. For payroll changes, use your company's secure HR portal or visit HR in person. If uncertain, call your HR department directly.</p>
              </div>
            </div>
          )}

          {/* Response */}
          {activeSection === 'response' && (
            <div className="wiki-section">
              <h2>7. What To Do If Phished</h2>

              <h3>If You Clicked a Link But Didn't Enter Information</h3>
              <ul>
                <li>Close the browser window</li>
                <li>Run a malware scan on your computer</li>
                <li>You're probably fine, but monitor your accounts for unusual activity</li>
              </ul>

              <h3>If You Downloaded an Attachment</h3>
              <ul>
                <li>Don't open it</li>
                <li>Move it to trash or quarantine</li>
                <li>Run a full antivirus scan</li>
                <li>Contact your IT security team if you're at work</li>
              </ul>

              <h3>If You Entered Your Password or Credentials</h3>
              <ul>
                <li>From a different device, immediately change your password for that account</li>
                <li>Enable two-factor authentication if available</li>
                <li>Check recent account activity for unauthorized access</li>
                <li>If you reuse passwords, change those accounts too</li>
              </ul>

              <h3>If Financial Information Was Compromised</h3>
              <ul>
                <li>Contact your bank immediately</li>
                <li>Review all recent transactions</li>
                <li>Check your credit report</li>
                <li>Consider placing a fraud alert or credit freeze</li>
                <li>File a report with the FTC at reportfraud.ftc.gov</li>
              </ul>

              <h3>Report It</h3>
              <ul>
                <li>Forward the phishing email to your company's security team</li>
                <li>Report it to the company being impersonated</li>
                <li>Report it to your email provider</li>
                <li>Your report helps protect others from the same attack</li>
              </ul>

              <div className="wiki-highlight">
                Remember: Phishing happens to everyone, even experienced security people. If it happens to you, the important thing is to act quickly. Don't be embarrassed to report it.
              </div>
            </div>
          )}

        </div>
      </div>

      <div className="wiki-footer">
        <p className="wiki-disclaimer">
          This guide is for educational purposes. It's not a substitute for professional security advice. If you believe you're a victim of phishing or cybercrime, contact law enforcement or a security professional.
        </p>
      </div>
    </div>
  );
};

export default PhishingWikiGuide;
