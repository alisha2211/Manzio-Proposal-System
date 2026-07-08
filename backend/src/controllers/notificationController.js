const db = require('../config/db');

async function list(req, res) {
  try {
    const [rows] = await db.execute('SELECT * FROM notifications ORDER BY created_at DESC');
    res.json({
      success: true,
      data: rows.map(r => ({
        id: r.id,
        type: r.type,
        title: r.title,
        message: r.message,
        time: r.time,
        read: !!r.read,
        link: r.link
      }))
    });
  } catch (err) {
    console.error('list notifications error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

async function markRead(req, res) {
  const { id } = req.params;
  try {
    await db.execute('UPDATE notifications SET `read` = 1 WHERE id = ?', [id]);
    res.json({ success: true, message: 'Notification marked as read' });
  } catch (err) {
    console.error('mark notification read error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

async function markAllRead(req, res) {
  try {
    await db.execute('UPDATE notifications SET `read` = 1');
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (err) {
    console.error('mark all notifications read error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

module.exports = { list, markRead, markAllRead };
