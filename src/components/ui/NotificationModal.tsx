import React from 'react';
import BottomSheet from './BottomSheet';
import { Bell, CheckCircle, AlertCircle, XCircle, InfoIcon } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  type?: NotificationType;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  type = 'info',
  action,
}) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-8 h-8 text-green-500" />;
      case 'error':
        return <XCircle className="w-8 h-8 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-8 h-8 text-yellow-500" />;
      case 'info':
      default:
        return <InfoIcon className="w-8 h-8 text-indigo-700" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50';
      case 'error':
        return 'bg-red-50';
      case 'warning':
        return 'bg-yellow-50';
      case 'info':
      default:
        return 'bg-indigo-700';
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-800';
      case 'error':
        return 'text-red-800';
      case 'warning':
        return 'text-yellow-800';
      case 'info':
      default:
        return 'text-white';
    }
  };

  const getButtonColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-600 hover:bg-green-700';
      case 'error':
        return 'bg-red-600 hover:bg-red-700';
      case 'warning':
        return 'bg-yellow-600 hover:bg-yellow-700';
      case 'info':
      default:
        return 'bg-white hover:bg-gray-100 text-indigo-700 border border-indigo-100';
    }
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} height="auto">
      <div className={`rounded-xl overflow-hidden ${getBgColor()}`}>
        <div className="flex flex-col items-center px-6 py-8">
          {type !== 'info' ? getIcon() : <Bell className="w-8 h-8 text-white" />}
          
          {title && (
            <h3 className={`text-xl font-semibold mt-4 mb-2 text-center ${getTextColor()}`}>
              {title}
            </h3>
          )}
          
          <p className={`text-center mb-6 ${getTextColor()}`}>{message}</p>
          
          <div className="flex w-full gap-4">
            <button
              onClick={onClose}
              className={`py-3 px-4 rounded-md flex-1 font-medium transition-colors 
                ${type === 'info' ? 'text-white border border-white/30 hover:bg-indigo-800' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            >
              Close
            </button>
            
            {action && (
              <button
                onClick={() => {
                  action.onClick();
                  onClose();
                }}
                className={`py-3 px-4 rounded-md flex-1 font-medium ${getButtonColor()} ${type === 'info' ? '' : 'text-white'}`}
              >
                {action.label}
              </button>
            )}
          </div>
        </div>
      </div>
    </BottomSheet>
  );
};

export default NotificationModal;
