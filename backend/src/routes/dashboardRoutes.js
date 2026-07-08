const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/dashboardController');
const { verifyToken } = require('../middleware/auth');

router.get('/', verifyToken, ctrl.getStats);

module.exports = router;
