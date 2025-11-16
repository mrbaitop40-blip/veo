import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Character, Dialogue, EnvironmentSettings } from '../types';
import Section from './Section';
import SelectInput from './SelectInput';
import TextInput from './TextInput';
import TextAreaInput from './TextAreaInput';
import Button from './Button';
import ImageUploader from './ImageUploader';
import Spinner from './Spinner';
import OutputBox from './OutputBox';
import { RACES, GENDERS, VOICES, LIGHTING_OPTIONS, CAMERA_ANGLES, SHOT_TYPES } from '../constants';
import { analyzeImageForCharacter } from '../services/geminiService';
import { generatePrompts } from '../utils/promptGeneratorUtils';
import { useApiKey } from '../hooks/useApiKey';

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.onerror = (error) => reject(error);
  });


const Veo3PromptGenerator: React.FC = () => {
  const { t } = useLanguage();
  const { apiKey } = useApiKey();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [dialogues, setDialogues] = useState<Dialogue[]>([]);
  const [environment, setEnvironment] = useState<EnvironmentSettings>({
    description: '',
    visualStyle: '',
    lighting: LIGHTING_OPTIONS[0].value,
    cameraAngle: CAMERA_ANGLES[0].value,
    shotType: SHOT_TYPES[0].value,
  });
  const [prompts, setPrompts] = useState({ indonesian: '', english: '', json: '' });

  // Real-time prompt generation
  useEffect(() => {
    const newPrompts = generatePrompts(characters, dialogues, environment);
    setPrompts(newPrompts);
  }, [characters, dialogues, environment]);
  
  // Auto-delete dialogues when a character is removed
  useEffect(() => {
    const characterIds = new Set(characters.map(c => c.id));
    const filteredDialogues = dialogues.filter(d => characterIds.has(d.characterId));
    if (filteredDialogues.length !== dialogues.length) {
      setDialogues(filteredDialogues);
    }
  }, [characters, dialogues]);

  // Clean up URL objects to prevent memory leaks
  useEffect(() => {
    // This effect runs when the component unmounts or when the characters array changes.
    // We don't need to do anything special on mount, but the return function is key.
    return () => {
      // When the component is about to unmount, revoke all URLs.
      characters.forEach(character => {
        if (character.referenceImageUrl) {
          URL.revokeObjectURL(character.referenceImageUrl);
        }
      });
    };
  }, []); // Empty dependency array means this cleanup runs only on unmount.


  // --- Character Handlers ---
  const addCharacter = () => {
    const newCharacter: Character = {
      id: Date.now(),
      race: RACES[0].value,
      customRace: '',
      gender: GENDERS[0].value,
      age: '',
      outfit: '',
      hairstyle: '',
      voice: VOICES[0].value,
      description: '',
      referenceImageFile: null,
      referenceImageUrl: null,
      isAnalyzing: false,
    };
    setCharacters([...characters, newCharacter]);
  };

  const removeCharacter = (id: number) => {
    const characterToRemove = characters.find(c => c.id === id);
    if (characterToRemove && characterToRemove.referenceImageUrl) {
        URL.revokeObjectURL(characterToRemove.referenceImageUrl);
    }
    setCharacters(characters.filter(c => c.id !== id));
  };

  const updateCharacter = (id: number, field: keyof Character, value: any) => {
    setCharacters(
      characters.map(c => (c.id === id ? { ...c, [field]: value } : c))
    );
  };
  
  const handleImageChangeAndAnalyze = async (id: number, files: File[]) => {
      const file = files[0] || null;

      // Revoke the old URL before creating a new one
      const oldCharacter = characters.find(c => c.id === id);
      if (oldCharacter && oldCharacter.referenceImageUrl) {
          URL.revokeObjectURL(oldCharacter.referenceImageUrl);
      }
      
      const resetCharacterImageState = (charId: number) => {
         setCharacters(chars => chars.map(c => c.id === charId ? { ...c, referenceImageFile: null, referenceImageUrl: null, isAnalyzing: false } : c));
      }

      // If the file is removed, clear the state
      if (!file) {
          resetCharacterImageState(id);
          return;
      }

      // Create a new URL and update state to show preview and loading spinner
      const imageUrl = URL.createObjectURL(file);
      setCharacters(chars => chars.map(c => c.id === id ? { ...c, referenceImageFile: file, referenceImageUrl: imageUrl, isAnalyzing: true } : c));
      
      if (!apiKey) {
        alert(t('apiKeyMissingError'));
        URL.revokeObjectURL(imageUrl);
        resetCharacterImageState(id);
        return;
      }

      // Perform the analysis
      try {
          const base64 = await fileToBase64(file);
          const analysis = await analyzeImageForCharacter(base64, file.type);

          // Update state with analysis results
          setCharacters(chars => chars.map(c => {
              if (c.id === id) {
                  return {
                      ...c,
                      race: RACES.find(r => r.value === analysis.race) ? analysis.race : c.race,
                      gender: GENDERS.find(g => g.value === analysis.gender) ? analysis.gender : c.gender,
                      age: analysis.age || c.age,
                      outfit: analysis.outfit || c.outfit,
                      hairstyle: analysis.hairstyle || c.hairstyle,
                      description: analysis.description || c.description,
                      isAnalyzing: false, // Turn off loading
                  };
              }
              return c;
          }));
      } catch (error) {
          console.error(error);
           let errorMessage = t('analysisError');
          if (error instanceof Error && error.message.includes("local storage")) {
            errorMessage = t('apiKeyMissingError');
          }
          alert(errorMessage);
          // Turn off loading on error
          setCharacters(chars => chars.map(c => (c.id === id ? { ...c, isAnalyzing: false } : c)));
      }
  };


  // --- Dialogue Handlers ---
  const addDialogue = () => {
    if (characters.length === 0) return;
    const newDialogue: Dialogue = {
      id: Date.now(),
      characterId: characters[0].id,
      text: '',
    };
    setDialogues([...dialogues, newDialogue]);
  };

  const removeDialogue = (id: number) => {
    setDialogues(dialogues.filter(d => d.id !== id));
  };

  const updateDialogue = (id: number, field: keyof Dialogue, value: any) => {
    setDialogues(
      dialogues.map(d => (d.id === id ? { ...d, [field]: value } : d))
    );
  };
  
  // --- Environment Handlers ---
   const updateEnvironment = (field: keyof EnvironmentSettings, value: string) => {
    setEnvironment(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-4 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Inputs */}
        <div className="flex flex-col gap-8">
          {/* Character Section */}
          <Section title={t('characterSectionTitle')}>
            {characters.map((char, index) => (
                <div key={char.id} className="p-4 bg-gray-900/50 rounded-lg border border-gray-700 space-y-4 relative">
                    <fieldset disabled={char.isAnalyzing}>
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-semibold text-violet-300">{t('characterLabel')} {index + 1}</h3>
                            <Button variant="secondary" size="small" onClick={() => removeCharacter(char.id)} className="!bg-red-900/50 !border-red-800/50 hover:!bg-red-800/70 !text-red-300">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                            </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <SelectInput label={t('raceLabel')} value={char.race} onChange={(v) => updateCharacter(char.id, 'race', v)} options={RACES} />
                                {char.race === 'Other...' && <TextInput label={t('customRaceLabel')} value={char.customRace} onChange={(v) => updateCharacter(char.id, 'customRace', v)} />}
                            </div>
                            <SelectInput label={t('genderLabel')} value={char.gender} onChange={(v) => updateCharacter(char.id, 'gender', v)} options={GENDERS} />
                            <TextInput label={t('ageLabel')} value={char.age} onChange={(v) => updateCharacter(char.id, 'age', v)} type="number" />
                            <TextInput label={t('outfitLabel')} value={char.outfit} onChange={(v) => updateCharacter(char.id, 'outfit', v)} />
                            <TextInput label={t('hairstyleLabel')} value={char.hairstyle} onChange={(v) => updateCharacter(char.id, 'hairstyle', v)} />
                            <SelectInput label={t('voiceLabel')} value={char.voice} onChange={(v) => updateCharacter(char.id, 'voice', v)} options={VOICES} />
                        </div>
                        <TextAreaInput label={t('descriptionActionLabel')} value={char.description} onChange={(v) => updateCharacter(char.id, 'description', v)} />
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">{t('referenceImageLabel')}</label>
                            <ImageUploader 
                                files={char.referenceImageFile ? [char.referenceImageFile] : []}
                                onFilesChange={(files) => handleImageChangeAndAnalyze(char.id, files)}
                                variant="single"
                            />
                        </div>
                    </fieldset>
                    {char.isAnalyzing && <div className="absolute inset-0 bg-black/70 rounded-lg flex items-center justify-center"><Spinner /></div>}
                </div>
            ))}
            <Button variant="primary" onClick={addCharacter} className="w-full">{t('addCharacterButton')}</Button>
          </Section>

          {/* Dialogue Section */}
          <Section title={t('dialogueSectionTitle')}>
             {dialogues.map((dialogue, index) => (
                <div key={dialogue.id} className="p-4 bg-gray-900/50 rounded-lg border border-gray-700 space-y-2 relative">
                    <button onClick={() => removeDialogue(dialogue.id)} className="absolute top-2 right-2 text-gray-500 hover:text-red-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                    <SelectInput 
                        label={t('dialogueCharacterLabel')}
                        value={String(dialogue.characterId)}
                        onChange={(v) => updateDialogue(dialogue.id, 'characterId', Number(v))}
                        options={characters.map((c, i) => ({ value: String(c.id), label: `${t('characterLabel')} ${i+1}`}))}
                    />
                    <TextAreaInput 
                        label={t('dialogueTextLabel')}
                        value={dialogue.text}
                        onChange={(v) => updateDialogue(dialogue.id, 'text', v)}
                    />
                </div>
             ))}
            <Button variant="primary" onClick={addDialogue} disabled={characters.length === 0} className="w-full">{t('addDialogueButton')}</Button>
          </Section>

          {/* Environment & Camera Section */}
          <Section title={t('environmentCameraSectionTitle')}>
            <TextInput label={t('environmentDescLabel')} value={environment.description} onChange={v => updateEnvironment('description', v)} />
            <TextInput label={t('visualStylePromptLabel')} value={environment.visualStyle} onChange={v => updateEnvironment('visualStyle', v)} />
            <SelectInput label={t('lightingLabel')} value={environment.lighting} onChange={v => updateEnvironment('lighting', v)} options={LIGHTING_OPTIONS} />
            <SelectInput label={t('cameraAngleLabel')} value={environment.cameraAngle} onChange={v => updateEnvironment('cameraAngle', v)} options={CAMERA_ANGLES} />
            <SelectInput label={t('shotTypeLabel')} value={environment.shotType} onChange={v => updateEnvironment('shotType', v)} options={SHOT_TYPES} />
          </Section>
        </div>

        {/* Right Column: Outputs */}
        <div className="flex flex-col gap-8 lg:sticky lg:top-36 self-start">
          <Section title={t('outputSectionTitle')}>
              <OutputBox title={t('indonesianPromptTitle')} language="Bahasa Indonesia" content={prompts.indonesian} />
              <OutputBox title={t('englishPromptTitle')} language="English" content={prompts.english} />
              <OutputBox title={t('jsonPromptTitle')} language="JSON" content={prompts.json} />
          </Section>
        </div>
      </div>
    </div>
  );
};

export default Veo3PromptGenerator;