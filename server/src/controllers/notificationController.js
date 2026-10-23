const Notification = require('../models/Notification');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// @desc    Get my notifications
// @route   GET /api/notifications
const getMyNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find({ user: req.user._id })
        .sort('-createdAt')
        .skip(skip)
        .limit(parseInt(limit)),
      Notification.countDocuments({ user: req.user._id }),
      Notification.countDocuments({ user: req.user._id, isRead: false }),
    ]);

    return successResponse(res, 200, 'Notifications retrieved', {
      notifications,
      unreadCount,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (err) {
    return errorResponse(res, 500, 'Server error');
  }
};

// @desc    Mark a notification as read
// @route   PATCH /api/notifications/:id/read
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { isRead: true },
      { new: true }
    );
    if (!notification) return errorResponse(res, 404, 'Notification not found');
    return successResponse(res, 200, 'Notification marked as read', { notification });
  } catch (err) {
    return errorResponse(res, 500, 'Server error');
  }
};

// @desc    Mark all notifications as read
// @route   PATCH /api/notifications/read-all
const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user._id, isRead: false }, { isRead: true });
    return successResponse(res, 200, 'All notifications marked as read');
  } catch (err) {
    return errorResponse(res, 500, 'Server error');
  }
};

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!notification) return errorResponse(res, 404, 'Notification not found');
    return successResponse(res, 200, 'Notification deleted');
  } catch (err) {
    return errorResponse(res, 500, 'Server error');
  }
};

module.exports = { getMyNotifications, markAsRead, markAllAsRead, deleteNotification };
