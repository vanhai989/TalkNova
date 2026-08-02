type ErrorWithResponse = {
  response?: {
    status?: number;
  };
  message?: string;
};

export function getUserFacingError(error: unknown): string {
  if (!error) {
    return 'Something went wrong. Please try again.';
  }

  const typedError = error as ErrorWithResponse;

  if (typedError.response?.status === 429) {
    return 'Rate limit exceeded. Please wait a moment and try again.';
  }

  if (typedError.message) {
    return typedError.message;
  }

  return 'Something went wrong. Please try again.';
}
