export const getVideoFrameAsBase64 = (videoUrl: string, time: 'start' | 'end' | number = 'end'): Promise<{ base64: string; mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.crossOrigin = "anonymous";
    video.src = videoUrl;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return reject(new Error('Could not get canvas context.'));
    }

    video.onloadedmetadata = () => {
      let seekTime = 0;
      if (time === 'end') {
        seekTime = video.duration > 0.1 ? video.duration - 0.1 : 0;
      } else if (time === 'start') {
        seekTime = 0.1;
      } else if (typeof time === 'number') {
        seekTime = Math.max(0, Math.min(time, video.duration));
      }

      video.currentTime = seekTime;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    };

    video.onseeked = () => {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      const base64 = dataUrl.split(',')[1];
      resolve({ base64, mimeType: 'image/jpeg' });
    };

    // FIX: The `onerror` event handler can receive a string or an Event.
    // This adds a type guard to handle both cases correctly and avoids an
    // error when trying to access `.target` on a string.
    video.onerror = (e: Event | string) => {
      if (e instanceof Event) {
        const target = e.target as HTMLVideoElement;
        reject(new Error(`Failed to load video for frame capture. Error code: ${target.error?.code}, Message: ${target.error?.message}`));
      } else {
        reject(new Error(`Failed to load video for frame capture: ${e}`));
      }
    };
  });
};

export const isValidJson = (str: string): boolean => {
    const trimmedStr = str.trim();
    if (!((trimmedStr.startsWith('{') && trimmedStr.endsWith('}')) || (trimmedStr.startsWith('[') && trimmedStr.endsWith(']')))) {
        return false;
    }
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
};