import { useState, useEffect } from 'react';
import { Bell, Check, X, Clock, CheckCircle, Gift, BookOpen, Megaphone, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { colorClasses } from '../styles/colors.js';
import api from '../api.js';

const NotificationPanel = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen && user?.id) {
      loadNotifications();
    }
  }, [isOpen, user?.id]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await api.getNotifications(user.id);
      setNotifications(data);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await api.markNotificationAsRead(notificationId);
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, read: true }
            : notif
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'overdue':
        return <Clock className="h-4 w-4 text-red-600" />;
      case 'due_soon':
        return <Clock className="h-4 w-4 text-orange-500" />;
      case 'borrow_approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'borrow_rejected':
        return <X className="h-4 w-4 text-red-500" />;
      case 'donation_approved':
        return <Gift className="h-4 w-4 text-green-500" />;
      case 'donation_rejected':
        return <Gift className="h-4 w-4 text-red-500" />;
      case 'welcome':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'announcement_urgent':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'announcement_important':
        return <Megaphone className="h-4 w-4 text-orange-500" />;
      case 'announcement':
        return <Megaphone className="h-4 w-4 text-blue-500" />;
      case 'due_date':
        return <Clock className="h-4 w-4 text-orange-500" />;
      case 'request_approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'request_rejected':
        return <X className="h-4 w-4 text-red-500" />;
      case 'donation':
        return <Gift className="h-4 w-4 text-purple-500" />;
      case 'borrow':
        return <BookOpen className="h-4 w-4 text-blue-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const getNotificationPriority = (type) => {
    switch (type) {
      case 'overdue':
        return 'high'; // Red background
      case 'due_soon':
        return 'medium'; // Orange background
      case 'borrow_approved':
      case 'donation_approved':
        return 'success'; // Green background
      case 'borrow_rejected':
      case 'donation_rejected':
        return 'error'; // Red background
      case 'welcome':
        return 'info'; // Blue background
      case 'announcement_urgent':
        return 'high'; // Red background
      case 'announcement_important':
        return 'medium'; // Orange background
      case 'announcement':
        return 'info'; // Blue background
      default:
        return 'normal'; // Default background
    }
  };

  const getPriorityStyles = (priority, isRead) => {
    if (isRead) return 'hover:bg-gray-50';
    
    switch (priority) {
      case 'high':
        return 'bg-red-50 border-l-4 border-red-500 hover:bg-red-100';
      case 'medium':
        return 'bg-orange-50 border-l-4 border-orange-500 hover:bg-orange-100';
      case 'success':
        return 'bg-green-50 border-l-4 border-green-500 hover:bg-green-100';
      case 'error':
        return 'bg-red-50 border-l-4 border-red-500 hover:bg-red-100';
      case 'info':
        return 'bg-blue-50 border-l-4 border-blue-500 hover:bg-blue-100';
      default:
        return 'bg-blue-50 hover:bg-blue-100';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} মিনিট আগে`;
    } else if (diffHours < 24) {
      return `${diffHours} ঘন্টা আগে`;
    } else {
      return `${diffDays} দিন আগে`;
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 z-40" 
        onClick={onClose}
      />
      
      {/* Notification Panel */}
      <div className={`absolute right-0 mt-2 w-80 ${colorClasses.bg.primary} rounded-lg shadow-lg border ${colorClasses.border.primary} z-50 max-h-96 overflow-hidden`}>
        {/* Header */}
        <div className={`p-4 border-b ${colorClasses.border.primary} flex items-center justify-between`}>
          <h3 className={`font-semibold ${colorClasses.text.primary}`}>নোটিফিকেশন</h3>
          <button
            onClick={onClose}
            className={`p-1 rounded-full hover:bg-gray-100 ${colorClasses.text.tertiary}`}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-80 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500 mx-auto"></div>
              <p className={`text-sm ${colorClasses.text.secondary} mt-2`}>লোড হচ্ছে...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-center">
              <Bell className={`h-8 w-8 ${colorClasses.text.tertiary} mx-auto mb-2`} />
              <p className={`text-sm ${colorClasses.text.secondary}`}>কোন নোটিফিকেশন নেই</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => {
                const priority = getNotificationPriority(notification.type);
                const priorityStyles = getPriorityStyles(priority, notification.read);
                
                return (
                  <div
                    key={notification.id}
                    className={`p-4 transition-colors ${priorityStyles}`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${colorClasses.text.primary} ${
                          !notification.read ? 'font-medium' : ''
                        }`}>
                          {notification.message}
                        </p>
                        <p className={`text-xs ${colorClasses.text.tertiary} mt-1`}>
                          {formatTimestamp(notification.timestamp)}
                        </p>
                      </div>
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className={`flex-shrink-0 p-1 rounded-full hover:bg-blue-100 ${colorClasses.text.accent}`}
                          title="পঠিত হিসেবে চিহ্নিত করুন"
                        >
                          <Check className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className={`p-3 border-t ${colorClasses.border.primary} text-center`}>
            <button
              onClick={() => {
                // Mark all as read
                notifications.forEach(notif => {
                  if (!notif.read) markAsRead(notif.id);
                });
              }}
              className={`text-xs ${colorClasses.text.accent} hover:underline`}
            >
              সব পঠিত হিসেবে চিহ্নিত করুন
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default NotificationPanel;
