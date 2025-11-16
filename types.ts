// FIX: Removed self-import of `ImagePart` and `ImageEditResult` which caused a declaration conflict.

export type VeoModel = 'veo-3.1-fast-generate-preview' | 'veo-3.1-generate-preview' | 'veo-3.0-generate-preview' | 'veo-3.0-generate-001' | 'veo-3.0-fast-generate-001' | 'veo-2.0-generate-001';
export type ImageModel = 'gemini-2.5-flash-image-preview' | 'imagen-4.0-generate-001';

export interface Scene {
  id: number;
  prompt: string;
  usePreviousScene: boolean;
  isJsonPrompt: boolean;
}

export interface VideoGenerationOptions {
  prompt: string | object;
  imageBase64: string | null;
  imageMimeType: string | null;
  model: VeoModel;
}

export interface ImageEditOptions {
  model: ImageModel;
  prompt: string;
  images: ImagePart[];
  aspectRatio?: AspectRatio;
}

export type AspectRatio = '16:9' | '9:16' | '1:1';
// FIX: Corrected typo in Resolution type from '100p' to '1080p'.
export type Resolution = '720p' | '1080p';
export type CharacterVoice = 'none' | 'english' | 'bahasa-indonesia';
export type VisualStyle = 'Realistic' | 'Cinematic' | 'Anime' | 'Pixar3D' | 'Cyberpunk' | "Retro 80's";

// FIX: Add ImagePart and ImageEditResult types to resolve missing member errors.
export interface ImagePart {
  imageBase64: string;
  imageMimeType: string;
}

export interface ImageEditResult {
  imageBase64: string;
  text: string | null;
}

export interface GenerationSettings {
    scenes: Scene[];
    startImage?: { base64: string; mimeType: string; name: string };
    aspectRatio: AspectRatio;
    enableSound: boolean;
    resolution: Resolution;
    veoModel: VeoModel;
    visualStyle: VisualStyle;
    characterVoice: CharacterVoice;
}
  
export interface HistoryItem {
    id: string;
    timestamp: number;
    thumbnailDataUrl: string;
    settings: GenerationSettings;
}

export interface ImageGenerationSettings {
    prompt: string;
    model: ImageModel;
    aspectRatio: AspectRatio;
    originalImages: { base64: string; mimeType: string; name: string }[];
}

export interface ImageHistoryItem {
    id: string;
    timestamp: number;
    thumbnailDataUrl: string; 
    settings: ImageGenerationSettings;
}


// --- VEO3 Prompt Generator Types ---

export interface Character {
  id: number;
  race: string;
  customRace: string;
  gender: string;
  age: string;
  outfit: string;
  hairstyle: string;
  voice: string;
  description: string;
  referenceImageFile: File | null;
  referenceImageUrl: string | null;
  isAnalyzing: boolean;
}

export interface Dialogue {
  id: number;
  characterId: number; // Links to Character.id
  text: string;
}

export interface EnvironmentSettings {
  description: string;
  visualStyle: string;
  lighting: string;
  cameraAngle: string;
  shotType: string;
}