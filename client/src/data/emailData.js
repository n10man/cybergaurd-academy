// Email database with 13 unique phishing training emails
// 6 Safe emails + 7 Phishing emails with specific attack vectors

export const SAFE_EMAILS = [
  {
    id: 1,
    from: 'engineering@company.com',
    subject: 'Q4 Code Review Process Update',
    preview: 'Please review the updated PR template for Q4...',
    fullContent: `Team,

As we enter Q4, our engineering department is implementing an updated PR review process to ensure code quality and compliance with new development standards.

Please download and review the attached documents:

1. PR_Review_Template.docx - The new template all pull requests must follow starting Monday, including required fields for test coverage, security review checklist, and deployment notes.

2. Q4_Code_Standards.pdf - Updated coding standards and best practices including naming conventions, error handling requirements, and documentation standards.

Key Changes Effective December 15th:
- All PRs must include evidence of unit testing with minimum 85% coverage
- Code reviews now require at least 2 approvals from senior engineers
- Automated security scanning is now mandatory for all PRs
- API changes must include updated documentation
- Database schema changes require architecture team approval

Timeline:
- Deadline to review: Friday, December 13th
- Implementation starts: Monday, December 15th
- Q&A session: Thursday 2 PM in Conference Room B

These standards apply to all team members and are mandatory going forward. Please familiarize yourself with these guidelines and let me know if you have any questions or need clarification.

Best regards,
Engineering Team
engineering@company.com
Ext. 5432`,
    isPhishing: false,
    folder: 'inbox',
    read: false,
    category: 'Downloadable',
    attachments: [
      { name: 'PR_Review_Template.docx', size: '45 KB', type: 'document' },
      { name: 'Q4_Code_Standards.pdf', size: '128 KB', type: 'document' }
    ],
    feedbackCorrect: 'Correct! This is a legitimate internal communication from engineering@company.com. Key indicators: Uses official company domain, clear business purpose (code review process), provides downloadable documentation from trusted source, no requests for credentials or sensitive information, professional formatting with specific dates and contact information.',
    feedbackIncorrect: 'This is a legitimate email. Internal department communications from official company domains are trustworthy. When attachments contain work-related documentation and no sensitive information is requested, it is safe to open them.'
  },
  {
    id: 2,
    from: 'hr@company.com',
    subject: 'Updated HR Portal Access Information',
    preview: 'Please visit the HR Portal to update your information...',
    fullContent: `Dear Employee,

We are updating our employee information systems to ensure accurate records for benefits administration, payroll processing, and emergency contact protocols.

Action Required by December 20th:
Please visit the HR Portal to review and update the following information:

1. Emergency Contact Information - Ensure your primary and secondary emergency contacts are current
2. Benefits Preferences - Review your current health insurance, 401(k), and other benefit elections
3. Direct Deposit Information - Confirm your banking details for payroll
4. Tax Withholding (W-4) - Update if your life circumstances have changed
5. Emergency Notification Preferences - Choose how we should contact you in case of workplace emergencies

How to Access:
- Log in through the company intranet at portal.company.com
- Use your company email and network password
- The portal is available during business hours and accessible via VPN after hours
- Updates take effect immediately upon submission

Important Notes:
- This is a secure, internal-only portal verified by our IT department
- Your information is encrypted and protected by company security protocols
- You will receive a confirmation email once your changes are saved
- Incomplete profiles may affect payroll processing

If you encounter any issues accessing the portal or have questions about the information requested, please contact the HR Service Center at hr-support@company.com or extension 4100.

Thank you for keeping your information current.

Best regards,
Human Resources Department
Human Resources Team`,
    isPhishing: false,
    folder: 'inbox',
    read: false,
    category: 'Link to webpage',
    feedbackCorrect: 'Correct! This is legitimate HR communication from hr@company.com. It directs you to the internal company intranet (portal.company.com) with no urgency, no threats, clear instructions, and uses standard HR communication language. Provides verification and contact information.',
    feedbackIncorrect: 'This is a safe email from HR. It uses the official company domain, provides clear internal portal information with verification steps, and follows standard HR procedures. It includes contact information for support and explains what information is needed and why.'
  },
  {
    id: 3,
    from: 'system@company.com',
    subject: 'Scheduled System Maintenance - December 15th',
    preview: 'Systems will be down for scheduled maintenance...',
    fullContent: `Notification: Scheduled system maintenance will occur on the following date and time:

Date: December 15th, 2025
Time: 2:00 AM - 4:00 AM EST
Duration: Approximately 2 hours

Affected Systems:
- Email servers
- File storage and collaboration tools
- Time tracking and HR systems
- Development environments and repositories
- VPN access (will be unavailable)

What to Expect:
- All systems will be temporarily unavailable during the maintenance window
- You will be unable to access any company systems, including remote access via VPN
- Automated backups will not run during this period (will resume afterward)
- Mobile app access to company services may be limited

Planning Recommendations:
- Complete and save any time-sensitive work before 1:45 AM EST
- Inform clients and external partners of potential response delays
- Schedule deployments or critical work after 4:30 AM EST
- Do NOT attempt to restart systems or make changes during maintenance

Why This Maintenance?
- Security patches and updates for all systems
- Database optimization and cleanup
- Infrastructure updates to improve performance
- Compliance and security audits

Questions or Concerns?
Please contact the IT Help Desk at it-support@company.com or call extension 2500. We apologize for any inconvenience.

System Administration Team`,
    isPhishing: false,
    folder: 'inbox',
    read: false,
    category: 'Notification/Alert',
    feedbackCorrect: 'Correct! This is a legitimate system notification from system@company.com. It provides advance notice with specific dates/times, requires no action from users (just planning), contains no requests for information, and includes clear support contact details.',
    feedbackIncorrect: 'This is a legitimate notification. Proper system maintenance alerts come from company domains, provide advance notice with specific dates and times, and do not request any user actions or credentials. They explain what will be affected and how to prepare.'
  },
  {
    id: 4,
    from: 'wellness@company.com',
    subject: 'Q4 Wellness Program Enrollment is Now Open',
    preview: 'Enroll in our wellness program for exclusive benefits...',
    fullContent: `Hello Team,

We're excited to announce that our Q4 Wellness Program is now open for enrollment! This year, we've expanded our offerings to include more fitness, mental health, and nutrition resources.

Available programs:

1. Fitness Programs
- On-site gym membership with personal training sessions
- Virtual fitness classes (yoga, HIIT, pilates)
- Corporate wellness challenges with rewards
- Access to fitness apps with company discount

2. Mental Health & Wellness
- Confidential counseling sessions with licensed therapists
- Stress management and meditation workshops
- Work-life balance coaching
- Mental health awareness seminars

3. Nutrition Programs
- Personalized nutrition consultations
- Healthy eating workshops
- Subsidized healthy lunch options
- Nutritionist-led webinars

Enrollment details:
- Deadline: December 1st, 2025
- Programs start: January 1st, 2026
- Enroll through the wellness portal at wellness.company.com
- All full-time employees are eligible
- Programs are free or subsidized for all staff

Benefits of enrollment:
- Improved physical and mental health
- Team building with colleagues
- Company wellness discount (10-15% savings)
- Quarterly wellness reward points
- Certificate of completion for professional development

How to enroll:
- Visit wellness.company.com
- Log in with your company credentials
- Complete the health questionnaire (optional, helps with program matching)
- Select your desired programs
- Confirm enrollment

Questions?
Contact the Wellness Team at wellness@company.com or call us at (555) 234-5678 during business hours.

We're looking forward to supporting your health and wellness journey!

Best regards,
Wellness Team`,
    isPhishing: false,
    folder: 'inbox',
    read: false,
    category: 'Form/Survey Request',
    feedbackCorrect: 'Correct! This is a legitimate employee benefit communication from wellness@company.com. It offers optional programs with clear details, a reasonable deadline, and professional language. No threats or demands for sensitive data.',
    feedbackIncorrect: 'This is a legitimate wellness program email. It comes from an internal department offering optional benefits with reasonable timelines, clear enrollment steps, and contact information. No suspicious tactics or credential requests present.'
  },
  {
    id: 5,
    from: 'recognition@company.com',
    subject: 'You\'ve Been Recognized as Employee of the Month!',
    preview: 'Congratulations! You\'ve been nominated...',
    fullContent: `Congratulations!

You have been selected as the Employee of the Month for outstanding performance, dedication, and positive impact on your team and the company.

Reason for Recognition:
You were recognized by your team and leadership for:
- Exceptional project delivery and attention to detail
- Mentoring junior team members and sharing knowledge
- Going above and beyond to support company initiatives
- Maintaining professionalism and positive attitude
- Contributing innovative ideas to improve processes

Your Award:
- $500 gift card (choice of retailer)
- Engraved certificate recognizing your achievement
- Feature in company newsletter and internal announcement
- Reserved parking spot for one month
- $50 bonus added to your next paycheck

Celebration Details:
Your award will be presented at the next company-wide meeting.

Date: Friday, December 19th at 4:00 PM
Location: Main Conference Center, Building A
Refreshments: Yes, followed by informal celebration

What's Next:
- Your manager will contact you to discuss the award
- You will receive your gift card by December 18th
- Certificate will be presented during the meeting
- Professional photo opportunity available

We truly appreciate your contributions and look forward to celebrating your success with the team.

Best regards,
Management Team
Human Resources Department`,
    isPhishing: false,
    folder: 'inbox',
    read: false,
    category: 'Notification/Alert',
    feedbackCorrect: 'Correct! This is a legitimate recognition email from recognition@company.com. It contains specific achievement details, concrete awards, official event information, and uses internal company communication channels with no requests for personal information.',
    feedbackIncorrect: 'This is a legitimate recognition message. Internal company departments use official channels to distribute awards and recognition. It includes specific details about what you\'re being recognized for, what the award is, and when it will be presented. No malicious content or information requests.'
  },
  {
    id: 6,
    from: 'marketing@company.com',
    subject: 'Join Us for Our Annual Career Fair - Schedule Your Interview',
    preview: 'Network with industry leaders at our career fair...',
    fullContent: `We are thrilled to invite you to our Annual Career Fair 2025!

Event details:
Date: November 22nd, 2025
Time: 10:00 AM - 4:00 PM EST
Location: Convention Center, Hall B, Downtown
Admission: Free for all employees and industry professionals

What to expect:
- 50+ leading companies in tech, finance, healthcare, and consulting
- One-on-one interview sessions with company recruiters
- Networking opportunities with industry professionals
- Resume review stations with HR specialists
- Career development workshops and panels
- Free lunch and refreshments
- Career advancement opportunity showcase

Who should attend:
- Employees seeking internal transfers or promotions
- Early-career professionals looking to advance
- Anyone interested in learning about other career paths
- Students and recent graduates
- Career changers exploring new opportunities

How to schedule:
1. Visit careers.company.com
2. Browse participating companies
3. Select interview times that interest you (15-minute slots)
4. Complete your profile (name, experience, interests)
5. Receive confirmation via email

To get started, visit our career portal at https://careers.company.com where you can register and browse all participating companies.

Preparation tips:
- Bring copies of your resume (physical and digital)
- Research companies you plan to meet
- Prepare questions about roles and company culture
- Professional attire recommended
- Download the event app for schedule updates

FAQs:
Q: Can I attend if I'm not looking to change jobs?
A: Yes! The fair is also for professional development and networking.

Q: What if I have scheduling conflicts?
A: Virtual attendance options available online at careers.company.com

Q: Is there cost to attend?
A: No, admission is completely free!

For more information, visit careers.company.com or email marketing@company.com

We look forward to seeing you there!

Marketing Department
Professional Development Team`,
    isPhishing: false,
    folder: 'inbox',
    read: false,
    category: 'Link to webpage',
    feedbackCorrect: 'Correct! This is a legitimate event invitation from marketing@company.com. It provides clear event details, links to an official company domain (careers.company.com), and offers optional professional development with no pressure tactics or credential requests.',
    feedbackIncorrect: 'This is a legitimate company event. Official company marketing uses company domains for career events and does not use high-pressure tactics or urgency manipulation. It provides comprehensive details and offers multiple ways to participate.'
  }
];

