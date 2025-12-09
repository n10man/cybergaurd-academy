/**
 * Email Database for Phishing Training
 * 
 * This file contains all emails used in the training module.
 * Emails are pre-classified as SAFE or PHISHING
 * 
 * Categories:
 * - SAFE_EMAILS: Legitimate business communications
 * - PHISHING_EMAILS: Malicious phishing attempts
 */

// SAFE EMAILS - Keep these to earn points
export const SAFE_EMAILS = [
  {
    id: 1,
    from: 'john.smith@techcorp.com',
    subject: 'Q4 Budget Review - Action Required',
    preview: 'Please review and approve the Q4 budget proposal...',
    fullContent: `Hi Team,

I hope this email finds you well. Please review the attached Q4 budget proposal and provide your feedback. We need final approval by end of this week to move forward with resource allocation.

BUDGET BREAKDOWN:
├─ Marketing Department: $50,000
├─ Development Team: $120,000
├─ Operations: $35,000
└─ Contingency: $15,000
Total: $220,000

Key Points:
• Marketing team is requesting increased budget for digital campaigns
• Development needs resources for new platform development
• Operations requires infrastructure upgrades
• Budget was approved by VP on Tuesday

Please review and download the attached spreadsheet:
<a href="/files/Q4_Budget_Final.xlsx" style="color: #1E88E5; text-decoration: underline;">Q4_Budget_Final.xlsx</a>

This document contains detailed line-item allocations for each department, historical spending comparisons, and cost-saving recommendations from our finance review.

Please respond with your approval or any concerns by EOD Friday.

Questions? Feel free to reach out.

Best regards,
John Smith
Finance Manager
TechCorp Inc.
john.smith@techcorp.com
(555) 123-4567
Office: Conference Room B, Floor 3`,
    isPhishing: false,
    folder: 'inbox',
    read: false,
    redFlags: null
  },
  {
    id: 2,
    from: 'sarah.johnson@techcorp.com',
    subject: 'Project Update: Q4 Deliverables Complete',
    preview: 'Great progress! Phase 1 is complete and Phase 2 is underway...',
    fullContent: `Hi everyone,

Excellent news! The team has successfully completed Phase 1 of the Q4 project ahead of schedule. Attached is the detailed status report.

PROJECT STATUS - Q4 INITIATIVE:
═════════════════════════════════
✓ COMPLETE: Phase 1 (Requirements & Design)
  - Requirements gathering: Completed Dec 1
  - Design mockups: Approved by stakeholders
  - Documentation: 100% complete

→ IN PROGRESS: Phase 2 (Development)
  - Backend API: 60% complete
  - Frontend components: 40% complete
  - Database schema: Implemented
  - Timeline: On track for Dec 28 completion

→ PLANNED: Phase 3 (Testing & Deployment)
  - QA testing: Starts January 10
  - UAT with stakeholders: January 15-20
  - Production deployment: January 31

UPCOMING MEETINGS:
• Thursday 2pm - Project steering committee (Conference Room B)
• Friday 10am - Dev team standup (Virtual)
• Monday 3pm - Stakeholder presentation

We're requesting team leads to confirm attendance. Please <a href="https://calendar.techcorp.com/Q4Project" style="color: #1E88E5; text-decoration: underline;">click here to RSVP</a> and you'll be asked to verify your details to update your calendar.

Questions or concerns? Reach out anytime!

Best regards,
Sarah Johnson
Project Manager
sarah.johnson@techcorp.com
Extension: 3421`,
    isPhishing: false,
    folder: 'inbox',
    read: false,
    redFlags: null
  },
  {
    id: 3,
    from: 'admin@techcorp.com',
    subject: 'Important: New Security Policy & Password Reset Required',
    preview: 'All employees must reset passwords by Friday. Update required for compliance...',
    fullContent: `Subject: IMPORTANT - New Security Policy Implementation

To: All TechCorp Employees
From: IT Security Department
Date: December 8, 2024

New Password Policy - Effective Immediately

In response to recent industry security concerns, TechCorp is implementing enhanced password security requirements. ALL employees must update their passwords by Friday, December 13, 2024.

PASSWORD REQUIREMENTS:
• Minimum 12 characters
• At least one uppercase letter (A-Z)
• At least one lowercase letter (a-z)
• At least one number (0-9)
• At least one special character (!@#$%^&*)
• Cannot contain username or parts of it
• Different from last 5 passwords

HOW TO UPDATE YOUR PASSWORD:
1. Visit: https://techcorp.com/security (verify the URL in your browser!)
2. Click "Change Password" in the left menu
3. Enter your current password
4. Enter your new 12+ character password twice
5. Click "Update"

IMPORTANT REMINDERS:
✓ This is a company-wide requirement
✓ Only visit the official TechCorp domain
✓ Never share your password with anyone
✓ IT will NEVER ask for your password via email
✓ Check domain names carefully

Questions? Contact IT Helpdesk:
• Phone: ext. 5000
• Email: ithelpdesk@techcorp.com
• Portal: https://techcorp.com/support

Thank you for your cooperation!
IT Security Team`,
    isPhishing: false,
    folder: 'inbox',
    read: false,
    redFlags: null
  },
  {
    id: 4,
    from: 'hr@techcorp.com',
    subject: 'Upcoming Holiday Schedule & Time Off Requests',
    preview: 'Holiday closure dates and time-off policy for Q1 2025...',
    fullContent: `To: All Staff
Subject: Holiday Schedule & Time Off Policy

Hi Team,

As we approach the holiday season, here's important information about our office closures and time-off policies:

OFFICE CLOSURES:
• December 24-25: Christmas (Closed)
• December 31 - January 1: New Year (Closed)
• January 20: MLK Jr. Day (Closed)

TIME OFF REQUESTS:
For any time off during the holiday period, please:
1. Request through the HR Portal
2. Get approval from your direct manager
3. Ensure team coverage is arranged
4. Submit requests by December 15

WORK FROM HOME POLICY:
During this period, teams may request flexible work arrangements. Please discuss with your manager.

HOLIDAY PARTIES:
• Department Holiday Social: December 20, 4pm (Conference Room A)
• Team Building Lunch: December 22, 12pm (Off-site catering)

For questions, contact HR at hr@techcorp.com or ext. 4500.

Happy Holidays!
Human Resources Department
TechCorp Inc.`,
    isPhishing: false,
    folder: 'inbox',
    read: false,
    redFlags: null
  },
  {
    id: 7,
    from: 'marketing@techcorp.com',
    subject: 'Black Friday Campaign Results & Sales Report',
    preview: 'November campaign exceeded targets by 34%. Check detailed breakdown...',
    fullContent: `Hi Team,

Fantastic results from our Black Friday campaign! I'm excited to share the numbers with you.

CAMPAIGN PERFORMANCE:
═════════════════════════════════
Target: $500,000 in sales
Actual: $670,000 in sales
Variance: +34% (EXCEEDED GOAL!)

BREAKDOWN BY CHANNEL:
• Email marketing: $245,000 (37%)
• Social media: $185,000 (28%)
• Direct traffic: $120,000 (18%)
• Paid ads: $120,000 (17%)

TOP PRODUCTS:
1. Software Suite Bundle - $120,000
2. Professional Services - $95,000
3. Training Program - $85,000

KEY INSIGHTS:
✓ Email marketing performed exceptionally well
✓ Social media engagement up 45% YoY
✓ Conversion rate: 3.2% (industry avg: 2.1%)
✓ Customer acquisition cost: $12 (target: $15)

NEXT STEPS:
• Analyze top-performing email subject lines
• Scale successful social campaigns
• Plan Cyber Monday strategy (this week)

<a href="https://reports.techcorp.com/campaigns/blackfriday2024" style="color: #1E88E5; text-decoration: underline;">VIEW FULL CAMPAIGN REPORT</a>

Congratulations to the entire marketing team for this incredible performance!

Best regards,
Michelle Chen
Director of Marketing
michelle.chen@techcorp.com
Extension: 2847`,
    isPhishing: false,
    folder: 'starred',
    read: false,
    redFlags: null
  },
  {
    id: 13,
    from: 'recruiting@techcorp.com',
    subject: 'Congratulations! Your Referral Bonus Has Been Processed',
    preview: 'Your employee referral for the Senior Dev position was approved. Bonus payout: $2,500...',
    fullContent: `Subject: Your Referral Bonus - $2,500 Payment Processed

Hi there,

Great news! Your recent employee referral has been approved and processed!

REFERRAL DETAILS:
═════════════════════════════════
Position: Senior Developer
Referred: Alex Martinez
Hire Date: November 15, 2024
Status: HIRED ✓

BONUS INFORMATION:
Amount: $2,500
Payment Method: Direct deposit
Expected: Next paycheck (Dec 15)
Payroll Reference: REF-2024-11-156

The referred employee has completed their first 30 days and passed probation. Per our referral program, your bonus is now being processed.

REFERRAL PROGRAM DETAILS:
• You'll receive $2,500 for each hire who completes 30 days
• Maximum bonus per fiscal year: $15,000
• Available to all full-time employees
• Referrals processed monthly

REFER MORE CANDIDATES:
We're always looking for great talent! If you have any referrals, please submit them through:
Portal: careers.techcorp.com/refer
Email: recruiting@techcorp.com

Thank you for helping us grow our team!

Best regards,
Human Resources Department
TechCorp Inc.
recruiting@techcorp.com`,
    isPhishing: false,
    folder: 'starred',
    read: false,
    redFlags: null
  }
];

