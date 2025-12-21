# 2FA Implementation - Complete Testing Guide

## Prerequisites for Testing

### 1. Required Applications
- **Authenticator App**: Download one of these:
  - Google Authenticator (Android/iOS)
  - Microsoft Authenticator (Android/iOS)
  - Authy (Android/iOS/Desktop)
  - FreeOTP+ (Android)

### 2. Running the Application
```bash
# Terminal 1: Start Backend
cd server
npm start
# Should be running on http://localhost:5000

# Terminal 2: Start Frontend
cd client
npm start
# Should be running on http://localhost:3000
```

### 3. Database
- Ensure PostgreSQL is running
- Database has `users` table with 2FA columns
- Run migrations if needed

---

## Complete Test Scenarios

### Scenario 1: Fresh Registration with Mandatory 2FA Setup

**Goal**: Verify new users are forced to complete 2FA setup

**Steps**:

1. **Navigate to Registration**
   - Open `http://localhost:3000`
   - Click "Create Account"
   - Or go directly to `http://localhost:3000/register`

2. **Fill Registration Form**
   ```
   Username: testuser2025
   Email: testuser@example.com
   Password: TestPassword123!
   Confirm Password: TestPassword123!
   ```

3. **Complete CAPTCHA**
   - Check the "I'm not a robot" checkbox
   - Wait for verification to complete

4. **Submit Registration**
   - Click "Sign Up"
   - Should see success message
   - **Verify**: Automatically redirected to `/setup-2fa`

5. **Verify Mandatory 2FA**
   - **Verify**: "⚠️ Two-factor authentication is REQUIRED for security" message appears
   - **Verify**: "Skip for Now" button is NOT present
   - Only "Get Started" button available
   - Cannot proceed without completing 2FA

6. **Click "Get Started"**
   - Proceed to QR Code step

7. **Scan QR Code**
   - Open your authenticator app
   - Scan the QR code displayed
   - Or use manual entry: Copy the secret key and enter manually
   - Authenticator should now show 6-digit codes

8. **Click "I've Scanned the Code"**
   - Proceed to verification step

9. **Enter 2FA Code**
   - Look at your authenticator app
   - Enter the current 6-digit code in the input field
   - Should accept valid codes
   - Should reject invalid codes

10. **Verify 2FA Enabled**
    - Should see success screen
    - Backup codes displayed (10 codes)
    - **Verify**: Backup codes are 8-character hex codes (e.g., "A1B2C3D4")

11. **Download Backup Codes**
    - Click "Download Backup Codes"
    - File should save as `testuser2025-backup-codes.txt`
    - Open file and verify all 10 codes are present

12. **Go to Dashboard**
    - Click "Go to Dashboard"
    - Should be logged in and able to access dashboard
    - **Success**: Registration with mandatory 2FA complete!

---

### Scenario 2: Login with TOTP Code (Standard Flow)

**Goal**: Verify users can login with 6-digit authenticator codes

**Prerequisites**: 
- Have completed Scenario 1
- Have authenticator app with registered account
- Know the account credentials

**Steps**:

1. **Logout**
   - From dashboard, click profile/logout button
   - Or navigate to `/login`

2. **Go to Login Page**
   - `http://localhost:3000/login`

3. **Enter Credentials**
   ```
   Email: testuser@example.com
   Password: TestPassword123!
   ```

4. **Submit Login Form**
   - Click "Sign in"
   - **Verify**: Get message "Password verified. Please provide your 2FA code."
   - **Verify**: Redirected to 2FA verification screen (NOT dashboard)
   - See "Back" button to return to login

5. **Retrieve 2FA Code**
   - Open authenticator app
   - Find account for testuser@example.com
   - Note the 6-digit code
   - **Note**: Code changes every 30 seconds

6. **Enter 2FA Code**
   - Input the 6-digit code
   - Press Enter or click "Verify"
   - **Verify**: Code is accepted
   - **Verify**: Automatically logged in and redirected to dashboard

7. **Verify Session**
   - Check localStorage: should have valid token
   - Dashboard should be accessible
   - User info should display correctly

8. **Success**: Verified TOTP code login works!

---

### Scenario 3: Login with Backup Code

**Goal**: Verify users can login using backup codes

**Prerequisites**:
- Have completed Scenario 1
- Have saved backup codes from 2FA setup

**Steps**:

1. **Logout from Dashboard**
   - Go to login page

2. **Enter Credentials**
   ```
   Email: testuser@example.com
   Password: TestPassword123!
   ```

3. **Reach 2FA Screen**
   - Click "Sign in"
   - Reach 2FA verification screen

4. **Enter Backup Code**
   - Instead of 6-digit TOTP code, enter a backup code
   - Format: 8 uppercase hex characters (e.g., "A1B2C3D4")
   - Paste from saved backup codes
   - Click "Verify"

