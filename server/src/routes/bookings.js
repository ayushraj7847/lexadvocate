const express = require('express');
const {
  createBooking,
  getMyBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
} = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');

const router = express.Router();

router.post('/', protect, authorize('client'), createBooking);
router.get('/my', protect, getMyBookings);
router.get('/:id', protect, getBookingById);
router.patch('/:id/status', protect, authorize('advocate'), updateBookingStatus);
router.patch('/:id/cancel', protect, authorize('client'), cancelBooking);

module.exports = router;
