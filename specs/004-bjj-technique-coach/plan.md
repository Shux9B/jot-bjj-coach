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

This plan implements a technique coach agent that automatically responds to Brazilian Jiu-Jitsu (BJJ) related questions in the existing chat dialog interface. The agent focuses on practical details, usage considerations, common mistakes, and safety considerations for BJJ techniques. The technique coach responds first to BJJ questions, with the science coach (002-science-coach-agent) providing supplementary responses after the technique coach response completes. The implementation integrates seamlessly with the existing chat dialog component (001-chat-dialog) and sender display name system (003-sender-display-names).

## Architecture Alignment

This implementation aligns with the project's architectural principles:

1. **Expo Framework**: Uses Expo for React Native development, ensuring cross-platform compatibility
2. **React Native Elements**: Leverages existing chat dialog components built with React Native Elements
3. **Expo Background Task**: Uses Expo background task system for agent API requests to ensure non-blocking operation
4. **NativeWind**: Maintains existing styling patterns using Tailwind CSS via NativeWind
5. **Agent Prompt Management**: Stores all agent prompts in centralized location per constitution Principle 6
6. **Shared Services**: Reuses existing BJJ detection service to ensure consistency with science coach

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

- **Chat Dialog Component (001-chat-dialog)**: Extend existing `ChatDialog` component to integrate technique coach response logic
- **BJJ Detection Service**: Reuse existing `bjj-detection-service.ts` for shared BJJ question detection
- **Message Types**: Extend existing `Message` interface to support technique coach responses with `agentType: 'technique-coach'`
- **Sender Display Names (003-sender-display-names)**: Use existing sender name system to display "技术教练" for technique coach responses
- **Science Coach (002-science-coach-agent)**: Trigger science coach response after technique coach response completes
- **Prompt Management System**: Centralized storage for technique coach prompts per constitution

### Technical Decisions (Resolved in research.md)

1. **Agent API Service**: Reuse DashScope (阿里百炼) API with Qwen models (qwen-turbo/qwen-plus) using existing OpenAI-compatible interface
2. **BJJ Detection Method**: Reuse existing LLM-based classification service shared with science coach
3. **Prompt Management**: `.specify/prompts/004-bjj-technique-coach/` directory with metadata headers
4. **Loading Indicator**: Reuse React Native Elements ActivityIndicator displayed inline as temporary message
5. **Timeout Notification**: Reuse existing timeout notification pattern
6. **Response Order**: Technique coach responds first, science coach triggered after technique coach response completes
7. **Failure Handling**: On technique coach failure or timeout, still trigger science coach response

## Implementation Steps

### Phase 0: Research & Design

1. **Research Technique Coach Prompt Design**
   - Review existing science coach prompt structure
   - Design prompt focused on practical details, usage considerations, common mistakes, and safety
   - Determine prompt structure and key instructions
   - Document prompt template structure

2. **Research Multi-Agent Response Coordination**
   - Review existing chat dialog implementation
   - Design coordination mechanism for technique coach → science coach response sequence
   - Determine failure handling and timeout scenarios
   - Document response ordering and state management

3. **Research Sender Name Integration**
   - Review 003-sender-display-names implementation
   - Determine agentType value for technique coach ("technique-coach")
   - Verify sender name mapping ("技术教练")
   - Document integration approach

### Phase 1: Component Design & Implementation

1. **Set Up Prompt Management System**
   - Create `.specify/prompts/004-bjj-technique-coach/` directory structure
   - Create technique coach prompt template
   - Document prompt metadata and versioning

2. **Implement Technique Coach Response Service**
   - Create `technique-coach-service.ts` module
   - Reuse existing DashScope API client
   - Implement response generation with technique-focused prompt
   - Add response truncation logic (2000 character limit)
   - Follow same patterns as `agent-response-service.ts`

3. **Extend Chat Dialog Component**
   - Modify `processAgentResponse` to handle technique coach first
   - Add technique coach response generation before science coach
   - Implement coordination: trigger science coach after technique coach completes
   - Add failure handling: trigger science coach on technique coach failure/timeout
   - Add loading indicator for technique coach processing
   - Add timeout notification for technique coach

4. **Integrate Sender Display Names**
   - Ensure technique coach messages have `agentType: 'technique-coach'`
   - Verify sender name utility maps "technique-coach" to "技术教练"
   - Test sender name display in chat dialog

5. **Update Message Type**
   - Verify `Message` interface supports `agentType: 'technique-coach'`
   - Ensure backward compatibility with existing messages

### Phase 2: Testing & Refinement

1. **Functional Testing**
   - Test technique coach response generation
   - Test technique coach → science coach response sequence
   - Test technique coach failure handling (triggers science coach)
   - Test technique coach timeout handling (triggers science coach)
   - Test non-BJJ question handling (shared detection)
   - Test concurrent message handling
   - Test sender name display for technique coach

2. **Performance Testing**
   - Verify 10-second response time requirement for technique coach
   - Test response sequence timing (technique coach → science coach)
   - Verify non-blocking behavior
   - Test with rapid consecutive messages

3. **UI/UX Testing**
   - Verify loading indicator visibility and clarity
   - Test timeout notification display
   - Verify seamless integration with existing chat
   - Test sender name display ("技术教练")
   - Test on different screen sizes
   - Verify response ordering (technique coach before science coach)

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
- Test technique coach response generation logic
- Test response truncation logic
- Test timeout handling logic
- Test failure handling logic

### Integration Testing
- Test complete technique coach → science coach response flow
- Test shared BJJ detection service integration
- Test sender name display integration
- Test concurrent message handling
- Test error handling scenarios

### Manual Testing
- Test on iOS simulator
- Test on Android emulator
- Test with various BJJ and non-BJJ questions
- Test timeout scenarios
- Test rapid message sending
- Test technique coach failure scenarios

## Risks and Mitigations

### Risk 1: Response Coordination Complexity
- **Risk**: Coordinating technique coach → science coach response sequence may introduce bugs
- **Mitigation**: Follow existing patterns, implement clear state management, thorough testing

### Risk 2: Technique Coach Prompt Quality
- **Risk**: Prompt may not generate high-quality technique-focused responses
- **Mitigation**: Iterate on prompt design, test with various BJJ questions, gather feedback

### Risk 3: Performance Impact
- **Risk**: Two sequential agent responses may feel slow to users
- **Mitigation**: Optimize response generation, ensure technique coach responds quickly, consider parallel processing if appropriate

### Risk 4: Failure Handling Complexity
- **Risk**: Complex failure scenarios (technique coach fails, science coach should still respond) may be error-prone
- **Mitigation**: Clear error handling logic, comprehensive testing of failure scenarios

### Risk 5: Integration with Existing Chat
- **Risk**: Changes may break existing chat dialog functionality or science coach integration
- **Mitigation**: Maintain existing component structure, add technique coach logic as extension, thorough regression testing

