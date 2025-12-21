const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const crypto = require('crypto');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const db = require('../config/database');
const { registerValidator, loginValidator } = require('../middleware/validators');
const { authLimiter, registerLimiter } = require('../middleware/rateLimiter');
const { sendVerificationEmail } = require('../utils/emailService');

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Register a new user
router.post('/register', registerLimiter, registerValidator, async (req, res) => {
  try {
    const { username, email, password, captchaToken } = req.body;
    
    console.log(`[REGISTER] Attempt - Username: ${username}, Email: ${email}, Time: ${new Date().toISOString()}`);

    // Verify CAPTCHA token with Google
    if (!captchaToken) {
      console.warn(`[REGISTER] CAPTCHA missing for user: ${username}`);
      return res.status(400).json({
        success: false,
        message: 'CAPTCHA verification is required'
      });
    }

    try {
      const captchaResponse = await axios.post(
        `https://www.google.com/recaptcha/api/siteverify`,
        null,
        {
          params: {
            secret: process.env.RECAPTCHA_SECRET_KEY,
            response: captchaToken
          }
        }
      );

      console.log(`[REGISTER] CAPTCHA score for ${username}: ${captchaResponse.data.score}`);

      if (!captchaResponse.data.success || captchaResponse.data.score < 0.5) {
        console.warn(`[REGISTER] CAPTCHA verification failed for ${username}, score: ${captchaResponse.data.score}`);
        return res.status(400).json({
          success: false,
          message: 'CAPTCHA verification failed. Please try again.'
        });
      }
    } catch (captchaError) {
      console.error(`[REGISTER] CAPTCHA error for ${username}:`, captchaError.message);
      return res.status(400).json({
        success: false,
        message: 'Failed to verify CAPTCHA. Please try again.'
      });
    }

    // Validation is now handled by middleware, but add extra checks here
    if (!username || !email || !password) {
      console.warn(`[REGISTER] Missing fields for user attempt`);
      return res.status(400).json({ 
        success: false, 
        message: 'Username, email, and password are required' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // For development: Auto-verify email on signup (skip email verification)
    // Insert into database - email AUTO-VERIFIED
    const insertQuery = `
      INSERT INTO users (username, email, password_hash, email_verified, verification_token, token_expiry, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      RETURNING id, username, email, created_at
    `;
    
    const result = await db.query(insertQuery, [
      username, 
      email, 
      hashedPassword, 
      true,  // email_verified = TRUE (auto-verified)
      null,  // no verification token needed
      null   // no token expiry needed
    ]);
    
    const user = result.rows[0];
    console.log(`[REGISTER] ✅ User created successfully - ID: ${user.id}, Username: ${username}`);
    console.log(`[REGISTER] Email auto-verified on signup`);

    // Auto-login after registration (email is auto-verified)
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log(`[REGISTER] ✅ Registration complete for ${username} at ${new Date().toISOString()}`);
    
    return res.status(201).json({
      success: true,
      message: 'Registration successful. Please set up 2FA.',
      token: token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    console.error(`[REGISTER] ❌ Error for ${req.body.username || 'unknown'}: ${error.message}`);
    console.error(`[REGISTER] Stack trace:`, error.stack);
    
    // Handle duplicate username/email
    if (error.code === '23505') {
      console.warn(`[REGISTER] Duplicate username/email: ${req.body.email}`);
      return res.status(400).json({
        success: false,
        message: 'Username or email already exists'
      });
    }
    
    // Log all database errors
    if (error.code) {
      console.error(`[REGISTER] Database error code: ${error.code}`);
    }
    
    return res.status(500).json({
      success: false,
      message: 'Registration failed. Please try again later.'
    });
  }
});

// Verify email
router.get('/verify-email', async (req, res, next) => {
  try {
    // Extract token from query parameters
    const { token } = req.query;

    // Validate token is provided
    if (!token) {
      return res.status(400).json({
        success: false,
        error: 'Verification token is required'
      });
    }

    // Query database to find user with verification token
    let result;
    try {
      result = await db.query(
        'SELECT id, email, username, verification_token, token_expiry, email_verified FROM users WHERE verification_token = $1',
        [token]
      );
    } catch (dbError) {
      console.error('Database error finding user by verification token:', dbError);
      return res.status(500).json({
        success: false,
        error: 'Failed to verify email. Please try again.'
      });
    }

    // Check if user found
    if (result.rows.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired verification token'
      });
    }

    const user = result.rows[0];

    // Check if email already verified
    if (user.email_verified) {
      return res.status(400).json({
        success: false,
        error: 'Email has already been verified'
      });
    }

    // Check if token expired
    if (!user.token_expiry) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired verification token'
      });
    }

    const now = new Date();
    const expiryDate = new Date(user.token_expiry);

    if (now > expiryDate) {
      return res.status(400).json({
        success: false,
        error: 'Verification link has expired. Please request a new one.'
      });
    }

    // Update user: set email_verified = true, clear verification_token and token_expiry
    try {
      await db.query(
        'UPDATE users SET email_verified = true, verification_token = NULL, token_expiry = NULL WHERE id = $1',
        [user.id]
      );
    } catch (dbError) {
      console.error('Database error updating email verification:', dbError);
      return res.status(500).json({
        success: false,
        error: 'Failed to verify email. Please try again.'
      });
    }

    // Generate JWT token for auto-login
    const loginToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return success response with login token
    res.status(200).json({
      success: true,
      message: 'Email verified successfully! You are now logged in.',
      token: loginToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Email verification error:', error);
    next(error);
  }
});

// Login user
router.post('/login', authLimiter, loginValidator, async (req, res, next) => {
  try {
    const { email, password } = req.body;

    console.log(`[LOGIN] Attempt - Email: ${email}, Time: ${new Date().toISOString()}`);

    // Validation
    if (!email || !password) {
      console.warn(`[LOGIN] Missing credentials for ${email}`);
      return res.status(400).json({ 
        error: 'Email and password are required' 
      });
    }

    // TEST USER - For immediate testing without database
    if (email === 'alex@test.com' && password === '123@123@') {
      console.log(`[LOGIN] ✅ Test user logged in: ${email}`);
      const token = jwt.sign(
        { userId: 999, email: 'alex@test.com' },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.json({
        message: 'Login successful',
        token,
        user: {
          id: 999,
          username: 'alex',
          email: 'alex@test.com'
        }
      });
    }

    // Find user by email
    const result = await db.query(
      'SELECT id, username, email, password_hash, email_verified FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      console.warn(`[LOGIN] User not found: ${email}`);
      return res.status(401).json({ 
        error: 'Invalid email or password' 
      });
    }

    const user = result.rows[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      console.warn(`[LOGIN] Invalid password for user: ${email}`);
      return res.status(401).json({ 
        error: 'Invalid email or password' 
      });
    }

    // Check if email is verified
    if (!user.email_verified) {
      console.warn(`[LOGIN] Email not verified for user: ${email}`);
      return res.status(403).json({
        success: false,
        error: 'Please verify your email before logging in. Check your inbox for the verification link.'
      });
    }

    // Check if user has 2FA enabled
    const userWithTwoFa = await db.query(
      'SELECT two_fa_enabled FROM users WHERE id = $1',
      [user.id]
    );

    if (!userWithTwoFa.rows[0].two_fa_enabled) {
      console.warn(`[LOGIN] 2FA not enabled for user: ${email} - forcing 2FA setup`);
      return res.status(403).json({
        success: false,
        requiresSetup2FA: true,
        message: 'Two-factor authentication is required for your account security',
        userId: user.id,
        username: user.username,
        email: user.email
      });
    }

    // 2FA is enabled - require 2FA verification before issuing token
    console.log(`[LOGIN] 2FA enabled for user ${email} - prompting for verification`);
    res.json({
      success: true,
      message: 'Password verified. Please provide your 2FA code.',
      requiresTwoFA: true,
      userId: user.id,
      email: user.email,
      username: user.username
    });
  } catch (error) {
    console.error('Login error:', error);
    next(error);
  }
});

// Verify token
router.get('/verify', async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'No token provided' 
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Optionally verify user still exists in database
      const result = await db.query(
        'SELECT id, username, email FROM users WHERE id = $1',
        [decoded.userId]
      );

      if (result.rows.length === 0) {
        return res.status(401).json({ 
          error: 'User not found' 
        });
      }

      res.json({
        valid: true,
        user: result.rows[0]
      });
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          error: 'Token expired',
          valid: false 
        });
      }
      if (jwtError.name === 'JsonWebTokenError') {
        return res.status(401).json({ 
          error: 'Invalid token',
          valid: false 
        });
      }
      throw jwtError;
    }
  } catch (error) {
    console.error('Token verification error:', error);
    next(error);
  }
});

