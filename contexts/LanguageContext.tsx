import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { translations, TranslationKeys } from '../i18n/translations';

export type Language = 'en' | 'id';

type TranslationValues = { [key: string]: string | number };

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: keyof TranslationKeys, values?: TranslationValues) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const storedLanguage = localStorage.getItem('language');
      return (storedLanguage === 'en' || storedLanguage === 'id') ? storedLanguage : 'id';
    } catch (error) {
      return 'id';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('language', language);
    } catch (error) {
      console.error("Could not save language to localStorage:", error);
    }
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = useCallback((key: keyof TranslationKeys, values?: TranslationValues): string => {
    let translation = translations[language][key] || translations['en'][key];
    if (values) {
        Object.keys(values).forEach(valueKey => {
            translation = translation.replace(`{${valueKey}}`, String(values[valueKey]));
        });
    }
    return translation;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
