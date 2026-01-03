# Implementation Plan

## Constitution Check

This plan MUST comply with the following constitutional principles:
- ✅ Expo-based React Native development
- ✅ React Native Elements component library
- ✅ Expo background task for network requests
- ✅ Tailwind CSS via NativeWind
- ✅ Centralized change documentation management
- ✅ Agent prompt management

## Overview

This plan implements a tactics coach agent that automatically responds to Brazilian Jiu-Jitsu (BJJ) related questions in the existing chat dialog interface. The agent focuses on tactics, strategies, and competitive applications for BJJ techniques. The tactics coach responds third in the sequence (after technique coach and science coach) to provide strategic and tactical guidance as a supplement. The implementation integrates seamlessly with the existing chat dialog component (001-chat-dialog) and sender display name system (003-sender-display-names).

## Architecture Alignment

This implementation aligns with the project's architectural principles:

1. **Expo Framework**: Uses Expo for React Native development, ensuring cross-platform compatibility
2. **React Native Elements**: Leverages existing chat dialog components built with React Native Elements
3. **Expo Background Task**: Uses Expo background task system for agent API requests to ensure non-blocking operation
4. **NativeWind**: Maintains existing styling patterns using Tailwind CSS via NativeWind
5. **Agent Prompt Management**: Stores all agent prompts in centralized location per constitution Principle 6
6. **Shared Services**: Reuses existing BJJ detection service to ensure consistency with other coaches

## Technical Context

### Technology Stack

- **Framework**: Expo (React Native)
- **UI Components**: React Native Elements (existing chat dialog components)
- **State Management**: React hooks (useState, useRef) for local component state
- **Network Requests**: Expo background task (expo-task-manager, expo-background-fetch) for agent API calls
- **Styling**: Tailwind CSS via NativeWind (existing patterns)
- **AI/LLM Integration**: DashScope (阿里百炼) API with Qwen models (reusing existing infrastructure)

### Dependencies

**Existing Dependencies** (Already in project):
- `@rneui/themed`: React Native Elements themed components
- `@rneui/base`: React Native Elements base components
- `expo-router`: File-based routing system
- `react-native`: Core React Native framework
- `nativewind`: Tailwind CSS for React Native
- `openai`: OpenAI-compatible client for DashScope API

**New Dependencies** (To be added):
- None (reuses existing dependencies)

### Integration Points

- **Chat Dialog Component (001-chat-dialog)**: Extend existing `ChatDialog` component to integrate tactics coach response logic after science coach completes
- **BJJ Detection Service**: Reuse existing `bjj-detection-service.ts` for shared BJJ question detection
- **Message Types**: Extend existing `Message` interface to support tactics coach responses with `agentType: 'tactics-coach'`
- **Sender Display Names (003-sender-display-names)**: Use existing sender name system to display "战术教练" for tactics coach responses
- **Technique Coach (004-bjj-technique-coach)**: Tactics coach triggered after technique coach and science coach complete successfully
- **Science Coach (002-science-coach-agent)**: Tactics coach triggered after science coach completes successfully
- **Prompt Management System**: Centralized storage for tactics coach prompts per constitution

### Technical Decisions (Resolved in research.md)

1. **Agent API Service**: Reuse DashScope (阿里百炼) API with Qwen models (qwen-turbo/qwen-plus) using existing OpenAI-compatible interface
2. **BJJ Detection Method**: Reuse existing LLM-based classification service shared with other coaches
3. **Prompt Management**: `.specify/prompts/005-tactics-coach/` directory with metadata headers
4. **Loading Indicator**: Reuse React Native Elements ActivityIndicator displayed inline as temporary message
5. **Timeout Notification**: Reuse existing timeout notification pattern
6. **Response Order**: Tactics coach responds third (after technique coach and science coach complete successfully)
7. **Failure Handling**: Only trigger tactics coach when both technique coach and science coach complete successfully

## Implementation Steps

### Phase 0: Research & Design

1. **Research Tactics Coach Prompt Design**
   - Review existing technique coach and science coach prompt structures
   - Design prompt focused on tactics, strategies, and competitive applications
   - Determine prompt structure and key instructions
   - Document prompt template structure

2. **Research Three-Agent Response Coordination**
   - Review existing chat dialog implementation with technique coach → science coach sequence
   - Design coordination mechanism for technique coach → science coach → tactics coach response sequence
   - Determine failure handling: tactics coach only triggered when both previous coaches succeed
   - Document response ordering and state management

3. **Research Sender Name Integration**
   - Review 003-sender-display-names implementation
   - Determine agentType value for tactics coach ("tactics-coach")
   - Verify sender name mapping ("战术教练")
   - Document integration approach

