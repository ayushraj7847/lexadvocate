const express = require('express');
const { getMyPayments, createMockCheckout } = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/my', protect, getMyPayments);
router.get('/', protect, getMyPayments);
router.post('/create-checkout', protect, createMockCheckout);
router.post('/checkout', protect, createMockCheckout);

module.exports = router;
