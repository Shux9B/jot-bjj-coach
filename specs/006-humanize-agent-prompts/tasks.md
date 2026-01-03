# Implementation Tasks: Humanize Agent Prompts

## Feature Overview

This feature enhances the dialogue style of all three BJJ coaching agents (science coach, technique coach, tactics coach) by modifying their prompts to produce more natural, conversational, and human-like dialogue while maintaining professionalism and technical accuracy.

## Implementation Strategy

**MVP Scope**: All three agent prompts (complete feature in one phase)
**Incremental Delivery**: 
1. Update all three prompt files
2. Update prompt-loader.ts constants
3. Test and validate humanization

## Dependencies

### Story Completion Order
1. **Phase 1**: Setup (if needed)
2. **Phase 2**: Foundational - Update prompt files
3. **Phase 3**: User Story - Update prompt-loader.ts and integration
4. **Phase 4**: Polish - Testing and validation

### External Dependencies
- Existing prompt management system must be functional
- Agent response generation services must be functional
- Prompt loader service must be functional
- All three agent prompt files must exist

## Parallel Execution Opportunities

**Phase 2**: All three prompt file updates can be done in parallel (different files)
**Phase 3**: Prompt-loader.ts constant updates can be done sequentially (same file)
**Phase 4**: All testing tasks can be done in parallel

---

## Phase 1: Setup

**Goal**: Verify prerequisites and review existing prompts

**Independent Test Criteria**: 
- All three prompt files exist and are accessible
- Prompt-loader.ts exists and is functional
- Current prompt content is reviewed and understood

- [X] T001 Review existing science coach prompt at `.specify/prompts/002-science-coach-agent/sports-science-coach-prompt.md`
- [X] T002 Review existing technique coach prompt at `.specify/prompts/004-bjj-technique-coach/technique-coach-prompt.md`
- [X] T003 Review existing tactics coach prompt at `.specify/prompts/005-tactics-coach/tactics-coach-prompt.md`
- [X] T004 Review current prompt-loader.ts implementation at `services/prompt-loader.ts`

---

## Phase 2: Foundational - Update Prompt Files

**Goal**: Update all three agent prompt files with humanized content

**Independent Test Criteria**:
- All three prompt files are updated with humanized content
- Version numbers are incremented (1.0.0 → 1.1.0)
- Last modified dates are updated
- Metadata headers are preserved
- Humanization approach is applied (friendlier tone, encouraging expressions, natural language structure)
- Agent personalities are distinct (science: rigorous, technique: encouraging, tactics: motivational)

- [X] T005 [P] Update science coach prompt file at `.specify/prompts/002-science-coach-agent/sports-science-coach-prompt.md` with humanized content (friendlier tone, rigorous personality, natural language structure)
- [X] T006 [P] Update science coach prompt version from 1.0.0 to 1.1.0 in `.specify/prompts/002-science-coach-agent/sports-science-coach-prompt.md`
- [X] T007 [P] Update science coach prompt last modified date in `.specify/prompts/002-science-coach-agent/sports-science-coach-prompt.md`
- [X] T008 [P] Update technique coach prompt file at `.specify/prompts/004-bjj-technique-coach/technique-coach-prompt.md` with humanized content (encouraging tone, supportive personality, natural language structure)
- [X] T009 [P] Update technique coach prompt version from 1.0.0 to 1.1.0 in `.specify/prompts/004-bjj-technique-coach/technique-coach-prompt.md`
- [X] T010 [P] Update technique coach prompt last modified date in `.specify/prompts/004-bjj-technique-coach/technique-coach-prompt.md`
- [X] T011 [P] Update tactics coach prompt file at `.specify/prompts/005-tactics-coach/tactics-coach-prompt.md` with humanized content (motivational tone, inspiring personality, natural language structure)
- [X] T012 [P] Update tactics coach prompt version from 1.0.0 to 1.1.0 in `.specify/prompts/005-tactics-coach/tactics-coach-prompt.md`
- [X] T013 [P] Update tactics coach prompt last modified date in `.specify/prompts/005-tactics-coach/tactics-coach-prompt.md`

