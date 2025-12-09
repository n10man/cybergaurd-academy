# Phishing Email Training Module - Points System Guide

## Overview
The email training module includes a sophisticated points system that rewards players for correctly identifying and handling phishing emails and keeping safe emails.

## Email Lists

### Safe Emails (8 total)
These are legitimate business communications that should be kept:
1. **john.smith@techcorp.com** - Q4 Budget Review
2. **sarah.johnson@techcorp.com** - Project Update  
3. **admin@techcorp.com** - Security Policy
4. **hr@techcorp.com** - Holiday Schedule
5. **marketing@techcorp.com** - Black Friday Report
6. **david.lee@techcorp.com** - Coffee Chat Cancellation
7. **operations@techcorp.com** - Office Relocation
8. **recruiting@techcorp.com** - Referral Bonus

### Phishing Emails (5 total)
These are malicious emails attempting to steal information:
1. **support@t3chcorp-secure.com** - Fake account verification (domain spoofing)
2. **alerts@amaz0n-orders.com** - Fake Amazon alert (character substitution)
3. **security-alerts@pay-pal-verify.net** - Fake PayPal alert (wrong domain)
4. **noreply@secure-bank-alert.com** - Fake bank alert (generic domain)
5. **urgent-delivery@shiptrack-alert.net** - Fake delivery notice (suspicious domain)

## Points System Details

### Earning Points

| Action | Points | Condition |
|--------|--------|-----------|
| Keep a safe email | +10 | You correctly identified it as legitimate |
| Delete a phishing email | +10 | You correctly identified it as malicious |

### Losing Points

| Action | Points | Condition |
|--------|--------|-----------|
| Delete a safe email | -10 | You incorrectly marked it for deletion |
| Keep a phishing email | -10 | You failed to identify the threat |

### Score Limits
- **Minimum Score:** 0 (score cannot go negative)
- **Maximum Score:** 130 (8 safe × 10 + 5 phishing × 10)
- **Perfect Score:** Keep all 8 safe emails (+80) + Delete all 5 phishing (+50) = 130 points

## UI Features

### Points Badge on Emails
Each email in the inbox shows a points badge in the top-right corner:
- ✓ +10 (Green) - Positive points you can earn
- 🚫 +10 (Green) - Points for deleting phishing

### Score Board
The bottom of the Gmail interface shows:
- **Current Score:** Displayed in white text on blue background
- **Status:** Shows "✓ Email analyzed" after you review an email

## How to Use

1. **Log in** with credentials from the sticky note
2. **Browse emails** in your inbox - each shows a points indicator
3. **Click an email** to read its full content
4. **Analyze** the email for red flags:
   - Check the sender's domain
   - Look for urgency tactics
   - Verify it's actually from the company it claims
5. **Make a decision:**
   - Click "✓ Keep - This is Safe" for legitimate emails
   - Click "🚫 Delete - This is Phishing" for malicious emails
6. **Watch your score** update immediately
7. **Continue** until you've reviewed all emails

## Red Flags to Watch For

### Domain Spoofing
- Look-alike domains (amaz0n instead of amazon)
- Wrong top-level domains (.net instead of .com)
- Subdomains that don't match company (.secure-bank-alert.com vs actual bank)

### Phishing Tactics
- Artificial urgency ("24 hours", "5 days", "12 hours")
- Account threats ("Account LIMITED", "Account SUSPENDED")
- Generic greetings ("Dear Customer" vs "Dear John")
- Requests for sensitive info (passwords, SSNs, card numbers)
- Suspicious links that don't match the sender

### Legitimate Email Characteristics
- Uses company official domain
- Personalized greeting with your name
- Clear business purpose
- No requests for sensitive information
- No unusual urgency or threats
- Matches company communication style

## Data Storage

All email data is stored in `/src/data/emailData.js` with two arrays:

```javascript
export const SAFE_EMAILS = [...]   // 8 legitimate emails
export const PHISHING_EMAILS = [...] // 5 phishing emails
```

Each email object contains:
- `id` - Unique identifier
- `from` - Sender's email address
- `subject` - Email subject line
- `preview` - Short preview text
- `fullContent` - Complete email body
- `isPhishing` - Boolean flag
- `folder` - Current location (inbox/starred/bin)
- `read` - Whether user has opened it
- `redFlags` - Array of suspicious indicators (for phishing emails)

## Component Architecture

### ComputerScreen.jsx
Main component handling:
- Email display and management
- Points calculation and display
- Email folder system (inbox, starred, bin)
- User actions (keep/delete emails)

### emailData.js
Data management:
- Centralized email definitions
- Easy to add/remove emails
- Organized by category (safe/phishing)
- Red flag documentation

### ComputerScreen.css
Styling:
- Gmail-like interface
- Points badge styling
- Score board styling
- Email row layout

## Testing Checklist

- [ ] Login with correct credentials
- [ ] See all 13 emails in inbox and starred folders
- [ ] Points badges show on each email row
- [ ] Click email to open and review
- [ ] Delete button updates score for phishing (+10)
- [ ] Keep button updates score for safe emails (+10)
- [ ] Deleting safe email deducts points (-10)
- [ ] Keeping phishing email deducts points (-10)
- [ ] Score board shows live updates
- [ ] Move emails to bin folder
- [ ] Score never goes below 0

## Future Enhancements

Potential improvements:
- Drag-and-drop email actions
- Keyboard shortcuts for delete/keep
- Progress tracking (X emails reviewed)
- Difficulty levels with different email sets
- Real-time feedback on why an email is phishing
- Leaderboard/scoring history
- Mobile-responsive interface
