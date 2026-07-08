const jwt = require('jsonwebtoken');
const db = require('../config/db');
const JWT_SECRET = process.env.JWT_SECRET || 'manzio_super_secret_jwt_key_2026';

/**
 * Verify JWT token from Authorization header.
 * Attaches decoded payload to req.user.
 */
async function verifyToken(req, res, next) {
  const auth = req.headers['authorization'];
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }
  const token = auth.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;

    if (!req.user.name) {
      const [rows] = await db.execute('SELECT name FROM users WHERE id = ?', [req.user.id]);
      if (rows && rows.length) {
        req.user.name = rows[0].name;
      } else {
        req.user.name = 'System';
      }
    }

    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
}

/**
 * Role guard — call after verifyToken.
 * Usage: requireRole('admin', 'manager')
 */
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Insufficient permissions' });
    }
    next();
  };
}

module.exports = { verifyToken, requireRole };
