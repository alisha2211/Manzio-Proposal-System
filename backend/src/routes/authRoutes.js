const express = require('express');
const router  = express.Router();
const { login, logout, me, updateProfile, changePassword } = require('../controllers/authController');
const { verifyToken }       = require('../middleware/auth');

router.post('/login',  login);
router.post('/logout', logout);
router.get('/me',      verifyToken, me);
router.put('/profile', verifyToken, updateProfile);
router.put('/change-password', verifyToken, changePassword);

module.exports = router;