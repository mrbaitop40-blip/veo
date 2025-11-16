import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import Spinner from './Spinner';

interface ImagePreviewModalProps {
  imageUrl: string;
  onClose: () => void;
}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({ imageUrl, onClose }) => {
  const { t } = useLanguage();
  
  // Window position state
  const [position, setPosition] = useState({ x: -9999, y: -9999 }); // Start off-screen
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, initialX: 0, initialY: 0 });
  const [windowSize, setWindowSize] = useState<{ width: number; height: number } | null>(null);
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);

  const windowRef = useRef<HTMLDivElement>(null);
  
  // Load image to determine its natural dimensions
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImageSize({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.src = imageUrl;
  }, [imageUrl]);

  // Calculate window size and position once the image size is known
  useEffect(() => {
    if (imageSize) {
      const titleBarHeight = 40; // Corresponds to h-10
      const viewportPadding = 80; // Min space from viewport edges

      const maxWidth = window.innerWidth - viewportPadding;
      const maxHeight = window.innerHeight - viewportPadding;
      const contentMaxHeight = maxHeight - titleBarHeight;

      const finalWidth = Math.min(imageSize.width, maxWidth);
      const finalHeight = Math.min(imageSize.height, contentMaxHeight) + titleBarHeight;

      setWindowSize({ width: finalWidth, height: finalHeight });

      // Center the window
      const initialX = Math.max((viewportPadding / 2), (window.innerWidth - finalWidth) / 2);
      const initialY = Math.max((viewportPadding / 2), (window.innerHeight - finalHeight) / 2);
      
      setPosition({ x: initialX, y: initialY });
    }
  }, [imageSize]);

  const handleDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY, initialX: position.x, initialY: position.y };
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      setPosition({ x: dragStartRef.current.initialX + dx, y: dragStartRef.current.initialY + dy });
    }
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);
  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);
  
  const windowStyle: React.CSSProperties = windowSize ? {
      position: 'absolute',
      top: position.y,
      left: position.x,
      width: windowSize.width,
      height: windowSize.height,
      visibility: position.x === -9999 ? 'hidden' : 'visible'
  } : {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 200,
      height: 200,
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" aria-modal="true" role="dialog" onClick={onClose}>
      <div
        ref={windowRef}
        className="bg-gray-800 rounded-lg shadow-2xl flex flex-col border border-gray-600"
        style={windowStyle}
        onClick={(e) => e.stopPropagation()}
      >
        {windowSize && imageSize ? (
          <>
            <div
              onMouseDown={handleDragStart}
              className="h-10 px-4 flex items-center justify-between bg-gray-900 rounded-t-lg cursor-move border-b border-gray-700 flex-shrink-0"
            >
              <span className="font-bold text-gray-300">{t('imagePreviewTitle')}</span>
              <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label={t('closePreviewLabel')}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-grow w-full h-full bg-black overflow-auto">
              <img 
                  src={imageUrl} 
                  alt={t('imagePreviewAlt')}
                  style={{ width: imageSize.width, height: imageSize.height }}
              />
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Spinner />
          </div>
        )}
      </div>
    </div>
  );
};

export default ImagePreviewModal;