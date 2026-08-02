import { apiClient, getOpenAiHeaders } from './client';

export async function generateAssistantReply(prompt: string): Promise<string> {
  const response = await apiClient.post(
    '/chat/completions',
    {
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful voice assistant for a mobile app.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
    },
    {
      headers: {
        ...getOpenAiHeaders(),
      },
    }
  );

  const content = response.data?.choices?.[0]?.message?.content;

  return typeof content === 'string'
    ? content
    : JSON.stringify(response.data);
}
