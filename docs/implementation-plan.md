# TalkNova Implementation Plan

## 1. Project goal
Build a voice-first AI assistant app on React Native with:
- microphone recording
- speech-to-text transcription
- GPT-powered conversation
- text-to-speech playback
- realtime conversation UX
- history/memory and beta polish

The plan below is structured so the project stays consistent across UI, state management, API integration, and audio services.

---

## 2. Architecture principles
To keep the app consistent across the whole project, every feature should follow the same pattern:

1. Screens stay thin
   - screens should focus on layout and user actions only
   - business flow should live in hooks or services

2. Shared logic lives in dedicated modules
   - audio recording and playback: src/services/audio
   - API communication: src/api
   - app state: src/store
   - reusable UI: src/components
   - feature-specific hooks: src/hooks

3. All AI and backend interactions must go through typed abstractions
   - define request/response types in src/types
   - keep API calls centralized in src/api

4. UI must follow consistent states
   - idle
   - loading
   - recording
   - processing
   - speaking
   - error

5. Error handling should be uniform
   - each feature should show a user-friendly message
   - retries and rate-limit handling should be centralized

---

## 3. Recommended project structure
- src/screens
  - main conversation screen
  - settings / onboarding screen if needed
- src/components
  - microphone button
  - transcript bubble
  - message list
  - status indicator
- src/hooks
  - useVoiceRecorder
  - useConversation
  - useSpeechPlayback
- src/services/audio
  - recorder service
  - playback service
  - file management helpers
- src/api
  - client.ts
  - speech.ts
  - chat.ts
  - tts.ts
- src/store
  - conversation store
  - settings store
- src/types
  - message types
  - transcription types
  - AI response types
- src/utils
  - formatting helpers
  - error helpers

---

## 4. Week-by-week implementation plan

### Week 1 — Foundation and voice input
Goal: establish the base app flow for recording audio and converting it to text.

#### Deliverables
- React Native app shell is stable and runs on iOS/Android
- microphone permission flow is implemented
- recording UI is functional
- audio file is captured and stored correctly
- speech-to-text pipeline is connected and works end to end

#### Tasks
1. Project setup and environment cleanup
   - confirm dependencies and versions
   - add environment config for API keys
   - standardize app theme colors and spacing

2. Build the recording foundation
   - complete the microphone recording flow in the recorder hook/service
   - handle start/stop states clearly
   - show loading and error feedback on the screen

3. Build transcription flow
   - create a transcription API wrapper in src/api
   - send recorded audio to speech-to-text
   - display transcript in the main screen

4. Improve UX basics
   - add button states for idle/recording/processing
   - add simple status text for user feedback

#### Acceptance criteria
- user can tap a button to start recording
- user can stop recording and receive a transcript
- errors are shown clearly without crashing the app
- the flow is reusable for later GPT conversation steps

---

### Week 2 — GPT conversation and transcript display
Goal: connect the app to GPT and show a simple chat-style conversation flow.

#### Deliverables
- user input can be sent to GPT
- assistant response is shown in the UI
- transcript/history is visible in a chat-style layout
- API integration is centralized and reusable

#### Tasks
1. Define conversation data model
   - message type with role, content, timestamp, status
   - support user and assistant messages

2. Create chat API layer
   - add a chat request service in src/api
   - support prompt + conversation history
   - handle timeout, retry, and error states

3. Build the conversation UI
   - show user messages and assistant replies in a list
   - add a simple input area or trigger flow
   - keep the UI consistent with the voice-first design

4. Connect transcript to chat flow
   - use the transcription result as the user message
   - show assistant response beneath it

#### Acceptance criteria
- a transcript becomes a conversation message
- GPT returns a response that is displayed in the app
- the screen can show both user and assistant messages clearly
- the chat flow is ready for later streaming and animation upgrades

---

### Week 3 — Real-time conversation experience
Goal: make the experience feel more alive and conversational.

#### Deliverables
- typing/streaming responses feel responsive
- animations make the app feel polished
- user can follow the conversation naturally
- the UI feels more like a conversational assistant

#### Tasks
1. Implement streaming response UX
   - show partial assistant responses as they arrive
   - avoid long blank screens during generation

2. Add motion and animation
   - animate the microphone button
   - animate message entry and response appearance
   - add subtle loading states for speaking and thinking

3. Improve conversation state handling
   - manage pending message state
   - handle interrupted or canceled responses safely

4. Improve audio feedback loop
   - connect speaking state to playback and visual cues
   - ensure the app does not feel laggy during transitions

#### Acceptance criteria
- assistant responses appear progressively instead of only after completion
- conversations feel smooth and responsive
- animations are subtle and do not harm usability
- the experience is comfortable for repeated voice interactions

---

### Week 4 — Memory, history, polish, and beta release
Goal: make the app usable, memorable, and launch-ready for a beta test.

#### Deliverables
- conversation history is preserved
- memory behavior is implemented in a simple and clear form
- UI is polished and consistent
- beta build is prepared for testing

#### Tasks
1. Add conversation history
   - save recent chats locally
   - allow users to reopen previous conversations

2. Add simple memory layer
   - store basic preferences or recurring context
   - keep memory lightweight and explainable

3. Polish UI and interaction details
   - unify spacing, colors, typography, and states
   - improve empty states, error states, and loading states
   - reduce visual inconsistency between screens

4. Prepare beta release
   - add app naming, icons, and launch screens polish
   - test on device
   - collect feedback and fix critical issues

#### Acceptance criteria
- users can review past conversations
- the app feels complete enough for beta testing
- core flows work reliably on real devices
- known issues are documented before release

---

## 5. Cross-cutting implementation standards

### UI consistency
- use one visual system for buttons, cards, spacing, and typography
- keep screen padding and component sizes consistent
- avoid ad-hoc styling per screen

### State consistency
- use a central conversation store for all chat data
- keep local UI state minimal and temporary
- avoid scattering message state across components

### API consistency
- all OpenAI-related requests should flow through src/api
- do not call network requests directly from screens
- wrap errors in a consistent format

### Audio consistency
- all recording and playback logic should be encapsulated behind services/hooks
- screens should not directly control native audio behavior

### Testing consistency
- add tests for core flows: recording state, transcription success, chat response rendering, error handling
- prefer small, focused tests over broad UI snapshots

---

## 6. Recommended implementation order
1. finish the recording + transcription flow
2. connect GPT and render chat messages
3. add speech playback and voice-first interaction loop
4. add streaming and animations
5. add history and memory
6. polish UI and beta release

---

## 7. Definition of done
A milestone is complete when:
- the feature works on device
- the UI shows clear states for loading/error/success
- the code follows the project structure
- errors are handled gracefully
- the feature is testable and maintainable
