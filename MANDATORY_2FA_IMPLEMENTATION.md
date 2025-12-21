# Mandatory 2FA Implementation with Password Recovery

## Overview
This document describes the mandatory Two-Factor Authentication (2FA) implementation with backup code support for account recovery.

## Key Features Implemented

### 1. **Mandatory 2FA Requirement**
- **Registration Flow**: After registration, users are forced to set up 2FA before accessing the dashboard
- **Skip Button Removed**: The "Skip for Now" button has been removed from the Setup2FA page
- **Mandatory Notice**: Clear messaging that 2FA is required for account security
- **First-Time Setup**: All new users must complete 2FA setup immediately after registration

### 2. **Login with 2FA Verification**
- **Two-Step Process**:
  1. User enters email and password
  2. System validates credentials and checks if 2FA is enabled
  3. If 2FA not set up: Forces user to `/setup-2fa` route
  4. If 2FA enabled: Prompts user to enter 2FA code
  
- **2FA Code Screen**:
  - 6-digit TOTP code from authenticator app, OR
  - 8-character backup code
  - Clean, secure UI for code entry
  - Clear instructions for both code types

### 3. **Backup Codes System**
- **Generation**: 10 unique backup codes generated during 2FA setup
- **Storage**: Codes stored securely in database as JSONB
- **Single-Use**: Each backup code can only be used once
- **Tracking**: System tracks remaining backup codes
- **Download**: Users can download backup codes as a text file

### 4. **Password Recovery Using 2FA**
- **Access Without Password**: Users who forget their password can use their 2FA code or backup code to reset it
- **Three-Step Recovery Process**:
  1. Enter email address
  2. Verify identity with 2FA code or backup code
  3. Create new password with strength requirements
  4. Auto-login with new credentials

- **Available At**: `/password-recovery` route (accessible from login page)
- **Security**: New password must meet same strength requirements as registration

## Database Schema

The `users` table includes 2FA columns:
```sql
two_fa_enabled BOOLEAN DEFAULT false,
two_fa_secret VARCHAR(255),
two_fa_backup_codes JSONB DEFAULT '[]'
```

## Backend API Endpoints

### 1. POST `/api/auth/register`
**Purpose**: Register new user and auto-enable 2FA requirement
**Response**:
```json
{
  "success": true,
  "message": "Registration successful. Please set up 2FA.",
  "token": "jwt_token",
  "user": {
    "id": 1,
    "username": "user123",
    "email": "user@example.com"
  }
}
```

### 2. POST `/api/auth/login`
**Purpose**: Authenticate user with email and password
**Response (2FA Required)**:
```json
{
  "success": true,
  "message": "Password verified. Please provide your 2FA code.",
  "requiresTwoFA": true,
  "userId": 1,
  "email": "user@example.com",
  "username": "user123"
}
```

**Response (2FA Not Set Up)**:
```json
{
  "success": false,
  "requiresSetup2FA": true,
  "message": "Two-factor authentication is required for your account security",
  "userId": 1,
  "username": "user123",
  "email": "user@example.com"
}
```

### 3. POST `/api/auth/verify-2fa-login`
**Purpose**: Verify 2FA code or backup code during login
**Request**:
```json
{
  "userId": 1,
  "verificationCode": "123456"
}
```
**Response**:
```json
{
  "success": true,
  "message": "2FA verification successful",
  "token": "jwt_token",
  "remainingBackupCodes": 9,
  "user": {
    "id": 1,
    "username": "user123",
    "email": "user@example.com"
  }
}
```

### 4. POST `/api/auth/recover-account`
**Purpose**: Reset password using 2FA code or backup code
**Request**:
```json
{
  "email": "user@example.com",
  "verificationCode": "123456",
  "newPassword": "NewSecurePassword123!"
}
```
**Response**:
```json
{
  "success": true,
  "message": "Password reset successful. You are now logged in.",
  "token": "jwt_token",
  "user": {
    "id": 1,
    "username": "user123",
    "email": "user@example.com"
  }
}
```

## Frontend Components

### 1. **Register.js**
- CAPTCHA verification
- Email auto-verification
- Auto-redirect to `/setup-2fa` after registration

### 2. **Setup2FA.js** (Updated)
- **4 Steps**:
  1. Intro - Explain 2FA benefits (MANDATORY, no skip option)
  2. QR Code - Scan QR code with authenticator app
  3. Verify - Enter 6-digit code to verify setup
  4. Complete - Display and download backup codes

- **Authenticator Apps**: Google Authenticator, Microsoft Authenticator, Authy
- **Manual Entry**: Secret key available for manual entry
- **Backup Codes**: Displayed and downloadable as text file

