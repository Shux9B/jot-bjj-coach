# Task Breakdown: BJJ Technique Coach Agent

## Constitution Check

All tasks MUST comply with the following constitutional principles:
- ✅ Expo-based React Native development
- ✅ React Native Elements component library
- ✅ Expo background task for network requests
- ✅ Tailwind CSS via NativeWind
- ✅ Centralized change documentation management
- ✅ Agent prompt management

## Overview

This task breakdown implements a technique coach agent feature that automatically responds to Brazilian Jiu-Jitsu (BJJ) related questions with practical, technique-focused guidance. The technique coach responds first to BJJ questions, with the science coach (002-science-coach-agent) providing supplementary responses after the technique coach response completes. The implementation reuses existing infrastructure (BJJ detection service, response truncation, OpenAI client) and integrates seamlessly with the existing chat dialog and sender display name system.

## Implementation Strategy

**MVP Scope**: Phase 1-4 (Setup, Foundational, Technique Coach Service, and Chat Integration) provide a minimal working technique coach that can generate and display technique-focused responses.

**Incremental Delivery**:
- Phase 1: Setup (prompt management)
- Phase 2: Foundational (service structure, sender name integration)
- Phase 3: User Story 3 (BJJ Detection - reuse existing service)
- Phase 4: User Story 1-2 (Technique coach response generation)
- Phase 5: User Story 4 (Chat integration with technique coach → science coach sequence)
- Phase 6: User Story 5 (Safety considerations - embedded in prompt and responses)
- Phase 7: Polish and error handling

## Dependencies

### Story Completion Order

1. **Phase 1: Setup** - Must complete before all other phases
2. **Phase 2: Foundational** - Must complete before user story phases
3. **Phase 3: User Story 3** (BJJ Detection) - Reuses existing service, verification only
4. **Phase 4: User Story 1-2** (Technique Coach Response) - Requires Phase 1-2
5. **Phase 5: User Story 4** (Chat Integration) - Requires Phase 4
6. **Phase 6: User Story 5** (Safety Considerations) - Embedded in Phase 4-5
7. **Phase 7: Polish** - Requires Phase 5

### Parallel Execution Opportunities

**Within Phase 1**:
- T002 [P] can be done independently (prompt file creation)

**Within Phase 2**:
- T004 [P] and T005 [P] can be done in parallel (service and prompt loader extension are independent)

**Within Phase 4**:
- T010 [P] and T011 [P] can be done in parallel (service implementation and prompt loading)

**Within Phase 5**:
- T014 [P] and T015 [P] can be done in parallel (technique coach integration and science coach trigger)

## Task List

### Phase 1: Setup

- [X] T001 Create prompt management directory structure at .specify/prompts/004-bjj-technique-coach/
- [X] T002 [P] Create technique coach prompt file at .specify/prompts/004-bjj-technique-coach/technique-coach-prompt.md with metadata header and prompt content focused on practical details, usage considerations, common mistakes, and safety
- [X] T003 Create README.md file at .specify/prompts/004-bjj-technique-coach/README.md documenting prompt management structure

### Phase 2: Foundational

- [X] T004 [P] Verify Message interface in types/chat.ts supports agentType field with 'technique-coach' value (should already support string type from 003-sender-display-names)
- [X] T005 [P] Extend prompt loader utility in services/prompt-loader.ts to add loadTechniqueCoachPrompt function that reads from .specify/prompts/004-bjj-technique-coach/technique-coach-prompt.md
- [X] T006 Verify sender name utility in utils/sender-name-utils.ts maps 'technique-coach' to '技术教练' (add mapping if missing)

### Phase 3: User Story 3 - BJJ Question Detection (Reuse Existing Service)

**Story Goal**: As a user, I want the system to only respond to BJJ-related questions so that I can use the chat for other purposes without receiving irrelevant responses.

**Independent Test Criteria**:
- System reuses existing BJJ detection service (shared with science coach)
- Single detection call per user message
- Detection result shared between technique coach and science coach
- System silently skips non-BJJ questions (score < 50)
- Detection errors are handled gracefully

- [X] T007 [US3] Verify existing BJJ detection service in services/bjj-detection-service.ts is accessible and functional
- [X] T008 [US3] Document that technique coach reuses existing detectBJJRelevance function from services/bjj-detection-service.ts (no implementation needed, already shared)

### Phase 4: User Story 1-2 - Technique Coach Response Generation

