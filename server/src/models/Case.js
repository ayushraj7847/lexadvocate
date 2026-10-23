const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  stage: String,
  description: String,
  date: { type: Date, default: Date.now },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const caseSchema = new mongoose.Schema(
  {
    caseReference: { type: String, unique: true },
    title: { type: String, required: true },
    caseType: { type: String, required: true },
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    advocate: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'ConsultationBooking' },
    courtName: String,
    courtLocation: String,
    filingDate: Date,
    nextHearingDate: Date,
    status: { type: String, enum: ['active','pending','on_hold','closed','won','lost'], default: 'active' },
    description: String,
    notes: String,
    progressTimeline: [progressSchema],
    documents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CaseDocument' }],
  },
  { timestamps: true }
);

caseSchema.pre('save', function () {
  if (!this.caseReference) {
    this.caseReference = `CASE-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
  }
});

module.exports = mongoose.model('Case', caseSchema);
