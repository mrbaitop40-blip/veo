import React, { useRef, useCallback, useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface ImageUploaderProps {
  onFilesChange: (files: File[]) => void;
  files: File[];
  maxFiles?: number;
  variant?: 'grid' | 'single';
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onFilesChange, files, maxFiles = 1, variant = 'grid' }) => {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const effectiveMaxFiles = variant === 'single' ? 1 : maxFiles;

  useEffect(() => {
    if (files && files.length > 0) {
      const urls = files.map(file => URL.createObjectURL(file));
      setPreviewUrls(urls);

      return () => {
        urls.forEach(url => URL.revokeObjectURL(url));
      };
    } else {
      setPreviewUrls([]);
    }
  }, [files]);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      const newFiles: File[] = Array.from(selectedFiles);
      if (variant === 'single') {
        onFilesChange(newFiles.slice(0, 1));
      } else {
        const combined = [...files, ...newFiles];
        onFilesChange(combined.slice(0, effectiveMaxFiles));
      }
    }
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = useCallback((indexToRemove: number) => {
    const updatedFiles = files.filter((_, index) => index !== indexToRemove);
    onFilesChange(updatedFiles);
  }, [files, onFilesChange]);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const SingleFileView = () => (
    <div className="relative group aspect-square bg-black rounded-md">
      <img src={previewUrls[0]} alt={`Preview 1`} className="w-full h-full object-contain rounded-md" />
      <div className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-md gap-4">
        <button type="button" onClick={triggerFileInput} className="text-white hover:text-gray-300 text-sm font-semibold">{t('changeImageButton')}</button>
        <button type="button" onClick={() => handleRemoveImage(0)} className="text-red-500 hover:text-red-400 text-sm font-semibold">{t('removeButton')}</button>
      </div>
    </div>
  );

  const GridView = () => (
    <div className="grid grid-cols-3 gap-2">
        {previewUrls.map((url, index) => (
            <div key={index} className="relative group aspect-square bg-black rounded-md">
                <img src={url} alt={`Preview ${index + 1}`} className="w-full h-full object-contain rounded-md" />
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                    <button type="button" onClick={() => handleRemoveImage(index)} className="text-red-500 hover:text-red-400 text-sm font-semibold">{t('removeButton')}</button>
                </div>
            </div>
        ))}
        {files.length < effectiveMaxFiles && (
            <div 
                onClick={triggerFileInput}
                className="bg-gray-900/50 border-2 border-dashed border-gray-700 rounded-lg p-4 text-center flex flex-col items-center justify-center text-gray-500 hover:border-violet-500 hover:text-violet-400 transition-colors cursor-pointer aspect-square"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" /></svg>
                <p className="mt-2 text-xs font-semibold">{t('addMoreImagesButton')}</p>
            </div>
        )}
    </div>
  );

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
        multiple={variant === 'grid' && effectiveMaxFiles > 1}
      />
      {files.length > 0 ? (
        variant === 'single' ? <SingleFileView /> : <GridView />
      ) : (
        <div 
          onClick={triggerFileInput}
          className="bg-gray-900/50 border-2 border-dashed border-gray-700 rounded-lg p-8 text-center flex flex-col items-center justify-center space-y-2 text-gray-500 hover:border-violet-500 hover:text-violet-400 transition-colors cursor-pointer"
        >
           <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          <p className="font-semibold">{effectiveMaxFiles > 1 ? t('uploadMultipleImagesHint') : t('uploadSingleImageHint')}</p>
          <p className="text-xs">JPG / PNG files up to 10MB</p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;