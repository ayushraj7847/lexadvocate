const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// @desc    Get all conversations for current user
// @route   GET /api/messages/conversations
const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({ participants: req.user._id })
      .populate('participants', 'name email avatar role')
      .populate('lastMessage')
      .sort('-lastMessageAt');
    return successResponse(res, 200, 'Conversations retrieved', { conversations });
  } catch (err) {
    return errorResponse(res, 500, 'Server error');
  }
};

// @desc    Create or get a conversation
// @route   POST /api/messages/conversations
const createConversation = async (req, res) => {
  try {
    const { participantId, bookingId, caseId } = req.body;

    const existing = await Conversation.findOne({
      participants: { $all: [req.user._id, participantId], $size: 2 },
    });
    if (existing) {
      const populated = await Conversation.findById(existing._id)
        .populate('participants', 'name email avatar role');
      return successResponse(res, 200, 'Conversation already exists', { conversation: populated });
    }

    const conversation = await Conversation.create({
      participants: [req.user._id, participantId],
      booking: bookingId,
      case: caseId,
    });

    const populated = await Conversation.findById(conversation._id)
      .populate('participants', 'name email avatar role');
    return successResponse(res, 201, 'Conversation created', { conversation: populated });
  } catch (err) {
    return errorResponse(res, 500, 'Server error');
  }
};

// @desc    Get messages for a conversation
// @route   GET /api/messages/conversations/:id/messages
const getMessages = async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) return errorResponse(res, 404, 'Conversation not found');
    if (!conversation.participants.some(p => p.toString() === req.user._id.toString())) {
      return errorResponse(res, 403, 'Not authorized');
    }

    const messages = await Message.find({ conversation: req.params.id })
      .populate('sender', 'name avatar')
      .sort('createdAt');

    // Mark messages as read
    await Message.updateMany(
      { conversation: req.params.id, sender: { $ne: req.user._id }, isRead: false },
      { isRead: true, readAt: new Date(), $addToSet: { readBy: req.user._id } }
    );

    return successResponse(res, 200, 'Messages retrieved', { messages });
  } catch (err) {
    return errorResponse(res, 500, 'Server error');
  }
};

// @desc    Send a message in a conversation
// @route   POST /api/messages/conversations/:id/messages
const sendMessage = async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) return errorResponse(res, 404, 'Conversation not found');
    if (!conversation.participants.some(p => p.toString() === req.user._id.toString())) {
      return errorResponse(res, 403, 'Not authorized');
    }

    const message = await Message.create({
      conversation: req.params.id,
      sender: req.user._id,
      content: req.body.content,
      messageType: req.body.messageType || 'text',
    });

    conversation.lastMessage = message._id;
    conversation.lastMessageAt = new Date();
    await conversation.save();

    const populated = await Message.findById(message._id).populate('sender', 'name avatar');
    return successResponse(res, 201, 'Message sent', { message: populated });
  } catch (err) {
    return errorResponse(res, 500, 'Server error');
  }
};

module.exports = { getConversations, createConversation, getMessages, sendMessage };
