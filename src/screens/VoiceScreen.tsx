import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { transcribeAudio } from '../api/speech';
import { useConversation } from '../hooks/useConversation';
import { useVoiceRecorder } from '../hooks/useVoiceRecorder';
import { getUserFacingError } from '../utils/errors';
import { useSpeechPlayback } from '../hooks/useSpeechPlayback';

export default function VoiceScreen() {
  const {
    isRecording,
    isBusy,
    statusMessage,
    error: recorderError,
    startRecording,
    stopRecording,
  } = useVoiceRecorder();
  const {
    messages,
    isLoading: isProcessing,
    error: conversationError,
    sendPrompt,
  } = useConversation();
  const { isSpeaking: isSpeakingPlayback, play, cancel } = useSpeechPlayback();
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionError, setTranscriptionError] = useState<string | null>(null);

  const handleRecordPress = async () => {
    if (isRecording) {
      try {
        const filePath = await stopRecording();
        if (!filePath) {
          setTranscriptionError('No recording file available.');
          return;
        }

        setTranscriptionError(null);
        setIsTranscribing(true);

        const result = await transcribeAudio(filePath);
        const nextTranscript = result || 'No speech detected.';

        if (nextTranscript && nextTranscript !== 'No speech detected.') {
          await sendPrompt(nextTranscript);
        }
      } catch (transcriptionErr) {
        console.error(transcriptionErr);
        setTranscriptionError(getUserFacingError(transcriptionErr));
      } finally {
        setIsTranscribing(false);
      }
      return;
    }

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
            (isBusy || isTranscribing || isProcessing) && styles.buttonDisabled,
          ]}
          onPress={handleRecordPress}
          disabled={isBusy || isTranscribing || isProcessing}
        >
          {isBusy || isTranscribing || isProcessing ? (
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

        {recorderError || transcriptionError || conversationError ? (
          <Text style={styles.errorText}>
            Error: {recorderError || transcriptionError || conversationError}
          </Text>
        ) : null}

        <ScrollView style={styles.messagesContainer} contentContainerStyle={styles.messagesContent}>
          {messages.length === 0 ? (
            <Text style={styles.emptyText}>Record your voice to start a conversation.</Text>
          ) : (
            messages.map(message => (
              <View
                key={message.id}
                style={[
                  styles.messageBubble,
                  message.role === 'user' ? styles.userBubble : styles.assistantBubble,
                ]}
              >
                <Text style={styles.messageRole}>{message.role.toUpperCase()}</Text>
                <Text
                  style={[
                    styles.messageText,
                    message.role === 'user' ? styles.userBubbleText : styles.assistantBubbleText,
                  ]}
                >
                  {message.content}
                </Text>
              </View>
            ))
          )}
        </ScrollView>
        {/* Play assistant messages via native TTS */}
        {messages.length > 0 && (
          <AutoPlayAssistantMessage messages={messages} play={play} />
        )}
      </View>
    </SafeAreaView>
  );
}

function AutoPlayAssistantMessage({
  messages,
  play,
}: {
  messages: any[];
  play: (text: string) => Promise<void>;
}) {
  useEffect(() => {
    const last = messages[messages.length - 1];
    if (last && last.role === 'assistant' && last.content) {
      play(last.content).catch(() => {});
    }
  }, [messages, play]);

  return null;
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
  messagesContainer: {
    flex: 1,
    marginTop: 12,
  },
  messagesContent: {
    paddingBottom: 16,
  },
  emptyText: {
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 24,
  },
  messageBubble: {
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  userBubble: {
    backgroundColor: '#1c64f2',
    alignSelf: 'flex-end',
  },
  assistantBubble: {
    backgroundColor: '#eef4ff',
    alignSelf: 'flex-start',
  },
  messageRole: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 6,
    color: '#ffffff',
  },
  assistantBubbleText: {
    color: '#111827',
  },
  userBubbleText: {
    color: '#ffffff',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  transcriptText: {
    fontSize: 15,
    lineHeight: 22,
  },
  errorText: {
    color: '#b91c1c',
    marginBottom: 12,
  },
});
