import React, { useEffect, useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface VideoPreviewModalProps {
  videoUrl: string;
  onClose: () => void;
}

const VideoPreviewModal: React.FC<VideoPreviewModalProps> = ({ videoUrl, onClose }) => {
  const { t } = useLanguage();
  
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Cleanup blob URL when component unmounts
  useEffect(() => {
      return () => {
          if (videoUrl.startsWith('blob:')) {
              URL.revokeObjectURL(videoUrl);
          }
      };
  }, [videoUrl]);
  
  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" 
      aria-modal="true" 
      role="dialog" 
      onClick={onClose}
    >
      <div
        className="bg-gray-800 rounded-lg shadow-2xl flex flex-col border border-gray-600 w-full max-w-4xl max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-10 px-4 flex items-center justify-between bg-gray-900 rounded-t-lg border-b border-gray-700 flex-shrink-0">
          <span className="font-bold text-gray-300">{t('videoPreviewTitle')}</span>
          <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label={t('closePreviewLabel')}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-grow p-4 bg-black overflow-hidden flex items-center justify-center">
            <video 
                src={videoUrl} 
                controls 
                autoPlay 
                loop
                className="max-w-full max-h-full"
            />
        </div>
      </div>
    </div>
  );
};

export default VideoPreviewModal;
