const db = require('../config/db');

/**
 * Log a system activity into the database.
 * @param {string} userId - User ID (e.g. 'u1')
 * @param {string} userName - User Name
 * @param {string} action - Action title (e.g. "Proposal Created")
 * @param {string} description - Action description or details
 */
async function logActivity(userId, userName, action, description = null) {
  try {
    await db.execute(
      'INSERT INTO activity_logs (user_id, user_name, action, description) VALUES (?, ?, ?, ?)',
      [userId || null, userName || 'System', action, description]
    );
  } catch (err) {
    console.error('Failed to write activity log:', err.message);
  }
}

module.exports = { logActivity };
