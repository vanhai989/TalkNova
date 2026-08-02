import { getUserFacingError } from '../src/utils/errors';

describe('getUserFacingError', () => {
  it('returns a friendly rate-limit message for 429 responses', () => {
    const error = { response: { status: 429 } };

    expect(getUserFacingError(error)).toBe(
      'Rate limit exceeded. Please wait a moment and try again.'
    );
  });

  it('returns the underlying message for regular errors', () => {
    expect(getUserFacingError(new Error('Network failed'))).toBe('Network failed');
  });

  it('returns a fallback message for unknown values', () => {
    expect(getUserFacingError(undefined)).toBe('Something went wrong. Please try again.');
  });
});
