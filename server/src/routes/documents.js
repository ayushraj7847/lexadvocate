const express = require('express');
const {
  uploadDocument,
  getMyDocuments,
  downloadDocument,
  deleteDocument,
} = require('../controllers/documentController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/upload', protect, upload.single('document'), uploadDocument);
router.get('/my', protect, getMyDocuments);
router.get('/:id/download', protect, downloadDocument);
router.delete('/:id', protect, deleteDocument);

module.exports = router;
