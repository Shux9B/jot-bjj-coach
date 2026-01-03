# Task Breakdown: Shared Context Between Agents

## Constitution Check

All tasks MUST comply with the following constitutional principles:
- ✅ Expo-based React Native development
- ✅ React Native Elements component library
- ✅ Expo background task for network requests
- ✅ Tailwind CSS via NativeWind
- ✅ Centralized change documentation management
- ✅ Agent prompt management

## Overview

This feature implements context sharing between multiple BJJ coaching agents to prevent duplicate information and create more coherent, complementary responses. Tasks are organized by user story to enable independent implementation and testing.

## User Stories

- **US1**: As a BJJ practitioner, I want to receive complementary responses from multiple coaches so that I get comprehensive guidance without redundant information
- **US2**: As a user, I want agent responses to build upon each other so that the conversation feels like a coordinated coaching session
- **US3**: As a BJJ learner, I want each coach to focus on their unique expertise without repeating what others have already explained

## Dependencies

### Story Completion Order

1. **Phase 2 (Foundational)** - Must complete before all user stories
   - Summary generation service is prerequisite for handling long contexts

2. **Phase 3 (US1)** - Can start after Phase 2
   - Implements basic context passing from technique coach to science coach
   - Independent and testable

3. **Phase 4 (US2)** - Depends on Phase 3
   - Extends context passing to include tactics coach
   - Requires science coach context passing to be working

4. **Phase 5 (US3)** - Can be parallel with Phase 3 and 4
   - Updates prompts to prevent duplication
   - Independent of context passing implementation

5. **Phase 6 (Polish)** - Depends on all previous phases
   - Testing and validation of complete feature

### Parallel Execution Opportunities

- **Phase 2 tasks**: Can be parallelized (T002-T004 are independent)
- **Phase 3 tasks**: T006-T007 can be parallel (different services)
- **Phase 4 tasks**: T009-T010 can be parallel (different services)
- **Phase 5 tasks**: T012-T013 can be parallel (different prompt files)

## Implementation Strategy

### MVP Scope
- **Phase 2 + Phase 3**: Basic context sharing from technique coach to science coach
- This provides immediate value and can be tested independently
- Phase 4 and 5 can be added incrementally

### Incremental Delivery
1. **Increment 1**: Summary generation service + Science coach context (Phase 2 + Phase 3)
2. **Increment 2**: Tactics coach context (Phase 4)
3. **Increment 3**: Duplicate prevention prompts (Phase 5)
4. **Increment 4**: Testing and polish (Phase 6)

## Task List

### Phase 1: Setup

- [x] T001 Review existing agent response services structure in `services/agent-response-service.ts`, `services/tactics-coach-service.ts`, and `services/technique-coach-service.ts`

### Phase 2: Foundational - Summary Generation Service

- [x] T002 [P] Create `services/response-summary-service.ts` with `generateResponseSummary` function that uses DashScope API to generate summaries
- [x] T003 [P] Implement `estimateTokenCount` function in `services/response-summary-service.ts` to estimate token count for Chinese text (1 token ≈ 4 characters)
- [x] T004 [P] Implement `checkNeedsSummary` function in `services/response-summary-service.ts` to check if context exceeds token limits (default 3000 tokens)

### Phase 3: User Story 1 - Context Passing to Science Coach

**Story Goal**: Science coach receives technique coach's response as context when generating its response.

**Independent Test Criteria**: 
- Science coach API call includes technique coach response as assistant message when technique coach succeeded
- Science coach generates response without context when technique coach failed or timed out
- Response sequence remains unchanged (technique → science → tactics)

- [x] T005 [US1] Update `generateResponse` function signature in `services/agent-response-service.ts` to accept optional `previousResponses?: string[]` parameter
- [x] T006 [P] [US1] Modify `generateResponse` function in `services/agent-response-service.ts` to build messages array with context: add previous responses as assistant messages before user question
- [x] T007 [P] [US1] Add context length checking in `generateResponse` function in `services/agent-response-service.ts`: call `checkNeedsSummary` and generate summaries if needed using `generateResponseSummary`
- [x] T008 [US1] Update `triggerScienceCoachResponse` function in `components/chat-dialog.tsx` to pass `techniqueCoachResponse` as context parameter to `generateResponse` (only if `techniqueCoachSucceeded` is true)

### Phase 4: User Story 2 - Context Passing to Tactics Coach

**Story Goal**: Tactics coach receives both technique coach's and science coach's responses as context when generating its response.

**Independent Test Criteria**:
- Tactics coach API call includes both previous responses as assistant messages when both previous coaches succeeded
- Tactics coach receives only available context when one previous coach failed
- Tactics coach generates response without context when both previous coaches failed
- Response sequence remains unchanged

