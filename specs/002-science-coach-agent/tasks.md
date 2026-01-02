# Task Breakdown: Science Coach Agent

## Constitution Check

All tasks MUST comply with the following constitutional principles:
- ✅ Expo-based React Native development
- ✅ React Native Elements component library
- ✅ Expo background task for network requests
- ✅ Tailwind CSS via NativeWind
- ✅ Centralized change documentation management
- ✅ Agent prompt management

## Overview

This task breakdown implements a sports science coach agent feature that automatically responds to Brazilian Jiu-Jitsu (BJJ) related questions in the existing chat dialog interface. The implementation follows an incremental approach, starting with foundational setup, then building BJJ detection, agent response generation, and finally integrating with the chat interface.

## Implementation Strategy

**MVP Scope**: Phase 1-4 (Setup, Foundational, BJJ Detection, and Agent Response Generation) provide a minimal working agent that can detect BJJ questions and generate responses.

**Incremental Delivery**:
- Phase 1-2: Foundation (prompts, types, utilities, API client)
- Phase 3: BJJ question detection (US3)
- Phase 4: Agent response generation (US1, US2)
- Phase 5: Chat integration and UX (US4)
- Phase 6: Polish and error handling

## Dependencies

### Story Completion Order

1. **Phase 1: Setup** - Must complete before all other phases
2. **Phase 2: Foundational** - Must complete before user story phases
3. **Phase 3: User Story 3** (BJJ Detection) - Can start after Phase 2
4. **Phase 4: User Story 1-2** (Agent Response) - Requires Phase 3
5. **Phase 5: User Story 4** (Integration & UX) - Requires Phase 4
6. **Phase 6: Polish** - Requires Phase 5

### Parallel Execution Opportunities

**Within Phase 1**:
- T002 [P] and T003 [P] can be done in parallel (prompt files are independent)

**Within Phase 2**:
- T005 [P] and T006 [P] can be done in parallel (types and utilities are independent)
- T007 [P] can be done in parallel with T005-T006 (OpenAI client setup)

**Within Phase 3**:
- T010 [P] and T011 [P] can be done in parallel (detection service and prompt loading)

**Within Phase 4**:
- T014 [P] and T015 [P] can be done in parallel (response service and truncation utility)

**Within Phase 5**:
- T018 [P] and T019 [P] can be done in parallel (loading indicator and timeout handling)

## Task List

### Phase 1: Setup

- [ ] T001 Install OpenAI npm package by running `npm install openai` in project root (NOTE: Required for DashScope OpenAI-compatible interface)
- [X] T002 [P] Create BJJ detection prompt file at .specify/prompts/002-science-coach-agent/bjj-detection-prompt.md with metadata header and prompt content
- [X] T003 [P] Create sports science coach prompt file at .specify/prompts/002-science-coach-agent/sports-science-coach-prompt.md with metadata header and prompt content
- [X] T004 Create README.md file at .specify/prompts/002-science-coach-agent/README.md documenting prompt management structure

### Phase 2: Foundational

- [X] T005 [P] Extend Message interface in types/chat.ts to add optional fields: isLoading?: boolean, isSystemMessage?: boolean, bjjRelevanceScore?: number
- [X] T006 [P] Create response truncation utility function in utils/response-truncation.ts with truncateResponse function that truncates at word boundary with ellipsis
- [X] T007 [P] Create OpenAI client wrapper in services/openai-client.ts that initializes OpenAI client with API key from EXPO_PUBLIC_OPENAI_API_KEY environment variable
- [X] T008 Create services directory structure if it doesn't exist

### Phase 3: User Story 3 - BJJ Question Detection

**Story Goal**: As a user, I want the system to only respond to BJJ-related questions so that I can use the chat for other purposes without receiving irrelevant responses.

**Independent Test Criteria**:
- System detects BJJ-related questions with >= 50 relevance score
- System silently skips non-BJJ questions (score < 50)
- System handles mixed messages correctly (>50% BJJ-related threshold)
- Detection completes within 5 seconds
- Detection errors are handled silently without user notification

