import { Platform, PermissionsAndroid } from 'react-native';
import { Sound } from 'react-native-nitro-sound';

async function requestAndroidMicrophonePermission(): Promise<boolean> {
  if (Platform.OS !== 'android') {
    return true;
  }

  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    {
      title: 'Microphone Access',
      message:
        'TalkNova needs access to your microphone to record your voice.',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK',
    }
  );

  return granted === PermissionsAndroid.RESULTS.GRANTED;
}

export async function startRecording(): Promise<string> {
  const hasPermission = await requestAndroidMicrophonePermission();
  if (!hasPermission) {
    throw new Error('Microphone permission denied');
  }

  return Sound.startRecorder();
}

export async function stopRecording(): Promise<string> {
  return Sound.stopRecorder();
}
