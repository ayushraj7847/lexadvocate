const Case = require('../models/Case');
const Notification = require('../models/Notification');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// @desc    Create a new case
// @route   POST /api/cases
const createCase = async (req, res) => {
  try {
    const { title, caseType, clientId, courtName, courtLocation, filingDate, description, bookingId } = req.body;
    if (req.user.role !== 'advocate') return errorResponse(res, 403, 'Only advocates can create cases');

    const newCase = await Case.create({
      title,
      caseType,
      courtName,
      courtLocation,
      description,
      client: clientId,
      advocate: req.user._id,
      booking: bookingId,
      filingDate: filingDate ? new Date(filingDate) : new Date(),
      progressTimeline: [
        { stage: 'Case Filed', description: 'Case has been filed', date: new Date(), updatedBy: req.user._id },
      ],
    });

    await Notification.create({
      user: clientId,
      title: 'New Case Assigned',
      message: `A new case "${title}" has been assigned to you`,
      type: 'case',
      link: `/client/cases/${newCase._id}`,
    });

    return successResponse(res, 201, 'Case created', { case: newCase });
  } catch (err) {
    console.error(err);
    return errorResponse(res, 500, 'Server error');
  }
};

// @desc    Get my cases (client or advocate)
// @route   GET /api/cases
const getMyCases = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = req.user.role === 'client' ? { client: req.user._id } : { advocate: req.user._id };
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [cases, total] = await Promise.all([
      Case.find(query)
        .populate('client', 'name email avatar')
        .populate('advocate', 'name email avatar')
        .sort('-createdAt')
        .skip(skip)
        .limit(parseInt(limit)),
      Case.countDocuments(query),
    ]);

    return successResponse(res, 200, 'Cases retrieved', {
      cases,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (err) {
    return errorResponse(res, 500, 'Server error');
  }
};

// @desc    Get case by ID
// @route   GET /api/cases/:id
const getCaseById = async (req, res) => {
  try {
    const caseDoc = await Case.findById(req.params.id)
      .populate('client', 'name email avatar phone')
      .populate('advocate', 'name email avatar')
      .populate('documents');

    if (!caseDoc) return errorResponse(res, 404, 'Case not found');

    const isAuthorized =
      caseDoc.client._id.toString() === req.user._id.toString() ||
      caseDoc.advocate._id.toString() === req.user._id.toString();
    if (!isAuthorized) return errorResponse(res, 403, 'Not authorized');

    return successResponse(res, 200, 'Case retrieved', { case: caseDoc });
  } catch (err) {
    return errorResponse(res, 500, 'Server error');
  }
};

// @desc    Update case details (advocate only)
// @route   PUT /api/cases/:id
const updateCase = async (req, res) => {
  try {
    const caseDoc = await Case.findById(req.params.id);
    if (!caseDoc) return errorResponse(res, 404, 'Case not found');
    if (caseDoc.advocate.toString() !== req.user._id.toString()) return errorResponse(res, 403, 'Not authorized');

    const allowedUpdates = ['title', 'status', 'nextHearingDate', 'courtName', 'courtLocation', 'notes'];
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) caseDoc[field] = req.body[field];
    });
    await caseDoc.save();

    return successResponse(res, 200, 'Case updated', { case: caseDoc });
  } catch (err) {
    return errorResponse(res, 500, 'Server error');
  }
};

// @desc    Add progress to case timeline (advocate only)
// @route   POST /api/cases/:id/progress
const addCaseProgress = async (req, res) => {
  try {
    const { stage, description } = req.body;
    const caseDoc = await Case.findById(req.params.id);
    if (!caseDoc) return errorResponse(res, 404, 'Case not found');
    if (caseDoc.advocate.toString() !== req.user._id.toString()) return errorResponse(res, 403, 'Not authorized');

    caseDoc.progressTimeline.push({ stage, description, date: new Date(), updatedBy: req.user._id });
    await caseDoc.save();

    await Notification.create({
      user: caseDoc.client,
      title: 'Case Update',
      message: `Your case "${caseDoc.title}" has a new update: ${stage}`,
      type: 'case',
      link: `/client/cases/${caseDoc._id}`,
    });

    return successResponse(res, 200, 'Progress added', { case: caseDoc });
  } catch (err) {
    return errorResponse(res, 500, 'Server error');
  }
};

module.exports = { createCase, getMyCases, getCaseById, updateCase, addCaseProgress };