**Story Goal**: As a Brazilian Jiu-Jitsu practitioner, I want to ask questions about BJJ techniques and receive detailed guidance on practical usage considerations automatically so that I can apply techniques correctly and avoid common mistakes.

**Independent Test Criteria**:
- Technique coach generates practical, technique-focused responses for BJJ questions
- Responses emphasize practical details, usage considerations, common mistakes, and safety
- Responses are relevant to the user's specific question
- Responses are limited to 2000 characters with truncation
- Response generation completes within 10 seconds
- Responses include safety considerations when applicable

- [X] T009 [US1] Create technique coach service in services/technique-coach-service.ts with generateTechniqueCoachResponse function that calls DashScope API
- [X] T010 [P] [US1] Implement prompt loading for technique coach in services/technique-coach-service.ts using loadTechniqueCoachPrompt from prompt-loader
- [X] T011 [P] [US1] Implement response generation with technique-focused prompt in services/technique-coach-service.ts using qwen-plus model
- [X] T012 [US1] Integrate response truncation utility in services/technique-coach-service.ts to limit responses to 2000 characters using truncateResponse from utils/response-truncation.ts
- [X] T013 [US2] Add timeout handling (10 seconds) in services/technique-coach-service.ts using Promise.race pattern
- [X] T014 [US2] Add error handling in services/technique-coach-service.ts that throws appropriate errors for timeout and API failures
- [X] T015 [US1] Ensure technique coach prompt emphasizes practical details, usage considerations, common mistakes, and safety in .specify/prompts/004-bjj-technique-coach/technique-coach-prompt.md

### Phase 5: User Story 4 - Chat Integration & Multi-Agent Coordination

**Story Goal**: As a user, I want agent responses to appear naturally in the conversation flow so that the interaction feels like a real coaching session.

**Independent Test Criteria**:
- Technique coach response appears first (before science coach)
- Technique coach loading indicator displays while processing
- Technique coach response displays with sender name "技术教练"
- Science coach response triggers after technique coach completes
- Science coach response appears after technique coach response
- Responses appear in chronological order
- Timeout notifications display when technique coach exceeds 10 seconds
- On technique coach failure/timeout, science coach still triggers
- Multiple concurrent messages are handled independently

- [X] T016 [US4] Modify processAgentResponse function in components/chat-dialog.tsx to call technique coach service first (before science coach)
- [X] T017 [US4] Add technique coach loading indicator display logic in components/chat-dialog.tsx when BJJ detection score >= 50 with agentType: 'technique-coach'
- [X] T018 [US4] Implement technique coach response generation call in components/chat-dialog.tsx after successful BJJ detection
- [X] T019 [US4] Implement technique coach response display in components/chat-dialog.tsx with agentType: 'technique-coach' and bjjRelevanceScore from shared detection
- [X] T020 [US4] Implement technique coach loading indicator removal in components/chat-dialog.tsx when response arrives or timeout occurs
- [X] T021 [US4] Add technique coach timeout notification handling in components/chat-dialog.tsx that displays timeout message after 10 seconds with agentType: 'technique-coach'
- [X] T022 [US4] Implement science coach trigger function in components/chat-dialog.tsx that is called after technique coach response completes (success, failure, or timeout)
- [X] T023 [US4] Ensure science coach response appears after technique coach response in chronological order in components/chat-dialog.tsx
- [X] T024 [US4] Implement technique coach failure handling in components/chat-dialog.tsx that triggers science coach response on non-timeout failures
- [X] T025 [US4] Implement technique coach timeout handling in components/chat-dialog.tsx that displays timeout notification then triggers science coach response
- [X] T026 [US4] Verify technique coach and science coach use same bjjRelevanceScore from shared detection in components/chat-dialog.tsx
- [X] T027 [US4] Ensure concurrent message handling in components/chat-dialog.tsx processes each message independently with its own technique coach → science coach sequence
- [X] T028 [US4] Verify sender name "技术教练" displays correctly for technique coach responses via existing sender name system in components/message-item.tsx

### Phase 6: User Story 5 - Safety Considerations

**Story Goal**: As a BJJ practitioner, I want to learn about important details and safety considerations when using techniques so that I can train safely and effectively.

**Independent Test Criteria**:
- Technique coach responses include safety considerations when applicable
- Responses emphasize important details users should pay attention to
- Responses include common mistakes to avoid
- Safety information is clear and actionable

