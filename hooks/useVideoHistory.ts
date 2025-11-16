import { useState, useEffect, useCallback } from 'react';
import { HistoryItem, GenerationSettings } from '../types';
import { db } from '../services/db';
import { getVideoFrameAsBase64 } from '../utils/videoUtils';

const HISTORY_STORAGE_KEY = 'veoVideoHistory';

export const useVideoHistory = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedHistoryJson = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (storedHistoryJson) {
        const storedHistory = JSON.parse(storedHistoryJson);
        setHistory(storedHistory.sort((a: HistoryItem, b: HistoryItem) => b.timestamp - a.timestamp));
      }
    } catch (error) {
      console.error("Failed to load history from localStorage:", error);
      localStorage.removeItem(HISTORY_STORAGE_KEY);
    }
    setIsLoaded(true);
  }, []);

  const saveHistoryToLocalStorage = (updatedHistory: HistoryItem[]) => {
      try {
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
      } catch (error) {
          console.error("Failed to save history to localStorage:", error);
      }
  }

  const addHistoryItem = useCallback(async (settings: GenerationSettings, videoBlob: Blob): Promise<void> => {
    if (!isLoaded) return;
    
    const id = `${Date.now()}-${Math.random()}`;
    const timestamp = Date.now();

    try {
      const videoUrl = URL.createObjectURL(videoBlob);
      const { base64: thumbnailBase64 } = await getVideoFrameAsBase64(videoUrl, 'start');
      URL.revokeObjectURL(videoUrl);
      const thumbnailDataUrl = `data:image/jpeg;base64,${thumbnailBase64}`;

      const newItem: HistoryItem = { id, timestamp, thumbnailDataUrl, settings };

      await db.videos.put(videoBlob, id);

      setHistory(prev => {
          const updatedHistory = [newItem, ...prev];
          saveHistoryToLocalStorage(updatedHistory);
          return updatedHistory;
      });

    } catch (error) {
        console.error("Failed to add item to history:", error);
    }
  }, [isLoaded]);

  const removeHistoryItem = useCallback(async (id: string): Promise<void> => {
    if (!isLoaded) return;

    try {
        await db.videos.delete(id);
        setHistory(prev => {
            const updatedHistory = prev.filter(item => item.id !== id);
            saveHistoryToLocalStorage(updatedHistory);
            return updatedHistory;
        });
    } catch (error) {
        console.error("Failed to remove item from history:", error);
    }
  }, [isLoaded]);

  const clearHistory = useCallback(async (): Promise<void> => {
    if (!isLoaded) return;

    try {
        await db.videos.clear();
        setHistory([]);
        localStorage.removeItem(HISTORY_STORAGE_KEY);
    } catch(error) {
        console.error("Failed to clear history:", error);
    }
  }, [isLoaded]);

  return { history, addHistoryItem, removeHistoryItem, clearHistory, isLoaded };
};
