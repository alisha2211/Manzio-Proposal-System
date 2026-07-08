const db = require('../config/db');

// GET /api/clients
async function list(req, res) {
  try {
    const [rows] = await db.execute('SELECT * FROM clients ORDER BY name');
    const shaped = rows.map(r => ({
      id: String(r.id), name: r.name, contact: r.contact, email: r.email,
      phone: r.phone, address: r.address, industry: r.industry,
      proposalsCount: r.proposals_count, notes: r.notes,
    }));
    res.json({ success: true, data: shaped });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

// GET /api/clients/:id
async function getOne(req, res) {
  try {
    const [rows] = await db.execute('SELECT * FROM clients WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Client not found' });
    const r = rows[0];
    res.json({ success: true, data: {
      id: r.id, name: r.name, contact: r.contact, email: r.email,
      phone: r.phone, address: r.address, industry: r.industry,
      proposalsCount: r.proposals_count, notes: r.notes,
    }});
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

// POST /api/clients
async function create(req, res) {
  const c = req.body;
  const id = c.id || `c-${Math.floor(Math.random() * 90000000 + 10000000)}`;
  try {
    await db.execute(
      `INSERT INTO clients (id, name, contact, email, phone, address, industry, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        c.name,
        c.contact || null,
        c.email || null,
        c.phone || null,
        c.address || null,
        c.industry || null,
        c.notes || null
      ]
    );
    const [rows] = await db.execute('SELECT * FROM clients WHERE id = ?', [id]);

    // Create notification
    try {
      await db.execute(
        "INSERT INTO notifications (id, type, title, message, time, `read`, link) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [`n-${Date.now()}`, 'client_added', 'Client Added', `New client "${c.name}" was added by ${req.user.name}`, 'Just now', 0, `/clients/${id}`]
      );
    } catch (errNotif) {
      console.error('Failed to create client notification:', errNotif.message);
    }

    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    console.error('create client error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

// PUT /api/clients/:id
async function update(req, res) {
  const c = req.body;
  const { id } = req.params;
  try {
    await db.execute(
      `UPDATE clients SET name = ?, contact = ?, email = ?, phone = ?, address = ?, industry = ?, notes = ?
       WHERE id = ?`,
      [
        c.name,
        c.contact || null,
        c.email || null,
        c.phone || null,
        c.address || null,
        c.industry || null,
        c.notes || null,
        id
      ]
    );
    const [rows] = await db.execute('SELECT * FROM clients WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }
    const r = rows[0];
    res.json({ success: true, data: {
      id: String(r.id), name: r.name, contact: r.contact, email: r.email,
      phone: r.phone, address: r.address, industry: r.industry,
      proposalsCount: r.proposals_count, notes: r.notes,
    }});
  } catch (err) {
    console.error('update client error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

// DELETE /api/clients/:id
async function remove(req, res) {
  const { id } = req.params;
  try {
    await db.execute('DELETE FROM clients WHERE id = ?', [id]);
    res.json({ success: true, message: 'Client deleted successfully' });
  } catch (err) {
    console.error('delete client error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

module.exports = { list, getOne, create, update, remove };
