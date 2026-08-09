import { useCallback, useState } from 'react';
import { ConversationMessage } from '../types/conversation';
import { generateAssistantReply } from '../api/chat';

function createMessage(role: ConversationMessage['role'], content: string, status?: ConversationMessage['status']): ConversationMessage {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    role,
    content,
    timestamp: new Date().toISOString(),
    status,
  };
}

export function useConversation() {
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addUserMessage = useCallback((content: string) => {
    const userMessage = createMessage('user', content, 'complete');
    setMessages(current => [...current, userMessage]);
    return userMessage;
  }, []);

  const addAssistantReply = useCallback((content: string) => {
    const assistantMessage = createMessage('assistant', content, 'complete');
    setMessages(current => [...current, assistantMessage]);
    return assistantMessage;
  }, []);

  const sendPrompt = useCallback(async (prompt: string) => {
    setError(null);
    setIsLoading(true);

    try {
      addUserMessage(prompt);
      const reply = await generateAssistantReply(prompt);
      addAssistantReply(reply || 'No response generated.');
      return reply;
    } catch (sendError) {
      const message = sendError instanceof Error ? sendError.message : 'Unable to generate a response.';
      setError(message);
      setMessages(current => [
        ...current,
        createMessage('assistant', message, 'error'),
      ]);
      throw sendError;
    } finally {
      setIsLoading(false);
    }
  }, [addAssistantReply, addUserMessage]);

  return {
    messages,
    isLoading,
    error,
    addUserMessage,
    addAssistantReply,
    sendPrompt,
  };
}
