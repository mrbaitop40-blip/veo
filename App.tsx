import React, { useState } from 'react';
import VideoGenerator from './components/VideoGenerator';
import ImageEditor from './components/ImageEditor';
import LanguageSwitcher from './components/LanguageSwitcher';
import { useLanguage } from './contexts/LanguageContext';
import Veo3PromptGenerator from './components/Veo3PromptGenerator';
import ApiKeyManager from './components/ApiKeyManager';

type ActiveTab = 'video' | 'image' | 'veo3';

// A small helper component for tab buttons
interface TabButtonProps {
    label: string;
    isActive: boolean;
    onClick: () => void;
    icon: React.ReactNode;
}

const TabButton: React.FC<TabButtonProps> = ({ label, isActive, onClick, icon }) => {
    const activeClasses = "border-violet-500 text-white";
    const inactiveClasses = "border-transparent text-gray-400 hover:text-white";
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 py-3 px-4 text-sm font-semibold border-b-2 transition-colors duration-200 ${isActive ? activeClasses : inactiveClasses}`}
        >
            {icon}
            {label}
        </button>
    );
};


const App: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<ActiveTab>('video');

  return (
    <div className="min-h-screen bg-black text-gray-200 flex flex-col">
       <header className="flex items-center justify-between p-3 border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-bold text-white">
            {t('appTitle')}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
        </div>
      </header>

      <ApiKeyManager />

      {/* Tab Navigation */}
      <nav className="px-4 border-b border-gray-800 bg-gray-900/80 z-10 backdrop-blur-sm">
        <div className="flex items-center">
          <TabButton
            label={t('videoGeneratorTab')}
            isActive={activeTab === 'video'}
            onClick={() => setActiveTab('video')}
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" /><path d="M14.553 7.106A1 1 0 0014 8v4a1 1 0 001.553.832l3-2a1 1 0 000-1.664l-3-2z" /></svg>}
          />
          <TabButton
            label={t('imageEditorTab')}
            isActive={activeTab === 'image'}
            onClick={() => setActiveTab('image')}
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" /></svg>}
          />
          <TabButton
            label={t('veo3PromptGeneratorTab')}
            isActive={activeTab === 'veo3'}
            onClick={() => setActiveTab('veo3')}
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 01.867.5 1 1 0 01.142.94l-1.028 4.114a1 1 0 00.378 1.054l2.757 2.068a1 1 0 01.32 1.353l-1.82 2.427a1 1 0 01-1.354.32l-2.757-2.068a1 1 0 00-1.054.378L7.55 17.633a1 1 0 01-.94.142A1 1 0 016 17V3a1 1 0 011-1h3a1 1 0 011 1zM9 4H7v11.517l1.028-4.114a1 1 0 011.054-.378l2.757 2.068L13.18 10.67a1 1 0 00-.32-1.353l-2.757-2.068a1 1 0 01-.378-1.054L10.757 2.08a1 1 0 00-1.204-.527L9 4z" clipRule="evenodd" /></svg>}
          />
        </div>
      </nav>

      <div className="flex-grow relative">
        <div className={`h-full ${activeTab === 'video' ? 'block' : 'hidden'}`}>
          <VideoGenerator />
        </div>
        <div className={`h-full ${activeTab === 'image' ? 'block' : 'hidden'}`}>
          <div className="p-4 md:p-8 overflow-y-auto h-full">
            <ImageEditor />
          </div>
        </div>
        <div className={`h-full ${activeTab === 'veo3' ? 'block' : 'hidden'}`}>
            <Veo3PromptGenerator />
        </div>
      </div>
    </div>
  );
};

export default App;