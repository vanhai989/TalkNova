/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

jest.mock('react-native-nitro-sound', () => ({
  Sound: {
    startRecorder: jest.fn(async () => '/tmp/recording.wav'),
    stopRecorder: jest.fn(async () => '/tmp/recording.wav'),
  },
}));

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});
