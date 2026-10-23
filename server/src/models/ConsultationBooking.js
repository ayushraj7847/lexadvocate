const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    advocate: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    advocateProfile: { type: mongoose.Schema.Types.ObjectId, ref: 'AdvocateProfile' },
    consultationDate: { type: Date, required: true },
    timeSlot: { type: String, required: true },
    consultationType: { type: String, enum: ['audio', 'video', 'in-person'], required: true },
    issueDescription: { type: String, maxlength: 2000 },
    practiceArea: String,
    status: { type: String, enum: ['pending','confirmed','completed','cancelled','rejected'], default: 'pending' },
    cancellationReason: String,
    rejectionReason: String,
    meetingLink: String,
    amount: { type: Number, required: true },
    paymentStatus: { type: String, enum: ['pending','paid','refunded'], default: 'pending' },
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
    notes: String,
    bookingReference: { type: String, unique: true },
  },
  { timestamps: true }
);

bookingSchema.pre('save', function () {
  if (!this.bookingReference) {
    this.bookingReference = `BK-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }
});

// Prevent double booking
bookingSchema.index(
  { advocate: 1, consultationDate: 1, timeSlot: 1 },
  { unique: true, partialFilterExpression: { status: { $nin: ['cancelled','rejected'] } } }
);

module.exports = mongoose.model('ConsultationBooking', bookingSchema);
