import { useState, useEffect, useCallback } from 'react';
import { ImageHistoryItem, ImageGenerationSettings } from '../types';
import { db } from '../services/db';

const HISTORY_STORAGE_KEY = 'veoImageHistory';

const base64ToBlob = (base64: string, mimeType: string): Blob => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
};


export const useImageHistory = () => {
  const [history, setHistory] = useState<ImageHistoryItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedHistoryJson = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (storedHistoryJson) {
        const storedHistory = JSON.parse(storedHistoryJson);
        setHistory(storedHistory.sort((a: ImageHistoryItem, b: ImageHistoryItem) => b.timestamp - a.timestamp));
      }
    } catch (error) {
      console.error("Failed to load image history from localStorage:", error);
      localStorage.removeItem(HISTORY_STORAGE_KEY);
    }
    setIsLoaded(true);
  }, []);

  const saveHistoryToLocalStorage = (updatedHistory: ImageHistoryItem[]) => {
      try {
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
      } catch (error) {
          console.error("Failed to save image history to localStorage:", error);
      }
  }

  const addHistoryItem = useCallback(async (settings: ImageGenerationSettings, generatedImageBase64: string): Promise<void> => {
    if (!isLoaded) return;
    
    const id = `${Date.now()}-${Math.random()}`;
    const timestamp = Date.now();

    try {
      const thumbnailDataUrl = `data:image/png;base64,${generatedImageBase64}`;
      const newItem: ImageHistoryItem = { id, timestamp, thumbnailDataUrl, settings };

      const imageBlob = base64ToBlob(generatedImageBase64, 'image/png');
      await db.images.put(imageBlob, id);

      setHistory(prev => {
          const updatedHistory = [newItem, ...prev];
          saveHistoryToLocalStorage(updatedHistory);
          return updatedHistory;
      });

    } catch (error) {
        console.error("Failed to add item to image history:", error);
    }
  }, [isLoaded]);

  const removeHistoryItem = useCallback(async (id: string): Promise<void> => {
    if (!isLoaded) return;

    try {
        await db.images.delete(id);
        setHistory(prev => {
            const updatedHistory = prev.filter(item => item.id !== id);
            saveHistoryToLocalStorage(updatedHistory);
            return updatedHistory;
        });
    } catch (error) {
        console.error("Failed to remove item from image history:", error);
    }
  }, [isLoaded]);

  const clearHistory = useCallback(async (): Promise<void> => {
    if (!isLoaded) return;

    try {
        await db.images.clear();
        setHistory([]);
        localStorage.removeItem(HISTORY_STORAGE_KEY);
    } catch(error) {
        console.error("Failed to clear image history:", error);
    }
  }, [isLoaded]);

  return { history, addHistoryItem, removeHistoryItem, clearHistory, isLoaded };
};
