// FIX: Import GenerateVideosOperation for correct typing from the SDK.
// FIX: Import Modality for image editing support.
import { GoogleGenAI, GenerateVideosOperation, Modality } from "@google/genai";
// FIX: Removed unused VeoOperation import.
// FIX: Import types for both video generation and image editing.
import { VideoGenerationOptions, AspectRatio, Resolution, ImagePart, ImageEditResult, CharacterVoice, VisualStyle, ImageEditOptions } from '../types';
import { RACES } from "../constants";

const getApiKey = (): string => {
    try {
        const apiKey = localStorage.getItem('gemini-api-key');
        if (!apiKey) {
            throw new Error("Gemini API key not found in local storage.");
        }
        return apiKey;
    } catch (error) {
        // This handles cases where localStorage is not available (e.g., server-side rendering, strict security settings)
        throw new Error("Could not access local storage to retrieve API key.");
    }
};

// FIX: Use the official GenerateVideosOperation type from the SDK instead of a custom one.
const pollOperation = async (ai: GoogleGenAI, operation: GenerateVideosOperation): Promise<GenerateVideosOperation> => {
    let currentOperation = operation;
    while (!currentOperation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000)); // Poll every 10 seconds
        try {
            currentOperation = await ai.operations.getVideosOperation({ operation: currentOperation });
        } catch (error) {
            console.error("Error polling operation status:", error);
            throw new Error("Failed to get video generation status.");
        }
    }
    return currentOperation;
};

const buildPrompt = (
    userPrompt: string,
    enableSound: boolean,
    resolution: Resolution,
    characterVoice: CharacterVoice,
    visualStyle: VisualStyle
): string => {
    const instructions = [
        `- The video should be rendered in high quality, specifically ${resolution}.`,
        `- The video should ${enableSound ? 'include appropriate sound effects and ambient audio' : 'be silent'}.`
    ];

    if (characterVoice !== 'none') {
        instructions.push(`- If there is dialogue, the characters should speak in ${characterVoice === 'english' ? 'English' : 'Bahasa Indonesia'}.`);
    }

    if (visualStyle !== 'Realistic') {
        instructions.push(`- The visual style should be ${visualStyle}.`);
    }
    
    return `${userPrompt}\n\n--- Technical Directives ---\n${instructions.join('\n')}`;
};

export const generateVideo = async (
    options: VideoGenerationOptions,
    aspectRatio: AspectRatio,
    enableSound: boolean,
    resolution: Resolution,
    characterVoice: CharacterVoice,
    visualStyle: VisualStyle
): Promise<string> => {
    const apiKey = getApiKey();
    const ai = new GoogleGenAI({ apiKey });

    try {
        // FIX: The API expects the prompt to be a string. If the prompt is a JSON object,
        // it must be stringified before being sent.
        const finalPrompt = typeof options.prompt === 'object'
            ? JSON.stringify(options.prompt)
            : buildPrompt(options.prompt, enableSound, resolution, characterVoice, visualStyle);
        
        const requestPayload: any = {
            model: options.model,
            prompt: finalPrompt,
            config: {
                numberOfVideos: 1,
                aspectRatio: aspectRatio,
            }
        };

        if (options.imageBase64 && options.imageMimeType) {
            requestPayload.image = {
                imageBytes: options.imageBase64,
                mimeType: options.imageMimeType,
            };
        }

        // FIX: Use the official GenerateVideosOperation type for the initial operation.
        let initialOperation: GenerateVideosOperation = await ai.models.generateVideos(requestPayload);
        const completedOperation = await pollOperation(ai, initialOperation);

        if (completedOperation.error) {
            throw new Error(`Video generation failed: ${completedOperation.error.message}`);
        }

        const downloadLink = completedOperation.response?.generatedVideos?.[0]?.video?.uri;

        if (!downloadLink) {
            throw new Error('Video generation finished but returned no downloadable URI.');
        }

        const videoResponse = await fetch(`${downloadLink}&key=${apiKey}`);
        if (!videoResponse.ok) {
            throw new Error(`Failed to download video file: ${videoResponse.statusText}`);
        }

        const videoBlob = await videoResponse.blob();

        // FIX: Add validation to ensure the downloaded content is actually a video.
        // This prevents corrupted files (e.g., error messages as text/json) from being processed,
        // which was causing the stitching process to fail with a 'No video track found' error.
        if (!videoBlob.type.startsWith('video/')) {
            const errorText = await videoBlob.text();
            console.error("Downloaded content is not a video:", errorText);
            throw new Error(`Downloaded file is not a valid video. The server may have returned an error: ${errorText.substring(0, 200)}`);
        }

        return URL.createObjectURL(videoBlob);
    } catch (error) {
        console.error("Error in generateVideo service:", error);
        if (error instanceof Error) {
            if (error.message.includes("API key")) {
                 throw new Error("API key is invalid or missing. Please check your key in the management section.");
            }
            throw error;
        }
        throw new Error("An unknown error occurred during video generation.");
    }
};

