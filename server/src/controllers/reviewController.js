const Review = require('../models/Review');
const AdvocateProfile = require('../models/AdvocateProfile');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// @desc    Create a review for an advocate
// @route   POST /api/reviews
const createReview = async (req, res) => {
  try {
    const { advocateId, bookingId, rating, comment } = req.body;
    const profile = await AdvocateProfile.findOne({ user: advocateId });
    if (!profile) return errorResponse(res, 404, 'Advocate not found');

    const review = await Review.create({
      client: req.user._id,
      advocate: advocateId,
      advocateProfile: profile._id,
      booking: bookingId,
      rating,
      comment,
    });

    // Recalculate and update advocate's average rating
    const reviews = await Review.find({ advocate: advocateId });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await AdvocateProfile.findOneAndUpdate(
      { user: advocateId },
      { rating: Math.round(avgRating * 10) / 10, totalReviews: reviews.length }
    );

    return successResponse(res, 201, 'Review submitted', { review });
  } catch (err) {
    if (err.code === 11000) return errorResponse(res, 400, 'You have already reviewed this booking');
    console.error(err);
    return errorResponse(res, 500, 'Server error');
  }
};

// @desc    Get reviews for an advocate
// @route   GET /api/reviews/advocate/:advocateId
const getAdvocateReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const targetId = req.params.advocateId || req.params.id;

    // Check if targetId is an AdvocateProfile or User
    let advocateUserId = targetId;
    const profile = await AdvocateProfile.findById(targetId);
    if (profile) {
      advocateUserId = profile.user;
    }

    const [reviews, total] = await Promise.all([
      Review.find({ advocate: advocateUserId })
        .populate('client', 'name avatar')
        .sort('-createdAt')
        .skip(skip)
        .limit(parseInt(limit)),
      Review.countDocuments({ advocate: advocateUserId }),
    ]);

    return successResponse(res, 200, 'Reviews retrieved', {
      reviews,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (err) {
    return errorResponse(res, 500, 'Server error');
  }
};

module.exports = { createReview, getAdvocateReviews };
