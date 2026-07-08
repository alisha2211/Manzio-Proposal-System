const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/userController');
const { verifyToken, requireRole } = require('../middleware/auth');

// require management or admin to list all users
router.get('/', verifyToken, requireRole('admin', 'management'), ctrl.list);

// require admin to create, edit, delete, status change a user
router.post('/', verifyToken, requireRole('admin'), ctrl.create);
router.put('/:id', verifyToken, requireRole('admin'), ctrl.update);
router.delete('/:id', verifyToken, requireRole('admin'), ctrl.remove);
router.patch('/:id/status', verifyToken, requireRole('admin'), ctrl.updateStatus);

module.exports = router;
