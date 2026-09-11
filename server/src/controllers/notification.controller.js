const notificationService = require('../services/notification.service');

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await notificationService.getUserNotifications(req.user.id);
    const unreadCount = await notificationService.getUnreadCount(req.user.id);
    res.json({
      success: true,
      data: notifications,
      unreadCount
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const notification = await notificationService.markAsRead(req.params.id, req.user.id);
    res.json({ success: true, data: notification });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    const result = await notificationService.markAllAsRead(req.user.id);
    res.json({ success: true, message: 'All notifications marked as read', data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
