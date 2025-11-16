import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Scene } from '../types';
import Button from './Button';

interface JsonImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (scenes: Omit<Scene, 'id'>[]) => void;
  mode?: 'global' | 'single';
}

const convertDetailedJsonToPrompt = (obj: any): string => {
  const parts: string[] = [];
  const traverse = (currentObj: any) => {
    for (const key in currentObj) {
      if (Object.prototype.hasOwnProperty.call(currentObj, key)) {
        const value = currentObj[key];
        if (typeof value === 'string' && value.trim() !== '') {
          parts.push(value.trim());
        } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          traverse(value);
        }
      }
    }
  };
  traverse(obj);
  return parts.join(', ');
};

const JsonImportModal: React.FC<JsonImportModalProps> = ({ isOpen, onClose, onImport, mode = 'global' }) => {
  const { t } = useLanguage();
  const [jsonText, setJsonText] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    // Reset state when modal opens
    if (isOpen) {
      setJsonText('');
      setError(null);
    }
  }, [isOpen]);

  const handleImport = () => {
    setError(null);
    if (!jsonText.trim()) {
      setError(t('jsonEmptyError'));
      return;
    }
    try {
      const parsed = JSON.parse(jsonText);
      let scenesToImport: Omit<Scene, 'id'>[] = [];

      if (Array.isArray(parsed)) {
        // Handle array of simple scenes
        scenesToImport = parsed.map((item, index) => {
          if (typeof item !== 'object' || item === null || typeof item.prompt !== 'string' || !item.prompt.trim()) {
            throw new Error(`${t('jsonFormatError')} (at index ${index})`);
          }
          return {
            prompt: item.prompt,
            usePreviousScene: typeof item.usePreviousScene === 'boolean' ? item.usePreviousScene : false,
            // FIX: Add missing 'isJsonPrompt' property to satisfy the Scene type.
            isJsonPrompt: false,
          };
        });
      } else if (typeof parsed === 'object' && parsed !== null) {
        // Handle single object, which could be simple or detailed
        if (typeof parsed.prompt === 'string' && parsed.prompt.trim()) {
          // Simple format: {"prompt": "..."}
          // FIX: Add missing 'isJsonPrompt' property to satisfy the Scene type.
          scenesToImport.push({
            prompt: parsed.prompt,
            usePreviousScene: typeof parsed.usePreviousScene === 'boolean' ? parsed.usePreviousScene : false,
            isJsonPrompt: false,
          });
        } else {
          // Detailed format
          const generatedPrompt = convertDetailedJsonToPrompt(parsed);
          if (generatedPrompt) {
            // FIX: Add missing 'isJsonPrompt' property to satisfy the Scene type.
            scenesToImport.push({ prompt: generatedPrompt, usePreviousScene: false, isJsonPrompt: false });
          } else {
            throw new Error(t('jsonInvalidObjectFormatError'));
          }
        }
      } else {
        throw new Error(t('jsonInvalidError'));
      }

      if (scenesToImport.length === 0) {
        throw new Error(t('jsonEmptyError'));
      }

      if (mode === 'single' && scenesToImport.length > 1) {
          setError(t('jsonSingleSceneError'));
          return;
      }

      onImport(scenesToImport);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError(t('jsonInvalidError'));
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="relative w-full max-w-2xl bg-gray-800 p-6 rounded-lg shadow-2xl border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-violet-300 mb-2">{t('importJsonTitle')}</h2>
        <p className="text-sm text-gray-400 mb-4">{mode === 'single' ? t('importJsonDescriptionSingle') : t('importJsonDescription')}</p>
        <textarea
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
          placeholder={t('importJsonPlaceholder')}
          className="w-full h-48 bg-gray-900 border border-gray-600 rounded-md p-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors font-mono text-sm"
        />
        {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
        <div className="mt-6 flex justify-end gap-4">
          <Button variant="secondary" onClick={onClose}>{t('cancelButton')}</Button>
          <Button variant="primary" onClick={handleImport}>{t('importButton')}</Button>
        </div>
      </div>
    </div>
  );
};

export default JsonImportModal;