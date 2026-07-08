const db = require('../config/db');
const { logActivity } = require('../utils/logger');

// GET /api/templates
async function list(req, res) {
  try {
    const [rows] = await db.execute('SELECT * FROM templates ORDER BY name');
    const shaped = rows.map(r => ({
      id: r.id,
      name: r.name,
      service: r.service,
      uses: r.uses,
      status: r.status,
      updatedAt: r.updated_at
    }));
    res.json({ success: true, data: shaped });
  } catch (err) {
    console.error('list templates error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

// POST /api/templates
async function create(req, res) {
  const { name, service } = req.body;
  if (!name || !service) {
    return res.status(400).json({ success: false, message: 'Name and service are required' });
  }
  const id = `t-${Date.now().toString().slice(-4)}`;
  const stamp = new Date().toISOString().slice(0, 10);
  try {
    await db.execute(
      'INSERT INTO templates (id, name, service, uses, status, updated_at) VALUES (?, ?, ?, 0, \'active\', ?)',
      [id, name, service, stamp]
    );

    await logActivity(req.user.id, req.user.name, 'Template Created', `Created template "${name}"`);

    res.status(201).json({ success: true, data: { id, name, service, uses: 0, status: 'active', updatedAt: stamp } });
  } catch (err) {
    console.error('create template error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

// PUT /api/templates/:id
async function update(req, res) {
  const { name, service } = req.body;
  const { id } = req.params;
  const stamp = new Date().toISOString().slice(0, 10);
  try {
    await db.execute(
      'UPDATE templates SET name = ?, service = ?, updated_at = ? WHERE id = ?',
      [name, service, stamp, id]
    );

    await logActivity(req.user.id, req.user.name, 'Template Updated', `Updated template "${name}"`);

    res.json({ success: true, data: { id, name, service, updatedAt: stamp } });
  } catch (err) {
    console.error('update template error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

// DELETE /api/templates/:id
async function remove(req, res) {
  const { id } = req.params;
  try {
    const [tempRows] = await db.execute('SELECT name FROM templates WHERE id = ?', [id]);
    if (tempRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Template not found' });
    }
    const name = tempRows[0].name;

    await db.execute('DELETE FROM templates WHERE id = ?', [id]);

    await logActivity(req.user.id, req.user.name, 'Template Deleted', `Deleted template "${name}"`);

    res.json({ success: true, message: 'Template deleted' });
  } catch (err) {
    console.error('delete template error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

// PATCH /api/templates/:id/activate
async function activate(req, res) {
  const { id } = req.params;
  const { status } = req.body;
  const activeStatus = status || 'active';
  try {
    const [tempRows] = await db.execute('SELECT name FROM templates WHERE id = ?', [id]);
    if (tempRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Template not found' });
    }
    const name = tempRows[0].name;

    await db.execute('UPDATE templates SET status = ? WHERE id = ?', [activeStatus, id]);

    await logActivity(req.user.id, req.user.name, 'Template Status Updated', `Updated status of template "${name}" to ${activeStatus}`);

    res.json({ success: true, message: `Template status updated to ${activeStatus}` });
  } catch (err) {
    console.error('activate template error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

module.exports = { list, create, update, remove, activate };
