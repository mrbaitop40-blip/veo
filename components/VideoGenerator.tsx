import React, { useState, useCallback, useEffect, useRef } from 'react';
import { generateVideo } from '../services/geminiService';
import { AspectRatio, Resolution, VeoModel, CharacterVoice, VisualStyle, Scene, GenerationSettings, HistoryItem } from '../types';
import { getVideoFrameAsBase64, isValidJson } from '../utils/videoUtils';
import { useVideoHistory } from '../hooks/useVideoHistory';
import { useApiKey } from '../hooks/useApiKey';

import Button from './Button';
import ImageUploader from './ImageUploader';
import Spinner from './Spinner';
import SelectInput from './SelectInput';
import TextAreaInput from './TextAreaInput';
import ToggleSwitch from './ToggleSwitch';
import VideoPlayer from './VideoPlayer';
import RadioButtonGroup from './RadioButtonGroup';
import HistoryPanel from './HistoryPanel';
import VideoPreviewModal from './VideoPreviewModal';
import { useLanguage } from '../contexts/LanguageContext';

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });

type OutputStatus = 'pending' | 'generating' | 'done';
interface Output {
  id: number;
  status: OutputStatus;
  url?: string;
}

const VideoGenerator: React.FC = () => {
  const { t } = useLanguage();
  const { apiKey } = useApiKey();
  const [scenes, setScenes] = useState<Scene[]>([{ id: Date.now(), prompt: '', usePreviousScene: false, isJsonPrompt: false }]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [enableSound, setEnableSound] = useState<boolean>(true);
  const [resolution, setResolution] = useState<Resolution>('720p');
  const [veoModel, setVeoModel] = useState<VeoModel>('veo-3.1-fast-generate-preview');
  const [visualStyle, setVisualStyle] = useState<VisualStyle>('Cinematic');
  const [characterVoice, setCharacterVoice] = useState<CharacterVoice>('none');
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isStopping, setIsStopping] = useState<boolean>(false);
  const stopRequested = useRef(false);
  const [error, setError] = useState<string | null>(null);
  const [outputs, setOutputs] = useState<Output[]>([]);
  
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const { history, addHistoryItem, removeHistoryItem, clearHistory } = useVideoHistory();
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null);

  const isVeo3Plus = veoModel.startsWith('veo-3.');
  const isLatestVeo = veoModel.startsWith('veo-3.1');

  useEffect(() => {
    if (!isVeo3Plus) {
      setCharacterVoice('none');
    }
  }, [isVeo3Plus]);

  useEffect(() => {
    if (veoModel === 'veo-2.0-generate-001') {
      setEnableSound(false);
    }
  }, [veoModel]);
  
  const handleAddScene = () => {
    setScenes([...scenes, { id: Date.now(), prompt: '', usePreviousScene: true, isJsonPrompt: false }]);
  };

  const handleRemoveScene = (id: number) => {
    setScenes(scenes.filter(scene => scene.id !== id));
  };

  const handleSceneChange = (id: number, field: keyof Scene, value: any) => {
    setScenes(scenes.map(scene => {
      if (scene.id === id) {
        const updatedScene = { ...scene, [field]: value };
        
        if (field === 'prompt' && !isValidJson(value as string)) {
          updatedScene.isJsonPrompt = false;
        }

        return updatedScene;
      }
      return scene;
    }));
  };

  const handleFilesChange = useCallback((files: File[]) => {
    setImageFiles(files);
  }, []);

  const handleStop = useCallback(() => {
    stopRequested.current = true;
    setIsStopping(true);
  }, []);

  const clearProject = useCallback(() => {
    setScenes([{ id: Date.now(), prompt: '', usePreviousScene: false, isJsonPrompt: false }]);
    setImageFiles([]);
    setAspectRatio('16:9');
    setEnableSound(true);
    setResolution('720p');
    setVeoModel('veo-3.1-fast-generate-preview');
    setVisualStyle('Cinematic');
    setCharacterVoice('none');
    setError(null);
    setOutputs([]);
  }, []);
  
  const handleLoadFromHistory = (item: HistoryItem) => {
    const settings = item.settings;
    setScenes(settings.scenes.map(s => ({ ...s, id: Date.now() })));
    setAspectRatio(settings.aspectRatio);
    setEnableSound(settings.enableSound);
    setResolution(settings.resolution);
    setVeoModel(settings.veoModel);
    setVisualStyle(settings.visualStyle);
    setCharacterVoice(settings.characterVoice);

    if (settings.startImage) {
        const byteString = atob(settings.startImage.base64);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], { type: settings.startImage.mimeType });
        const file = new File([blob], settings.startImage.name, { type: settings.startImage.mimeType });
        setImageFiles([file]);
    } else {
        setImageFiles([]);
    }
    
    setIsHistoryOpen(false);
    setOutputs([]);
    setError(null);
  };

  const handlePlayFromHistory = async (videoUrl: string) => {
      setPreviewVideoUrl(videoUrl);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey) {
      setError(t('apiKeyMissingError'));
      return;
    }
    if (scenes.some(s => !s.prompt.trim())) {
        setError(t('promptRequiredForSceneError'));
        return;
    }

    setIsLoading(true);
    setIsStopping(false);
    stopRequested.current = false;
    setError(null);
    setOutputs(scenes.map(scene => ({ id: scene.id, status: 'pending' })));

    let lastFrame: { base64: string; mimeType: string } | null = null;

    try {
      if (imageFiles.length > 0) {
        const imageFile = imageFiles[0];
        lastFrame = {
          base64: await fileToBase64(imageFile),
          mimeType: imageFile.type,
        };
      }

      for (let i = 0; i < scenes.length; i++) {
        if (stopRequested.current) {
            break;
        }

        const scene = scenes[i];
        
        setOutputs(prev => prev.map((output, index) => index === i ? { ...output, status: 'generating' } : output));
        
        let imageBase64: string | null = null;
        let imageMimeType: string | null = null;

        const useImage = (i === 0 && imageFiles.length > 0) || (i > 0 && scene.usePreviousScene);

        if (useImage && lastFrame) {
            imageBase64 = lastFrame.base64;
            imageMimeType = lastFrame.mimeType;
        }

        let promptPayload: string | object = scene.prompt;
        if (scene.isJsonPrompt) {
            try {
                promptPayload = JSON.parse(scene.prompt);
            } catch (err) {
                 console.error(`Invalid JSON in scene ${i + 1}:`, scene.prompt);
                 setError(`Error: Prompt for Scene ${i + 1} is marked as JSON but is invalid.`);
                 setIsLoading(false);
                 setIsStopping(false);
                 setOutputs(prev => prev.map(o => o.status === 'generating' ? { ...o, status: 'pending' } : o));
                 return; 
            }
        }

        const generatedUrl = await generateVideo(
          { prompt: promptPayload, imageBase64, imageMimeType, model: veoModel },
          aspectRatio,
          enableSound,
          resolution,
          characterVoice,
          visualStyle
        );
        
        setOutputs(prev => prev.map((output, index) => index === i ? { ...output, status: 'done', url: generatedUrl } : output));
        
        // Save to history
        const response = await fetch(generatedUrl);
        const videoBlob = await response.blob();
        
        const generationSettings: GenerationSettings = {
            scenes: [scene],
            aspectRatio,
            enableSound,
            resolution,
            veoModel,
            visualStyle,
            characterVoice,
        };

        if (useImage && lastFrame) {
            generationSettings.startImage = { 
                ...lastFrame, 
                name: (i === 0 && imageFiles.length > 0) ? imageFiles[0].name : 'previous_frame.jpg' 
            };
        }
        await addHistoryItem(generationSettings, videoBlob);
        
        if (i < scenes.length - 1 && scenes[i + 1].usePreviousScene) {
          lastFrame = await getVideoFrameAsBase64(generatedUrl, 'end');
        }
      }
      
      if (stopRequested.current) {
        setError(t('generationStoppedByUser'));
      }

    } catch (err) {
      if (!stopRequested.current) {
        if (err instanceof Error && err.message.includes("local storage")) {
            setError(t('apiKeyMissingError'));
        } else {
            const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred.';
            setError(`${t('generationFailedError')} ${errorMessage}`);
        }
        setOutputs(prev => prev.map(o => ({ ...o, status: o.status === 'generating' ? 'pending' : o.status })));
      }
    } finally {
      setIsLoading(false);
      setIsStopping(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 h-full">
        {/* Controls Panel */}
        <aside className="lg:col-span-3 bg-gray-900 p-4 border-r border-gray-800 overflow-y-auto h-full">
          <form onSubmit={handleSubmit} className="space-y-6 flex flex-col h-full">
            <fieldset disabled={isLoading} className="space-y-6 flex-grow">
               <div className="flex items-center justify-between gap-2">
                  <h2 className="text-lg font-bold text-emerald-300">{t('settingsTitle')}</h2>
                  <Button type="button" variant="secondary" size="small" onClick={() => setIsHistoryOpen(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.415L11 9.586V6z" clipRule="evenodd" /></svg>
                    {t('historyTitle')}
                  </Button>
               </div>
               <div className="flex items-center gap-2">
                  <SelectInput<VeoModel>
                    label={t('veoModelLabel')}
                    value={veoModel}
                    onChange={setVeoModel}
                    options={[
                      { value: 'veo-3.1-fast-generate-preview', label: 'veo-3.1-fast-generate-preview' },
                      { value: 'veo-3.1-generate-preview', label: 'veo-3.1-generate-preview' },
                      { value: 'veo-3.0-generate-preview', label: 'veo-3.0-generate-preview' },
                      { value: 'veo-3.0-generate-001', label: 'veo-3.0-generate-001' },
                      { value: 'veo-3.0-fast-generate-001', label: 'veo-3.0-fast-generate-001' },
                      { value: 'veo-2.0-generate-001', label: 'veo-2.0-generate-001' },
                    ]}
                  />
                  {isLatestVeo && <span className="mt-4 bg-violet-500/20 text-violet-300 text-xs font-bold px-2 py-1 rounded-full">NEW</span>}
              </div>
            
              <ImageUploader files={imageFiles} onFilesChange={handleFilesChange} maxFiles={1} />
              
              <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-emerald-300">{t('scenesTitle')}</h3>
                {scenes.map((scene, index) => (
                  <div key={scene.id} className="bg-gray-800/50 p-3 rounded-lg border border-gray-700 relative space-y-2">
                     <div className="flex items-center justify-between">
                       <span className="text-xs font-semibold text-emerald-300">{t('sceneLabel')} {index + 1}</span>
                        {scenes.length > 1 && (
                          <button type="button" onClick={() => handleRemoveScene(scene.id)} className="text-gray-500 hover:text-red-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        )}
                     </div>
                    <TextAreaInput 
                      label=""
                      value={scene.prompt}
                      onChange={(val) => handleSceneChange(scene.id, 'prompt', val)}
                      placeholder={t('promptPlaceholder')}
                    />
                     <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id={`json-prompt-checkbox-${scene.id}`}
                                checked={scene.isJsonPrompt}
                                onChange={(e) => handleSceneChange(scene.id, 'isJsonPrompt', e.target.checked)}
                                disabled={!isValidJson(scene.prompt)}
                                className="h-4 w-4 rounded text-violet-600 bg-gray-700 border-gray-600 focus:ring-violet-500 focus:ring-offset-gray-900 disabled:opacity-50"
                            />
                            <label 
                                htmlFor={`json-prompt-checkbox-${scene.id}`} 
                                className={`font-medium text-gray-400 ${!isValidJson(scene.prompt) ? 'opacity-50' : ''}`}
                            >
                                {t('jsonPromptCheckboxLabel')}
                            </label>
                        </div>
                        {index > 0 && (
                            <ToggleSwitch label={t('usePreviousSceneLabel')} enabled={scene.usePreviousScene} onChange={(val) => handleSceneChange(scene.id, 'usePreviousScene', val)} />
                        )}
                    </div>
                  </div>
                ))}
                 <Button type="button" variant="primary" onClick={handleAddScene} className="w-full">
                    {t('addSceneButton')}
                </Button>
              </div>
              
              <div className="space-y-4 pt-4 border-t border-gray-800">
                  <SelectInput<VisualStyle>
                      label={t('visualStyleLabel')}
                      value={visualStyle}
                      onChange={setVisualStyle}
                      options={[
                          { value: 'Cinematic', label: t('styleCinematic') },
                          { value: 'Realistic', label: t('styleRealistic') },
                          { value: 'Anime', label: t('styleAnime') },
                          { value: 'Pixar3D', label: t('stylePixar3D') },
                          { value: 'Cyberpunk', label: t('styleCyberpunk') },
                          { value: "Retro 80's", label: t('styleRetro80s') },
                      ]}
                  />
                  <div className="grid grid-cols-2 gap-2">
                      <SelectInput<AspectRatio> 
                          label={t('aspectRatioLabel')}
                          value={aspectRatio}
                          onChange={setAspectRatio}
                          options={[
                              { value: '16:9', label: t('aspectRatio16x9') },
                              { value: '9:16', label: t('aspectRatio9x16') },
                          ]}
                      />
                      <SelectInput<Resolution> 
                          label={t('resolutionLabel')}
                          value={resolution}
                          onChange={setResolution}
                          options={[
                              { value: '1080p', label: t('resolution1080p') },
                              { value: '720p', label: t('resolution720p') },
                          ]}
                      />
                  </div>
                  {isVeo3Plus && (
                      <RadioButtonGroup<CharacterVoice>
                          label={t('characterVoiceLabel')}
                          name="character-voice"
                          value={characterVoice}
                          onChange={setCharacterVoice}
                          options={[
                              { value: 'none', label: t('voiceNone') },
                              { value: 'english', label: t('voiceEnglish') },
                              { value: 'bahasa-indonesia', label: t('voiceIndonesian') },
                          ]}
                      />
                  )}
                  <ToggleSwitch label={t('enableSoundLabel')} enabled={enableSound} onChange={setEnableSound} disabled={veoModel === 'veo-2.0-generate-001'} />
              </div>

            </fieldset>
            
            <div className="pt-4 border-t border-gray-800">
                {isLoading ? (
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={handleStop}
                        disabled={isStopping}
                        className="w-full !bg-red-600 hover:!bg-red-500 focus:!ring-red-500 !text-white"
                    >
                        {isStopping ? (
                            <> <Spinner className="h-5 w-5" /> {t('stoppingButton')} </>
                        ) : (
                           <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                            </svg>
                            {t('stopButton')}
                           </>
                        )}
                    </Button>
                ) : (
                    <Button type="submit" disabled={!apiKey || scenes.some(s => !s.prompt.trim())} className="w-full text-lg">
                        {t('generateVideoButton')} ({scenes.length} {scenes.length > 1 ? t('scenesLabel') : t('sceneLabel')})
                    </Button>
                )}
            </div>
          </form>
        </aside>

        {/* Content Area */}
        <main className="lg:col-span-9 bg-black p-4 md:p-8 overflow-y-auto h-full">
          {error && (
              <div className="text-center text-red-400 bg-red-900/30 p-4 rounded-lg mb-6 border border-red-800">
                  <p className="font-bold">{t('errorTitle')}</p>
                  <p className="text-sm">{error}</p>
              </div>
          )}
          
          {outputs.length > 0 ? (
              <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {outputs.map((output, index) => (
                          <div key={output.id} className="space-y-2 bg-gray-900/50 p-2 rounded-lg">
                               <h3 className="text-sm font-semibold text-emerald-300 text-center">{t('sceneLabel')} {index + 1}</h3>
                               {output.status === 'done' && output.url ? (
                                  <VideoPlayer videoUrl={output.url} />
                               ) : output.status === 'generating' ? (
                                  <div className="aspect-video bg-black rounded-md flex flex-col items-center justify-center text-gray-400">
                                      <Spinner className="h-8 w-8"/>
                                      <p className="mt-2 text-sm">{t('generatingSceneShort')}</p>
                                  </div>
                               ) : (
                                  <div className="aspect-video bg-black rounded-md flex items-center justify-center text-gray-600 gap-2">
                                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                       <p className="text-sm font-semibold">{t('scenePending')}</p>
                                  </div>
                               )}
                          </div>
                      ))}
                  </div>
                   {!isLoading && (
                      <div className="text-center pt-6 border-t border-gray-800 flex justify-center gap-4 flex-wrap">
                          <Button variant="secondary" onClick={clearProject}>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                              {t('createAnotherButton')}
                          </Button>
                      </div>
                   )}
              </div>
            ) : !error && !isLoading && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                  <p className="mt-4 text-lg">{t('videoPlaceholder')}</p>
                </div>
              </div>
            )
          }
        </main>
      </div>

      <HistoryPanel 
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onPlay={handlePlayFromHistory}
        onLoad={handleLoadFromHistory}
        onDelete={removeHistoryItem}
        onClear={clearHistory}
      />
      {previewVideoUrl && (
          <VideoPreviewModal
              videoUrl={previewVideoUrl}
              onClose={() => setPreviewVideoUrl(null)}
          />
      )}
    </>
  );
};

export default VideoGenerator;