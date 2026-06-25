const express = require('express');
const router = express.Router();

// Login – placeholder implementation (replace with real auth later)
router.post('/login', (req, res) => {
  // In a real app you would validate the user's credentials here.
  const token = 'sample-token'; // placeholder JWT
  res.json({
    success: true,
    token,
    user: {
      id: 1,
      name: 'Admin',
      email: 'admin@manzio.com',
    },
  });
});

// Logout – simple token blacklist (in‑memory for demo purposes)
router.post('/logout', (req, res) => {
  const token = req.body.token || req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(400).json({ success: false, message: 'Token required' });
  }
  if (!global.tokenBlacklist) global.tokenBlacklist = new Set();
  global.tokenBlacklist.add(token);
  res.json({ success: true, message: 'Logged out' });
});

module.exports = router;