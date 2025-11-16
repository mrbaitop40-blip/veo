import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import Button from './Button';

interface OutputBoxProps {
  title: string;
  language: string;
  content: string;
}

const OutputBox: React.FC<OutputBoxProps> = ({ title, language, content }) => {
  const { t } = useLanguage();
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <div className="bg-gray-800/50 rounded-lg border border-gray-700 h-full flex flex-col">
      <div className="flex justify-between items-center p-3 border-b border-gray-700 bg-gray-800/70 rounded-t-lg">
        <div>
          <h3 className="font-semibold text-emerald-300">{title}</h3>
          <p className="text-xs text-gray-400">{language}</p>
        </div>
        <Button
          variant="secondary"
          size="small"
          onClick={handleCopy}
          disabled={!content}
          className={isCopied ? '!bg-green-500 !text-white' : ''}
        >
          {isCopied ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" /><path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" /></svg>
          )}
          {isCopied ? t('copiedButton') : t('copyButton')}
        </Button>
      </div>
      <pre className="p-4 text-sm text-gray-300 overflow-auto flex-grow whitespace-pre-wrap font-mono">
        {content || <span className="text-gray-500">Output will appear here...</span>}
      </pre>
    </div>
  );
};

export default OutputBox;