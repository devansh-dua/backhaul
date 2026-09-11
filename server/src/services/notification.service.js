const Notification = require('../models/Notification');

class NotificationService {
  async createNotification(data) {
    return await Notification.create(data);
  }

  async getUserNotifications(userId, limit = 20) {
    return await Notification.find({ recipient: userId })
      .populate('shipment trip match')
      .sort({ createdAt: -1 })
      .limit(limit);
  }

  async markAsRead(notificationId, userId) {
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, recipient: userId },
      { isRead: true },
      { new: true }
    );
    if (!notification) {
      throw new Error('Notification not found or unauthorized');
    }
    return notification;
  }

  async markAllAsRead(userId) {
    await Notification.updateMany(
      { recipient: userId, isRead: false },
      { isRead: true }
    );
    return { success: true };
  }

  async getUnreadCount(userId) {
    return await Notification.countDocuments({ recipient: userId, isRead: false });
  }
}

module.exports = new NotificationService();
