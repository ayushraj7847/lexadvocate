const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    advocate: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    advocateProfile: { type: mongoose.Schema.Types.ObjectId, ref: 'AdvocateProfile' },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'ConsultationBooking' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, maxlength: 1000 },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

reviewSchema.index({ advocate: 1, client: 1, booking: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
