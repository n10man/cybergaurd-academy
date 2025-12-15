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
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, captchaToken } = req.body;
    
    console.log('=== Registration Attempt ===');
    console.log('Username:', username);
    console.log('Email:', email);

    // Basic validation
    if (!username || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username, email, and password are required' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Insert into database - email not verified yet
    const insertQuery = `
      INSERT INTO users (username, email, password_hash, email_verified, verification_token, token_expiry, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      RETURNING id, username, email, created_at
    `;
    
    const result = await db.query(insertQuery, [
      username, 
      email, 
      hashedPassword, 
      false,  // email_verified = false
      verificationToken,
      tokenExpiry
    ]);
    
    const user = result.rows[0];
    console.log('User created successfully:', user.id);

    // Send verification email
    try {
      await sendVerificationEmail(email, verificationToken, username);
      console.log('Verification email sent to:', email);
    } catch (emailError) {
      console.error('Error sending verification email:', emailError);
      // Don't fail registration if email fails, but log it
    }

    console.log('=== Registration Successful ===');

    return res.status(201).json({
      success: true,
      message: 'Registration successful. Please check your email to verify your account.',
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    console.error('=== Registration Error ===');
    console.error('Error message:', error.message);
    
    // Handle duplicate username/email
    if (error.code === '23505') {
      return res.status(400).json({
        success: false,
        message: 'Username or email already exists'
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Registration failed: ' + error.message
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

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required' 
      });
    }

    // Find user by email
    const result = await db.query(
      'SELECT id, username, email, password_hash, email_verified FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ 
        error: 'Invalid email or password' 
      });
    }

    const user = result.rows[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ 
        error: 'Invalid email or password' 
      });
    }

    // Check if email is verified
    if (!user.email_verified) {
      return res.status(403).json({
        success: false,
        error: 'Please verify your email before logging in. Check your inbox for the verification link.'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
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
    const { userId, verificationCode } = req.body;

    if (!userId || !verificationCode) {
      return res.status(400).json({ error: 'User ID and verification code required' });
    }

    // Get user's 2FA secret
    const result = await db.query(
      'SELECT id, two_fa_secret, two_fa_backup_codes FROM users WHERE id = $1 AND two_fa_enabled = true',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid user or 2FA not enabled' });
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
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.json({
        message: '2FA verification successful',
        token,
        user: {
          id: user.id
        }
      });
    }

    // Try backup codes
    const backupCodes = JSON.parse(user.two_fa_backup_codes || '[]');
    const codeIndex = backupCodes.indexOf(verificationCode.toUpperCase());

    if (codeIndex !== -1) {
      // Valid backup code - remove it and generate login token
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
        message: '2FA verification successful',
        token,
        user: {
          id: user.id
        }
      });
    }

    res.status(401).json({ error: 'Invalid verification code' });
  } catch (error) {
    console.error('2FA login verification error:', error);
    res.status(500).json({ error: 'Failed to verify 2FA' });
  }
});

module.exports = router;

