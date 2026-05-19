import { useCallback, useState } from 'react';
import {
  startRecording as startRecordingService,
  stopRecording as stopRecordingService,
} from '../services/audio/recorder';

export function useVoiceRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [filePath, setFilePath] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState('Ready to record');
  const [error, setError] = useState<string | null>(null);

  const startRecording = useCallback(async () => {
    setError(null);
    setIsBusy(true);
    try {
      const path = await startRecordingService();
      setFilePath(null);
      setIsRecording(true);
      setStatusMessage('Recording...');
      return path;
    } catch (startError: unknown) {
      const message =
        startError instanceof Error
          ? startError.message
          : 'Unable to start recording.';
      setError(message);
      setStatusMessage('Recording failed');
      throw startError;
    } finally {
      setIsBusy(false);
    }
  }, []);

  const stopRecording = useCallback(async () => {
    setError(null);
    setIsBusy(true);
    try {
      const path = await stopRecordingService();
      setFilePath(path);
      setIsRecording(false);
      setStatusMessage('Recording stopped');
      return path;
    } catch (stopError: unknown) {
      const message =
        stopError instanceof Error
          ? stopError.message
          : 'Unable to stop recording.';
      setError(message);
      setStatusMessage('Stop failed');
      throw stopError;
    } finally {
      setIsBusy(false);
    }
  }, []);

  return {
    isRecording,
    isBusy,
    filePath,
    statusMessage,
    error,
    startRecording,
    stopRecording,
  };
}
