# Implementation Tasks: BJJ Tactics Coach Agent

## Feature Overview

This feature implements a tactics coach agent that automatically responds to Brazilian Jiu-Jitsu (BJJ) related questions in the existing chat dialog interface. The tactics coach focuses on tactics, strategies, and competitive applications, responding third in the sequence (after technique coach and science coach) to provide strategic and tactical guidance as a supplement.

## Implementation Strategy

**MVP Scope**: User Story 1 (P1) - Core tactics coach response generation and integration
**Incremental Delivery**: 
1. MVP: Tactics coach service and basic integration
2. Enhancement: Response sequencing and conditional triggering
3. Polish: Error handling, testing, and optimization

## Dependencies

### Story Completion Order
1. **Phase 1-2**: Setup and foundational tasks (must complete before user stories)
2. **Phase 3**: User Story 1 (P1) - Core tactics coach functionality
3. **Phase 4**: User Story 4 (P2) - Response sequencing and UX
4. **Phase 5**: User Story 5 (P1) - Enhanced tactical guidance
5. **Phase 6**: Polish and cross-cutting concerns

### External Dependencies
- Existing chat dialog component (001-chat-dialog) must be functional
- Technique coach (004-bjj-technique-coach) must be functional
- Science coach (002-science-coach-agent) must be functional
- Sender display name system (003-sender-display-names) must be functional
- BJJ detection service must be functional and shared

## Parallel Execution Opportunities

**Phase 1**: All setup tasks can be done in parallel
**Phase 2**: Prompt creation and service implementation can be done in parallel with sender name mapping
**Phase 3**: Service implementation and chat dialog integration can be done sequentially (integration depends on service)
**Phase 4-5**: Can be done in parallel after Phase 3 completes
**Phase 6**: All polish tasks can be done in parallel

---

## Phase 1: Setup

**Goal**: Create prompt management directory structure for tactics coach

**Independent Test Criteria**: 
- `.specify/prompts/005-tactics-coach/` directory exists
- Directory structure matches other coach prompts

- [X] T001 Create prompt management directory structure at `.specify/prompts/005-tactics-coach/`

---

## Phase 2: Foundational

**Goal**: Implement core tactics coach service and sender name mapping

**Independent Test Criteria**:
- Tactics coach service can generate responses
- Sender name utility maps 'tactics-coach' to '战术教练'
- Prompt is loaded correctly

- [X] T002 [P] Create tactics coach prompt file at `.specify/prompts/005-tactics-coach/tactics-coach-prompt.md` with focus on tactics, strategies, and competitive applications
- [X] T003 [P] Add TACTICS_COACH_PROMPT constant to `services/prompt-loader.ts`
- [X] T004 [P] Add loadTacticsCoachPrompt function to `services/prompt-loader.ts`
- [X] T005 [P] Create tactics coach service at `services/tactics-coach-service.ts` with generateTacticsCoachResponse function
- [X] T006 [P] Implement response generation logic in `services/tactics-coach-service.ts` using DashScope API with Qwen models
- [X] T007 [P] Add response truncation logic (2000 character limit) to `services/tactics-coach-service.ts`
- [X] T008 [P] Add timeout handling (10 seconds) to `services/tactics-coach-service.ts`
- [X] T009 [P] Add error handling and logging to `services/tactics-coach-service.ts`
- [X] T010 [P] Add 'tactics-coach' → '战术教练' mapping to AGENT_NAME_MAP in `utils/sender-name-utils.ts`

---

## Phase 3: User Story 1 (P1) - Core Tactics Coach Response Generation

**Story**: As a Brazilian Jiu-Jitsu practitioner, I want to ask questions about BJJ tactics and strategies and receive strategic guidance so that I can understand how to apply techniques in competitive scenarios

**Independent Test Criteria**:
- When user sends BJJ-related question, tactics coach response is generated after science coach completes successfully
- Tactics coach response focuses on tactics, strategies, and competitive applications
- Response is displayed with correct sender name "战术教练"
- Response is truncated to 2000 characters if needed
- Response appears in correct sequence (after technique coach and science coach)

- [X] T011 [US1] Import generateTacticsCoachResponse in `components/chat-dialog.tsx`
- [X] T012 [US1] Create triggerTacticsCoachResponse function in `components/chat-dialog.tsx` to handle tactics coach response generation
- [X] T013 [US1] Add loading indicator logic for tactics coach in triggerTacticsCoachResponse function in `components/chat-dialog.tsx`
- [X] T014 [US1] Add tactics coach response generation with timeout handling (10 seconds) in triggerTacticsCoachResponse function in `components/chat-dialog.tsx`
- [X] T015 [US1] Add tactics coach response display logic with agentType 'tactics-coach' in triggerTacticsCoachResponse function in `components/chat-dialog.tsx`
- [X] T016 [US1] Modify triggerScienceCoachResponse function in `components/chat-dialog.tsx` to call triggerTacticsCoachResponse after science coach response completes successfully
- [X] T017 [US1] Ensure tactics coach response includes bjjRelevanceScore from shared detection in `components/chat-dialog.tsx`

---

## Phase 4: User Story 4 (P2) - Natural Response Flow

