import React, { createContext, useContext, useState } from 'react';
import NotificationModal from '../components/ui/NotificationModal';
import type { NotificationType } from '../components/ui/NotificationModal';

interface NotificationContextType {
  showNotification: (props: {
    title?: string;
    message: string;
    type?: NotificationType;
    action?: {
      label: string;
      onClick: () => void;
    };
  }) => void;
  hideNotification: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notificationProps, setNotificationProps] = useState({
    title: '',
    message: '',
    type: 'info' as NotificationType,
    action: undefined as { label: string; onClick: () => void } | undefined,
  });

  const showNotification = ({
    title,
    message,
    type = 'info',
    action,
  }: {
    title?: string;
    message: string;
    type?: NotificationType;
    action?: { label: string; onClick: () => void };
  }) => {
    setNotificationProps({
      title: title || '',
      message,
      type,
      action,
    });
    setIsOpen(true);
  };

  const hideNotification = () => {
    setIsOpen(false);
  };

  return (
    <NotificationContext.Provider value={{ showNotification, hideNotification }}>
      {children}
      <NotificationModal
        isOpen={isOpen}
        onClose={hideNotification}
        title={notificationProps.title}
        message={notificationProps.message}
        type={notificationProps.type}
        action={notificationProps.action}
      />
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
