import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { generateAssistantReply } from '../api/chat';
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
  const [assistantReply, setAssistantReply] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isGeneratingReply, setIsGeneratingReply] = useState(false);
  const [transcriptionError, setTranscriptionError] = useState<string | null>(null);
  const [replyError, setReplyError] = useState<string | null>(null);

  const handleRecordPress = async () => {
    if (isRecording) {
      try {
        const filePath = await stopRecording();
        if (!filePath) {
          setTranscript('No recording file available.');
          return;
        }

        setTranscriptionError(null);
        setReplyError(null);
        setIsTranscribing(true);
        setIsGeneratingReply(false);
        setTranscript('Uploading and transcribing...');
        setAssistantReply('');

        const result = await transcribeAudio(filePath);
        const nextTranscript = result || 'No speech detected.';
        setTranscript(nextTranscript);

        if (nextTranscript && nextTranscript !== 'No speech detected.') {
          setIsGeneratingReply(true);
          try {
            const reply = await generateAssistantReply(nextTranscript);
            setAssistantReply(reply || 'No response generated.');
          } catch (replyErr) {
            console.error(replyErr);
            setReplyError(getUserFacingError(replyErr));
            setAssistantReply('');
          } finally {
            setIsGeneratingReply(false);
          }
        }
      } catch (transcriptionErr) {
        console.error(transcriptionErr);
        setTranscriptionError(getUserFacingError(transcriptionErr));
        setTranscript('');
      } finally {
        setIsTranscribing(false);
      }
      return;
    }

    setTranscript('');
    setAssistantReply('');
    setTranscriptionError(null);
    setReplyError(null);
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
          disabled={isBusy || isTranscribing || isGeneratingReply}
        >
          {isBusy || isTranscribing || isGeneratingReply ? (
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

        {error || transcriptionError || replyError ? (
          <Text style={styles.errorText}>Error: {error || transcriptionError || replyError}</Text>
        ) : null}

        <View style={styles.transcriptBox}>
          <Text style={styles.label}>Transcript</Text>
          <Text style={styles.transcriptText}>{transcript || 'No transcript yet.'}</Text>
        </View>

        <View style={styles.replyBox}>
          <Text style={styles.label}>Assistant</Text>
          <Text style={styles.transcriptText}>
            {isGeneratingReply ? 'Generating reply...' : assistantReply || 'No reply yet.'}
          </Text>
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
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  replyBox: {
    flex: 1,
    backgroundColor: '#eef4ff',
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