// Setup 2FA - Generate secret and QR code
router.get('/setup-2fa', verifyToken, async (req, res) => {
  try {
    // Generate secret
    const secret = speakeasy.generateSecret({
      name: `CyberGuard Academy (${req.userId})`,
      issuer: 'CyberGuard Academy',
      length: 32
    });

    // Generate QR code
    const qrCode = await QRCode.toDataURL(secret.otpauth_url);

    // Generate backup codes
    const backupCodes = [];
    for (let i = 0; i < 10; i++) {
      backupCodes.push(crypto.randomBytes(4).toString('hex').toUpperCase());
    }

    // Store in session temporarily (don't save to DB yet - user needs to verify)
    res.json({
      qrCode,
      secret: secret.base32,
      backupCodes
    });
  } catch (error) {
    console.error('Setup 2FA error:', error);
    res.status(500).json({ error: 'Failed to setup 2FA' });
  }
});

// Verify 2FA setup
router.post('/verify-2fa', verifyToken, async (req, res) => {
  try {
    const { verificationCode, secret } = req.body;

    if (!verificationCode || !secret) {
      return res.status(400).json({ error: 'Verification code and secret required' });
    }

    // Verify the code
    const isValid = speakeasy.totp.verify({
      secret: secret,
      encoding: 'base32',
      token: verificationCode,
      window: 2
    });

    if (!isValid) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }

    // Generate backup codes
    const backupCodes = [];
    for (let i = 0; i < 10; i++) {
      backupCodes.push(crypto.randomBytes(4).toString('hex').toUpperCase());
    }

    // Save 2FA secret and backup codes to database
    const backupCodesJson = JSON.stringify(backupCodes);
    await db.query(
      'UPDATE users SET two_fa_secret = $1, two_fa_backup_codes = $2, two_fa_enabled = true WHERE id = $3',
      [secret, backupCodesJson, req.userId]
    );

    res.json({
      message: '2FA enabled successfully',
      backupCodes
    });
  } catch (error) {
    console.error('Verify 2FA error:', error);
    res.status(500).json({ error: 'Failed to verify 2FA' });
  }
});

