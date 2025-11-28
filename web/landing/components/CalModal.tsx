import React from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface CalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CalModal: React.FC<CalModalProps> = ({ isOpen, onClose }) => {
  React.useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const modalContent = (
      <div 
        className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          margin: 0,
          padding: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <div 
          className="relative bg-white rounded-lg shadow-2xl w-full max-w-4xl flex flex-col"
          onClick={(e) => e.stopPropagation()}
          style={{ 
            maxHeight: '95vh',
            height: '95vh',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            margin: 'auto',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0" style={{ height: '73px' }}>
            <h2 className="text-lg font-sans font-medium">Schedule a Meeting</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>

          {/* Cal.com Embed */}
          <div 
            className="flex-1"
            style={{ 
              height: 'calc(95vh - 73px)',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <iframe
              src="https://cal.com/junaidm/30min"
              className="w-full border-0"
              title="Schedule a meeting"
              allow="camera; microphone; geolocation"
              scrolling="no"
              style={{ 
                width: '100%',
                height: '100%',
                border: 'none',
                display: 'block',
                overflow: 'hidden',
              }}
            />
          </div>
        </div>
      </div>
  );

  return createPortal(modalContent, document.body);
};

export default CalModal;

