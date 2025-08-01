import React, { useEffect, useState } from 'react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  height?: string; // Custom height (default is 'auto')
}

const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  children,
  height = 'auto',
}) => {
  const [isRendered, setIsRendered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Handle animation states
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (isOpen) {
      setIsRendered(true);
      // Small delay to ensure DOM is ready before starting animation
      timeoutId = setTimeout(() => {
        setIsAnimating(true);
      }, 10);
    } else {
      setIsAnimating(false);
      // Delay unmounting to allow for close animation
      timeoutId = setTimeout(() => {
        setIsRendered(false);
      }, 350); // Slightly longer to ensure smooth closing
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isOpen]);

  // Handle clicks outside the modal
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isRendered) {
    return null;
  }

  return (
    <div 
      className={`fixed inset-0 z-50 bg-black transition-all duration-300 ease-in-out ${
        isAnimating ? 'bg-opacity-50' : 'bg-opacity-0'
      }`}
      onClick={handleBackdropClick}
    >
      <div 
        className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-xl transform transition-all duration-300 ease-in-out ${
          isAnimating ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ maxHeight: '90vh', height }}
      >
        {/* Drag indicator */}
        <div className="flex justify-center pt-2 pb-4">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
        </div>
        
        {/* Header with title */}
        {title && (
          <div className="px-6 pb-4 border-b">
            <h2 className="text-lg font-semibold text-center">{title}</h2>
          </div>
        )}
        
        {/* Content */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 100px)' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default BottomSheet;
