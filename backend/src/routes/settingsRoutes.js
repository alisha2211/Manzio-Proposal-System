const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/settingsController');
const { verifyToken, requireRole } = require('../middleware/auth');

router.use(verifyToken);

router.get('/', ctrl.getSettings);
router.put('/', requireRole('admin'), ctrl.updateSettings);
router.post('/logo', requireRole('admin'), ctrl.uploadLogo);

module.exports = router;
