const db = require('../config/db');
const bcrypt = require('bcryptjs');
const { logActivity } = require('../utils/logger');

// GET /api/users  (management + admin only)
async function list(req, res) {
  try {
    const [rows] = await db.execute(
      'SELECT id, name, role, email, avatar_color, status, proposals_sent, conversion FROM users ORDER BY name'
    );
    const shaped = rows.map(r => ({
      id: r.id,
      name: r.name,
      role: r.role,
      email: r.email,
      avatarColor: r.avatar_color,
      status: r.status,
      proposalsSent: r.proposals_sent,
      conversion: r.conversion,
    }));
    res.json({ success: true, data: shaped });
  } catch (err) {
    console.error('list users error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

// POST /api/users (restricted to admin)
async function create(req, res) {
  const { name, role, email, password, avatarColor } = req.body;
  if (!name || !role || !email || !password) {
    return res.status(400).json({ success: false, message: 'All required fields must be supplied' });
  }
  const uId = `u${Date.now().toString().slice(-4)}`;
  try {
    const hashed = await bcrypt.hash(password, 10);
    await db.execute(
      `INSERT INTO users (id, name, role, email, password, avatar_color, status, proposals_sent, conversion)
       VALUES (?, ?, ?, ?, ?, ?, 'active', 0, 0)`,
      [uId, name, role, email, hashed, avatarColor || '#5B8DEF']
    );
    
    // Create system log
    await logActivity(req.user.id, req.user.name, 'User Created', `Created user ${name} (${role})`);

    const [rows] = await db.execute('SELECT id, name, role, email, avatar_color AS avatarColor, status FROM users WHERE id = ?', [uId]);

    // Create notification
    try {
      await db.execute(
        "INSERT INTO notifications (id, type, title, message, time, `read`, link) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [`n-${Date.now()}`, 'user_added', 'User Added', `New ${role === 'admin' ? 'Super Admin' : 'Manager'} "${name}" was created by ${req.user.name}`, 'Just now', 0, '/settings']
      );
    } catch (errNotif) {
      console.error('Failed to create user notification:', errNotif.message);
    }

    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    console.error('create user error:', err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

// PUT /api/users/:id (restricted to admin)
async function update(req, res) {
  const { name, role, email, password, avatarColor } = req.body;
  const { id } = req.params;
  
  if (!name || !role || !email) {
    return res.status(400).json({ success: false, message: 'Name, role and email are required' });
  }

  try {
    let query, params;
    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      query = `UPDATE users SET name = ?, role = ?, email = ?, password = ?, avatar_color = ? WHERE id = ?`;
      params = [name, role, email, hashed, avatarColor || '#5B8DEF', id];
    } else {
      query = `UPDATE users SET name = ?, role = ?, email = ?, avatar_color = ? WHERE id = ?`;
      params = [name, role, email, avatarColor || '#5B8DEF', id];
    }

    await db.execute(query, params);
    
    // Create system log
    await logActivity(req.user.id, req.user.name, 'User Updated', `Updated user details for ${name} (${role})`);

    const [rows] = await db.execute('SELECT id, name, role, email, avatar_color AS avatarColor, status FROM users WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error('update user error:', err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

// DELETE /api/users/:id (restricted to admin)
async function remove(req, res) {
  const { id } = req.params;
  try {
    // Prevent admin from deleting themselves
    if (id === req.user.id) {
      return res.status(400).json({ success: false, message: 'Cannot delete your own account' });
    }

    const [userRows] = await db.execute('SELECT name FROM users WHERE id = ?', [id]);
    if (userRows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const userName = userRows[0].name;

    await db.execute('DELETE FROM users WHERE id = ?', [id]);
    
    // Create system log
    await logActivity(req.user.id, req.user.name, 'User Deleted', `Deleted user account for ${userName}`);

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    console.error('delete user error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

// PATCH /api/users/:id/status (restricted to admin)
async function updateStatus(req, res) {
  const { status } = req.body;
  const { id } = req.params;
  if (!status) {
    return res.status(400).json({ success: false, message: 'Status is required' });
  }
  try {
    if (id === req.user.id) {
      return res.status(400).json({ success: false, message: 'Cannot change your own status' });
    }

    const [userRows] = await db.execute('SELECT name FROM users WHERE id = ?', [id]);
    if (userRows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const userName = userRows[0].name;

    await db.execute('UPDATE users SET status = ? WHERE id = ?', [status, id]);
    
    // Create system log
    await logActivity(req.user.id, req.user.name, 'User Status Updated', `Changed status of user ${userName} to ${status}`);

    res.json({ success: true, message: 'User status updated successfully' });
  } catch (err) {
    console.error('update status error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

module.exports = { list, create, update, remove, updateStatus };
