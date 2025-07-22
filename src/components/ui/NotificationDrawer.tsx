import React, { useState, useEffect } from 'react';
import BottomSheet from './BottomSheet';
import { Bell, X } from 'lucide-react';
import { format } from 'date-fns';

export interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

// Simple mock notifications data
const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'New Appointment Scheduled',
    message: 'Rajesh Kumar has booked a training session for today at 4:00 PM',
    isRead: false,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Session Completed',
    message: 'Your session with Priya Sharma has been completed successfully',
    isRead: false,
    createdAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: '3',
    title: 'New Message',
    message: 'Arjun Paluoy sent you a message about his meal plan',
    isRead: true,
    createdAt: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: '4',
    title: 'Session Reminder',
    message: 'You have a session with Vijay Malvya in 30 minutes',
    isRead: true,
    createdAt: new Date(Date.now() - 14400000).toISOString()
  },
  {
    id: '5',
    title: 'Weekly Report',
    message: 'Your weekly performance report is now available',
    isRead: true,
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  // Simulate fetching notifications from API
  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      // Simulate API delay
      setTimeout(() => {
        setNotifications(mockNotifications);
        setLoading(false);
      }, 500);
    }
  }, [isOpen]);

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, isRead: true } : notification
    ));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    
    // If today, show time only
    if (date.toDateString() === now.toDateString()) {
      return `Today at ${format(date, 'h:mm a')}`;
    }
    
    // If yesterday
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${format(date, 'h:mm a')}`;
    }
    
    // Otherwise show full date
    return format(date, 'MMM d, yyyy • h:mm a');
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} height="70vh" title="Notifications">
      <div className="px-4 py-3 flex justify-between items-center border-b bg-gray-50">
        <div className="flex items-center">
          <Bell className="h-5 w-5 text-gray-600 mr-2" />
          <h2 className="text-lg font-semibold">Notifications</h2>
          {unreadCount > 0 && (
            <span className="bg-gray-800 text-white text-xs rounded-full px-2 py-0.5 ml-2 font-medium">
              {unreadCount}
            </span>
          )}
        </div>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors p-1"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="overflow-y-auto" style={{ maxHeight: 'calc(70vh - 60px)' }}>
        {loading ? (
          <div className="flex flex-col justify-center items-center p-12">
            <div className="animate-spin h-8 w-8 border-4 border-gray-300 border-t-gray-600 rounded-full mb-4"></div>
            <p className="text-gray-500 text-sm">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-16">
            <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-500 mb-2">No notifications</h3>
            <p className="text-gray-400 text-sm">You're all caught up!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map(notification => (
              <div 
                key={notification.id} 
                className={`flex items-start gap-3 p-4 transition-all cursor-pointer hover:bg-gray-50 ${
                  notification.isRead ? 'bg-white' : 'bg-blue-50'
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex-shrink-0 mt-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    notification.isRead ? 'bg-gray-200' : 'bg-blue-500'
                  }`}>
                    <Bell className={`h-4 w-4 ${
                      notification.isRead ? 'text-gray-500' : 'text-white'
                    }`} />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={`font-semibold text-sm ${
                      notification.isRead ? 'text-gray-700' : 'text-gray-900'
                    }`}>
                      {notification.title}
                    </h3>
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 flex-shrink-0"></div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed mb-2">{notification.message}</p>
                  <span className="text-xs text-gray-500">
                    {formatDate(notification.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </BottomSheet>
  );
};

export default NotificationDrawer;
