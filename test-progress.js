// Quick test to check progress records in database
require('dotenv').config({ path: './server/.env' });
const db = require('./server/config/database');

async function checkProgress() {
  try {
    console.log('Checking progress records in database...\n');
    
    const result = await db.query(
      'SELECT user_id, current_level, last_position_x, last_position_y, last_updated FROM user_progress ORDER BY last_updated DESC LIMIT 5'
    );

    if (result.rows.length === 0) {
      console.log('❌ No progress records found in database');
    } else {
      console.log(`✅ Found ${result.rows.length} progress record(s):\n`);
      result.rows.forEach((row, idx) => {
        console.log(`${idx + 1}. User ID: ${row.user_id}`);
        console.log(`   Current Level: ${row.current_level}`);
        console.log(`   Position: (${row.last_position_x}, ${row.last_position_y})`);
        console.log(`   Last Updated: ${row.last_updated}\n`);
      });
    }

    // Also check how many users we have
    const usersResult = await db.query('SELECT COUNT(*) as count FROM users');
    console.log(`Total users in system: ${usersResult.rows[0].count}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkProgress();
