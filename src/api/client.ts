import axios, { AxiosRequestConfig } from 'axios';

declare const process: any;

const OPENAI_API_KEY = process?.env?.OPENAI_API_KEY || '';
const MAX_RETRIES = 5;
const BACKOFF_BASE_MS = 1000;
let rateLimitResetAt = 0;

function parseRetryAfter(retryAfterHeader: string | number | undefined): number | null {
  if (retryAfterHeader === undefined || retryAfterHeader === null) {
    return null;
  }

  const headerValue = String(retryAfterHeader).trim();
  const parsedSeconds = Number(headerValue);
  if (!Number.isNaN(parsedSeconds)) {
    return parsedSeconds * 1000;
  }

  const parsedDate = Date.parse(headerValue);
  if (!Number.isNaN(parsedDate)) {
    return Math.max(parsedDate - Date.now(), 0);
  }

  return null;
}

function sleep(ms: number) {
  return new Promise<void>(resolve => setTimeout(() => resolve(), ms));
}

function getRateLimitCooldownMessage() {
  if (Date.now() >= rateLimitResetAt) {
    return null;
  }

  const secondsRemaining = Math.ceil((rateLimitResetAt - Date.now()) / 1000);
  return `Rate limit active. Please wait ${secondsRemaining} second${
    secondsRemaining === 1 ? '' : 's'
  } before retrying.`;
}

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

apiClient.interceptors.request.use(config => {
  const cooldownMessage = getRateLimitCooldownMessage();
  if (cooldownMessage) {
    return Promise.reject(new Error(cooldownMessage));
  }
  return config;
});

apiClient.interceptors.response.use(
  response => response,
  async error => {
    const config = error.config as AxiosRequestConfig & { __retryCount?: number };
    const status = error.response?.status;

    if (!config || !error.response) {
      return Promise.reject(error);
    }

    const retryAfterMs = parseRetryAfter(error.response.headers?.['retry-after']);
    const currentRetryCount = config.__retryCount || 0;

    if (status === 429) {
      const cooldownMs = retryAfterMs ?? BACKOFF_BASE_MS * 2 ** currentRetryCount;
      rateLimitResetAt = Date.now() + cooldownMs;
    }

    if (status === 429 && currentRetryCount < MAX_RETRIES) {
      config.__retryCount = currentRetryCount + 1;
      const delay = retryAfterMs ?? BACKOFF_BASE_MS * 2 ** currentRetryCount;

      await sleep(delay);
      return apiClient(config);
    }

    if (status === 429) {
      error.message = `${error.message} (rate limit exceeded, retried ${MAX_RETRIES} times). Please try again in a few seconds.`;
    }

    return Promise.reject(error);
  }
);

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
