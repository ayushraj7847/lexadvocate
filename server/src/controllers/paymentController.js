const Payment = require('../models/Payment');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// @desc    Get my payment history
// @route   GET /api/payments
const getMyPayments = async (req, res) => {
  try {
    const query = req.user.role === 'client' ? { client: req.user._id } : { advocate: req.user._id };
    const payments = await Payment.find(query)
      .populate('client', 'name email')
      .populate('advocate', 'name email')
      .populate('booking', 'bookingReference consultationDate')
      .sort('-createdAt');
    return successResponse(res, 200, 'Payments retrieved', { payments });
  } catch (err) {
    return errorResponse(res, 500, 'Server error');
  }
};

// @desc    Create a mock payment / checkout
// @route   POST /api/payments/checkout
const createMockCheckout = async (req, res) => {
  try {
    const { bookingId, amount, advocateId } = req.body;
    const payment = await Payment.create({
      client: req.user._id,
      advocate: advocateId,
      booking: bookingId,
      amount,
      status: 'completed',
      paymentMethod: 'mock',
      description: 'Mock payment for consultation',
    });
    return successResponse(res, 201, 'Mock payment processed', { payment, sessionUrl: null });
  } catch (err) {
    return errorResponse(res, 500, 'Server error');
  }
};

module.exports = { getMyPayments, createMockCheckout };