- [X] T009 [US3] Create prompt loading utility function in services/prompt-loader.ts that reads prompt files from .specify/prompts/002-science-coach-agent/ directory
- [X] T010 [P] [US3] Create BJJ detection service in services/bjj-detection-service.ts with detectBJJRelevance function that calls OpenAI API
- [X] T011 [P] [US3] Implement prompt loading for BJJ detection in services/bjj-detection-service.ts using prompt-loader utility
- [X] T012 [US3] Implement confidence scoring logic (0-100 scale) in services/bjj-detection-service.ts with score parsing and validation
- [X] T013 [US3] Implement >= 50 threshold check in services/bjj-detection-service.ts to determine if message is BJJ-related
- [X] T014 [US3] Add error handling and fallback behavior in services/bjj-detection-service.ts that returns 0 on errors (treated as non-BJJ)
- [X] T015 [US3] Add timeout handling (5 seconds) in services/bjj-detection-service.ts using Promise.race pattern

### Phase 4: User Story 1-2 - Agent Response Generation

**Story Goal**: As a Brazilian Jiu-Jitsu practitioner, I want to ask questions about BJJ techniques and receive sports science explanations automatically so that I can understand the biomechanical and physiological principles behind the techniques.

**Independent Test Criteria**:
- Agent generates sports science explanations for BJJ questions
- Responses are relevant to the user's specific question
- Responses are limited to 2000 characters with truncation
- Response generation completes within 10 seconds
- Responses are factually accurate and focused on sports science

- [X] T016 [US1] Create agent response service in services/agent-response-service.ts with generateResponse function that calls OpenAI API
- [X] T017 [US1] Implement prompt loading for sports science coach in services/agent-response-service.ts using prompt-loader utility
- [X] T018 [US1] Implement response generation with sports science focus in services/agent-response-service.ts using GPT-3.5-turbo model
- [X] T019 [US1] Integrate response truncation utility in services/agent-response-service.ts to limit responses to 2000 characters
- [X] T020 [US2] Add timeout handling (10 seconds) in services/agent-response-service.ts using Promise.race pattern
- [X] T021 [US2] Add error handling in services/agent-response-service.ts that throws appropriate errors for timeout and API failures

### Phase 5: User Story 4 - Chat Integration & User Experience

**Story Goal**: As a user, I want agent responses to appear naturally in the conversation flow so that the interaction feels like a real coaching session.

**Independent Test Criteria**:
- Agent responses appear automatically after user sends BJJ question
- Loading indicator displays while agent is processing
- Agent responses appear as "other" party messages aligned to the right
- Responses appear in chronological order with user messages
- Timeout notifications display when response exceeds 10 seconds
- Non-BJJ questions result in no response (silent handling)
- Multiple concurrent messages are handled independently

- [X] T022 [US4] Create LoadingIndicator component in components/loading-indicator.tsx using React Native Elements ActivityIndicator
- [X] T023 [US4] Style LoadingIndicator component with NativeWind classes for right alignment in components/loading-indicator.tsx
- [X] T024 [US4] Extend ChatDialog component in components/chat-dialog.tsx to trigger agent processing when user sends message
- [X] T025 [US4] Implement BJJ detection call in ChatDialog handleSend function in components/chat-dialog.tsx
- [X] T026 [US4] Add loading indicator display logic in ChatDialog component in components/chat-dialog.tsx when detection score >= 50
- [X] T027 [US4] Implement agent response generation call in ChatDialog component in components/chat-dialog.tsx after successful detection
- [X] T028 [US4] Implement loading indicator removal and response display in ChatDialog component in components/chat-dialog.tsx
- [X] T029 [US4] Add timeout notification handling in ChatDialog component in components/chat-dialog.tsx that displays timeout message after 10 seconds
- [X] T030 [US4] Implement silent handling for non-BJJ questions (score < 50) in ChatDialog component in components/chat-dialog.tsx
- [X] T031 [US4] Implement concurrent message handling in ChatDialog component in components/chat-dialog.tsx to process multiple messages independently
- [X] T032 [US4] Ensure agent responses maintain chronological order in ChatDialog component in components/chat-dialog.tsx
- [X] T033 [US4] Update MessageItem component in components/message-item.tsx to handle isLoading state and display LoadingIndicator
- [X] T034 [US4] Update MessageItem component in components/message-item.tsx to handle isSystemMessage state with special styling

