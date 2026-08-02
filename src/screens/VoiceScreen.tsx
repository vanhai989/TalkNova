import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { transcribeAudio } from '../api/speech';
import { useVoiceRecorder } from '../hooks/useVoiceRecorder';
import { getUserFacingError } from '../utils/errors';

export default function VoiceScreen() {
  const {
    isRecording,
    isBusy,
    statusMessage,
    error,
    startRecording,
    stopRecording,
  } = useVoiceRecorder();
  const [transcript, setTranscript] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionError, setTranscriptionError] = useState<string | null>(null);

  const handleRecordPress = async () => {
    if (isRecording) {
      try {
        const filePath = await stopRecording();
        if (!filePath) {
          setTranscript('No recording file available.');
          return;
        }

        setTranscriptionError(null);
        setIsTranscribing(true);
        setTranscript('Uploading and transcribing...');

        const result = await transcribeAudio(filePath);
        setTranscript(result || 'No speech detected.');
      } catch (transcriptionError) {
        console.error(transcriptionError);
        setTranscriptionError(getUserFacingError(transcriptionError));
        setTranscript('');
      } finally {
        setIsTranscribing(false);
      }
      return;
    }

    setTranscript('');
    setTranscriptionError(null);
    await startRecording();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Voice Recorder</Text>

        <TouchableOpacity
          style={[
            styles.button,
            isRecording ? styles.buttonRecording : styles.buttonIdle,
            (isBusy || isTranscribing) && styles.buttonDisabled,
          ]}
          onPress={handleRecordPress}
          disabled={isBusy || isTranscribing}
        >
          {isBusy || isTranscribing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              {isRecording ? 'Stop Recording' : 'Start Recording'}
            </Text>
          )}
        </TouchableOpacity>

        <View style={styles.statusRow}>
          <Text style={styles.label}>Status:</Text>
          <Text style={styles.statusText}>{statusMessage}</Text>
        </View>

        {error || transcriptionError ? (
          <Text style={styles.errorText}>Error: {error || transcriptionError}</Text>
        ) : null}

        <View style={styles.transcriptBox}>
          <Text style={styles.label}>Transcript</Text>
          <Text style={styles.transcriptText}>{transcript || 'No transcript yet.'}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fb',
  },
  card: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24,
  },
  button: {
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonIdle: {
    backgroundColor: '#1c64f2',
  },
  buttonRecording: {
    backgroundColor: '#dc2626',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  label: {
    fontWeight: '700',
    marginRight: 8,
  },
  statusText: {
    color: '#374151',
  },
  transcriptBox: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  transcriptText: {
    marginTop: 8,
    color: '#111827',
    lineHeight: 22,
  },
  errorText: {
    color: '#b91c1c',
    marginBottom: 12,
  },
});
