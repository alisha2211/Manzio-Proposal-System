const db = require('../config/db');

async function list(req, res) {
  try {
    const [rows] = await db.execute(`
      SELECT r.*, u.name AS creator_name
      FROM reports r
      LEFT JOIN users u ON r.created_by = u.id
      ORDER BY r.created_at DESC
    `);
    res.json({
      success: true,
      data: rows.map(r => ({
        id: r.id,
        name: r.name,
        type: r.type,
        createdBy: r.created_by,
        creatorName: r.creator_name || 'System',
        createdAt: r.created_at,
        data: typeof r.data === 'string' ? JSON.parse(r.data) : r.data
      }))
    });
  } catch (err) {
    console.error('list reports error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

async function create(req, res) {
  const { name, type, data } = req.body;
  if (!name || !type) {
    return res.status(400).json({ success: false, message: 'Name and type are required' });
  }
  try {
    const [result] = await db.execute(
      'INSERT INTO reports (name, type, created_by, data) VALUES (?, ?, ?, ?)',
      [name, type, req.user.id, data ? JSON.stringify(data) : null]
    );
    const newId = result.insertId;
    const [rows] = await db.execute(`
      SELECT r.*, u.name AS creator_name
      FROM reports r
      LEFT JOIN users u ON r.created_by = u.id
      WHERE r.id = ?
    `, [newId]);

    const r = rows[0];
    res.status(201).json({
      success: true,
      data: {
        id: r.id,
        name: r.name,
        type: r.type,
        createdBy: r.created_by,
        creatorName: r.creator_name || 'System',
        createdAt: r.created_at,
        data: typeof r.data === 'string' ? JSON.parse(r.data) : r.data
      }
    });
  } catch (err) {
    console.error('create report error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

async function remove(req, res) {
  const { id } = req.params;
  try {
    await db.execute('DELETE FROM reports WHERE id = ?', [id]);
    res.json({ success: true, message: 'Report deleted successfully' });
  } catch (err) {
    console.error('delete report error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

module.exports = { list, create, remove };
