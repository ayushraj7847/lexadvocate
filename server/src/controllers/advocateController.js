const AdvocateProfile = require('../models/AdvocateProfile');
const User = require('../models/User');
const SavedAdvocate = require('../models/SavedAdvocate');
const ConsultationBooking = require('../models/ConsultationBooking');
const Case = require('../models/Case');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// @desc    Get all advocates with filters
// @route   GET /api/advocates
const getAdvocates = async (req, res) => {
  try {
    const {
      search, practiceArea, minExperience, maxFee, minRating,
      city, sortBy = 'rating', page = 1, limit = 12,
    } = req.query;

    const query = { isProfileComplete: true };

    if (practiceArea) query.practiceAreas = practiceArea;
    if (minExperience) query.experience = { $gte: parseInt(minExperience) };
    if (maxFee) query.consultationFee = { $lte: parseInt(maxFee) };
    if (minRating) query.rating = { $gte: parseFloat(minRating) };
    if (city) query['location.city'] = new RegExp(city, 'i');

    let sort = {};
    if (sortBy === 'rating') sort = { rating: -1 };
    else if (sortBy === 'experience') sort = { experience: -1 };
    else if (sortBy === 'fee_asc') sort = { consultationFee: 1 };
    else if (sortBy === 'fee_desc') sort = { consultationFee: -1 };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    if (search) {
      const users = await User.find({ name: new RegExp(search, 'i'), role: 'advocate' }).select('_id');
      query.user = { $in: users.map(u => u._id) };
    }

    const [advocates, total] = await Promise.all([
      AdvocateProfile.find(query)
        .populate('user', 'name email avatar phone')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit)),
      AdvocateProfile.countDocuments(query),
    ]);

    return successResponse(res, 200, 'Advocates retrieved', {
      advocates,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (err) {
    console.error(err);
    return errorResponse(res, 500, 'Server error');
  }
};

// @desc    Get advocate by profile ID
// @route   GET /api/advocates/:id
const getAdvocateById = async (req, res) => {
  try {
    const profile = await AdvocateProfile.findById(req.params.id).populate('user', 'name email avatar phone createdAt');
    if (!profile) return errorResponse(res, 404, 'Advocate not found');
    return successResponse(res, 200, 'Advocate retrieved', { advocate: profile });
  } catch (err) {
    return errorResponse(res, 500, 'Server error');
  }
};

// @desc    Update advocate profile (advocate only)
// @route   PUT /api/advocates/profile
const updateAdvocateProfile = async (req, res) => {
  try {
    const updates = req.body;

    // Check profile completeness
    const requiredFields = ['bio', 'practiceAreas', 'experience', 'consultationFee'];
    const profileData = { ...updates };
    const isComplete = requiredFields.every(f => profileData[f]);

    if (req.file) profileData.profilePhoto = `/uploads/${req.file.filename}`;
    profileData.isProfileComplete = isComplete;

    const profile = await AdvocateProfile.findOneAndUpdate(
      { user: req.user._id },
      profileData,
      { new: true, upsert: true, runValidators: true }
    ).populate('user', 'name email avatar phone');

    return successResponse(res, 200, 'Profile updated', { profile });
  } catch (err) {
    console.error(err);
    return errorResponse(res, 500, 'Server error');
  }
};

// @desc    Get advocate dashboard data
// @route   GET /api/advocates/me/dashboard
const getAdvocateDashboard = async (req, res) => {
  try {
    const [profile, totalBookings, pendingBookings, activeCases] = await Promise.all([
      AdvocateProfile.findOne({ user: req.user._id }),
      ConsultationBooking.countDocuments({ advocate: req.user._id }),
      ConsultationBooking.countDocuments({ advocate: req.user._id, status: 'pending' }),
      Case.countDocuments({ advocate: req.user._id, status: 'active' }),
    ]);

    const recentBookings = await ConsultationBooking.find({ advocate: req.user._id })
      .populate('client', 'name email avatar')
      .sort('-createdAt')
      .limit(5);

    return successResponse(res, 200, 'Dashboard data retrieved', {
      profile,
      stats: { totalBookings, pendingBookings, activeCases, rating: profile?.rating || 0 },
      recentBookings,
    });
  } catch (err) {
    return errorResponse(res, 500, 'Server error');
  }
};

// @desc    Save or unsave an advocate (toggle)
// @route   POST /api/advocates/:id/save
const toggleSaveAdvocate = async (req, res) => {
  try {
    const advocateProfile = await AdvocateProfile.findById(req.params.id);
    if (!advocateProfile) return errorResponse(res, 404, 'Advocate not found');

    const existing = await SavedAdvocate.findOne({ client: req.user._id, advocate: advocateProfile.user });
    if (existing) {
      await existing.deleteOne();
      return successResponse(res, 200, 'Advocate removed from saved list');
    } else {
      await SavedAdvocate.create({ client: req.user._id, advocate: advocateProfile.user, advocateProfile: advocateProfile._id });
      return successResponse(res, 200, 'Advocate saved');
    }
  } catch (err) {
    return errorResponse(res, 500, 'Server error');
  }
};

// @desc    Get saved advocates for the current client
// @route   GET /api/advocates/saved
const getSavedAdvocates = async (req, res) => {
  try {
    const saved = await SavedAdvocate.find({ client: req.user._id })
      .populate({ path: 'advocateProfile', populate: { path: 'user', select: 'name email avatar' } });
    return successResponse(res, 200, 'Saved advocates retrieved', { saved });
  } catch (err) {
    return errorResponse(res, 500, 'Server error');
  }
};

module.exports = { getAdvocates, getAdvocateById, updateAdvocateProfile, getAdvocateDashboard, toggleSaveAdvocate, getSavedAdvocates };