- [x] T009 [P] [US2] Update `generateTacticsCoachResponse` function signature in `services/tactics-coach-service.ts` to accept optional `previousResponses?: string[]` parameter
- [x] T010 [P] [US2] Modify `generateTacticsCoachResponse` function in `services/tactics-coach-service.ts` to build messages array with context: add previous responses as assistant messages before user question
- [x] T011 [US2] Add context length checking in `generateTacticsCoachResponse` function in `services/tactics-coach-service.ts`: call `checkNeedsSummary` and generate summaries if needed using `generateResponseSummary`
- [x] T012 [US2] Update `triggerTacticsCoachResponse` function signature in `components/chat-dialog.tsx` to accept `techniqueCoachResponse?: string` and `scienceCoachResponse?: string` parameters
- [x] T013 [US2] Modify `triggerTacticsCoachResponse` function in `components/chat-dialog.tsx` to build context array from both previous responses (only if both succeeded) and pass to `generateTacticsCoachResponse`
- [x] T014 [US2] Update `triggerScienceCoachResponse` function in `components/chat-dialog.tsx` to pass both `techniqueCoachResponse` and `scienceCoachResponse` to `triggerTacticsCoachResponse` when both succeeded

### Phase 5: User Story 3 - Duplicate Prevention Prompts

**Story Goal**: Each coach focuses on their unique expertise without repeating what others have already explained.

**Independent Test Criteria**:
- Science coach prompt includes explicit instructions to avoid duplicating technique coach information
- Tactics coach prompt includes explicit instructions to avoid duplicating previous coaches' information
- Agents generate responses that complement rather than duplicate previous responses
- Responses remain informative and valuable

- [x] T015 [P] [US3] Update sports science coach prompt in `services/prompt-loader.ts` to add duplicate prevention instructions: "If you receive previous responses from other coaches, avoid repeating information already covered, focus on your unique expertise (biomechanics, physiology, exercise science), complement previous responses rather than duplicate them"
- [x] T016 [P] [US3] Update tactics coach prompt in `services/prompt-loader.ts` to add duplicate prevention instructions: "If you receive previous responses from other coaches, avoid repeating information already covered, focus on your unique expertise (tactical applications, strategic thinking, competition strategies), complement previous responses rather than duplicate them"
- [x] T017 [US3] Verify technique coach prompt in `services/prompt-loader.ts` remains unchanged (first agent, no context)

### Phase 6: Polish & Cross-Cutting Concerns

- [ ] T018 Test context passing from technique coach to science coach: verify science coach receives context when technique coach succeeded
- [ ] T019 Test context passing to tactics coach: verify tactics coach receives both contexts when both previous coaches succeeded
- [ ] T020 Test duplicate prevention: verify subsequent agents avoid repeating information from previous agents
- [ ] T021 Test failure handling: verify context not passed when previous agents failed or timed out
- [ ] T022 Test summary generation: verify summaries generated when context exceeds token limits
- [ ] T023 Test backward compatibility: verify response sequence, conditional triggering, error handling, and timeout behavior remain unchanged
- [ ] T024 Test response quality: verify responses remain informative and valuable even when avoiding duplication
- [x] T025 Remove debugger statements from `services/agent-response-service.ts` (lines 19 and 34) and `services/openai-client.ts` (line 18)

## Task Summary

- **Total Tasks**: 25
- **Phase 1 (Setup)**: 1 task
- **Phase 2 (Foundational)**: 3 tasks
- **Phase 3 (US1)**: 4 tasks
- **Phase 4 (US2)**: 6 tasks
- **Phase 5 (US3)**: 3 tasks
- **Phase 6 (Polish)**: 8 tasks

### Parallel Opportunities

- **Phase 2**: T002, T003, T004 can be parallel (independent functions in same file)
- **Phase 3**: T006, T007 can be parallel (different modifications to same function, but sequential is safer)
- **Phase 4**: T009, T010 can be parallel (different modifications to same function, but sequential is safer)
- **Phase 5**: T015, T016 can be parallel (different prompt updates)

### Independent Test Criteria Summary

- **US1**: Science coach receives context, fallback works, sequence unchanged
- **US2**: Tactics coach receives both contexts, partial context handling, sequence unchanged
- **US3**: Prompts include duplicate prevention, responses complement each other, responses remain valuable

### Suggested MVP Scope

- **MVP**: Phase 2 + Phase 3 (Summary service + Science coach context)
- **Rationale**: Provides immediate value, independently testable, enables incremental delivery
- **Next Increments**: Phase 4 (Tactics coach context), Phase 5 (Duplicate prevention), Phase 6 (Testing)

## Notes

- All context passing is optional (backward compatible)
- Summary generation only triggered when context exceeds token limits
- Context only passed for successful responses
- All existing functional behaviors must remain unchanged
- Response sequence (technique → science → tactics) must remain unchanged
- Conditional triggering logic must remain unchanged

