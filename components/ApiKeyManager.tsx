import React, { useState, useEffect } from 'react';
import { useApiKey } from '../hooks/useApiKey';
import { useLanguage } from '../contexts/LanguageContext';
import TextInput from './TextInput';
import Button from './Button';

const ApiKeyManager: React.FC = () => {
  const { t } = useLanguage();
  const { apiKey, saveApiKey, removeApiKey } = useApiKey();
  const [inputValue, setInputValue] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    if (apiKey) {
      setInputValue(''); // Clear input after saving or if key already exists
    }
  }, [apiKey]);

  const handleSave = () => {
    if (inputValue.trim()) {
      saveApiKey(inputValue.trim());
      setStatusMessage(t('apiKeySavedSuccess'));
      setTimeout(() => setStatusMessage(''), 3000);
    }
  };

  const handleRemove = () => {
    removeApiKey();
    setStatusMessage(t('apiKeyRemovedSuccess'));
    setTimeout(() => setStatusMessage(''), 3000);
  };

  return (
    <div className="bg-gray-800/50 p-4 border-b border-gray-700">
      <h2 className="text-lg font-semibold text-violet-300 mb-2">{t('apiKeyManagerTitle')}</h2>
      <div className="flex flex-col md:flex-row items-start md:items-end gap-4">
        <div className="flex-grow w-full">
            <TextInput
                label={t('apiKeyInputLabel')}
                value={inputValue}
                onChange={setInputValue}
                placeholder={t('apiKeyInputPlaceholder')}
                type="password"
            />
        </div>
        <div className="flex gap-2 flex-shrink-0">
            <Button onClick={handleSave} disabled={!inputValue.trim()}>{t('saveApiKeyButton')}</Button>
            {apiKey && <Button variant="secondary" className="!bg-red-900/50 !border-red-700/50 hover:!bg-red-800/50 !text-red-300" onClick={handleRemove}>{t('removeApiKeyButton')}</Button>}
        </div>
      </div>
      {statusMessage && <p className="text-sm text-green-400 mt-2">{statusMessage}</p>}
      <p className="text-xs text-gray-500 mt-2">{t('apiKeySecurityWarning')}</p>
    </div>
  );
};

export default ApiKeyManager;
