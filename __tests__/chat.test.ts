import { generateAssistantReply } from '../src/api/chat';
import { apiClient } from '../src/api/client';

jest.mock('../src/api/client', () => ({
  apiClient: {
    post: jest.fn(),
  },
  getOpenAiHeaders: jest.fn(() => ({ Authorization: 'Bearer test-key' })),
}));

const mockedApiClient = apiClient as unknown as { post: jest.Mock };

describe('generateAssistantReply', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('sends the prompt to the chat completions endpoint and returns the reply', async () => {
    mockedApiClient.post.mockResolvedValue({
      data: {
        choices: [{ message: { content: 'Hello there' } }],
      },
    });

    const reply = await generateAssistantReply('Say hi');

    expect(mockedApiClient.post).toHaveBeenCalledWith(
      '/chat/completions',
      expect.objectContaining({
        model: 'gpt-4o-mini',
        messages: expect.arrayContaining([
          expect.objectContaining({ role: 'user', content: 'Say hi' }),
        ]),
      }),
      expect.objectContaining({ headers: expect.any(Object) })
    );
    expect(reply).toBe('Hello there');
  });
});
