const ConsultationBooking = require('../models/ConsultationBooking');
const AdvocateProfile = require('../models/AdvocateProfile');
const Payment = require('../models/Payment');
const Notification = require('../models/Notification');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// @desc    Create booking
// @route   POST /api/bookings
const createBooking = async (req, res) => {
  try {
    const { advocateId, consultationDate, timeSlot, consultationType, issueDescription, practiceArea } = req.body;

    const advocateProfile = await AdvocateProfile.findOne({ user: advocateId });
    if (!advocateProfile) return errorResponse(res, 404, 'Advocate not found');

    // Check for double booking
    const existingBooking = await ConsultationBooking.findOne({
      advocate: advocateId,
      consultationDate: new Date(consultationDate),
      timeSlot,
      status: { $nin: ['cancelled', 'rejected'] },
    });
    if (existingBooking) return errorResponse(res, 409, 'This time slot is already booked');

    // Create mock payment first
    const payment = await Payment.create({
      client: req.user._id,
      advocate: advocateId,
      amount: advocateProfile.consultationFee,
      status: 'completed',
      paymentMethod: 'mock',
      description: `Consultation booking with advocate`,
    });

    const booking = await ConsultationBooking.create({
      client: req.user._id,
      advocate: advocateId,
      advocateProfile: advocateProfile._id,
      consultationDate: new Date(consultationDate),
      timeSlot,
      consultationType,
      issueDescription,
      practiceArea,
      amount: advocateProfile.consultationFee,
      paymentStatus: 'paid',
      paymentId: payment._id,
    });

    payment.booking = booking._id;
    await payment.save();

    // Create notifications for both parties
    await Notification.create([
      {
        user: advocateId,
        title: 'New Consultation Request',
        message: `${req.user.name} has booked a consultation with you`,
        type: 'booking',
        link: `/advocate/bookings/${booking._id}`,
      },
      {
        user: req.user._id,
        title: 'Booking Confirmed',
        message: `Your consultation has been booked successfully. Reference: ${booking.bookingReference}`,
        type: 'booking',
        link: `/client/bookings/${booking._id}`,
      },
    ]);

    const populatedBooking = await ConsultationBooking.findById(booking._id)
      .populate('advocate', 'name email avatar')
      .populate('advocateProfile', 'practiceAreas consultationFee location');

    return successResponse(res, 201, 'Booking created successfully', { booking: populatedBooking, payment });
  } catch (err) {
    if (err.code === 11000) return errorResponse(res, 409, 'This time slot is already booked');
    console.error(err);
    return errorResponse(res, 500, 'Server error');
  }
};

// @desc    Get my bookings (client or advocate)
// @route   GET /api/bookings/my
const getMyBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = req.user.role === 'client' ? { client: req.user._id } : { advocate: req.user._id };
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [bookings, total] = await Promise.all([
      ConsultationBooking.find(query)
        .populate('client', 'name email avatar phone')
        .populate('advocate', 'name email avatar')
        .populate('advocateProfile', 'practiceAreas consultationFee location designation')
        .sort('-createdAt')
        .skip(skip)
        .limit(parseInt(limit)),
      ConsultationBooking.countDocuments(query),
    ]);

    return successResponse(res, 200, 'Bookings retrieved', {
      bookings,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (err) {
    return errorResponse(res, 500, 'Server error');
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
const getBookingById = async (req, res) => {
  try {
    const booking = await ConsultationBooking.findById(req.params.id)
      .populate('client', 'name email avatar phone')
      .populate('advocate', 'name email avatar')
      .populate('advocateProfile', 'practiceAreas consultationFee location designation bio');

    if (!booking) return errorResponse(res, 404, 'Booking not found');

    const isAuthorized =
      booking.client._id.toString() === req.user._id.toString() ||
      booking.advocate._id.toString() === req.user._id.toString();
    if (!isAuthorized) return errorResponse(res, 403, 'Not authorized');

    return successResponse(res, 200, 'Booking retrieved', { booking });
  } catch (err) {
    return errorResponse(res, 500, 'Server error');
  }
};

// @desc    Update booking status (advocate only)
// @route   PATCH /api/bookings/:id/status
const updateBookingStatus = async (req, res) => {
  try {
    const { status, rejectionReason, meetingLink } = req.body;
    const booking = await ConsultationBooking.findById(req.params.id);
    if (!booking) return errorResponse(res, 404, 'Booking not found');
    if (booking.advocate.toString() !== req.user._id.toString()) return errorResponse(res, 403, 'Not authorized');

    booking.status = status;
    if (rejectionReason) booking.rejectionReason = rejectionReason;
    if (meetingLink) booking.meetingLink = meetingLink;
    await booking.save();

    await Notification.create({
      user: booking.client,
      title: `Booking ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      message: `Your consultation booking has been ${status}`,
      type: 'booking',
      link: `/client/bookings/${booking._id}`,
    });

    return successResponse(res, 200, 'Booking status updated', { booking });
  } catch (err) {
    return errorResponse(res, 500, 'Server error');
  }
};

// @desc    Cancel booking (client only)
// @route   PATCH /api/bookings/:id/cancel
const cancelBooking = async (req, res) => {
  try {
    const { cancellationReason } = req.body;
    const booking = await ConsultationBooking.findById(req.params.id);
    if (!booking) return errorResponse(res, 404, 'Booking not found');
    if (booking.client.toString() !== req.user._id.toString()) return errorResponse(res, 403, 'Not authorized');
    if (['completed', 'cancelled'].includes(booking.status)) {
      return errorResponse(res, 400, 'Cannot cancel this booking');
    }

    booking.status = 'cancelled';
    booking.cancellationReason = cancellationReason;
    await booking.save();

    await Notification.create({
      user: booking.advocate,
      title: 'Booking Cancelled',
      message: `A consultation booking has been cancelled by the client`,
      type: 'booking',
      link: `/advocate/bookings/${booking._id}`,
    });

    return successResponse(res, 200, 'Booking cancelled', { booking });
  } catch (err) {
    return errorResponse(res, 500, 'Server error');
  }
};

module.exports = { createBooking, getMyBookings, getBookingById, updateBookingStatus, cancelBooking };
