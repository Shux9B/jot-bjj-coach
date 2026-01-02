# Task Breakdown

## Constitution Check

All tasks MUST comply with the following constitutional principles:
- ✅ Expo-based React Native development
- ✅ React Native Elements component library
- ✅ Expo background task for network requests
- ✅ Tailwind CSS via NativeWind
- ✅ Centralized change documentation management

## Overview

This task breakdown implements a chat dialog interface feature organized by user stories. The implementation follows an incremental approach, starting with foundational setup, then building core functionality, and finally adding polish and cross-cutting concerns.

## Implementation Strategy

**MVP Scope**: Phase 1-3 (Setup, Foundational, and User Story 1-2) provide a minimal working chat interface where users can type and send messages.

**Incremental Delivery**:
- Phase 1-2: Foundation (types, utilities)
- Phase 3: Core input and send functionality (US1, US2)
- Phase 4: Message display with alignment (US3, US4, US5)
- Phase 5: Polish and accessibility

## Dependencies

### Story Completion Order

1. **Phase 1: Setup** - Must complete before all other phases
2. **Phase 2: Foundational** - Must complete before user story phases
3. **Phase 3: User Story 1-2** (Input & Send) - Can start after Phase 2
4. **Phase 4: User Story 3-5** (Message Display) - Requires Phase 3
5. **Phase 5: Polish** - Requires Phase 4

### Parallel Execution Opportunities

**Within Phase 2**:
- T003 [P] and T004 [P] can be done in parallel (types and utilities are independent)

**Within Phase 3**:
- T007 [P] and T008 [P] can be done in parallel (MessageInput and message handler are independent)
- T009 [P] can be done in parallel with T007-T008 (ChatDialog structure)

**Within Phase 4**:
- T011 [P] and T012 [P] can be done in parallel (MessageItem and FlatList integration)

## Task List

### Phase 1: Setup

- [X] T001 Verify NativeWind is installed and configured in package.json
- [X] T002 Verify React Native Elements dependencies (@rneui/themed, @rneui/base) are installed in package.json
- [X] T003 [P] Create Message type definition in types/chat.ts
- [X] T004 [P] Create message ID generation utility function in utils/message-utils.ts

### Phase 2: Foundational

- [X] T005 Create components directory structure if it doesn't exist
- [X] T006 Verify KeyboardAvoidingView import path and Platform API availability

### Phase 3: User Story 1-2 - Input & Send Functionality

**Story Goal**: As a user, I want to type messages in an input field at the bottom of the screen and click a send button to submit my message so that my message appears in the conversation.

**Independent Test Criteria**: 
- User can see text input field at bottom of screen
- User can type text into input field
- User can see send button adjacent to input field
- When user clicks send button, message is submitted
- After sending, input field is cleared

- [X] T007 [P] [US1] Create MessageInput component in components/message-input.tsx with React Native Elements Input component
- [X] T008 [P] [US1] Implement message sending handler function in components/chat-dialog.tsx
- [X] T009 [P] [US2] Create ChatDialog component structure in components/chat-dialog.tsx with KeyboardAvoidingView wrapper
- [X] T010 [US2] Integrate MessageInput component into ChatDialog with onSend handler in components/chat-dialog.tsx
- [X] T011 [US2] Implement input field clearing logic after message send in components/message-input.tsx

### Phase 4: User Story 3-5 - Message Display & Alignment

**Story Goal**: As a user, I want to see my messages aligned to the left, other party's messages aligned to the right, and all messages in a scrollable list so that I can view the entire conversation history.

**Independent Test Criteria**:
- User's messages are displayed aligned to the left side of the screen
- Other party's messages are displayed aligned to the right side of the screen
- All messages are displayed in chronological order
- Message list is scrollable when messages exceed visible area
- New messages are immediately visible after sending without manual scrolling

- [X] T012 [P] [US3] Create MessageItem component in components/message-item.tsx with conditional alignment based on sender
- [X] T013 [US3] Apply NativeWind styling for left alignment (self-start) for user messages in components/message-item.tsx
- [X] T014 [US4] Apply NativeWind styling for right alignment (self-end) for other party messages in components/message-item.tsx
- [X] T015 [US4] Implement visual distinction between user and other party messages using background colors in components/message-item.tsx
- [X] T016 [US5] Implement FlatList component for message list in components/chat-dialog.tsx
- [X] T017 [US5] Configure FlatList with keyExtractor using message.id in components/chat-dialog.tsx
- [X] T018 [US5] Implement auto-scroll to bottom when new messages are added using onContentSizeChange in components/chat-dialog.tsx
- [X] T019 [US5] Implement message state management using useState hook in components/chat-dialog.tsx
- [X] T020 [US5] Connect message sending handler to update message state array in components/chat-dialog.tsx

### Phase 5: Polish & Cross-Cutting Concerns

**Story Goal**: Ensure accessibility, performance, and user experience requirements are met.

**Independent Test Criteria**:
- Input field is accessible via screen readers
- Send button has appropriate accessibility labels
- Message content has sufficient contrast
- Input field remains accessible when keyboard is displayed
- Send button is easily tappable (minimum 44x44 points)
- Message list scrolls smoothly without performance issues

- [X] T021 Add accessibility labels to Input component in components/message-input.tsx
- [X] T022 Add accessibility labels to Button component in components/message-input.tsx
- [X] T023 Verify message text contrast meets accessibility standards in components/message-item.tsx
- [X] T024 Verify KeyboardAvoidingView behavior works correctly on iOS and Android in components/chat-dialog.tsx
- [X] T025 Verify send button touch target size meets minimum 44x44 points requirement in components/message-input.tsx
- [X] T026 Optimize FlatList rendering performance with React.memo for MessageItem in components/message-item.tsx
- [X] T027 Configure default route to display ChatDialog in app/index.tsx
- [X] T028 Update app/index.tsx to import and render ChatDialog component

## Task Summary

**Total Tasks**: 28

**Tasks by Phase**:
- Phase 1 (Setup): 4 tasks
- Phase 2 (Foundational): 2 tasks
- Phase 3 (US1-2 Input & Send): 5 tasks
- Phase 4 (US3-5 Display & Alignment): 9 tasks
- Phase 5 (Polish): 8 tasks

**Tasks by User Story**:
- User Story 1 (Input Field): 1 task (T007)
- User Story 2 (Send Button): 4 tasks (T008, T009, T010, T011)
- User Story 3 (Left Alignment): 2 tasks (T012, T013)
- User Story 4 (Right Alignment): 2 tasks (T014, T015)
- User Story 5 (Scrollable List): 5 tasks (T016, T017, T018, T019, T020)

**Parallel Opportunities**: 7 tasks marked with [P]

**Suggested MVP Scope**: Complete Phases 1-3 for a working chat interface with input and send functionality. Phase 4 adds message display, and Phase 5 adds polish.

## Notes

- All file paths are relative to project root
- Components use React Native Elements (@rneui/themed) per constitution
- All styling uses NativeWind (Tailwind CSS) per constitution
- Message state is managed locally using React hooks (no persistence per spec)
- Keyboard handling uses React Native KeyboardAvoidingView
- Auto-scrolling uses FlatList's onContentSizeChange callback
- Message ID generation uses timestamp + random string approach
- No external API contracts needed (local UI-only feature per spec)

