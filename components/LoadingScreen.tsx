import React, { useState, useEffect } from 'react';
import Spinner from './Spinner';
import { useLanguage } from '../contexts/LanguageContext';

interface LoadingScreenProps {
    message?: string | null;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ message }) => {
  const { t } = useLanguage();
  const [messageIndex, setMessageIndex] = useState(0);

  const loadingMessages = [
    t('loadingMessage1'),
    t('loadingMessage2'),
    t('loadingMessage3'),
    t('loadingMessage4'),
    t('loadingMessage5'),
    t('loadingMessage6'),
    t('loadingMessage7'),
    t('loadingMessage8'),
  ];

  useEffect(() => {
    if (!message) {
        const interval = setInterval(() => {
        setMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
        }, 3000);
        return () => clearInterval(interval);
    }
  }, [loadingMessages.length, message]);

  return (
    <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
      <Spinner />
      <h2 className="text-2xl font-bold mt-6 text-violet-300">{t('generatingVideoTitle')}</h2>
      <p className="mt-2 text-gray-300 transition-opacity duration-500 ease-in-out">
        {message || loadingMessages[messageIndex]}
      </p>
    </div>
  );
};

export default LoadingScreen;