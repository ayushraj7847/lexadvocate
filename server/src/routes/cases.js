const express = require('express');
const {
  createCase,
  getMyCases,
  getCaseById,
  updateCase,
  addCaseProgress,
} = require('../controllers/caseController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');

const router = express.Router();

router.post('/', protect, authorize('advocate'), createCase);
router.get('/my', protect, getMyCases);
router.get('/:id', protect, getCaseById);
router.patch('/:id', protect, authorize('advocate'), updateCase);
router.put('/:id', protect, authorize('advocate'), updateCase);
router.post('/:id/progress', protect, authorize('advocate'), addCaseProgress);

module.exports = router;