// FIX: Implement and export editImage function to resolve missing member error.
export const editImage = async (options: ImageEditOptions): Promise<ImageEditResult> => {
    const apiKey = getApiKey();
    const ai = new GoogleGenAI({ apiKey });

    try {
        if (options.model === 'gemini-2.5-flash-image-preview') {
            if (options.images.length === 0) {
                throw new Error("An image is required for editing.");
            }
            const imageParts = options.images.map(image => ({
                inlineData: {
                    data: image.imageBase64,
                    mimeType: image.imageMimeType,
                },
            }));

            const textPart = { text: options.prompt };

            const parts = [...imageParts, textPart];

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image-preview',
                contents: { parts },
                config: {
                    responseModalities: [Modality.IMAGE, Modality.TEXT],
                },
            });
            
            let imageBase64: string | null = null;
            let text: string | null = null;

            if (response.candidates && response.candidates.length > 0 && response.candidates[0].content && response.candidates[0].content.parts) {
                for (const part of response.candidates[0].content.parts) {
                    if (part.inlineData) {
                        imageBase64 = part.inlineData.data;
                    } else if (part.text) {
                        text = part.text;
                    }
                }
            }

            if (!imageBase64) {
                 if (text) {
                    throw new Error(`Model responded with text instead of an image: ${text}`);
                }
                throw new Error('Image editing resulted in no image output.');
            }

            return { imageBase64, text };
        } else if (options.model === 'imagen-4.0-generate-001') {
            const response = await ai.models.generateImages({
                model: options.model,
                prompt: options.prompt,
                config: {
                  numberOfImages: 1,
                  outputMimeType: 'image/png',
                  ...(options.aspectRatio && { aspectRatio: options.aspectRatio }),
                },
            });

            if (!response.generatedImages || response.generatedImages.length === 0) {
                throw new Error('Image generation did not return any images.');
            }

            const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
            return { imageBase64: base64ImageBytes, text: null };
        }
        
        throw new Error(`Unsupported image model: ${options.model}`);

    } catch (error) {
        console.error("Error in editImage service:", error);
        if (error instanceof Error) {
            throw error;
        }
        throw new Error("An unknown error occurred during image editing.");
    }
};

export const analyzeImageForCharacter = async (base64ImageData: string, mimeType: string): Promise<any> => {
    const apiKey = getApiKey();
    const ai = new GoogleGenAI({ apiKey });
    
    const raceOptions = RACES.map(r => r.value).filter(r => r !== 'Other...').join('", "');

    const prompt = `Analyze the character in this image. Based on your visual analysis, provide a JSON object with the following keys: "race", "gender", "age", "outfit", "hairstyle", "description".

    Rules:
    1.  The output MUST be a single, valid JSON object and nothing else. Do not wrap it in markdown.
    2.  For the "race" key, you MUST choose one of the following exact values: "${raceOptions}". If the race is ambiguous or not on the list, make your best guess from the provided options.
    3.  For "gender", use one of "Pria", "Wanita", or "Non-Biner".
    4.  For "age", provide an estimated age as a number string (e.g., "25").
    5.  For "outfit" and "hairstyle", provide a brief, descriptive string.
    6.  For "description", provide a one-sentence summary of the character's appearance or demeanor.
    
    Example response:
    {
      "race": "Asia Timur",
      "gender": "Wanita",
      "age": "28",
      "outfit": "jaket kulit hitam",
      "hairstyle": "rambut hitam panjang",
      "description": "Seorang wanita dengan ekspresi percaya diri."
    }`;

    try {
        const imagePart = {
            inlineData: {
                mimeType: mimeType,
                data: base64ImageData,
            },
        };
        const textPart = {
            text: prompt,
        };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
        });

        const jsonString = response.text.trim();
        
        // Clean the string in case it's wrapped in markdown
        const cleanedJsonString = jsonString.replace(/^```json\n|```$/g, '');

        return JSON.parse(cleanedJsonString);
    } catch (error) {
        console.error("Error analyzing image for character:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to analyze image: ${error.message}`);
        }
        throw new Error("An unknown error occurred during image analysis.");
    }
};