### 3. **Login.js** (Updated)
- **Step 1**: Email and password input
- **Step 2** (if 2FA enabled): 2FA code input screen
  - Accepts 6-digit TOTP code or 8-character backup code
  - "Back" button to re-enter password
  - Link to password recovery page

- **Forgot Password Link**: Points to `/password-recovery`

### 4. **PasswordRecovery.js** (New)
- **4 Steps**:
  1. Email entry
  2. 2FA code verification
  3. New password creation with strength requirements
  4. Success screen with auto-login

- **Password Requirements**:
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character (@$!%*?&)

## User Flows

### Registration Flow
```
User Registration
    ↓
Email Auto-Verified
    ↓
Redirected to Setup2FA (MANDATORY)
    ↓
Scan QR Code
    ↓
Verify with 6-digit Code
    ↓
View & Download Backup Codes
    ↓
Access Dashboard
```

### Login Flow (with 2FA)
```
Enter Email & Password
    ↓
Password Verified
    ↓
Check if 2FA Enabled
    ↓
If No: Force Setup2FA
If Yes: Prompt 2FA Code
    ↓
Enter 6-digit TOTP or Backup Code
    ↓
Generate JWT Token
    ↓
Access Dashboard
```

### Password Recovery Flow
```
Click "Forgot Password?" on Login
    ↓
Navigate to /password-recovery
    ↓
Enter Email Address
    ↓
Enter 2FA Code or Backup Code
    ↓
Create New Password (with requirements)
    ↓
Auto-Login with New Credentials
    ↓
Access Dashboard
```

## Security Considerations

### 1. **2FA Verification**
- Time-based OTP (TOTP) with 30-second window and ±2 minute tolerance
- Uses Google Authenticator-compatible format
- 32-character base32 encoded secret

### 2. **Backup Codes**
- 10 cryptographically secure codes generated per user
- Each code is 8 hex characters (2^32 combinations)
- Single-use codes: Deleted after use
- Remaining count tracked and returned to user

### 3. **Password Requirements**
- Enforced on registration, 2FA setup, and password recovery
- Minimum 8 characters with complexity requirements
- Hashed with bcrypt (10 salt rounds)

### 4. **Rate Limiting**
- Login attempts rate-limited via `authLimiter` middleware
- Registration attempts rate-limited via `registerLimiter` middleware
- Prevents brute force attacks

### 5. **Email Verification**
- Token-based email verification on registration
- Tokens expire after 24 hours
- Email auto-verified during registration (for development/testing)

## Configuration

### Required Environment Variables
```
JWT_SECRET=your_secret_key_here
RECAPTCHA_SECRET_KEY=your_recaptcha_secret
RECAPTCHA_SITE_KEY=your_recaptcha_site_key
```

### Database
Ensure `users` table has 2FA columns (see schema.sql)

## Testing

### Test Registration → Setup 2FA → Login
1. Register new account
2. Scan QR code with Google Authenticator
3. Enter 6-digit code to verify
4. Download/save backup codes
5. Logout and test login with 2FA code

### Test Password Recovery
1. Login and note down a backup code
2. Logout
3. Click "Forgot password?" on login page
4. Enter email, then backup code
5. Create new password
6. Verify auto-login works

### Test Backup Code Usage
1. Login with 6-digit TOTP code (standard)
2. Logout
3. Login with 8-character backup code
4. Verify code is removed from remaining codes

## Files Modified/Created

### Created
- `client/src/pages/PasswordRecovery.js` - Password recovery component
- `client/src/pages/PasswordRecovery.css` - Password recovery styles

### Modified
- `server/routes/auth.js` - Updated login flow, added recovery endpoint
- `client/src/pages/Setup2FA.js` - Removed skip button, made mandatory
- `client/src/pages/Login.js` - Added 2FA verification screen
- `client/src/App.js` - Added password recovery route

## Troubleshooting

### 2FA Code Not Working
- Verify authenticator app time is synced correctly
- TOTP has 30-second window; use code within window
- Check that user has 2FA enabled (`two_fa_enabled = true`)

### Backup Code Issues
- Each backup code can only be used once
- Check code format (8 hex characters, uppercase)
- Verify backup codes stored in database

### Login Stuck on 2FA
- Check JWT token validity
- Verify userId matches user in database
- Check 2FA secret is correctly stored

## Future Enhancements

1. **Multiple Authenticator Methods**
   - SMS-based OTP
   - Email-based OTP
   - Hardware security keys

2. **Backup Code Management**
   - UI to regenerate backup codes
   - Display remaining backup code count
   - Warning when running low on codes

3. **Device Trust**
   - Remember device for 30 days
   - Skip 2FA on trusted devices
   - Device management page

4. **Audit Logging**
   - Log all 2FA setup events
   - Track successful/failed login attempts
   - Track password reset events

5. **Admin Features**
   - Force password reset for users
   - Revoke 2FA setup
   - View user authentication history
