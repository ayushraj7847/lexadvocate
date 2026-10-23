const express = require('express');
const {
  getAdvocates,
  getAdvocateById,
  updateAdvocateProfile,
  getAdvocateDashboard,
  toggleSaveAdvocate,
  getSavedAdvocates,
} = require('../controllers/advocateController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/', getAdvocates);
router.get('/saved', protect, authorize('client'), getSavedAdvocates);
router.get('/me/dashboard', protect, authorize('advocate'), getAdvocateDashboard);
router.put('/profile', protect, authorize('advocate'), upload.single('profilePhoto'), updateAdvocateProfile);
router.get('/:id', getAdvocateById);
router.post('/:id/save', protect, authorize('client'), toggleSaveAdvocate);

module.exports = router;