// Login with 2FA verification
router.post('/verify-2fa-login', async (req, res) => {
  try {
    const { userId, verificationCode, isRecovery } = req.body;

    console.log(`[2FA-LOGIN] Verification attempt - User ID: ${userId}, Is Recovery: ${isRecovery}, Time: ${new Date().toISOString()}`);

    if (!userId || !verificationCode) {
      console.warn(`[2FA-LOGIN] Missing parameters - User ID: ${userId}, Code provided: ${!!verificationCode}`);
      return res.status(400).json({ error: 'User ID and verification code required' });
    }

    // Get user's 2FA secret
    const result = await db.query(
      'SELECT id, username, email, two_fa_secret, two_fa_backup_codes FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      console.warn(`[2FA-LOGIN] Invalid user - User ID: ${userId}`);
      return res.status(401).json({ error: 'Invalid user' });
    }

    const user = result.rows[0];

    // Try to verify with TOTP
    const isValidTotp = speakeasy.totp.verify({
      secret: user.two_fa_secret,
      encoding: 'base32',
      token: verificationCode,
      window: 2
    });

    if (isValidTotp) {
      // Valid TOTP code - generate login token
      console.log(`[2FA-LOGIN] ✅ Valid TOTP code for user ID: ${userId}`);
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.json({
        message: '2FA verification successful',
        success: true,
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      });
    }

    // Try backup codes
    const backupCodes = JSON.parse(user.two_fa_backup_codes || '[]');
    const codeIndex = backupCodes.indexOf(verificationCode.toUpperCase());

    if (codeIndex !== -1) {
      // Valid backup code - remove it and generate login token
      console.log(`[2FA-LOGIN] ✅ Valid backup code used for user ID: ${userId}, remaining codes: ${backupCodes.length - 1}`);
      backupCodes.splice(codeIndex, 1);
      
      await db.query(
        'UPDATE users SET two_fa_backup_codes = $1 WHERE id = $2',
        [JSON.stringify(backupCodes), userId]
      );

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.json({
        message: '2FA verification successful (backup code used)',
        success: true,
        token,
        remainingBackupCodes: backupCodes.length,
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      });
    }

    console.warn(`[2FA-LOGIN] Invalid verification code for user ID: ${userId}`);
    res.status(401).json({ error: 'Invalid verification code or backup code' });
  } catch (error) {
    console.error('2FA login verification error:', error);
    res.status(500).json({ error: 'Failed to verify 2FA' });
  }
});

