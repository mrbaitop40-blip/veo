import React from 'react';
import Button from './Button';
import { useLanguage } from '../contexts/LanguageContext';

interface VideoPlayerProps {
  videoUrl: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl }) => {
  const { t } = useLanguage();
  return (
    <div className="w-full flex flex-col items-center space-y-3">
      <video src={videoUrl} controls loop className="w-full rounded-md shadow-lg shadow-black/30" />
      <a href={videoUrl} download={`generated-video-${Date.now()}.mp4`}>
        <Button variant="secondary" size="small">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
          {t('downloadVideoButton')}
        </Button>
      </a>
    </div>
  );
};

export default VideoPlayer;