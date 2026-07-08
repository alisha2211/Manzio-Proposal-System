const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/proposalController');
const { verifyToken } = require('../middleware/auth');

// Public endpoints for PDF download / preview helper
router.post('/temp-pdf', ctrl.storeTempPdf);
router.get('/download-pdf/:key', ctrl.downloadTempPdf);
router.get('/download-pdf/:key/:filename', ctrl.downloadTempPdf);

router.use(verifyToken);               // All proposal routes require auth

router.get('/',           ctrl.list);
router.get('/:id',        ctrl.getOne);
router.post('/',          ctrl.create);
router.put('/:id',        ctrl.update);
router.patch('/:id/status', ctrl.updateStatus);
router.delete('/:id',     ctrl.remove);
router.post('/:id/duplicate', ctrl.duplicate);
router.post('/:id/send',      ctrl.sendProposal);

module.exports = router;