// Recover account with 2FA code when password is forgotten
router.post('/recover-account', async (req, res) => {
  try {
    const { email, verificationCode, newPassword } = req.body;

    console.log(`[ACCOUNT-RECOVERY] Attempt - Email: ${email}, Time: ${new Date().toISOString()}`);

    if (!email || !verificationCode || !newPassword) {
      console.warn(`[ACCOUNT-RECOVERY] Missing parameters for ${email}`);
      return res.status(400).json({ error: 'Email, verification code, and new password are required' });
    }

    // Find user by email
    const userResult = await db.query(
      'SELECT id, username, two_fa_secret, two_fa_backup_codes, two_fa_enabled FROM users WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      console.warn(`[ACCOUNT-RECOVERY] User not found: ${email}`);
      return res.status(401).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];

    if (!user.two_fa_enabled) {
      console.warn(`[ACCOUNT-RECOVERY] 2FA not enabled for user: ${email}`);
      return res.status(403).json({ error: '2FA is required for account recovery' });
    }

    // Verify the code is either valid TOTP or valid backup code
    const isValidTotp = speakeasy.totp.verify({
      secret: user.two_fa_secret,
      encoding: 'base32',
      token: verificationCode,
      window: 2
    });

    let isValidBackupCode = false;
    let backupCodes = JSON.parse(user.two_fa_backup_codes || '[]');
    const codeIndex = backupCodes.indexOf(verificationCode.toUpperCase());
    
    if (codeIndex !== -1) {
      isValidBackupCode = true;
      // Remove used backup code
      backupCodes.splice(codeIndex, 1);
    }

    if (!isValidTotp && !isValidBackupCode) {
      console.warn(`[ACCOUNT-RECOVERY] Invalid verification code for ${email}`);
      return res.status(401).json({ error: 'Invalid 2FA code or backup code' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and backup codes if backup code was used
    const updateQuery = isValidBackupCode
      ? 'UPDATE users SET password_hash = $1, two_fa_backup_codes = $2 WHERE id = $3'
      : 'UPDATE users SET password_hash = $1 WHERE id = $2';

    if (isValidBackupCode) {
      await db.query(updateQuery, [hashedPassword, JSON.stringify(backupCodes), user.id]);
    } else {
      await db.query(updateQuery, [hashedPassword, user.id]);
    }

    console.log(`[ACCOUNT-RECOVERY] ✅ Password reset for user ${email}`);

    // Generate login token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Password reset successful. You are now logged in.',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Account recovery error:', error);
    res.status(500).json({ error: 'Failed to recover account' });
  }
});

module.exports = router;

