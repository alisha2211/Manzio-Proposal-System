const db = require('../config/db');

async function list(req, res) {
  try {
    const [rows] = await db.execute(
      'SELECT id, user_id, user_name, action, description, created_at FROM activity_logs ORDER BY created_at DESC LIMIT 100'
    );
    res.json({
      success: true,
      data: rows.map(r => ({
        id: r.id,
        userId: r.user_id,
        userName: r.user_name,
        action: r.action,
        description: r.description,
        createdAt: r.created_at
      }))
    });
  } catch (err) {
    console.error('list activities error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

module.exports = { list };