- [X] T029 [US5] Verify technique coach prompt in .specify/prompts/004-bjj-technique-coach/technique-coach-prompt.md emphasizes safety considerations
- [X] T030 [US5] Test technique coach responses include safety considerations for applicable BJJ questions
- [X] T031 [US5] Verify technique coach responses include common mistakes and how to avoid them

### Phase 7: Polish & Cross-Cutting Concerns

- [X] T032 Add error logging for technique coach processing failures in services/technique-coach-service.ts
- [X] T033 Verify non-blocking behavior of technique coach processing in components/chat-dialog.tsx
- [X] T034 Test technique coach response truncation with responses exceeding 2000 characters in services/technique-coach-service.ts
- [X] T035 Test technique coach timeout scenarios with simulated slow API responses in components/chat-dialog.tsx
- [X] T036 Test concurrent message handling with rapid successive BJJ questions in components/chat-dialog.tsx ensuring each gets independent technique coach → science coach sequence
- [X] T037 Verify technique coach loading indicator appears and disappears correctly in components/chat-dialog.tsx
- [X] T038 Test technique coach failure handling triggers science coach response correctly in components/chat-dialog.tsx
- [X] T039 Test technique coach timeout handling displays notification and triggers science coach response in components/chat-dialog.tsx
- [X] T040 Verify technique coach response appears before science coach response in chronological order in components/chat-dialog.tsx
- [X] T041 Test sender name "技术教练" displays correctly for all technique coach messages in components/message-item.tsx
- [X] T042 Verify shared BJJ detection service is used correctly (single call per message) in components/chat-dialog.tsx
- [X] T043 Test error handling when DashScope API is unavailable for technique coach in services/technique-coach-service.ts
- [X] T044 Verify technique coach responses are limited to 2000 characters with proper truncation in services/technique-coach-service.ts
- [X] T045 Test response sequence: technique coach → science coach for multiple concurrent messages in components/chat-dialog.tsx
- [X] T046 Verify no visual or functional regressions in existing chat dialog functionality in components/chat-dialog.tsx
- [X] T047 Test technique coach prompt quality with various BJJ technique questions to ensure practical, actionable responses

## Summary

**Total Task Count**: 47 tasks

**Task Count per Phase**:
- Phase 1 (Setup): 3 tasks
- Phase 2 (Foundational): 3 tasks
- Phase 3 (US3 - BJJ Detection): 2 tasks (verification only, reuses existing)
- Phase 4 (US1-2 - Response Generation): 7 tasks
- Phase 5 (US4 - Chat Integration): 13 tasks
- Phase 6 (US5 - Safety): 3 tasks
- Phase 7 (Polish): 16 tasks

**Task Count per User Story**:
- User Story 1 (Technique Guidance): 6 tasks (T009-T015)
- User Story 2 (Automatic Responses): 2 tasks (T013-T014)
- User Story 3 (BJJ Detection Only): 2 tasks (T007-T008, verification)
- User Story 4 (Natural Conversation Flow): 13 tasks (T016-T028)
- User Story 5 (Safety Considerations): 3 tasks (T029-T031)

**Parallel Execution Opportunities**:
- Phase 1: T002 can be done independently
- Phase 2: T004 and T005 can be done in parallel
- Phase 4: T010 and T011 can be done in parallel
- Phase 5: Multiple tasks can be done in parallel (T014-T015, T016-T017, etc.)

**Independent Test Criteria per Story**:
- **US1**: Technique coach generates practical, technique-focused responses with safety considerations
- **US2**: Automatic response generation without user action, completes within 10 seconds
- **US3**: Only responds to BJJ-related questions (score >= 50), reuses shared detection service
- **US4**: Responses appear naturally in conversation flow, technique coach before science coach, proper loading indicators and error handling
- **US5**: Responses include safety considerations, common mistakes, and important details

**Suggested MVP Scope**: Phase 1-4 (Setup, Foundational, BJJ Detection verification, and Technique Coach Response Generation) - 15 tasks. This provides a working technique coach that can generate responses, though full chat integration (Phase 5) is needed for complete user experience.

**Format Validation**: All tasks follow the required checklist format with:
- ✅ Checkbox: `- [ ]`
- ✅ Task ID: T001, T002, etc.
- ✅ [P] marker where applicable for parallelizable tasks
- ✅ [US1], [US2], etc. labels for user story phases
- ✅ Clear descriptions with exact file paths

