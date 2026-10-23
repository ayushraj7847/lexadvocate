const express = require('express');
const {
  getConversations,
  createConversation,
  getMessages,
  sendMessage,
} = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getConversations);
router.get('/conversations', protect, getConversations);
router.post('/', protect, createConversation);
router.post('/conversations', protect, createConversation);

router.get('/:id/messages', protect, getMessages);
router.post('/:id/messages', protect, sendMessage);
router.get('/conversations/:id/messages', protect, getMessages);
router.post('/conversations/:id/messages', protect, sendMessage);

module.exports = router;
