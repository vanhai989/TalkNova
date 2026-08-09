export type ConversationRole = 'user' | 'assistant' | 'system';

export type ConversationStatus = 'pending' | 'complete' | 'error';

export interface ConversationMessage {
  id: string;
  role: ConversationRole;
  content: string;
  timestamp: string;
  status?: ConversationStatus;
}
