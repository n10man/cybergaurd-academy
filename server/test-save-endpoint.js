// Test the progress save endpoint manually
require('dotenv').config();
const db = require('./config/database');
const jwt = require('jsonwebtoken');

// Node 18+ has built-in fetch
const fetch = globalThis.fetch;

async function testProgressSave() {
  try {
    console.log('🧪 Testing progress save endpoint...\n');
    
    // Get a test user
    const userResult = await db.query('SELECT id FROM users LIMIT 1');
    if (userResult.rows.length === 0) {
      console.log('❌ No users found');
      process.exit(1);
    }
    
    const userId = userResult.rows[0].id;
    console.log(`📝 Using user ID: ${userId}`);
    
    // Create a JWT token
    const token = jwt.sign(
      { userId: userId },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    console.log(`🔑 Generated token: ${token.substring(0, 20)}...\n`);
    
    // Make a request to save progress
    const response = await fetch(`http://localhost:5000/api/progress/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        current_level: 'test_level',
        completed_modules: [],
        badges_earned: [],
        total_points: 100,
        last_position_x: 123.45,
        last_position_y: 67.89
      })
    }).catch(err => {
      console.error('📡 Fetch error:', err);
      throw err;
    });
    
    console.log(`📡 Response status: ${response.status}`);
    
    const data = await response.json();
    console.log(`📊 Response:`, JSON.stringify(data, null, 2));
    
    // Check if it was actually saved
    const checkResult = await db.query(
      'SELECT current_level, total_points, last_position_x FROM user_progress WHERE user_id = $1',
      [userId]
    );
    
    if (checkResult.rows.length > 0) {
      console.log(`\n✅ Progress record found in database:`, checkResult.rows[0]);
    } else {
      console.log(`\n❌ No progress record found in database!`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testProgressSave();
