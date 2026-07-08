const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/activityController');
const { verifyToken } = require('../middleware/auth');

router.get('/', verifyToken, ctrl.list);

module.exports = router;