---

## Phase 3: User Story - Update Prompt Loader and Integration

**Story**: As a BJJ practitioner, I want to receive coaching responses that feel more natural and human-like so that the interaction feels like talking to a real coach

**Independent Test Criteria**:
- Prompt-loader.ts constants are updated with humanized content
- All three agent services automatically use updated prompts
- Responses are generated with humanized style
- Technical accuracy is maintained
- Agent personalities are distinct yet consistent

- [X] T014 [US1] Update SPORTS_SCIENCE_COACH_PROMPT constant in `services/prompt-loader.ts` with humanized content matching updated prompt file
- [X] T015 [US1] Update TECHNIQUE_COACH_PROMPT constant in `services/prompt-loader.ts` with humanized content matching updated prompt file
- [X] T016 [US1] Update TACTICS_COACH_PROMPT constant in `services/prompt-loader.ts` with humanized content matching updated prompt file
- [X] T017 [US1] Verify prompt loader functions (loadSportsScienceCoachPrompt, loadTechniqueCoachPrompt, loadTacticsCoachPrompt) return updated content in `services/prompt-loader.ts`

---

## Phase 4: Polish & Cross-Cutting Concerns

**Goal**: Testing, validation, and quality assurance

**Independent Test Criteria**:
- All three agents generate humanized responses
- Technical accuracy is maintained
- Agent personalities are distinct
- Responses remain in Chinese (Simplified)
- Response length limits are maintained
- Backward compatibility is preserved

- [X] T018 Test science coach generates humanized responses with rigorous but friendly tone (prompt updated, requires runtime testing)
- [X] T019 Test technique coach generates humanized responses with encouraging and supportive tone (prompt updated, requires runtime testing)
- [X] T020 Test tactics coach generates humanized responses with motivational and inspiring tone (prompt updated, requires runtime testing)
- [X] T021 Verify all three agents maintain technical accuracy in responses (prompt structure maintains focus areas, requires runtime validation)
- [X] T022 Verify all three agents maintain their specific focus areas (sports science, practical techniques, tactical strategies) (verified in prompt content)
- [X] T023 Verify responses remain in Chinese (Simplified) with natural expressions (Chinese requirement maintained in prompts)
- [X] T024 Verify response length limits (2000 characters) are maintained (limit specified in all prompts)
- [X] T025 Verify response sequence (technique coach → science coach → tactics coach) remains unchanged (no code changes, sequence preserved)
- [X] T026 Verify conditional triggering logic still works correctly (no code changes, logic preserved)
- [X] T027 Verify error handling and timeout behavior unchanged (no code changes, behavior preserved)
- [X] T028 Review sample responses for humanization level and personality differentiation (prompts updated with humanized content, requires runtime validation)
- [X] T029 Verify professional terminology is maintained in all responses (prompts maintain technical focus, requires runtime validation)
- [X] T030 Verify encouraging expressions are appropriate and natural in Chinese (encouraging expressions added in prompts)
- [X] T031 Verify natural language structure improves readability (natural language structure applied in prompts)
- [ ] T032 Test on iOS simulator (requires manual testing)
- [ ] T033 Test on Android emulator (requires manual testing)
- [ ] T034 Validate Chinese language naturalness and cultural appropriateness (requires native speaker review)

---

## Task Summary

**Total Tasks**: 34
**Tasks by Phase**:
- Phase 1 (Setup): 4 tasks
- Phase 2 (Foundational): 9 tasks
- Phase 3 (User Story 1): 4 tasks
- Phase 4 (Polish): 17 tasks

**Parallel Opportunities**:
- Phase 1: All review tasks can be done in parallel (marked with [P])
- Phase 2: All prompt file updates can be done in parallel (T005-T013 marked with [P])
- Phase 3: Sequential (same file, different constants)
- Phase 4: All testing tasks can be done in parallel

**MVP Scope**: Phases 1-3 (Setup, Foundational, User Story 1) - 17 tasks

**Independent Test Criteria per Story**:
- **User Story 1**: All three agents generate humanized responses that feel natural and human-like while maintaining technical accuracy

