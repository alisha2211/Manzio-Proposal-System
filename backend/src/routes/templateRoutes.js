const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/templateController');
const { verifyToken, requireRole } = require('../middleware/auth');

router.get('/',       verifyToken, ctrl.list);
router.post('/',      verifyToken, requireRole('admin', 'management'), ctrl.create);
router.put('/:id',    verifyToken, requireRole('admin', 'management'), ctrl.update);
router.delete('/:id', verifyToken, requireRole('admin', 'management'), ctrl.remove);
router.patch('/:id/activate', verifyToken, requireRole('admin', 'management'), ctrl.activate);

module.exports = router;
