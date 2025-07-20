import React, { useState, useEffect } from 'react';
import BottomSheet from './BottomSheet';
import { Bell, CheckCircle, AlertCircle, XCircle, InfoIcon, X } from 'lucide-react';
import { format } from 'date-fns';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'info',
    title: 'New Appointment',
    message: 'You have a new appointment scheduled with John Smith at 2:00 PM',
    isRead: false,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    type: 'success',
    title: 'Appointment Complete',
    message: 'Your appointment with Mary Johnson has been marked as complete',
    isRead: true,
    createdAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
  },
  {
    id: '3',
    type: 'warning',
    title: 'Upcoming Session',
    message: 'Reminder: You have a nutrition session in 30 minutes',
    isRead: false,
    createdAt: new Date(Date.now() - 172800000).toISOString() // 2 days ago
  },
  {
    id: '4',
    type: 'error',
    title: 'Cancelled Session',
    message: 'A client has cancelled their appointment scheduled for tomorrow',
    isRead: true,
    createdAt: new Date(Date.now() - 259200000).toISOString() // 3 days ago
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

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />;
      case 'error':
        return <XCircle className="w-6 h-6 text-red-500 flex-shrink-0" />;
      case 'warning':
        return <AlertCircle className="w-6 h-6 text-yellow-500 flex-shrink-0" />;
      case 'info':
      default:
        return <InfoIcon className="w-6 h-6 text-blue-500 flex-shrink-0" />;
    }
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
      <div className="px-4 py-3 flex justify-between items-center border-b">
        <div className="flex items-center">
          <Bell className="h-5 w-5 text-yellow-500 mr-2" />
          <h2 className="text-lg font-semibold">Notifications</h2>
          {unreadCount > 0 && (
            <span className="bg-yellow-500 text-white text-xs rounded-full px-2 py-0.5 ml-2">
              {unreadCount} new
            </span>
          )}
        </div>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="overflow-y-auto" style={{ maxHeight: 'calc(70vh - 60px)' }}>
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin h-8 w-8 border-4 border-yellow-500 border-t-transparent rounded-full"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="h-12 w-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500">You have no notifications</p>
          </div>
        ) : (
          <div className="divide-y">
            {notifications.map(notification => (
              <div 
                key={notification.id} 
                className={`p-4 flex items-start gap-3 ${notification.isRead ? 'bg-white' : 'bg-yellow-50'}`}
                onClick={() => markAsRead(notification.id)}
              >
                {getNotificationIcon(notification.type)}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                    <span className="text-xs text-gray-500">
                      {formatDate(notification.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
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
