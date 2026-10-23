const mongoose = require('mongoose');

const savedAdvocateSchema = new mongoose.Schema(
  {
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    advocate: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    advocateProfile: { type: mongoose.Schema.Types.ObjectId, ref: 'AdvocateProfile' },
  },
  { timestamps: true }
);

savedAdvocateSchema.index({ client: 1, advocate: 1 }, { unique: true });

module.exports = mongoose.model('SavedAdvocate', savedAdvocateSchema);
