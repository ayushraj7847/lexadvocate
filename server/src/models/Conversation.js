const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema(
  {
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'ConsultationBooking' },
    case: { type: mongoose.Schema.Types.ObjectId, ref: 'Case' },
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
    lastMessageAt: Date,
    unreadCount: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Conversation', conversationSchema);
