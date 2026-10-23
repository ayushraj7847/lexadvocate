const CaseDocument = require('../models/CaseDocument');
const Case = require('../models/Case');
const path = require('path');
const fs = require('fs');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// @desc    Upload a document
// @route   POST /api/documents/upload
const uploadDocument = async (req, res) => {
  try {
    if (!req.file) return errorResponse(res, 400, 'No file uploaded');

    const { caseId, bookingId } = req.body;
    const doc = await CaseDocument.create({
      uploadedBy: req.user._id,
      case: caseId || undefined,
      booking: bookingId || undefined,
      originalName: req.file.originalname,
      filename: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size,
      accessibleBy: [req.user._id],
    });

    if (caseId) {
      await Case.findByIdAndUpdate(caseId, { $push: { documents: doc._id } });
    }

    return successResponse(res, 201, 'Document uploaded', { document: doc });
  } catch (err) {
    console.error(err);
    return errorResponse(res, 500, 'Server error');
  }
};

// @desc    Get my documents
// @route   GET /api/documents
const getMyDocuments = async (req, res) => {
  try {
    const docs = await CaseDocument.find({
      $or: [{ uploadedBy: req.user._id }, { accessibleBy: req.user._id }],
    })
      .populate('case', 'title caseReference')
      .populate('uploadedBy', 'name')
      .sort('-createdAt');

    return successResponse(res, 200, 'Documents retrieved', { documents: docs });
  } catch (err) {
    return errorResponse(res, 500, 'Server error');
  }
};

// @desc    Download a document
// @route   GET /api/documents/:id/download
const downloadDocument = async (req, res) => {
  try {
    const doc = await CaseDocument.findById(req.params.id);
    if (!doc) return errorResponse(res, 404, 'Document not found');

    const isAuthorized =
      doc.uploadedBy.toString() === req.user._id.toString() ||
      doc.accessibleBy.some(id => id.toString() === req.user._id.toString());
    if (!isAuthorized) return errorResponse(res, 403, 'Not authorized');

    const filePath = path.join(__dirname, '../../uploads', doc.filename);
    if (!fs.existsSync(filePath)) return errorResponse(res, 404, 'File not found on server');

    res.download(filePath, doc.originalName);
  } catch (err) {
    return errorResponse(res, 500, 'Server error');
  }
};

// @desc    Delete a document
// @route   DELETE /api/documents/:id
const deleteDocument = async (req, res) => {
  try {
    const doc = await CaseDocument.findById(req.params.id);
    if (!doc) return errorResponse(res, 404, 'Document not found');
    if (doc.uploadedBy.toString() !== req.user._id.toString()) return errorResponse(res, 403, 'Not authorized');

    const filePath = path.join(__dirname, '../../uploads', doc.filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    await doc.deleteOne();

    return successResponse(res, 200, 'Document deleted');
  } catch (err) {
    return errorResponse(res, 500, 'Server error');
  }
};

module.exports = { uploadDocument, getMyDocuments, downloadDocument, deleteDocument };
