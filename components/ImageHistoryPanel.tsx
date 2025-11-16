import React from 'react';
import { ImageHistoryItem } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import Button from './Button';
import { db } from '../services/db';

interface ImageHistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  history: ImageHistoryItem[];
  onPreview: (id: string) => void;
  onLoad: (item: ImageHistoryItem) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
}

const ImageHistoryItemCard: React.FC<{ 
    item: ImageHistoryItem, 
    onPreview: (id: string) => void, 
    onLoad: (item: ImageHistoryItem) => void, 
    onDelete: (id: string) => void 
}> = ({ item, onPreview, onLoad, onDelete }) => {
    const { t } = useLanguage();
    const date = new Date(item.timestamp).toLocaleString();
    const prompt = item.settings.prompt.substring(0, 50) + (item.settings.prompt.length > 50 ? '...' : '');

    const handleDownload = async () => {
        try {
            const imageBlob = await db.images.get(item.id);
            if (imageBlob) {
                const url = URL.createObjectURL(imageBlob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `generated-image-${item.id}.png`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }
        } catch (error) {
            console.error("Failed to download image from history:", error);
        }
    };
    
    return (
        <div className="bg-gray-800 rounded-lg p-3 flex flex-col gap-3 border border-gray-700">
            <img src={item.thumbnailDataUrl} alt="Generated image thumbnail" className="w-full h-auto object-cover rounded aspect-square bg-black" />
            <div className="flex-grow">
                <p className="text-xs text-gray-400 font-mono" title={item.settings.prompt}>{prompt}</p>
                <p className="text-xs text-gray-500 mt-1">{date}</p>
            </div>
            <div className="flex gap-2 justify-between flex-wrap">
                 <Button variant="secondary" size="small" onClick={() => onDelete(item.id)} aria-label={t('deleteFromImageHistoryButton')} title={t('deleteFromImageHistoryButton')}><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg></Button>
                 <div className="flex gap-2">
                    <Button variant="secondary" size="small" onClick={() => onLoad(item)}>{t('loadImageSettingsButton')}</Button>
                    <Button variant="secondary" size="small" onClick={() => onPreview(item.id)}>{t('previewImageButton')}</Button>
                    <Button variant="primary" size="small" onClick={handleDownload}>{t('downloadImageButton')}</Button>
                </div>
            </div>
        </div>
    )
}

const ImageHistoryPanel: React.FC<ImageHistoryPanelProps> = ({ isOpen, onClose, history, onPreview, onLoad, onDelete, onClear }) => {
  const { t } = useLanguage();

  const handleClear = () => {
      if (window.confirm(t('confirmClearImageHistory'))) {
          onClear();
      }
  }

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-30 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <aside className={`fixed top-0 right-0 h-full w-full max-w-md bg-gray-900 border-l border-gray-700 shadow-2xl z-40 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
            <header className="p-4 border-b border-gray-700 flex justify-between items-center flex-shrink-0">
                <h2 className="text-xl font-bold text-white">{t('imageHistoryTitle')}</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </header>
            
            <div className="p-4 flex-grow overflow-y-auto">
                {history.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                        {history.map(item => (
                            <ImageHistoryItemCard key={item.id} item={item} onPreview={onPreview} onLoad={onLoad} onDelete={onDelete} />
                        ))}
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full text-center text-gray-600">
                        <p>{t('noImageHistoryMessage')}</p>
                    </div>
                )}
            </div>

            {history.length > 0 && (
                 <footer className="p-4 border-t border-gray-700 flex-shrink-0">
                    <Button variant="secondary" onClick={handleClear} className="w-full !bg-red-900/50 !border-red-700/50 hover:!bg-red-800/50 !text-red-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                        {t('clearImageHistoryButton')}
                    </Button>
                </footer>
            )}
        </div>
      </aside>
    </>
  );
};

export default ImageHistoryPanel;