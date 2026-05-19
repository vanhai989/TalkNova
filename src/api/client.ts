import axios from 'axios';

declare const process: any;

const OPENAI_API_KEY =
  process?.env?.OPENAI_API_KEY || '';

if (!OPENAI_API_KEY) {
  console.warn(
    'OPENAI_API_KEY is not configured. Set OPENAI_API_KEY in your environment or add it to src/api/client.ts for development.'
  );
}

export const apiClient = axios.create({
  baseURL: 'https://api.openai.com/v1',
  headers: {
    Accept: 'application/json',
  },
});

export function getOpenAiHeaders() {
  if (!OPENAI_API_KEY) {
    throw new Error(
      'OPENAI_API_KEY is required for the transcription API. Set it in your environment or in src/api/client.ts.'
    );
  }

  return {
    Authorization: `Bearer ${OPENAI_API_KEY}`,
  };
}
