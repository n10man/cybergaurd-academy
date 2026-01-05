const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../config/database');

// Middleware to verify JWT token
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
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    return res.status(401).json({ error: 'Token verification failed' });
  }
};

// Get user progress
router.get('/:userId', verifyToken, async (req, res, next) => {
  try {
    const { userId } = req.params;
    const authenticatedUserId = req.userId;

    // Verify user can only access their own progress
    if (parseInt(userId) !== parseInt(authenticatedUserId)) {
      return res.status(403).json({ 
        error: 'Access denied. You can only view your own progress.' 
      });
    }

    console.log(`📥 [PROGRESS] Loading progress for user ${userId}`);

    // Get user progress
    const result = await db.query(
      'SELECT * FROM user_progress WHERE user_id = $1 ORDER BY last_updated DESC',
      [userId]
    );

    console.log(`✅ [PROGRESS] Found ${result.rows.length} progress record(s) for user ${userId}`);

    res.json({
      userId: parseInt(userId),
      progress: result.rows
    });
  } catch (error) {
    console.error('❌ [PROGRESS] Get progress error:', error);
    next(error);
  }
});

// Save user progress
router.post('/:userId', verifyToken, async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { current_level, completed_modules, badges_earned, total_points, last_position_x, last_position_y } = req.body;
    const authenticatedUserId = req.userId;

    console.log(`\n💾 [PROGRESS] Saving progress for user ${userId}:`, {
      current_level,
      completed_modules,
      total_points,
      last_position_x,
      last_position_y,
      authenticatedUserId
    });

    // Validation
    if (!userId) {
      console.log(`❌ [PROGRESS] userId is required`);
      return res.status(400).json({ 
        error: 'userId is required' 
      });
    }

    // Verify user can only save their own progress
    if (parseInt(userId) !== parseInt(authenticatedUserId)) {
      console.log(`❌ [PROGRESS] Auth check failed: ${userId} !== ${authenticatedUserId}`);
      return res.status(403).json({ 
        error: 'Access denied. You can only save your own progress.' 
      });
    }

    console.log(`✅ [PROGRESS] Auth check passed, checking for existing record...`);

    // Check if progress record exists
    const existingProgress = await db.query(
      'SELECT id FROM user_progress WHERE user_id = $1',
      [userId]
    );

    console.log(`📊 [PROGRESS] Found ${existingProgress.rows.length} existing progress record(s)`);

    let result;

    if (existingProgress.rows.length > 0) {
      console.log(`🔄 [PROGRESS] Updating existing progress record...`);
      // Update existing progress
      result = await db.query(
        `UPDATE user_progress 
         SET current_level = $1, 
             completed_modules = $2, 
             badges_earned = $3, 
             total_points = $4, 
             last_position_x = $5, 
             last_position_y = $6, 
             last_updated = CURRENT_TIMESTAMP 
         WHERE user_id = $7 
         RETURNING *`,
        [
          current_level || null,
          typeof completed_modules === 'string' ? completed_modules : JSON.stringify(completed_modules || []),
          typeof badges_earned === 'string' ? badges_earned : JSON.stringify(badges_earned || []),
          total_points || 0,
          last_position_x || null,
          last_position_y || null,
          userId
        ]
      );
    } else {
      console.log(`➕ [PROGRESS] Creating new progress record...`);
      // Insert new progress
      result = await db.query(
        `INSERT INTO user_progress 
         (user_id, current_level, completed_modules, badges_earned, total_points, last_position_x, last_position_y) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) 
         RETURNING *`,
        [
          userId,
          current_level || null,
          typeof completed_modules === 'string' ? completed_modules : JSON.stringify(completed_modules || []),
          typeof badges_earned === 'string' ? badges_earned : JSON.stringify(badges_earned || []),
          total_points || 0,
          last_position_x || null,
          last_position_y || null
        ]
      );
    }

    res.json({
      message: 'Progress saved successfully',
      progress: result.rows[0]
    });

    console.log(`✅ [PROGRESS] Progress saved successfully for user ${userId}`);
  } catch (error) {
    console.error('❌ [PROGRESS] Save progress error:', error);
    
    // Handle JSON parsing errors
    if (error.code === '22007' || error.message.includes('invalid input')) {
      return res.status(400).json({ 
        error: 'Invalid progress data format' 
      });
    }
    
    next(error);
  }
});

module.exports = router;

