const { validationResult } = require('express-validator');
const User = require('../models/User');
const AdvocateProfile = require('../models/AdvocateProfile');
const generateToken = require('../utils/generateToken');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// @desc    Register user
// @route   POST /api/auth/register
const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return errorResponse(res, 400, 'Validation failed', errors.array());

  const { name, email, password, role, phone } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return errorResponse(res, 400, 'Email already registered');

    const user = await User.create({ name, email, password, role: role || 'client', phone });

    // Create advocate profile if role is advocate
    if (user.role === 'advocate') {
      await AdvocateProfile.create({ user: user._id });
    }

    const token = generateToken(user._id, user.role);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return successResponse(res, 201, 'Registration successful', {
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error(err);
    return errorResponse(res, 500, 'Server error during registration');
  }
};

// @desc    Login user
// @route   POST /api/auth/login
const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return errorResponse(res, 400, 'Validation failed', errors.array());

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return errorResponse(res, 401, 'Invalid email or password');
    }
    if (!user.isActive) return errorResponse(res, 403, 'Account is deactivated');

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user._id, user.role);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    let advocateProfile = null;
    if (user.role === 'advocate') {
      advocateProfile = await AdvocateProfile.findOne({ user: user._id }).select('practiceAreas consultationFee rating isProfileComplete');
    }

    return successResponse(res, 200, 'Login successful', {
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, phone: user.phone },
      advocateProfile,
    });
  } catch (err) {
    console.error(err);
    return errorResponse(res, 500, 'Server error during login');
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
const logout = (req, res) => {
  res.cookie('token', '', { httpOnly: true, expires: new Date(0) });
  return successResponse(res, 200, 'Logged out successfully');
};

// @desc    Get current user
// @route   GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    let advocateProfile = null;
    if (user.role === 'advocate') {
      advocateProfile = await AdvocateProfile.findOne({ user: user._id });
    }
    return successResponse(res, 200, 'User retrieved', { user, advocateProfile });
  } catch (err) {
    return errorResponse(res, 500, 'Server error');
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone },
      { new: true, runValidators: true }
    ).select('-password');
    return successResponse(res, 200, 'Profile updated', { user });
  } catch (err) {
    return errorResponse(res, 500, 'Server error');
  }
};

module.exports = { register, login, logout, getMe, updateProfile };
