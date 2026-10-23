const jwt = require('jsonwebtoken');
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');

const initializeSocket = (io) => {
  io.use((socket, next) => {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization?.split(' ')[1];

    if (!token) {
      return next(new Error('Authentication required'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');
      socket.userId = decoded.id;
      socket.userRole = decoded.role;
      next();
    } catch (err) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    socket.join(`user_${socket.userId}`);

    socket.on('join_conversation', (conversationId) => {
      socket.join(`conversation_${conversationId}`);
    });

    socket.on('leave_conversation', (conversationId) => {
      socket.leave(`conversation_${conversationId}`);
    });

    socket.on('send_message', async ({ conversationId, content, messageType = 'text', documentId = null }) => {
      try {
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) return;
        if (!conversation.participants.some((p) => p.toString() === socket.userId)) return;

        const messageData = {
          conversation: conversationId,
          sender: socket.userId,
          content,
          messageType,
        };
        if (documentId) messageData.document = documentId;

        const message = await Message.create(messageData);

        conversation.lastMessage = message._id;
        conversation.lastMessageAt = new Date();
        await conversation.save();

        const populated = await Message.findById(message._id)
          .populate('sender', 'name avatar role')
          .populate('document');

        io.to(`conversation_${conversationId}`).emit('new_message', populated);

        // Also notify the other participant's personal room
        const otherParticipant = conversation.participants.find(
          (p) => p.toString() !== socket.userId
        );
        if (otherParticipant) {
          io.to(`user_${otherParticipant.toString()}`).emit('conversation_updated', {
            conversationId,
            lastMessage: populated,
          });
        }
      } catch (err) {
        socket.emit('socket_error', { message: 'Failed to send message' });
      }
    });

    socket.on('typing', ({ conversationId }) => {
      socket.to(`conversation_${conversationId}`).emit('user_typing', { userId: socket.userId });
    });

    socket.on('stop_typing', ({ conversationId }) => {
      socket.to(`conversation_${conversationId}`).emit('user_stop_typing', { userId: socket.userId });
    });

    socket.on('disconnect', () => {
      // Clean disconnect
    });
  });
};

module.exports = initializeSocket;
