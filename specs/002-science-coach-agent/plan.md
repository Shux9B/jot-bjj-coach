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

This plan implements a sports science coach agent that automatically responds to Brazilian Jiu-Jitsu (BJJ) related questions in the existing chat dialog interface. The agent analyzes user messages to detect BJJ-related content, generates sports science explanations for BJJ questions, and silently handles non-BJJ questions. The implementation integrates seamlessly with the existing chat dialog component (001-chat-dialog) without modifying its UI structure.

## Architecture Alignment

This implementation aligns with the project's architectural principles:

1. **Expo Framework**: Uses Expo for React Native development, ensuring cross-platform compatibility
2. **React Native Elements**: Leverages existing chat dialog components built with React Native Elements
3. **Expo Background Task**: Uses Expo background task system for agent API requests to ensure non-blocking operation
4. **NativeWind**: Maintains existing styling patterns using Tailwind CSS via NativeWind
5. **Agent Prompt Management**: Stores all agent prompts in centralized location per constitution Principle 6

## Technical Context

### Technology Stack

- **Framework**: Expo (React Native)
- **UI Components**: React Native Elements (existing chat dialog components)
- **State Management**: React hooks (useState, useRef) for local component state
- **Network Requests**: Expo background task (expo-task-manager, expo-background-fetch) for agent API calls
- **Styling**: Tailwind CSS via NativeWind (existing patterns)
- **AI/LLM Integration**: External agent API service (implementation detail to be determined)

### Dependencies

**Existing Dependencies** (Already in project):
- `@rneui/themed`: React Native Elements themed components
- `@rneui/base`: React Native Elements base components
- `expo-router`: File-based routing system
- `react-native`: Core React Native framework
- `nativewind`: Tailwind CSS for React Native

**New Dependencies** (To be added):
- `expo-task-manager`: For background task management
- `expo-background-fetch`: For background network requests
- Agent API client library (to be determined based on chosen service)

### Integration Points

- **Chat Dialog Component (001-chat-dialog)**: Extend existing `ChatDialog` component to integrate agent response logic
- **Message Types**: Extend existing `Message` interface to support agent responses
- **Agent API Service**: External service for BJJ question detection and response generation
- **Prompt Management System**: Centralized storage for agent prompts per constitution

### Technical Decisions (Resolved in research.md)

1. **Agent API Service**: DashScope (阿里百炼) API with Qwen models (qwen-turbo/qwen-plus) using OpenAI-compatible interface
2. **BJJ Detection Method**: LLM-based classification with confidence scoring (0-100 scale, threshold >= 50)
3. **Prompt Management**: `.specify/prompts/002-science-coach-agent/` directory with metadata headers
4. **Loading Indicator**: React Native Elements ActivityIndicator displayed inline as temporary message
5. **Timeout Notification**: Display as regular message in chat with system message styling

## Implementation Steps

### Phase 0: Research & Design

1. **Research Agent API Services**
   - Evaluate OpenAI, Anthropic, and other LLM services
   - Compare pricing, rate limits, and API formats
   - Determine best fit for BJJ question detection and response generation
   - Document API integration patterns

2. **Research BJJ Question Detection Approaches**
   - Evaluate LLM-based classification vs pattern matching
   - Research confidence scoring for >50% threshold
   - Determine performance characteristics
   - Document detection accuracy requirements

3. **Research Prompt Management Best Practices**
   - Review constitution requirements for prompt storage
   - Design directory structure and naming conventions
   - Plan version control strategy
   - Document prompt template structure

4. **Research Loading Indicator Patterns**
   - Review React Native Elements ActivityIndicator
   - Research chat loading indicator UX patterns
   - Determine placement and styling approach
   - Document implementation approach

5. **Research Timeout Handling Patterns**
   - Review error handling patterns in chat interfaces
   - Determine notification display approach
   - Research user-friendly timeout messaging
   - Document implementation approach

### Phase 1: Component Design & Implementation

1. **Set Up Prompt Management System**
   - Create `.specify/prompts/` directory structure
   - Create BJJ detection prompt template
   - Create sports science coach agent prompt template
   - Document prompt metadata and versioning

2. **Implement BJJ Question Detection Service**
   - Create detection service module
   - Integrate with chosen agent API
   - Implement >50% threshold logic
   - Add error handling and fallback behavior

3. **Implement Agent Response Service**
   - Create agent response service module
   - Integrate with chosen agent API
   - Implement response generation with sports science focus
   - Add response truncation logic (2000 character limit)

4. **Extend Chat Dialog Component**
   - Integrate agent processing into `ChatDialog` component
   - Add loading indicator display logic
   - Implement timeout notification handling
   - Add concurrent message handling support

5. **Implement Background Task Integration**
   - Set up Expo background task for agent API calls
   - Configure task registration and execution
   - Implement non-blocking request handling
   - Add error handling for background failures

6. **Add Loading Indicator Component**
   - Create loading indicator component using React Native Elements
   - Style with NativeWind
   - Integrate into chat message flow
   - Test visibility and positioning

7. **Implement Timeout Notification**
   - Create timeout notification component
   - Integrate into chat message flow
   - Style with NativeWind
   - Test display and user experience

### Phase 2: Testing & Refinement

1. **Functional Testing**
   - Test BJJ question detection accuracy
   - Test agent response generation
   - Test non-BJJ question silent handling
   - Test mixed message threshold logic
   - Test concurrent message handling
   - Test timeout scenarios

2. **Performance Testing**
   - Verify 10-second response time requirement
   - Test background task performance
   - Verify non-blocking behavior
   - Test with rapid consecutive messages

3. **UI/UX Testing**
   - Verify loading indicator visibility and clarity
   - Test timeout notification display
   - Verify seamless integration with existing chat
   - Test on different screen sizes

## Dependencies

### Existing Dependencies (Already in package.json)
- `@rneui/base`: ^4.0.0-rc.8
- `@rneui/themed`: ^4.0.0-rc.8
- `expo-router`: ~6.0.21
- `react-native`: 0.81.5
- `nativewind`: (if installed)

### Additional Dependencies (To be added)
- `expo-task-manager`: For background task management
- `expo-background-fetch`: For background network requests
- Agent API client library (TBD based on service selection)

## Testing Strategy

### Unit Testing
- Test BJJ question detection logic
- Test >50% threshold calculation
- Test response truncation logic
- Test timeout handling logic

### Integration Testing
- Test complete agent response flow
- Test concurrent message handling
- Test background task execution
- Test error handling scenarios

### Manual Testing
- Test on iOS simulator
- Test on Android emulator
- Test with various BJJ and non-BJJ questions
- Test timeout scenarios
- Test rapid message sending

## Risks and Mitigations

### Risk 1: Agent API Service Selection
- **Risk**: Choosing wrong service may impact cost, performance, or reliability
- **Mitigation**: Research multiple options, compare pricing and features, start with most flexible option

### Risk 2: BJJ Detection Accuracy
- **Risk**: Detection may not meet 90% accuracy requirement
- **Mitigation**: Implement confidence scoring, allow for prompt iteration, plan for A/B testing

### Risk 3: Background Task Limitations
- **Risk**: Platform limitations may affect background execution
- **Mitigation**: Follow Expo best practices, implement fallback to foreground processing, test on both platforms

### Risk 4: Response Time Performance
- **Risk**: May not meet 10-second response time requirement
- **Mitigation**: Optimize API calls, implement caching where appropriate, monitor performance metrics

### Risk 5: Integration with Existing Chat
- **Risk**: Changes may break existing chat dialog functionality
- **Mitigation**: Maintain existing component structure, add agent logic as extension, thorough regression testing
