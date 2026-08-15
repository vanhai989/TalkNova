import { useCallback, useState } from 'react';
import { speak, stop } from '../services/audio/playback';

export function useSpeechPlayback() {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const play = useCallback(async (text: string) => {
    setIsSpeaking(true);
    try {
      await speak(text);
    } catch (err) {
      console.warn('TTS playback error', err);
    } finally {
      setIsSpeaking(false);
    }
  }, []);

  const cancel = useCallback(() => {
    stop();
    setIsSpeaking(false);
  }, []);

  return { isSpeaking, play, cancel };
}
