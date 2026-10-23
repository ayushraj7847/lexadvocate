const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    advocate: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'ConsultationBooking' },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    status: { type: String, enum: ['pending','completed','failed','refunded'], default: 'pending' },
    paymentMethod: { type: String, default: 'mock' },
    stripePaymentIntentId: String,
    stripeSessionId: String,
    transactionId: { type: String, unique: true },
    description: String,
    refundReason: String,
    refundedAt: Date,
  },
  { timestamps: true }
);

paymentSchema.pre('save', function () {
  if (!this.transactionId) {
    this.transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
  }
});

module.exports = mongoose.model('Payment', paymentSchema);