**Story**: As a user, I want agent responses to appear naturally in the conversation flow so that the interaction feels like a real coaching session

**Independent Test Criteria**:
- Responses appear in correct sequence: technique coach → science coach → tactics coach
- Responses are displayed in chronological order
- Loading indicators appear and disappear correctly
- User can continue sending messages while responses are being generated

- [X] T018 [US4] Verify response ordering logic ensures tactics coach response appears after science coach response in `components/chat-dialog.tsx`
- [X] T019 [US4] Ensure loading indicator is removed when tactics coach response arrives or times out in `components/chat-dialog.tsx`
- [X] T020 [US4] Verify message list maintains chronological order for all three coach responses in `components/chat-dialog.tsx`

---

## Phase 5: User Story 5 (P1) - Enhanced Tactical Guidance

**Story**: As a BJJ competitor, I want to learn about tactical applications and strategic thinking so that I can improve my competitive performance

**Independent Test Criteria**:
- Tactics coach responses include tactical considerations (when to apply techniques, how to set up attacks, how to counter opponent strategies)
- Responses emphasize strategic thinking and tactical decision-making
- Responses provide actionable guidance for competitive scenarios

- [X] T021 [US5] Verify tactics coach prompt emphasizes tactical applications and strategic thinking in `.specify/prompts/005-tactics-coach/tactics-coach-prompt.md`
- [X] T022 [US5] Test tactics coach responses include tactical considerations such as timing, positioning, and match management
- [X] T023 [US5] Verify tactics coach responses provide strategic guidance for competitive scenarios

---

## Phase 6: Conditional Triggering and Error Handling

**Goal**: Implement conditional triggering (tactics coach only when both previous coaches succeed) and comprehensive error handling

**Independent Test Criteria**:
- Tactics coach is NOT triggered when technique coach fails or times out
- Tactics coach is NOT triggered when science coach fails or times out
- Tactics coach timeout displays notification message
- Chat interface remains functional during failures

- [X] T024 Modify triggerScienceCoachResponse function in `components/chat-dialog.tsx` to only call triggerTacticsCoachResponse when science coach completes successfully (not on failure/timeout)
- [X] T025 Add conditional check in triggerTacticsCoachResponse to ensure it's only called after both technique coach and science coach succeed in `components/chat-dialog.tsx`
- [X] T026 Add timeout notification display for tactics coach (10 seconds) in triggerTacticsCoachResponse function in `components/chat-dialog.tsx`
- [X] T027 Add error handling for tactics coach generation failures (silent error, no user notification except timeout) in `components/chat-dialog.tsx`
- [X] T028 Verify tactics coach is not triggered when technique coach fails/timeouts in `components/chat-dialog.tsx`
- [X] T029 Verify tactics coach is not triggered when science coach fails/timeouts in `components/chat-dialog.tsx`

---

## Phase 7: Polish & Cross-Cutting Concerns

**Goal**: Testing, optimization, and final refinements

**Independent Test Criteria**:
- All acceptance criteria from spec.md are met
- No regressions in existing chat dialog functionality
- Performance meets 10-second response time requirement
- Error handling is comprehensive

- [ ] T030 Test three-coach response sequence: technique coach → science coach → tactics coach with successful completion
- [ ] T031 Test tactics coach not triggered when technique coach fails/timeouts
- [ ] T032 Test tactics coach not triggered when science coach fails/timeouts
- [ ] T033 Test tactics coach timeout handling (10 seconds)
- [ ] T034 Test non-BJJ question handling (shared detection service)
- [ ] T035 Test concurrent message handling (multiple BJJ questions in rapid succession)
- [ ] T036 Test sender name display for tactics coach ("战术教练")
- [ ] T037 Verify response truncation works correctly (2000 character limit)
- [ ] T038 Verify response ordering (technique coach → science coach → tactics coach)
- [ ] T039 Test on iOS simulator
- [ ] T040 Test on Android emulator
- [ ] T041 Verify no regressions in existing chat dialog functionality
- [ ] T042 Verify performance meets 10-second response time requirement for tactics coach
- [ ] T043 Verify chat interface remains functional during agent processing failures

---

## Task Summary

**Total Tasks**: 43
**Tasks by Phase**:
- Phase 1 (Setup): 1 task
- Phase 2 (Foundational): 9 tasks
- Phase 3 (User Story 1): 7 tasks
- Phase 4 (User Story 4): 3 tasks
- Phase 5 (User Story 5): 3 tasks
- Phase 6 (Conditional Triggering): 6 tasks
- Phase 7 (Polish): 14 tasks

**Parallel Opportunities**:
- Phase 1: All tasks can be done in parallel
- Phase 2: T002-T010 can be done in parallel (marked with [P])
- Phase 3-5: Sequential within each phase, but phases can be done in parallel after dependencies are met
- Phase 6: Sequential (depends on Phase 3)
- Phase 7: All testing tasks can be done in parallel

**MVP Scope**: Phases 1-3 (Setup, Foundational, User Story 1) - 17 tasks

**Independent Test Criteria per Story**:
- **User Story 1**: Tactics coach generates and displays responses correctly
- **User Story 4**: Responses appear in natural sequence and chronological order
- **User Story 5**: Responses include tactical considerations and strategic guidance

