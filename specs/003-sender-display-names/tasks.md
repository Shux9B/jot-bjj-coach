# Task Breakdown

## Constitution Check

All tasks MUST comply with the following constitutional principles:
- ✅ Expo-based React Native development
- ✅ React Native Elements component library
- ✅ Expo background task for network requests
- ✅ Tailwind CSS via NativeWind
- ✅ Centralized change documentation management

## Overview

This task breakdown implements sender name display functionality in the chat dialog interface. The implementation follows an incremental approach, starting with foundational data model extensions, then building core sender name display functionality, and finally adding polish and cross-cutting concerns.

## Implementation Strategy

**MVP Scope**: Phase 1-3 (Setup, Foundational, and User Story 1-2) provide a minimal working implementation where user messages display "本人" and agent messages display agent names.

**Incremental Delivery**:
- Phase 1-2: Foundation (data model, utilities, styles)
- Phase 3: User message sender name display (US1)
- Phase 4: Agent message sender name display (US2)
- Phase 5: Vertical layout and consistency (US3, US4)
- Phase 6: Polish and accessibility

## Dependencies

### Story Completion Order

1. **Phase 1: Setup** - Must complete before all other phases
2. **Phase 2: Foundational** - Must complete before user story phases
3. **Phase 3: User Story 1** (User Message Sender Name) - Can start after Phase 2
4. **Phase 4: User Story 2** (Agent Message Sender Name) - Requires Phase 3
5. **Phase 5: User Story 3-4** (Vertical Layout & Consistency) - Requires Phase 4
6. **Phase 6: Polish** - Requires Phase 5

### Parallel Execution Opportunities

**Within Phase 2**:
- T003 [P] and T004 [P] can be done in parallel (types and utilities are independent)
- T005 [P] can be done in parallel with T003-T004 (styles are independent)

**Within Phase 3**:
- T007 [P] and T008 [P] can be done in parallel (utility function and MessageItem update are independent)

**Within Phase 4**:
- T010 [P] and T011 [P] can be done in parallel (ChatDialog and LoadingIndicator updates are independent)

**Within Phase 5**:
- T013 [P] and T014 [P] can be done in parallel (accessibility and performance optimizations are independent)

## Task List

### Phase 1: Setup

- [X] T001 Verify TypeScript is configured and Message interface exists in types/chat.ts
- [X] T002 Verify React Native Elements and NativeWind dependencies are installed in package.json

### Phase 2: Foundational

**Story Goal**: Establish data model and utility foundation for sender name display functionality.

**Independent Test Criteria**:
- Message interface includes optional `agentType` field
- Sender name utility function correctly maps agent types to display names
- Chat styles include sender name styling constants

- [X] T003 [P] Extend Message interface with optional `agentType?: 'sports-science' | string` field in types/chat.ts
- [X] T004 [P] Create sender name utility function with AGENT_NAME_MAP in utils/sender-name-utils.ts
- [X] T005 [P] Add sender name style constants to constants/chat-styles.ts

### Phase 3: User Story 1 - User Message Sender Name

**Story Goal**: As a user, I want to see "本人" displayed on my messages so that I can easily identify which messages I sent.

**Independent Test Criteria**:
- User messages display "本人" above message content
- "本人" label is positioned above user's message content
- "本人" label appears consistently for all user messages
- Sender name respects existing message alignment (left for user messages)

- [X] T006 [US1] Import getSenderName utility function in components/message-item.tsx
- [X] T007 [P] [US1] Add sender name display logic for user messages in components/message-item.tsx
- [X] T008 [P] [US1] Implement vertical layout with sender name above message content in components/message-item.tsx

### Phase 4: User Story 2 - Agent Message Sender Name

**Story Goal**: As a user, I want to see agent names (like "运动健康助理") on agent messages so that I can distinguish between different agents.

**Independent Test Criteria**:
- Agent messages with `agentType: 'sports-science'` display "运动健康助理"
- Agent messages without `agentType` do not display sender names (backward compatibility)
- System messages with `agentType` display corresponding agent name
- Loading indicators with `agentType` display corresponding agent name
- Agent names are positioned above agent's message content

- [X] T009 [US2] Add sender name display logic for agent messages in components/message-item.tsx
- [X] T010 [P] [US2] Update ChatDialog component to include `agentType: 'sports-science'` in agent response messages in components/chat-dialog.tsx
- [X] T011 [P] [US2] Update ChatDialog component to include `agentType: 'sports-science'` in system messages in components/chat-dialog.tsx
- [X] T012 [US2] Update ChatDialog component to include `agentType: 'sports-science'` in loading indicator messages in components/chat-dialog.tsx
- [X] T013 [US2] Extend LoadingIndicator component to accept optional `agentType` prop and display sender name in components/loading-indicator.tsx

### Phase 5: User Story 3-4 - Vertical Layout & Consistency

**Story Goal**: As a user, I want sender names displayed above message content so that I can quickly identify who sent each message, and I want consistent sender name display across all messages so that the interface feels cohesive and professional.

**Independent Test Criteria**:
- Sender name and message content are arranged vertically (name above content)
- Sender names are visually consistent for messages of the same type
- Sender names respect existing message alignment (user messages left, agent messages right)
- Vertical spacing between name and content is appropriate for readability
- Name label styling complements existing message bubble design

- [X] T014 [US3] Ensure vertical layout spacing is appropriate (4-6px margin between name and content) in components/message-item.tsx
- [X] T015 [US3] Apply consistent styling for user message sender names ("本人") in components/message-item.tsx
- [X] T016 [US4] Apply consistent styling for agent message sender names in components/message-item.tsx
- [X] T017 [US4] Verify sender name alignment matches message content alignment in components/message-item.tsx

### Phase 6: Polish & Cross-Cutting Concerns

**Story Goal**: Ensure accessibility, performance, and visual quality meet requirements.

**Independent Test Criteria**:
- Screen readers announce sender names correctly
- Color contrast meets WCAG AA standards
- Message rendering performance remains smooth (60 FPS)
- Sender name display does not increase rendering time by more than 10%
- Visual consistency across all message types

- [X] T018 [P] Add accessibilityLabel to message container View with sender name in components/message-item.tsx
- [X] T019 [P] Verify color contrast ratios meet WCAG AA standards for sender name text in constants/chat-styles.ts
- [X] T020 Wrap MessageItem component with React.memo for performance optimization in components/message-item.tsx
- [X] T021 Test message rendering performance with sender names (target: <10% increase) in components/message-item.tsx
- [X] T022 Verify visual consistency across all message types (user, agent, system, loading) in components/message-item.tsx
- [X] T023 Test backward compatibility: messages without `agentType` do not display sender names in components/message-item.tsx

## Summary

**Total Task Count**: 23 tasks

**Task Count per User Story**:
- Phase 2 (Foundational): 3 tasks
- Phase 3 (US1 - User Message Sender Name): 3 tasks
- Phase 4 (US2 - Agent Message Sender Name): 5 tasks
- Phase 5 (US3-4 - Vertical Layout & Consistency): 4 tasks
- Phase 6 (Polish): 6 tasks

**Parallel Opportunities Identified**: 8 tasks can be executed in parallel across different phases

**Independent Test Criteria**: Each user story phase has clear, testable acceptance criteria

**Suggested MVP Scope**: Phase 1-3 (Setup, Foundational, and User Story 1) provides minimal working implementation with user message sender names. Phase 4 adds agent message sender names for complete functionality.

