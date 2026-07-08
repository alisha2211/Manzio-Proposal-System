const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const { logActivity } = require("../utils/logger");
const { saveBase64File } = require("../utils/fileUpload");

const JWT_SECRET = process.env.JWT_SECRET || 'manzio_super_secret_jwt_key_2026';

async function login(req, res) {
  try {
    const email = req.body.email?.trim();
    const password = req.body.password;

    console.log("LOGIN BODY:", req.body);

    const [rows] = await db.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = rows[0];

    // Check status
    if (user.status === 'inactive') {
      return res.status(403).json({ message: "Account is deactivated. Please contact administrator." });
    }

    console.log("USER FOUND:", user.email);

    const isMatch = await bcrypt.compare(password, user.password);

    console.log("PASSWORD MATCH:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // System Activity Log
    await logActivity(user.id, user.name, 'User Logged In', `Logged in via REST API`);

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarColor: user.avatar_color,
        avatarPath: user.avatar_path
      }
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
}

async function logout(req, res) {
  try {
    if (req.user) {
      await logActivity(req.user.id, req.user.name, 'User Logged Out', `Logged out via REST API`);
    }
  } catch (e) {
    console.warn('Logout log failed:', e.message);
  }
  res.json({ success: true, message: "Logout successful" });
}

async function me(req, res) {
  try {
    const [rows] = await db.execute(
      "SELECT id, name, email, role, avatar_color, avatar_path FROM users WHERE id = ?",
      [req.user.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    const user = rows[0];
    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarColor: user.avatar_color,
        avatarPath: user.avatar_path
      }
    });
  } catch (err) {
    console.error("ME ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
}

async function updateProfile(req, res) {
  const { name, email, avatarColor, avatarData } = req.body;
  if (!name || !email) {
    return res.status(400).json({ success: false, message: "Name and email are required" });
  }
  try {
    let avatarPath = null;
    if (avatarData) {
      avatarPath = saveBase64File(avatarData, 'avatar');
    }

    let query, params;
    if (avatarPath) {
      query = 'UPDATE users SET name = ?, email = ?, avatar_color = ?, avatar_path = ? WHERE id = ?';
      params = [name, email, avatarColor || '#5B8DEF', avatarPath, req.user.id];
    } else {
      query = 'UPDATE users SET name = ?, email = ?, avatar_color = ? WHERE id = ?';
      params = [name, email, avatarColor || '#5B8DEF', req.user.id];
    }

    await db.execute(query, params);
    await logActivity(req.user.id, name, 'Profile Updated', `Updated profile name/email`);

    const [rows] = await db.execute('SELECT id, name, email, role, avatar_color, avatar_path FROM users WHERE id = ?', [req.user.id]);
    const u = rows[0];
    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        avatarColor: u.avatar_color,
        avatarPath: u.avatar_path
      }
    });
  } catch (err) {
    console.error('update profile error:', err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ success: false, message: 'Email already in use' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

async function changePassword(req, res) {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    return res.status(400).json({ success: false, message: "Old password and new password are required" });
  }
  try {
    const [rows] = await db.execute('SELECT password, name FROM users WHERE id = ?', [req.user.id]);
    const user = rows[0];
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Incorrect current password" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await db.execute('UPDATE users SET password = ? WHERE id = ?', [hashed, req.user.id]);
    await logActivity(req.user.id, user.name, 'Password Changed', `Updated account password`);

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    console.error('change password error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

module.exports = { login, logout, me, updateProfile, changePassword };