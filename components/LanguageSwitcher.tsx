import React, { useState, useRef, useEffect } from 'react';
import { useLanguage, Language } from '../contexts/LanguageContext';
import IndonesiaFlag from './icons/IndonesiaFlag';
import UKFlag from './icons/UKFlag';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const languageOptions: { lang: Language; label: string; icon: React.ReactNode }[] = [
    { lang: 'id', label: t('languageIndonesian'), icon: <IndonesiaFlag /> },
    { lang: 'en', label: t('languageEnglish'), icon: <UKFlag /> },
  ];

  const currentLanguage = languageOptions.find(opt => opt.lang === language);

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-violet-500"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {currentLanguage?.icon}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-20">
          <ul className="py-1">
            {languageOptions.map(option => (
              <li key={option.lang}>
                <button
                  onClick={() => handleLanguageChange(option.lang)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-violet-600 flex items-center gap-3"
                >
                  {option.icon}
                  <span>{option.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;