const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, maxlength: 5000 },
    messageType: { type: String, enum: ['text', 'document'], default: 'text' },
    document: { type: mongoose.Schema.Types.ObjectId, ref: 'CaseDocument' },
    isRead: { type: Boolean, default: false },
    readAt: Date,
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Message', messageSchema);