### Phase 1: Component Design & Implementation

1. **Set Up Prompt Management System**
   - Create `.specify/prompts/005-tactics-coach/` directory structure
   - Create tactics coach prompt template
   - Document prompt metadata and versioning

2. **Implement Tactics Coach Response Service**
   - Create `tactics-coach-service.ts` module
   - Reuse existing DashScope API client
   - Implement response generation with tactics-focused prompt
   - Add response truncation logic (2000 character limit)
   - Follow same patterns as `technique-coach-service.ts` and `agent-response-service.ts`

3. **Extend Chat Dialog Component**
   - Modify `triggerScienceCoachResponse` to trigger tactics coach after science coach completes successfully
   - Add tactics coach response generation after science coach response completes
   - Implement coordination: trigger tactics coach only when both technique coach and science coach complete successfully
   - Add failure handling: do not trigger tactics coach if technique coach or science coach fails/timeouts
   - Add loading indicator for tactics coach processing
   - Add timeout notification for tactics coach

4. **Integrate Sender Display Names**
   - Ensure tactics coach messages have `agentType: 'tactics-coach'`
   - Verify sender name utility maps "tactics-coach" to "战术教练"
   - Test sender name display in chat dialog

5. **Update Message Type**
   - Verify `Message` interface supports `agentType: 'tactics-coach'`
   - Ensure backward compatibility with existing messages

### Phase 2: Testing & Refinement

1. **Functional Testing**
   - Test tactics coach response generation
   - Test three-coach response sequence: technique coach → science coach → tactics coach
   - Test tactics coach not triggered when technique coach fails/timeouts
   - Test tactics coach not triggered when science coach fails/timeouts
   - Test tactics coach timeout handling
   - Test non-BJJ question handling (shared detection)
   - Test concurrent message handling
   - Test sender name display for tactics coach

2. **Performance Testing**
   - Verify 10-second response time requirement for tactics coach
   - Test response sequence timing (technique coach → science coach → tactics coach)
   - Verify non-blocking behavior
   - Test with rapid consecutive messages

3. **UI/UX Testing**
   - Verify loading indicator visibility and clarity
   - Test timeout notification display
   - Verify seamless integration with existing chat
   - Test sender name display ("战术教练")
   - Test on different screen sizes
   - Verify response ordering (technique coach → science coach → tactics coach)

## Dependencies

### Existing Dependencies (Already in package.json)
- `@rneui/base`: ^4.0.0-rc.8
- `@rneui/themed`: ^4.0.0-rc.8
- `expo-router`: ~6.0.21
- `react-native`: 0.81.5
- `nativewind`: (if installed)
- `openai`: (existing DashScope client)

### Additional Dependencies (To be added)
- None (reuses existing dependencies)

## Testing Strategy

### Unit Testing
- Test tactics coach response generation logic
- Test response truncation logic
- Test timeout handling logic
- Test failure handling logic

### Integration Testing
- Test complete three-coach response flow: technique coach → science coach → tactics coach
- Test shared BJJ detection service integration
- Test sender name display integration
- Test concurrent message handling
- Test error handling scenarios
- Test tactics coach not triggered when previous coaches fail

### Manual Testing
- Test on iOS simulator
- Test on Android emulator
- Test with various BJJ and non-BJJ questions
- Test timeout scenarios
- Test rapid message sending
- Test tactics coach failure scenarios
- Test scenarios where technique coach or science coach fail

## Risks and Mitigations

### Risk 1: Three-Agent Response Coordination Complexity
- **Risk**: Coordinating three sequential agent responses may introduce bugs
- **Mitigation**: Follow existing patterns, implement clear state management, thorough testing

### Risk 2: Tactics Coach Prompt Quality
- **Risk**: Prompt may not generate high-quality tactics-focused responses
- **Mitigation**: Iterate on prompt design, test with various BJJ questions, gather feedback

### Risk 3: Performance Impact
- **Risk**: Three sequential agent responses may feel slow to users
- **Mitigation**: Optimize response generation, ensure each coach responds quickly, consider parallel processing if appropriate

### Risk 4: Failure Handling Complexity
- **Risk**: Complex failure scenarios (tactics coach only triggered when both previous coaches succeed) may be error-prone
- **Mitigation**: Clear error handling logic, comprehensive testing of failure scenarios

### Risk 5: Integration with Existing Chat
- **Risk**: Changes may break existing chat dialog functionality or other coach integrations
- **Mitigation**: Maintain existing component structure, add tactics coach logic as extension, thorough regression testing