### Phase 6: Polish & Cross-Cutting Concerns

- [X] T035 Add environment variable configuration documentation in README.md or .env.example file
- [X] T036 Implement error logging for agent processing failures in services/bjj-detection-service.ts and services/agent-response-service.ts
- [ ] T037 Add retry logic with exponential backoff in services/bjj-detection-service.ts for transient API failures
- [ ] T038 Add retry logic with exponential backoff in services/agent-response-service.ts for transient API failures
- [ ] T039 Verify non-blocking behavior of agent processing in ChatDialog component in components/chat-dialog.tsx
- [ ] T040 Test agent response truncation with responses exceeding 2000 characters in services/agent-response-service.ts
- [ ] T041 Test timeout scenarios with simulated slow API responses in components/chat-dialog.tsx
- [ ] T042 Test concurrent message handling with rapid successive BJJ questions in components/chat-dialog.tsx
- [ ] T043 Verify loading indicator appears and disappears correctly in components/chat-dialog.tsx
- [ ] T044 Test mixed message threshold logic (>50% BJJ-related) in services/bjj-detection-service.ts
- [ ] T045 Verify silent handling of non-BJJ questions doesn't disrupt chat flow in components/chat-dialog.tsx
- [ ] T046 Test error handling when OpenAI API is unavailable in services/bjj-detection-service.ts and services/agent-response-service.ts
- [ ] T047 Verify agent responses integrate seamlessly with existing chat dialog interface in components/chat-dialog.tsx
- [ ] T048 Test on iOS simulator to verify cross-platform compatibility
- [ ] T049 Test on Android emulator to verify cross-platform compatibility

## Summary

**Total Task Count**: 49 tasks

**Task Count by Phase**:
- Phase 1 (Setup): 4 tasks
- Phase 2 (Foundational): 4 tasks
- Phase 3 (US3 - BJJ Detection): 7 tasks
- Phase 4 (US1-2 - Agent Response): 6 tasks
- Phase 5 (US4 - Integration & UX): 13 tasks
- Phase 6 (Polish): 15 tasks

**Task Count by User Story**:
- User Story 1 (BJJ explanations): 6 tasks (Phase 4)
- User Story 2 (Automatic responses): 2 tasks (Phase 4)
- User Story 3 (BJJ detection only): 7 tasks (Phase 3)
- User Story 4 (Natural conversation flow): 13 tasks (Phase 5)

**Parallel Opportunities Identified**:
- Phase 1: 2 parallel tasks (T002, T003)
- Phase 2: 3 parallel tasks (T005, T006, T007)
- Phase 3: 2 parallel tasks (T010, T011)
- Phase 4: 2 parallel tasks (T014, T015)
- Phase 5: 2 parallel tasks (T018, T019)

**Independent Test Criteria**:
- **US3 (BJJ Detection)**: Detection accuracy >= 90%, silent handling of non-BJJ questions, >= 50 threshold logic
- **US1-2 (Agent Response)**: Sports science explanations, 2000 character limit, 10-second timeout
- **US4 (Integration & UX)**: Natural conversation flow, loading indicators, timeout notifications, concurrent message handling

**Suggested MVP Scope**: Phase 1-4 (Setup, Foundational, BJJ Detection, and Agent Response Generation) - This provides a working agent that can detect BJJ questions and generate responses, which can be tested independently before full UI integration.

**Format Validation**: ✅ All tasks follow the required checklist format with checkbox, Task ID, optional [P] marker, optional [Story] label, and file paths.