// PHISHING EMAILS - Delete these to earn points
export const PHISHING_EMAILS = [
  {
    id: 5,
    from: 'davidtan@company-sec.ru',
    subject: 'Senior Developer Position - Urgent Response Needed',
    preview: 'We have an exciting opportunity for a Senior Developer position. Please respond...',
    fullContent: `Hello,

We've been impressed by your professional profile and would like to invite you to interview for a Senior Developer position at our organization.

POSITION DETAILS:
═════════════════════════════════
Title: Senior Developer (Full-Stack)
Location: Remote
Salary: $150,000 - $180,000 annually
Benefits: Full benefits package, stock options, flexible hours

This is an exciting opportunity to work on cutting-edge technologies and lead a team of developers. The role involves:
• Architecture design for enterprise systems
• Full-stack development (Node.js, React, PostgreSQL)
• Team mentorship and code reviews
• Direct collaboration with C-level executives

We'd like to move quickly on this opportunity. To schedule your interview, please provide:
• Your current CV/Resume
• Salary expectations
• Your availability for the next two weeks
• LinkedIn profile URL

This is a time-sensitive opportunity and we're interviewing candidates this week.

Best regards,
David Tan
HR Recruiter
davidtan@company-sec.ru
Company Phone: +1-555-987-6543`,
    isPhishing: true,
    folder: 'inbox',
    read: false,
    redFlags: [
      '🚩 Domain "company-sec.ru" - Foreign domain (.ru)!',
      '🚩 From "davidtan@company-sec.ru" - personal name doesn\'t match professional domain',
      '🚩 Job offer feels unsolicited - no previous contact',
      '🚩 Urgency language - "time-sensitive opportunity", "this week"',
      '🚩 Asks for personal information (CV, LinkedIn, salary expectations)',
      '🚩 No company name or professional branding mentioned',
      '🚩 Generic greeting without personalization',
      '🚩 Suspicious salary offer seems too high'
    ]
  },
  {
    id: 6,
    from: 'support@amazn-security.io',
    subject: 'Account Security Alert - Suspicious Activity Detected',
    preview: 'We detected unusual login attempts on your account. Please verify immediately...',
    fullContent: `Dear Valued Customer,

Our security systems detected unusual login attempts on your account from an unfamiliar location.

ACCOUNT ALERT:
═════════════════════════════════
Date: December 9, 2024 at 3:15 AM
Location: Lagos, Nigeria
Device: Mobile Browser
Status: Account Limited

To protect your account, we need you to verify your identity:
<a href="https://amazn-security.io/verify-account" style="color: #1E88E5; text-decoration: underline;">Verify Your Account Now</a>

What you'll need:
• Email address
• Password
• Associated payment method on file

This verification should take less than 2 minutes and will restore full access to your account immediately.

If you didn't make this request, securing your account now will prevent any unauthorized activity.

Thank you,
Amazon Customer Support Team
support@amazon.com`,
    isPhishing: true,
    folder: 'starred',
    read: false,
    redFlags: [
      '🚩 Domain "amazn-security.io" - NOT amazon.com',
      '🚩 "amazn" missing the "o" - common phishing tactic',
      '🚩 Asks for passwords via email link - red flag!',
      '🚩 Geographic warning creates urgency/fear',
      '🚩 Promises quick 2-minute verification',
      '🚩 Signs as "support@amazon.com" but email from different domain'
    ]
  },
  {
    id: 8,
    from: 'paypal-security@payment-verify.net',
    subject: 'Action Required: Update Your PayPal Payment Method',
    preview: 'Your payment method has expired. Please update it to continue using PayPal...',
    fullContent: `Hello,

We're writing to inform you that the payment method on your PayPal account needs to be updated. To continue using PayPal without interruption, please update your payment information.

PAYMENT METHOD STATUS: NEEDS UPDATE
═════════════════════════════════

Your current payment method has expired or is no longer valid. This may affect:
• Your ability to send or receive payments
• Automatic payments and subscriptions
• Account functionality

To update your payment method, please visit:
<a href="http://company-sec.net/hr-portal/employee-verification" style="color: #1E88E5; text-decoration: underline;">Verify Payment Method</a>

What you'll need:
• Your PayPal login
• Current credit/debit card information
• Billing address

This update should take about 2-3 minutes and is required for account verification.

Questions? Contact us at support@paypal.com

Thank you,
PayPal Account Services
© 2024 PayPal, Inc.`,
    isPhishing: true,
    folder: 'inbox',
    read: false,
    redFlags: [
      '🚩 Domain "payment-verify.net" - NOT paypal.com',
      '🚩 Link goes to "paypal-security.io" not official PayPal',
      '🚩 PayPal doesn\'t ask for full payment details via email',
      '🚩 Real PayPal alerts go through app/website, not email',
      '🚩 Generic greeting without account holder name',
      '🚩 Sign-off mentions support@paypal.com but email from different domain'
    ]
  },
  {
    id: 10,
    from: 'noreply@secure-banking.io',
    subject: 'Important: Verify Your Account Information',
    preview: 'We need you to update your account details for security purposes...',
    fullContent: `Hello,

As part of our routine security update, we need to verify the information on file for your account. Please update your details through our secure portal.

ACCOUNT VERIFICATION REQUIRED:
═════════════════════════════════
We've received some alerts about your account and need to verify your identity.

To complete the verification process:
<a href="https://secure-banking.io/account-verify" style="color: #1E88E5; text-decoration: underline;">Verify Your Account</a>

This should take about 5 minutes. You'll need:
• Your account number
• Date of birth
• Last 4 digits of your SSN

Once verified, you'll have full access to all features. This verification is required per our security protocols.

If you have any questions, please contact our support team.

Thank you,
Account Security Team
Your Bank Name`,
    isPhishing: true,
    folder: 'starred',
    read: false,
    redFlags: [
      '🚩 Domain "secure-banking.io" - NOT real bank domain',
      '🚩 Asking for SSN digits via email link',
      '🚩 Generic greeting without personalization',
      '🚩 Real banks send alerts through their app/website',
      '🚩 Uses "security protocols" language to sound official',
      '🚩 5-minute claim to pressure quick action'
    ]
  },
  {
    id: 12,
    from: 'notifications@shiptrack-delivery.io',
    subject: 'Delivery Notification: Package Pending',
    preview: 'Your package is ready for delivery. Click to schedule your preferred time...',
    fullContent: `Hello,

We have a package coming your way! Here are the details:

SHIPMENT DETAILS:
═════════════════════════════════
Tracking Number: SHP-4829-1847-92
Expected Delivery: October 24, 2024
Carrier: Standard Express
Weight: 2.5 lbs
Status: Out for delivery today

Your package is currently out for delivery and should arrive by end of business today. If you'd like to reschedule or provide delivery instructions:

<a href="https://shiptrack-delivery.io/reschedule?tracking=SHP-4829-1847-92" style="color: #1E88E5; text-decoration: underline;">Schedule Delivery</a>

DELIVERY OPTIONS:
• Standard delivery to address on file
• Request signature upon delivery
• Leave with neighbor
• Pick up at local facility

If you have any questions about your shipment, please contact us.

Thank you,
ShipTrack Delivery Team
notifications@shiptrack-delivery.io`,
    isPhishing: true,
    folder: 'inbox',
    read: false,
    redFlags: [
      '🚩 Domain "shiptrack-delivery.io" - NOT official carrier',
      '🚩 Generic greeting without customer name',
      '🚩 Link asks to "reschedule" which collects personal info',
      '🚩 Real carriers use .com domains (ups.com, fedex.com)',
      '🚩 Professional formatting makes it look legitimate',
      '🚩 Tracking number format appears realistic'
    ]
  },
  {
    id: 14,
    from: 'security-team@microsoft-verify.io',
    subject: 'Microsoft Account: Suspicious Sign-In Activity',
    preview: 'We detected a sign-in attempt from an unfamiliar location. Please verify it\'s you...',
    fullContent: `Hello,

We noticed a new sign-in to your Microsoft account from a location you don't normally use.

SIGN-IN DETAILS:
═════════════════════════════════
Location: Moscow, Russia
Device: Chrome on Windows
Time: December 9, 2024, 3:22 AM
IP Address: 195.68.x.x

To keep your account secure, we temporarily restricted your account. 

WAS THIS YOU?

If this was you, verify your identity to restore access:
<a href="https://microsoft-verify.io/account/confirm-identity" style="color: #1E88E5; text-decoration: underline;">Confirm Your Sign-In</a>

If this wasn't you, your account may be compromised. Click the link above to:
✓ Verify it's really you
✓ Review account activity
✓ Restore full access

You have 24 hours to verify. After that, account access may be permanently restricted.

To keep your account secure:
• Never share your password via email
• Use a strong password
• Enable two-factor authentication

Microsoft Account Security Team
security-team@microsoft.com`,
    isPhishing: true,
    folder: 'inbox',
    read: false,
    redFlags: [
      '🚩 Domain "microsoft-verify.io" - NOT Microsoft official',
      '🚩 Real Microsoft domains: microsoft.com, outlook.com, live.com',
      '🚩 Generic greeting without account name',
      '🚩 Signs as "security-team@microsoft.com" but email from .io domain',
      '🚩 Suspicious location warning creates urgency',
      '🚩 "24 hours to verify" creates pressure',
      '🚩 Link goes to external domain (not microsoft.com)',
      '🚩 Real Microsoft would use their official domain for links'
    ]
  },
  {
    id: 15,
    from: 'noreply@apple-verify.net',
    subject: 'Apple ID: Unusual Activity - Please Verify',
    preview: 'We detected a sign-in from China. Verify your Apple ID to keep it secure...',
    fullContent: `Hello,

We detected a sign-in attempt to your Apple ID from an unfamiliar location.

SIGN-IN ATTEMPT:
═════════════════════════════════
Location: Beijing, China
Device: Unknown Android device
Time: December 8, 2024 at 11:47 PM UTC
IP Address: 220.248.x.x

To protect your account, we've temporarily restricted access until you verify your identity.

VERIFY YOUR IDENTITY:
<a href="https://apple-verify.net/account/confirm-identity" style="color: #1E88E5; text-decoration: underline;">Confirm Your Identity</a>

WHAT YOU'LL NEED:
• Your Apple ID email address
• Your password
• Your date of birth
• Recovery options

This verification should take about 3 minutes and will restore full access to:
✓ iCloud
✓ App Store
✓ iTunes
✓ Apple Music
✓ Find My iPhone

If this wasn't you, please verify immediately to prevent unauthorized access.

You have 24 hours to complete this verification before account restrictions apply.

Apple Security Team
support@apple.com`,
    isPhishing: true,
    folder: 'inbox',
    read: false,
    redFlags: [
      '🚩 Domain "apple-verify.net" - NOT Apple official',
      '🚩 Real Apple domain: apple.com, iCloud.com, appleid.apple.com',
      '🚩 Generic greeting without name personalization',
      '🚩 Signs as "support@apple.com" but email from .net domain',
      '🚩 Asks for password via external link (Apple never does this)',
      '🚩 Unusual location warning creates fear/urgency',
      '🚩 "24 hours" deadline pressures quick action',
      '🚩 Link goes to external domain (not apple.com)'
    ]
  },
  {
    id: 16,
    from: 'accounting@company-payment.io',
    subject: 'URGENT: Invoice Payment Due - CEO Authorization Required',
    preview: 'Invoice payment of $45,000 needs CEO authorization. Please process wire transfer immediately...',
    fullContent: `URGENT - CEO REQUEST

Hi Finance Team,

This is a time-sensitive request directly from our CEO. We need to process an urgent payment today.

WIRE TRANSFER REQUEST:
═════════════════════════════════
Amount: $45,000 USD
Vendor: TechVendor Solutions Inc.
Invoice #: INV-2024-8847
Due: TODAY (December 9)

The CEO has authorized this payment for critical infrastructure upgrades. We need this processed IMMEDIATELY.

WIRE TRANSFER DETAILS:
Bank: First Capital Bank
Account: 5479-XX-XXXXX
Routing: 021000021
Reference: INV-2024-8847

Please process this wire transfer ASAP and confirm once complete. The CEO needs confirmation by EOD.

Time is critical - please handle this as your top priority.

Important: Please do NOT discuss this with other staff until confirmed. This is a confidential matter.

Best regards,
Michael Chen
CFO Assistant
accounting@company-payment.io
Ext: 5544`,
    isPhishing: true,
    folder: 'inbox',
    read: false,
    redFlags: [
      '🚩 "CEO Authorization" - common CEO fraud/Business Email Compromise (BEC) tactic',
      '🚩 Domain "company-payment.io" - check company domain carefully',
      '🚩 Urgency and pressure: "IMMEDIATELY", "TODAY", "ASAP"',
      '🚩 Confidentiality request: "do NOT discuss with other staff" - red flag',
      '🚩 Unusual payment amount without context',
      '🚩 Generic greeting without personalization',
      '🚩 Real finance requests go through proper channels with multiple approvals',
      '🚩 Legitimate wire transfers never happen via email request'
    ]
  },
  {
    id: 17,
    from: 'compliance@tax-refund-service.io',
    subject: 'TAX REFUND PENDING - Claim Your $3,847 Refund Now',
    preview: 'You have an unclaimed tax refund of $3,847. Verify your information to receive it...',
    fullContent: `TAX REFUND NOTIFICATION

Hello,

Our records indicate that you have an UNCLAIMED TAX REFUND of $3,847 USD for the 2024 tax year!

REFUND DETAILS:
═════════════════════════════════
Refund Amount: $3,847.00
Tax Year: 2024
Status: APPROVED - PENDING CLAIM
Processing Time: 3-5 business days

To claim your refund, please verify your information and select your payment method:

<a href="https://tax-refund-service.io/claim-refund?ref=2024-847" style="color: #1E88E5; text-decoration: underline;">CLAIM YOUR TAX REFUND NOW</a>

INFORMATION REQUIRED:
• Full name
• Social Security Number (SSN)
• Date of birth
• Current address
• Bank account information (for direct deposit)

This is a limited-time offer! Your refund will be automatically processed once you complete verification.

IMPORTANT: This offer expires in 48 HOURS. Don't miss out on your tax refund!

Questions? Contact our support team at: support@tax-refund-service.io

Best regards,
IRS Tax Refund Department
compliance@tax-refund-service.io
Processing Reference: TRF-2024-84729`,
    isPhishing: true,
    folder: 'starred',
    read: false,
    redFlags: [
      '🚩 Domain "tax-refund-service.io" - NOT IRS.gov official',
      '🚩 IRS never initiates contact via email about refunds',
      '🚩 Asking for full SSN via email link - MAJOR red flag',
      '🚩 Money-related urgency: "LIMITED-TIME", "48 HOURS"',
      '🚩 Too-good-to-be-true offer: Large unexpected refund',
      '🚩 Real IRS correspondence comes by mail, not email',
      '🚩 Pressure to provide bank account information',
      '🚩 Generic greeting without personalization'
    ]
  },
  {
    id: 18,
    from: 'support@linkedin-careers.io',
    subject: 'Congratulations! You\'ve Been Selected for a Premium Job Opportunity',
    preview: 'A top employer wants to hire you. Claim your exclusive job offer before it expires...',
    fullContent: `EXCLUSIVE JOB OPPORTUNITY

Congratulations!

You have been SELECTED by a premium employer through our recruitment network for an exclusive job opportunity!

JOB OFFER DETAILS:
═════════════════════════════════
Position: Senior Business Consultant
Company: International Finance Corp
Location: Remote (Flexible)
Salary: $95,000 - $125,000 annually
Benefits: Full healthcare, 401k, flexible hours

This is an exclusive opportunity! Only 3 candidates were selected.

NEXT STEPS:
To claim this opportunity and proceed with the hiring process:

<a href="https://linkedin-careers.io/apply?offer=IFC-2024-847" style="color: #1E88E5; text-decoration: underline;">CLAIM YOUR JOB OPPORTUNITY</a>

WHAT YOU'LL NEED:
• Full legal name
• Phone number
• Email address
• Current address
• Social Security Number (for background check)
• Bank routing number (for direct deposit setup)

This exclusive offer EXPIRES IN 24 HOURS! Secure your future now.

Questions? Email our recruitment team at: careers@linkedin-careers.io

Best regards,
LinkedIn Careers Team
support@linkedin-careers.io
Offer Reference: JOB-2024-Q4-847`,
    isPhishing: true,
    folder: 'inbox',
    read: false,
    redFlags: [
      '🚩 Domain "linkedin-careers.io" - NOT linkedin.com official',
      '🚩 Unsolicited job offer - very common phishing tactic',
      '🚩 Premium opportunity language to build credibility',
      '🚩 Asking for SSN and bank routing via email link',
      '🚩 24-hour expiration creates urgency',
      '🚩 Generic greeting without personalization',
      '🚩 Real job offers come through official LinkedIn or company domain',
      '🚩 Legitimate employers don\'t request SSN in initial offer'
    ]
  }
];

/**
 * Get all emails combined
 */
export const getAllEmails = () => {
  return [...SAFE_EMAILS, ...PHISHING_EMAILS].sort((a, b) => a.id - b.id);
};

/**
 * Get summary statistics
 */
export const getEmailStats = () => {
  return {
    totalEmails: SAFE_EMAILS.length + PHISHING_EMAILS.length,
    safeEmails: SAFE_EMAILS.length,
    phishingEmails: PHISHING_EMAILS.length
  };
};