5. **Verify Backup Code Acceptance**
   - **Verify**: Backup code is accepted
   - **Verify**: Automatically logged in
   - **Verify**: Dashboard accessible

6. **Verify Code Was Used**
   - Logout and login again with TOTP code
   - Check console logs (if available) for message about remaining backup codes
   - Or: Try to login again with the SAME backup code
   - **Verify**: Same backup code is rejected (single-use!)

7. **Success**: Verified backup code login works and codes are single-use!

---

### Scenario 4: Password Recovery with TOTP Code

**Goal**: Verify users can reset password using 2FA code

**Prerequisites**:
- Have completed Scenario 1
- Have authenticator app with account

**Steps**:

1. **Navigate to Login**
   - `http://localhost:3000/login`

2. **Click "Forgot password?"**
   - Button in the form options
   - **Verify**: Redirected to `/password-recovery`

3. **Enter Email**
   - Email: `testuser@example.com`
   - Click "Continue"

4. **Reach 2FA Verification Step**
   - **Verify**: Message: "Enter your 2FA code or backup code to verify your identity"
   - Input field for 2FA code

5. **Enter TOTP Code**
   - Get current 6-digit code from authenticator
   - Enter it in the field
   - Click "Verify Code"

6. **Reach Password Reset Step**
   - **Verify**: Now on password creation form
   - Form shows password strength requirements
   - Requirements:
     - Uppercase letter ✓
     - Lowercase letter ✓
     - Number ✓
     - Special character (@$!%*?&) ✓
     - At least 8 characters ✓

7. **Create New Password**
   - **Try Invalid**: Enter "pass" - too short, missing requirements
   - **Verify**: "Reset Password" button is disabled
   - Enter valid password: `NewPassword123!@`
   - Check "Show password" to verify entry
   - Enter same password in confirm field

8. **Submit Password Reset**
   - Click "Reset Password"
   - **Verify**: Success screen with checkmark
   - Message: "Password reset successful. You are now logged in."

9. **Verify Auto-Login**
   - Should be automatically logged in
   - Redirected to dashboard
   - User info displayed

10. **Verify New Password Works**
    - Logout
    - Login with new password: `NewPassword123!@`
    - Should work with 2FA code

11. **Success**: Password recovery with TOTP code works!

---

### Scenario 5: Password Recovery with Backup Code

**Goal**: Verify users can reset password using backup codes

**Prerequisites**:
- Have completed Scenario 1
- Have saved backup codes

**Steps**:

1. **Navigate to Password Recovery**
   - `http://localhost:3000/password-recovery`

2. **Enter Email**
   - Email: `testuser@example.com`
   - Click "Continue"

3. **Enter Backup Code**
   - Use a backup code that hasn't been used yet
   - Enter it (8 hex characters)
   - Click "Verify Code"

4. **Create New Password**
   - Enter new password: `AnotherPassword456!`
   - Confirm it
   - Click "Reset Password"

5. **Verify Success**
   - Auto-logged in
   - Redirected to dashboard

6. **Verify Backup Code Was Consumed**
   - Logout
   - Go to password recovery again
   - Try to use the SAME backup code
   - **Verify**: Rejected with error message

7. **Verify New Password Works**
   - Logout and login with new credentials
   - Email: `testuser@example.com`
   - Password: `AnotherPassword456!`
   - Provide 2FA code when prompted

8. **Success**: Password recovery with backup code works and is single-use!

---

### Scenario 6: Existing User Without 2FA (Force Setup)

**Goal**: Verify existing users without 2FA are forced to setup

**Prerequisites**:
- Have a user account without 2FA enabled in database
- Can create this by disabling 2FA for a user in DB

**Steps**:

1. **Prepare Test User**
   - In database, set `two_fa_enabled = false` for a test user
   - Keep email/password known

2. **Login with This User**
   - Email: `legacyuser@example.com`
   - Password: `Password123!`
   - Click "Sign in"

3. **Verify Force 2FA Setup**
   - **Verify**: Instead of going to dashboard, redirected to `/setup-2fa`
   - **Verify**: Message about 2FA being required
   - Cannot proceed without completing setup

4. **Complete 2FA Setup**
   - Follow steps from Scenario 1
   - Scan QR code with authenticator
   - Verify with 6-digit code
   - Download backup codes

5. **Verify Access Granted**
   - After completion, can access dashboard
   - Next login will require 2FA code

6. **Success**: Legacy users are forced to enable 2FA on next login!

---

### Scenario 7: Edge Cases & Error Handling

#### 7A: Invalid 2FA Code During Login
**Steps**:
1. Reach 2FA login screen
2. Enter incorrect 6-digit code (e.g., "000000")
3. Click "Verify"
4. **Verify**: Error message "Invalid verification code or backup code"
5. Can try again without re-entering password

