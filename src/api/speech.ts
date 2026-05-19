import { apiClient, getOpenAiHeaders } from './client';

export async function transcribeAudio(filePath: string): Promise<string> {
  const normalizedUri =
    filePath.startsWith('file://') || filePath.startsWith('content://')
      ? filePath
      : `file://${filePath}`;

  const formData = new FormData();
  formData.append('file', {
    uri: normalizedUri,
    name: 'recording.wav',
    type: 'audio/wav',
  } as any);
  formData.append('model', 'whisper-1');
  formData.append('response_format', 'text');

  const response = await apiClient.post('/audio/transcriptions', formData, {
    headers: {
      ...getOpenAiHeaders(),
    },
  });

  return typeof response.data === 'string'
    ? response.data
    : JSON.stringify(response.data);
}
