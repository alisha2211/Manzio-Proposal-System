const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/clientController');
const { verifyToken, requireRole } = require('../middleware/auth');

router.use(verifyToken); // require auth for all client routes

router.get('/',    ctrl.list);
router.get('/:id', ctrl.getOne);
router.post('/',   ctrl.create);
router.put('/:id',    ctrl.update);
router.delete('/:id', requireRole('admin', 'management'), ctrl.remove);

module.exports = router;
