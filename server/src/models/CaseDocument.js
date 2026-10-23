const mongoose = require('mongoose');

const caseDocumentSchema = new mongoose.Schema(
  {
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    case: { type: mongoose.Schema.Types.ObjectId, ref: 'Case' },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'ConsultationBooking' },
    originalName: { type: String, required: true },
    filename: { type: String, required: true },
    mimetype: String,
    size: Number,
    status: { type: String, enum: ['pending','reviewed','approved','rejected'], default: 'pending' },
    isShared: { type: Boolean, default: false },
    accessibleBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('CaseDocument', caseDocumentSchema);
