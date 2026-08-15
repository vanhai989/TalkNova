// Simple native TTS wrapper using react-native-tts
let Tts: any;
try {
  // optional native dependency; tests / non-native environments may not have it
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  Tts = require('react-native-tts');
} catch (err) {
  Tts = {
    speak: (_: string) => {},
    stop: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
  };
}

export async function speak(text: string): Promise<void> {
  if (!text) return;

  return new Promise<void>((resolve, reject) => {
    try {
      Tts.stop();

      const onFinish = () => {
        try {
          Tts.removeEventListener('tts-finish', onFinish);
        } catch (_) {}
        resolve();
      };

      Tts.addEventListener('tts-finish', onFinish);
      Tts.speak(text);
    } catch (err) {
      reject(err);
    }
  });
}

export function stop(): void {
  try {
    Tts.stop();
  } catch (_) {}
}