#### 7B: Wrong Email Format
**Steps**:
1. Go to password recovery
2. Enter invalid email format (e.g., "notanemail")
3. Click "Continue"
4. **Verify**: Error "Please enter a valid email address"

#### 7C: Wrong Password During Login
**Steps**:
1. Enter correct email but wrong password
2. Click "Sign in"
3. **Verify**: Error "Invalid email or password"
4. Does NOT reveal 2FA screen
5. Cannot proceed without correct password

#### 7D: Backup Code Already Used
**Steps**:
1. Use a backup code to login/recover
2. Logout/go to recovery again
3. Try to use same backup code
4. **Verify**: Error "Invalid verification code or backup code"

#### 7E: Check Remaining Backup Codes
**Steps**:
1. Use one backup code to login
2. Check browser console for logs
3. **Verify**: Message shows remaining backup codes (e.g., 9 remaining)

---

## Quick Verification Checklist

Complete all of these:

- [ ] New users CANNOT skip 2FA during registration
- [ ] Login works with 6-digit TOTP code
- [ ] Login works with 8-character backup code
- [ ] Each backup code is single-use
- [ ] Password recovery works with TOTP code
- [ ] Password recovery works with backup code
- [ ] Users without 2FA are forced to setup on login
- [ ] Invalid codes are rejected with clear error messages
- [ ] Auto-login works after password recovery
- [ ] Backup codes can be downloaded and viewed
- [ ] "Forgot password?" link works
- [ ] "Password recovery" link on 2FA login screen works
- [ ] All password requirements are enforced
- [ ] Rate limiting still applies to login attempts

---

## Logging & Debugging

### View Backend Logs
The server logs authentication events:
```
[LOGIN] Attempt - Email: user@example.com
[LOGIN] Password verified
[2FA-LOGIN] Verification attempt - User ID: 1
[2FA-LOGIN] ✅ Valid TOTP code for user ID: 1
[ACCOUNT-RECOVERY] Attempt - Email: user@example.com
```

### Check Browser Console
- Open Developer Tools (F12)
- Go to Console tab
- Look for fetch requests and responses
- Check localStorage for token and user info

### Database Verification
```sql
-- Check if 2FA is enabled for user
SELECT id, username, email, two_fa_enabled, two_fa_backup_codes 
FROM users 
WHERE email = 'testuser@example.com';

-- Count remaining backup codes
SELECT jsonb_array_length(two_fa_backup_codes) as backup_codes_count
FROM users
WHERE email = 'testuser@example.com';
```

---

## Troubleshooting During Testing

### "QR Code won't scan"
- Try manual entry instead
- Copy the secret key
- In authenticator app, select "Enter a setup key"
- Paste the secret

### "6-digit code is always invalid"
- Check authenticator app time is correct
- Code expires in 30 seconds
- Try code from next time window (wait 30 sec)
- Check TOTP secret matches QR code

### "Stuck on 2FA screen after password reset"
- Check JWT token is valid
- Clear localStorage and retry
- Check backend logs for errors

### "Backup code not working"
- Verify it's 8 characters
- Try with UPPERCASE letters
- Each code can only be used once
- Check code format (hex: 0-9, A-F)

### "User redirected to setup 2FA after login"
- This is CORRECT behavior if user doesn't have 2FA enabled
- User must complete setup to proceed
- Feature working as designed!

---

## Performance Testing

### Expected Response Times
- Login: < 500ms
- 2FA verification: < 300ms (TOTP is local)
- Backup code verification: < 300ms (10 codes max)
- Password recovery: < 500ms

### Load Testing
- Rate limiting should prevent brute force
- 10 TOTP attempts/minute is reasonable
- Backup code lookup is O(n) with n=10 (negligible)

---

## Success Criteria

✅ All 7 scenarios complete without errors  
✅ All checklist items verified  
✅ No SQL errors in logs  
✅ No JavaScript console errors  
✅ Users cannot bypass 2FA  
✅ Backup codes are single-use  
✅ Password recovery is secure  
✅ Session tokens are valid  

---

## Additional Notes

- **Development Mode**: Currently set to auto-login at landing page. Change `isDevelopment = false` in App.js to test full flow
- **CAPTCHA**: May be in test mode - works but shows warnings
- **Email**: Auto-verified in development. Remove `email_verified = true` to test actual email verification
- **Database**: Use test database, not production!

---

## Test Data Management

### Resetting for Fresh Tests
```bash
# Delete test user
DELETE FROM users WHERE email = 'testuser@example.com';

# Or update to remove 2FA
UPDATE users SET two_fa_enabled = false WHERE email = 'testuser@example.com';
```

### Creating Multiple Test Users
Create different users for different test scenarios:
- `user1@test.com` - Standard 2FA user
- `user2@test.com` - Used all backup codes
- `user3@test.com` - Never setup 2FA (to test force setup)

---

**Happy Testing! 🎉**
