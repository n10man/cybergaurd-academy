import React, { useEffect, useState, useMemo } from 'react';
import './WikiView.css';

const WikiView = ({ isOpen, onClose }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [glossaryTerm, setGlossaryTerm] = useState(null);
  const [hoveredEmailDemo, setHoveredEmailDemo] = useState(null);

  // Glossary - simple explanations for technical terms
  const glossary = useMemo(() => ({
    'HTTPS': 'A safer way to connect to websites. Think of it like sending a letter in a sealed envelope instead of a postcard. The "S" stands for Secure. If you see a little lock icon next to the website address, that means HTTPS is active.',
    'HTTP': 'The older way websites work. It\'s like sending information on a postcard - anyone can read it if they intercept it. Never enter passwords on HTTP websites.',
    'SSL Certificate': 'A digital ID card for websites. It proves that a website is real and not fake. Even scammers can get fake SSL certificates, so don\'t just trust the lock icon alone - check the actual website address too.',
    'Encrypted': 'When your data is scrambled so only the right person can read it. Like a secret code that only you and your friend know.',
    'Malware': 'Malicious software - basically, bad programs designed to harm your computer or steal your info. Think of it like a virus for computers.',
    'Credentials': 'Your login information - your username and password. The stuff hackers want to steal.',
    'Phishing': 'When someone tricks you into giving them your personal info by pretending to be someone trustworthy. Like a fake email pretending to be your bank.',
    'Spam': 'Unwanted emails or messages. Usually trying to sell you something or trick you.',
    '2FA': 'Two-Factor Authentication. A second step to verify you\'re really you. Like a code sent to your phone in addition to your password.',
    'Ransomware': 'Malware that locks your files and demands money to unlock them. It\'s basically digital kidnapping of your data.',
    'Antivirus': 'Software that protects your computer from malware. Think of it as a security guard for your computer.',
    'Password Manager': 'An app that safely stores all your passwords so you don\'t have to remember them. It\'s like a secure vault for your passwords.',
    'VPN': 'Virtual Private Network. It\'s like putting a privacy filter on your internet connection so others can\'t see what you\'re doing online.',
    'Firewall': 'A security system that controls what can come in and out of your computer or network. Like a bouncer at a club deciding who gets in.',
    'WiFi Security': 'Protecting your wireless connection. Public WiFi is like an open radio broadcast - anyone nearby can see your data. Always use a VPN on public WiFi.',
  }), []);

  // Main educational content - simplified and more natural
  const pages = useMemo(() => [
    {
      title: 'What is Phishing?',
      content: `Imagine someone calls you pretending to be from your bank. They sound real, they know some of your info, and they're asking you to "verify" your account by giving them your password. That's basically what phishing is - but over email and text instead of the phone.

Phishing is when someone tricks you into giving them passwords or personal info by pretending to be someone you trust. It's one of the most common ways hackers break into accounts.

WHY PEOPLE FALL FOR IT:
The trick is that phishers are really good at copying real emails. They use the company's logo, colors, and writing style. They make it look so real that even smart people sometimes fall for it.

THE REAL PROBLEM:
Once someone has your password, they can:
• Steal your money from online banking
• Mess with your social media accounts
• Use your email to hack into other accounts
• Pretend to be you and scam your friends
• Steal personal documents and photos

THE GOOD NEWS:
You can protect yourself! Once you learn the tricks, you'll spot fake emails from a mile away.`
    },
    {
      title: 'The Website Address Trick',
      content: `Here's the #1 way to catch a fake website: Look at the website address.

When you visit a website, there's an address at the top of your browser (like google.com or amazon.com). This address is called a URL, and it's your biggest clue whether a site is real or fake.

THE TRICK SCAMMERS USE:
Let's say you get an email saying "Verify your Amazon account NOW!" with a link. You click it and it LOOKS like Amazon's website. But check the address bar...

❌ Fake: amazon-security-check.com (it says Amazon but the real owner is someone else)
❌ Fake: amaz0n.com (the number 0 instead of the letter o - super sneaky!)
✓ Real: amazon.com

THE GOLDEN RULE:
The part that matters is the main domain name - in this case "amazon." Everything added before or after that usually means it's fake.

WHAT IT LOOKS LIKE:
[What is HTTPS?]

Real Amazon URL: amazon.com
Fake Amazon URLs:
• amazon.checkout-secure.com (they added stuff in front)
• login-amazon.net (different ending, "net" instead of "com")
• amazone.com (just one letter off)

YOUR JOB:
Always look at that address bar before entering any passwords. Don't just look for the company name - check if the actual domain matches what you expect.`
    },
    {
      title: 'Spotting Fake Sender Emails',
      content: `An email says it's from your bank, but is it really? Let's look at how to tell.

THE SNEAKY PART:
Email addresses are like disguises. You see "Amazon Support <support@amazon.com>" but that fancy name part can be anything. The real info is the actual email address in angle brackets.

EXAMPLE OF A TRICK:
You see: "Amazon Support <noreply@amazonsupport.net>"
But wait - "amazonsupport.net" is NOT the real Amazon. Amazon's real email would be something like "@amazon.com"

HOW TO CHECK:
1. Look at the sender's email address (not the display name)
2. Is it from the real company's domain? (amazon.com, not amazonsupport.net)
3. When in doubt, go to the company's website directly and find their contact page
4. Call them using a phone number YOU know is real

REAL COMPANIES NEVER:
• Ask you to confirm passwords in an email
• Send links for you to "verify your account"
• Threaten you with account closure by email
• Ask for your full password or credit card number

If you get an email doing any of these things, it's almost certainly fake.`
    },
    {
      title: 'The Urgency Trap',
      content: `Scammers love to make you panic. When you're panicked, you don't think straight. You just click and do what they say.

HERE ARE THE SCARY MESSAGES YOU MIGHT SEE:

"YOUR ACCOUNT IS LOCKED!"
This makes you think "Oh no! I need to fix this RIGHT NOW!" But real companies don't lock you out and then email you. They'd let you know in person or through the app.

"IMMEDIATE ACTION REQUIRED"
Sounds urgent, right? But notice - they're the ones being scary. Real companies are calm and clear about what happened.

"SUSPICIOUS ACTIVITY DETECTED"
This one plays on your fear. But again, your real bank wouldn't ask you to "verify" your password. They'd never ask that.

"YOU OWE US MONEY - 24 HOURS TO PAY"
Financial fear is real, but don't panic. Check your actual account. Log in to the real website (don't use the link in the email). If you really owe money, you'll see it there.

THE TRICK:
Scammers use these pressure tactics because fear makes people dumb. You skip checking the email address. You skip looking at the website address. You just... click.

WHAT TO DO INSTEAD:
1. PAUSE - Take a breath. Real emergencies aren't solved by email links
2. CHECK - Go directly to the company's website (type it yourself, don't click the link)
3. VERIFY - If there's really a problem, you'll see it on the real website
4. CALL - Use a phone number you know is real and call the company

The most secure companies in the world know this. They don't pressure you because they know it's a scam tactic.`
    },
    {
      title: 'Dangerous File Types',
      content: `When someone sends you a file, do you know if it's safe or dangerous?

Every file has an extension - that's the letters after the period, like .pdf or .exe

SAFE FILES:
✓ .pdf - Documents (usually safe)
✓ .docx - Word documents (usually safe)
✓ .xlsx - Excel spreadsheets (usually safe)
✓ .jpg or .png - Pictures (usually safe)
✓ .txt - Text files (safe)

DANGEROUS FILES:
❌ .exe - Programs that run and do stuff (very dangerous!)
❌ .bat or .cmd - Commands that your computer will execute (dangerous!)
❌ .scr - Screen saver files (often malicious!)
❌ .vbs - Script files (can be dangerous!)
❌ .zip - Compressed folders (could contain dangerous files inside!)

THE SNEAKY TRICK:
Scammers do something called "double extension." They make a file look safe but it's actually dangerous:

❌ invoice.pdf.exe
Your computer shows: "invoice.pdf" (looks safe!)
But it's actually: "invoice.pdf.exe" (will run as a program!)

What happens when you open it? The bad software runs and your computer gets infected.

HOW TO PROTECT YOURSELF:

1. TURN ON FILE EXTENSIONS:
Windows: Open File Explorer → View tab → Check "File name extensions"
This way you'll see the REAL extension, not the fake one

2. BE CAREFUL WITH EMAILS:
If an email attachment seems weird or unexpected - don't open it
Ask the sender if they really sent it (use phone or known contact info)

3. SCAN FIRST:
Before opening any suspicious file, scan it with [What is Antivirus?] software

REMEMBER:
Your friends and family would never email you suspicious files. If they do - that's a big red flag.`
    },
    {
      title: 'The Hover-Over Secret',
      content: `Here's the simplest trick that will stop most phishing attacks. It takes 2 seconds.

BEFORE YOU CLICK ANY EMAIL LINK - HOVER OVER IT.

That's it. Just move your mouse over the link and don't click.

WHAT HAPPENS:
At the very bottom left of your browser, you'll see the REAL website address. Not what the email says, but what will actually happen if you click.

EXAMPLE:
Email says: "Click here to verify your PayPal account"
You hover over it...
Bottom left shows: "https://paypa1-verify.ru/signin"

Wait - that's not PayPal! And ".ru" is Russia! This is fake!

ANOTHER EXAMPLE:
Email says: "Urgent: Bank needs your verification"
You hover...
Bottom left shows: "http://secure-bank-verify.net/password"

Real banks don't send you password reset links in emails. This is fake!

WHAT YOU'RE LOOKING FOR:
✓ Does the address match where you expect to go?
✓ Do you recognize the domain? (amazon.com, not some random site?)
✓ If it says banking, does it go to the real bank's website?

IF IT DOESN'T MATCH:
DON'T CLICK! Delete the email. Report it as spam.

ON YOUR PHONE:
Long-press the link and select "Copy." Paste it somewhere to see the real address.

THIS ONE TRICK stops 90% of phishing because most people don't even know to look. Once you do it a few times, it becomes automatic.`
    },
    {
      title: 'Latest Phishing Tricks',
      content: `Scammers keep inventing new ways to trick people. Here are the latest tricks to watch for:

LOOKALIKE DOMAINS:
Real: amazon.com
Fake: amaz0n.com (zero instead of letter o)
Fake: amazom.com (m instead of n)
Fake: amaozn.com (letters rearranged)

People miss these because they read fast. Slow down!

FAKE TEXT MESSAGES:
"Hi, this is Amazon. Click here to verify your account"
Never click links in unexpected texts. Go to the website yourself.

"Your package needs verification"
Check the sender's email. Doesn't match the real delivery service? Fake! Always go directly to the company's official website instead of clicking links from emails.

SOCIAL MEDIA HACK WARNING:
Someone messages you: "OMG is this you??"
It's not your real friend - their account got hacked. Don't click the link. Message them through another way to ask if they sent it.

VOICE PHISHING (PHONE CALLS):
Caller: "I'm from your bank's security team"
You: "Okay, what do you need?"
Caller: "Read me the code on your screen"
Real companies: Never ask for codes. Never.

COPYCAT WEBSITES:
They copy Amazon's website pixel-by-pixel. But the address is wrong.
Once you buy something, they DON'T send it - they just took your money.

SUPPLY CHAIN:
You get an email from your office's IT company.
But it's actually from someone who hacked the IT company's email.
Same problem as personal hacks, but feels more official.

RED FLAGS FOR ANY EMAIL/LINK:
• Asks for passwords - RED FLAG
• Threatens account closure - RED FLAG
• Demands immediate action - RED FLAG
• Uses scare tactics - RED FLAG
• Wants your credit card info - RED FLAG
• Grammar or spelling mistakes (real companies proofread) - RED FLAG
• Asking to "verify" personal info - RED FLAG

IF YOU'RE NOT SURE:
• Don't click
• Call the company using a number you know is real
• Visit their website by typing it yourself
• Wait a day. You'll feel better.

One wrong click can compromise your whole digital life. One right decision to check first keeps you safe.`
    },
    {
      title: 'Stay Safe Every Day',
      content: `Being safe online isn't complicated. It's mostly common sense and good habits.

PASSWORD SECURITY:
• Make passwords long (12+ characters)
• Mix up uppercase, lowercase, numbers, symbols
• Don't use: birthdays, pet names, "123456"
• Don't use the same password everywhere
• Use a [What is Password Manager?] if you have lots of passwords

EMAIL SAFETY:
• Don't click links in suspicious emails
• Hover over links before clicking
• Don't open unexpected attachments
• If an email asks for passwords - it's fake
• Report spam emails instead of deleting them

BROWSING SAFELY:
• Keep your browser updated
• Use private/incognito mode when on public [What is WiFi Security?]
• Don't save passwords in your browser
• Check the website address before entering info
• That lock icon just means it's [What is Encrypted?] - it doesn't mean it's real

KEEPING YOUR COMPUTER SAFE:
• Keep your operating system updated
• Run [What is Antivirus?] software
• Don't download random files from the internet
• Don't plug in USB drives from strangers
• Keep your computer locked when you leave

PHONE SAFETY:
• Don't click links in texts from unknown numbers
• Don't answer questions about personal info from random callers
• If someone claims to be IT support - they're probably lying
• Real companies don't cold-call asking for passwords

WHAT TO DO IF SOMETHING HAPPENS:
1. Change your password immediately
2. Call your bank/company on a number you know is real
3. Check your accounts for unusual activity
4. Consider using [What is 2FA?] for extra protection
5. Don't panic - businesses deal with this all the time

THE MOST IMPORTANT THING:
When in doubt, DON'T interact with it. Wait. Think. Verify. It's better to be safe and call them to check than to be sorry later.

You don't need to be a tech expert to stay safe. You just need to slow down and think before you click.`
    }
  ], []);

  useEffect(() => {
    if (!isOpen) {
      setDisplayedText('');
      setIsComplete(false);
      return;
    }

    setDisplayedText('');
    setIsComplete(false);
    let index = 0;
    const speed = 1;
    const currentContent = pages[currentPage].content;

    const interval = setInterval(() => {
      if (index < currentContent.length) {
        setDisplayedText(currentContent.substring(0, index + 1));
        index++;
      } else {
        setIsComplete(true);
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [isOpen, currentPage, pages]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      // Don't interfere with form inputs - check if focus is on input/textarea
      const isFormInput = document.activeElement?.tagName === 'INPUT' || 
                         document.activeElement?.tagName === 'TEXTAREA';
      if (isFormInput) {
        return;
      }

      if (e.code === 'Escape') {
        onClose();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        setCurrentPage((prev) => (prev > 0 ? prev - 1 : pages.length - 1));
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        setCurrentPage((prev) => (prev < pages.length - 1 ? prev + 1 : 0));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, pages.length, onClose]);

  if (!isOpen) return null;

  // Render email demo component for the Hover-Over Secret page
  const EmailDemo = () => {
    const demoEmails = [
      {
        sender: 'paypal-verify@secure.com',
        subject: 'Verify Your PayPal Account',
        body: 'Click here to verify your account',
        linkText: 'Verify Account',
        realURL: 'https://paypa1-verify.ru/signin',
        fakeURL: 'https://www.paypal.com'
      },
      {
        sender: 'noreply@amazon-security.net',
        subject: 'Unusual Activity Detected',
        body: 'Please confirm your identity immediately',
        linkText: 'Confirm Identity',
        realURL: 'https://amaz0n-security.biz/login',
        fakeURL: 'https://www.amazon.com'
      }
    ];

    return (
      <div className="email-demo-container">
        <div className="demo-instruction">
          <strong>👉 Try hovering over the link in this fake email:</strong>
        </div>
        {demoEmails.map((email, idx) => (
          <div key={idx} className="demo-email">
            <div className="email-header">
              <div><strong>From:</strong> {email.sender}</div>
              <div><strong>Subject:</strong> {email.subject}</div>
            </div>
            <div className="email-body">
              <p>{email.body}</p>
              <button 
                className="demo-email-link"
                onMouseEnter={() => setHoveredEmailDemo(idx)}
                onMouseLeave={() => setHoveredEmailDemo(null)}
                title={email.realURL}
              >
                {email.linkText}
              </button>
            </div>
            {hoveredEmailDemo === idx && (
              <div className="url-preview">
                <div className="url-label">URL appears at bottom-left:</div>
                <div className="url-display">{email.realURL}</div>
                <div className="url-warning">⚠️ Not what the link says!</div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  // If viewing a glossary term
  if (glossaryTerm) {
    return (
      <div className="wiki-overlay" onClick={onClose}>
        <div className="wiki-container" onClick={(e) => e.stopPropagation()}>
          {/* Center - Main Content (Full width for glossary) */}
          <div className="wiki-page wiki-center" style={{ gridColumn: '1 / -1' }}>
            <div className="wiki-page-header">
              <h2>What is {glossaryTerm}?</h2>
            </div>
            <div className="wiki-page-content">
              <p>{glossary[glossaryTerm]}</p>
            </div>
            <button 
              className="nav-button nav-prev"
              onClick={() => setGlossaryTerm(null)}
              style={{ margin: '15px auto', width: 'auto', paddingLeft: '30px', paddingRight: '30px' }}
            >
              ← Back to Chapter
            </button>
          </div>

          {/* Right - Navigation & Info */}
          <div className="wiki-page wiki-right" style={{ gridColumn: '1 / -1' }}>
            <div className="wiki-page-info">
              <div className="page-number">
                <span>{currentPage + 1}</span>/<span>{pages.length}</span>
              </div>
              <button className="wiki-close" onClick={onClose}>✕</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wiki-overlay" onClick={onClose}>
      <div className="wiki-container" onClick={(e) => e.stopPropagation()}>
        {/* Center - Main Content */}
        <div className="wiki-page wiki-center">
          <div className="wiki-page-header">
            <span className="header-emoji">
              {currentPage === 0 && '🎣'}
              {currentPage === 1 && '🔗'}
              {currentPage === 2 && '📧'}
              {currentPage === 3 && '⏰'}
              {currentPage === 4 && '⚠️'}
              {currentPage === 5 && '🖱️'}
              {currentPage === 6 && '🚨'}
              {currentPage === 7 && '🛡️'}
            </span>
            <h2>{pages[currentPage].title}</h2>
          </div>
          <div className="wiki-page-content">
            <p>
              {displayedText.split(/(\[[^\]]+\])/g).map((part, idx) => {
                if (part.startsWith('[') && part.endsWith(']')) {
                  const term = part.slice(1, -1);
                  return (
                    <span
                      key={idx}
                      className="glossary-link"
                      onClick={(e) => {
                        e.stopPropagation();
                        setGlossaryTerm(term.replace('What is ', '').replace('?', ''));
                      }}
                    >
                      {part}
                    </span>
                  );
                }
                return <span key={idx}>{part}</span>;
              })}
            </p>
            {!isComplete && <span className="wiki-cursor">▊</span>}
            {isComplete && currentPage === 5 && <EmailDemo />}
          </div>
          <div className="wiki-nav-bottom">
            <div className="page-dots-bottom">
              {pages.map((_, idx) => (
                <button
                  key={idx}
                  className={`dot ${idx === currentPage ? 'active' : ''}`}
                  onClick={() => setCurrentPage(idx)}
                  title={`Go to page ${idx + 1}`}
                />
              ))}
            </div>
            <div className="nav-buttons-bottom">
              <button 
                className="nav-button nav-prev"
                onClick={() => setCurrentPage((prev) => (prev > 0 ? prev - 1 : pages.length - 1))}
                title="Previous page (← or A)"
              >
                <i className="fas fa-chevron-left"></i> Prev
              </button>
              <button 
                className="nav-button nav-next"
                onClick={() => setCurrentPage((prev) => (prev < pages.length - 1 ? prev + 1 : 0))}
                title="Next page (→ or D)"
              >
                Next <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Close Button - Floating */}
        <button className="wiki-close-floating" onClick={onClose}>✕</button>
      </div>
    </div>
  );
};

export default WikiView;