export const PHISHING_EMAILS = [
  {
    id: 7,
    from: 'support@microsoft-updates.net',
    subject: 'Critical Windows Security Update - Download Required',
    preview: 'Your system needs immediate security patches...',
    fullContent: `URGENT SECURITY ALERT

Dear User,

Our systems have detected that your Windows operating system is vulnerable to critical security threats. Immediate action is required to protect your computer from malware, ransomware, and data theft.

SECURITY VULNERABILITY DETAILS:
- Threat Level: CRITICAL
- Affected Systems: Windows 7, 8, 10, 11
- Vulnerability: Zero-day exploit allowing remote code execution
- Risk: Complete system compromise, data theft, financial loss

ACTION REQUIRED IMMEDIATELY:

Download and install the security patch to protect your system:

Download the security patch (157 MB)

INSTALLATION INSTRUCTIONS:
1. Download the file using the link above
2. Close all applications and save your work
3. Run the installer as Administrator
4. Follow the on-screen prompts
5. Your system will restart to apply updates
6. Do NOT turn off your computer during installation

IMPORTANT - DO NOT DELAY:
- Hackers are actively exploiting this vulnerability
- Your personal files, photos, and financial data are at risk
- Banks and financial institutions recommend immediate patching
- Microsoft Support requires this update for continued protection

If you do not install this update, your system may be compromised within 24 hours.

Download the security patch now

This update is completely free and required for all Windows users.

Microsoft Security Team
security@microsoft-updates.net`,
    isPhishing: true,
    folder: 'inbox',
    read: false,
    category: 'Downloadable',
    attachments: [
      { name: 'WindowsSecurityPatch_v2.1.exe', size: '157 MB', type: 'executable' }
    ],
    feedbackCorrect: 'Correct! This is a phishing email. Red flags: Non-Microsoft domain (microsoft-updates.net instead of microsoft.com), requests to download and run .exe file (major malware vector), creates extreme urgency about security threats, threatens data theft and system compromise, uses fear tactics (24-hour deadline), legitimate Microsoft updates come through Windows Update, not email downloads.',
    feedbackIncorrect: 'This is phishing attempting to distribute malware. The .exe file would install malicious software. Real Microsoft security updates come through Windows Update, not email. The non-official domain (microsoft-updates.net) and urgent threat language are classic phishing tactics. Never download security patches from unsolicited emails.'
  },
  {
    id: 8,
    from: 'delivery@fedex-package-trace.com',
    subject: 'Package Delivery Failure - Action Required',
    preview: 'Your package could not be delivered...',
    fullContent: `FedEx Delivery Notice

Dear Customer,

We attempted to deliver your package on December 9th, 2025, but delivery was unsuccessful. The package is currently held at our distribution center awaiting further instructions.

Package details:
- Tracking Number: FDX-8847392047
- Status: Delivery failed - held for pickup
- Recipient: You
- Sender: Unknown
- Weight: 2.3 kg
- Contents: Electronics/Accessories

Action required:

To receive your package, you must provide additional delivery information and confirm your identity. You can confirm delivery here (http://malicious-tracker.net/fedex-confirm) to access your options.

Delivery options:
1. Schedule a new delivery attempt (Free)
2. Pick up at nearest FedEx location (Free)
3. Return to sender (Processing fee applies)

Important - urgent:
Your package will be returned to sender in 3 days if no action is taken. Update now (http://malicious-tracker.net/fedex-update) before your package is shipped back.

Once you access the portal, you will need to provide:
- Full name
- Email address
- Phone number
- Delivery address confirmation

This is a secure FedEx portal verified by our servers.

Thank you,
FedEx Customer Service
delivery@fedex-package-trace.com

FedEx Global Shipping Solutions`,
    isPhishing: true,
    folder: 'inbox',
    read: false,
    category: 'Link to webpage',
    feedbackCorrect: 'Correct! This is phishing. Red flags: Non-FedEx domain (fedex-package-trace.com instead of fedex.com), requests personal information via external link, uses urgency (3-day deadline for return), sender domain doesn\'t match legitimate FedEx, creates sense of package loss to pressure clicking, legitimate FedEx uses official domain and directs to fedex.com for tracking.',
    feedbackIncorrect: 'This is a phishing email using delivery service impersonation. The non-official domain (fedex-package-trace.com) is a red flag. FedEx never requests personal information via email links. Always go directly to fedex.com for package tracking. The urgency tactic and unfamiliar sender are classic phishing indicators.'
  },
  {
    id: 9,
    from: 'security-alert@amaz0n-account.com',
    subject: 'Your Amazon Account Has Been Compromised - Urgent Action Required',
    preview: 'Suspicious activity detected on your account...',
    fullContent: `Amazon account security alert

Dear Valued Amazon Customer,

We have detected suspicious login attempts on your Amazon account from unauthorized locations. For your protection, we have temporarily suspended access to your account until you can verify your identity.

Security incident details:
- Incident Type: Unauthorized Access Attempts
- Detection Time: December 9, 2025 2:47 PM EST
- Failed Login Attempts: 47
- Locations: China, Russia, India
- Status: Account suspended

Immediate action required:

Your Amazon account access has been restricted. To restore full account access and prevent fraudulent purchases, you must verify your account information immediately.

To proceed, please verify here:

https://amaz0n-account.com/verify-account?session=AZ94847B3C

1. Amazon account email
2. Amazon account password
3. Full name and date of birth
4. Complete billing address
5. Credit card number used for purchases
6. CVV security code
7. Phone number

Urgent - time sensitive:
Your account will remain suspended until verification is complete. All purchases are blocked and you cannot access your Prime membership, orders, or payment methods. If you do not verify within 24 hours, your account may be permanently closed.

We apologize for this inconvenience. Your quick action will help us protect your account and prevent fraudulent activity.

Amazon Security Team
security-alert@amaz0n-account.com`,
    isPhishing: true,
    folder: 'inbox',
    read: false,
    category: 'Urgency to input personal info',
    feedbackCorrect: 'Correct! This is phishing. Red flags: Fake domain (amaz0n-account.com with zero instead of letter O, instead of amazon.com), requests passwords and credit card information via email (Amazon NEVER does this), uses fear about account suspension, creates artificial urgency (24-hour deadline), requests comprehensive personal and financial data, legitimate Amazon uses amazon.com domain for all communications.',
    feedbackIncorrect: 'This is phishing attempting credential and financial data theft. The spoofed domain (amaz0n-account.com with a zero) is a red flag. Amazon never requests passwords, credit card numbers, or CVV codes via email. Real security alerts direct you to amazon.com login page directly, not external links. The urgency and account suspension threat are manipulation tactics.'
  },
  {
    id: 10,
    from: 'account-security@maybank3-alert.com',
    subject: 'Urgent Banking Alert - Verify Your Account Now',
    preview: 'Unusual activity detected on your bank account...',
    fullContent: `Maybank Account Securitate Notice - URGENTTT

Dear Valued Maybank Customero,

We have detektid unusual transaksion aktiviti on your Maybank konto. For your proteksyon and to prevento unauthorized withdrawlz, pleeeease verify your konto detailz immediatly now alreadee.

Transaksion alert detailz informacion:
- Unusual Aktiviti: Multiples foreign transaksion attemptid yesss
- Amount: RM 15,847.50 rupiahh maybbe
- Time: Desember 9, 2025 2:15 PM EST or lokol timezone
- Statuss: Blockked - Pending Verifikashun urgentlyyy

Importent - when you klik link pleeeease do makings:
- You will be redirekted securit Maybank verifikashun page to veryy fasttt
- Enter your konto numbre, userneme pasword and morreeee
- Konfirm your 6-digitt PIN kode numbre securiti safeee
- Verifee recent the transaksionz okayy dokay
- Uppdate sekuriti kwestions if needing or maybbe nott nott

Konto has been temporerily lokked for sekuriti purposez yessss. To restore akses and verifi these transaksionz are authorizd, you must kompleet konto verifikashun nao nao nao. Your konto securiti is veeeery importent so pleease verify here to akses konto nao right now immedite.

This verifikashun is requiered within 12 hourz fasttt fasttt. Failur to verify will result in biggg big konsekuenses:
- Permanente konto suspenshun maybbe maybbe
- Blockked akses to fundz moneyz cashh
- All pending transaksionz kanselled removvv removvv
- Konto klozed due to sekuriti konsernn veryy badd badd

Thanku for protektring your konto and sekuriti informacion yessss yessss. Immedite aksion requiered nao pleease do fasttt fasttt fasttt.

Maybank Sekuriti Teemm
account-security@maybank3-alert.com

Maybank Berhhad - Malayzia Finansial Servises`,
    isPhishing: true,
    folder: 'inbox',
    read: false,
    category: 'Link to webpage',
    attachments: [],
    feedbackCorrect: 'Correct! This is phishing using domain spoofing. Red flags: Sender domain (maybank3-alert.com) doesn\'t match real Maybank domain, BUT the link in the email says "http://maybank.com" when you hover over it - a classic phishing tactic where the displayed link text differs from the actual destination (the real URL would be hidden), requests banking credentials (username, password, PIN), uses urgency and threat of account closure, legitimate Maybank never requests PIN or passwords via email.',
    feedbackIncorrect: 'This is phishing with link spoofing. The email sender domain (maybank3-alert.com) is suspicious. More importantly, hovering over the link reveals the actual destination might not be the legitimate Maybank domain. Banks never request PINs, passwords, or full account credentials via email. Always manually navigate to your bank website rather than clicking email links.'
  },
  {
    id: 11,
    from: 'tanDav1d@yahoo.ru',
    subject: 'Urgent: Senior Developer Position - High Priority Review Needed',
    preview: 'Need your technical expertise on critical project...',
    fullContent: `Hello,

I am David Tan, Senior Developer at your company working on a critical, confidential project. I need your immediate technical expertise and assistance to help us complete this before the end of the year.

The project requires me to add you to the secure development repository immediately. To proceed, please reply to this email with the following information:

1. Full Name (as it appears on company records)
2. Employee ID Number
3. Direct Phone Number
4. Current Password for System Access
5. Team Department

This project has high visibility with C-level executives and requires strict confidentiality. You will be working alongside our top engineers. This is a unique opportunity to showcase your skills.

The deadline is extremely tight, and I need this information within the next 2 hours to get you added to the repository before end of business today. Due to the sensitive nature of this project, please do NOT discuss this with anyone else, including your manager.

Please confirm receipt of this email and provide the requested information as soon as possible.

Best regards,
David Tan
Senior Developer
Development Team`,
    isPhishing: true,
    folder: 'inbox',
    read: false,
    category: 'Urgency to input personal info',
    feedbackCorrect: 'Correct! This is phishing. Red flags: Non-company email address (yahoo.ru instead of company.com), requests for password via email (critical red flag - no legitimate company ever does this), extreme urgency tactic (2-hour deadline), insistence on secrecy ("don\'t tell anyone"), and impersonation of authority figure. Legitimate internal requests use official company systems.',
    feedbackIncorrect: 'This is a phishing attempt. The sender uses a personal yahoo.ru email, not a company domain. It requests passwords and credentials via email, which legitimate companies NEVER do. It also uses urgency, secrecy demands, and impersonation tactics - all classic phishing indicators.'
  },
  {
    id: 12,
    from: 'fraud-detection@citibank-secure.net',
    subject: 'Fraud Alert - Unusual Account Activity Detected',
    preview: 'We detected unauthorized transactions...',
    fullContent: `Citibank Fraud Detection Alert

Dear Citibank Customer,

Our automated fraud detection system has flagged unusual transaction activity on your Citibank credit card account. Immediate verification is required to prevent further unauthorized charges.

FRAUD ALERT DETAILS:
- Alert Time: December 9, 2025 1:43 PM EST
- Unauthorized Transactions: 3 detected
- Merchant: Unknown Foreign Vendors
- Total Charged: $4,287.63
- Card Status: TEMPORARILY BLOCKED

ACTION REQUIRED - URGENT:

To verify your identity and reactivate your card, you must download and review our secure fraud verification document:

Download your fraud report: fraud-verification-report.zip (8.7 MB)

INSTRUCTIONS:
1. Download the ZIP file
2. Extract all documents
3. Open the verification form
4. Complete all required fields
5. Email the completed form back to us
6. Your card will be reactivated within 2 hours

REQUIRED INFORMATION FOR VERIFICATION:
- Full name and date of birth
- Social Security Number
- Account number
- 16-digit card number
- Expiration date and CVV
- Current address
- Mother's maiden name
- Account PIN

Download: fraud-verification-report.zip

If you do not verify within 6 hours, your account will be permanently closed and all future transactions will be declined.

Access your fraud verification: fraud-verification-report.zip

Thank you,
Citibank Fraud Protection Team
fraud-detection@citibank-secure.net`,
    isPhishing: true,
    folder: 'inbox',
    read: false,
    category: 'Downloadable',
    attachments: [
      { name: 'fraud-verification-report.zip', size: '8.7 MB', type: 'archive' }
    ],
    feedbackCorrect: 'Correct! This is phishing. Red flags: Non-Citibank domain (citibank-secure.net instead of citibank.com), requests to download ZIP file (may contain malware), asks for complete financial data including SSN, card number, CVV, and PIN via email (banks NEVER do this), creates urgency with 6-hour deadline, legitimate banks handle fraud through secure portals or phone calls, never unsolicited email downloads.',
    feedbackIncorrect: 'This is phishing requesting financial information via email download. Banks never ask for CVV, PIN, or full card numbers via email. The non-official domain (citibank-secure.net) and ZIP file download are red flags for malware distribution. Real fraud alerts come through official banking apps or secure portals, not email attachments. Never download files from unsolicited banking emails.'
  },
  {
    id: 13,
    from: 'payroll@company-hrsystem.kp',
    subject: 'Critical Payroll System Update - New Direct Deposit Form Required',
    preview: 'All employees must submit updated banking information...',
    fullContent: `Payroll System Notification - Urgent Update

Hello Employee,

Due security upgrade of system, all employees must resubmit deposit information for banking through new secure payroll portal. This ensure uninterrupted payment for December and January pay check.

Deadline: December 10th, 2025 (Tomorrow - very important!)

What you must to do:

1. Download the form for direct deposit
2. Complete all field with your current banking details
3. Scan your ID government-issued (front and back side)
4. Email the form and ID scan back to payroll@company-hrsystem.kp

Required information needed:
- Full legal name and date birth
- Social Security Number (SSN)
- Bank name and location branch
- Full number account bank
- Bank routing number (9 digit code)
- Account type (Checking or Savings)
- Phone number of account holder

Document requirement:
- Photo ID government-issued (driver license or passport)
- Bank statement recent showing account number
- Card Social Security or document tax with SSN

Important note:
- Form is 100% secure and encrypted very much
- Your information is protection by company data security
- Processing take 24-48 hour
- You will receive confirmation email when is processed
- Incomplete submission may delay your paycheck

Download form direct deposit here: New_Direct_Deposit_Form.pdf
Email completed form to: payroll@company-hrsystem.kp

If your payroll information not updated by December 10th, your December 15th paycheck will be delayed very long time. All employee must comply with this require.

Questions? Contact Payroll Department
payroll@company-hrsystem.kp

Human Resources - Payroll Service`,
    isPhishing: true,
    folder: 'inbox',
    read: false,
    category: 'Downloadable + Urgency to input personal info',
    attachments: [
      { name: 'New_Direct_Deposit_Form.pdf', size: '2.4 MB', type: 'document' }
    ],
    feedbackCorrect: 'Correct! This is phishing. Red flags: Non-company domain (company-hrsystem.kp instead of company.com), requests complete banking information (account number, routing number, SSN), asks for scans of ID and Social Security card via email (identity theft vector), broken English and poor grammar suggesting non-native speaker or compromised account, creates urgency with deadline and threat of delayed paycheck, requests information that internal payroll systems already have, legitimate HR departments never ask for SSN or complete account details via unsolicited email.',
    feedbackIncorrect: 'This is phishing collecting personal and financial information for identity theft. The non-official domain (.kp) and requests for SSN, bank account details, and ID scans are major red flags. The broken English and poor grammar are additional indicators of a scam. Internal HR departments already have this information - they would never ask you to resubmit via email. The paycheck delay threat is artificial pressure. Legitimate payroll changes use secure internal portals or direct communication from known HR staff.'
  }
];

// Helper function to randomize email order
export const getRandomizedEmails = () => {
  const allEmails = [...SAFE_EMAILS, ...PHISHING_EMAILS];
  
  // Fisher-Yates shuffle
  for (let i = allEmails.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allEmails[i], allEmails[j]] = [allEmails[j], allEmails[i]];
  }
  
  return allEmails;
};
