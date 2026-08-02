# TalkNova

TalkNova is a voice-first AI assistant built with React Native. The app enables users to record voice input, transcribe it with OpenAI speech-to-text, generate an AI response, and display the conversation flow in a simple mobile experience.

## Overview

TalkNova is designed to feel like a conversational assistant that can be used naturally through voice. The current implementation focuses on the core experience:

- record audio from the microphone
- transcribe speech to text
- send the transcript to GPT for a response
- display both the transcript and assistant reply in the UI

## Features

### Current capabilities
- microphone recording flow
- audio transcription via OpenAI Whisper
- GPT-powered assistant replies
- clear loading, error, and status states in the UI
- modular architecture for future expansion into TTS, streaming, history, and memory

### Planned enhancements
- text-to-speech playback for assistant responses
- richer conversational UI with chat bubbles and animations
- conversation history and persistent memory
- onboarding, settings, and polished beta experience

## Tech Stack

- React Native
- TypeScript
- Axios for API communication
- OpenAI APIs for transcription and chat completions
- React Navigation
- Jest for testing

## Project Structure

- src/screens: app screens and main user experience
- src/api: API wrappers for speech and chat services
- src/hooks: reusable logic for voice recording
- src/services: native audio functionality
- src/utils: shared helpers and error formatting
- __tests__: unit tests for core behavior

## Getting Started

### Prerequisites

- Node.js 22.11+ recommended
- React Native development environment set up for iOS or Android
- An OpenAI API key

### Install dependencies

```bash
npm install
```

### Environment configuration

Set your OpenAI API key before running the app:

```bash
export OPENAI_API_KEY=your_api_key_here
```

### Run the app

For iOS:

```bash
npx react-native run-ios
```

For Android:

```bash
npx react-native run-android
```

## Testing

Run the test suite with:

```bash
npm test -- --runInBand
```

## Development Notes

The app follows a modular structure to keep voice input, transcription, and AI response logic separate from the UI. This makes it easier to extend the product with future features such as streaming responses, better audio playback, and persistent conversation history.

## Roadmap

1. Finish the full voice interaction loop with TTS
2. Improve the chat experience with richer UI and animations
3. Add conversation history and lightweight memory
4. Prepare the app for beta testing and deployment
