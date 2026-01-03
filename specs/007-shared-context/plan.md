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

This plan implements context sharing between multiple BJJ coaching agents (technique coach, science coach, tactics coach) to prevent duplicate information and create more coherent, complementary responses. The implementation involves passing previous agent responses as context to subsequent agents through API message arrays, updating agent prompts to explicitly avoid duplication, and implementing summary generation for long contexts.

## Architecture Alignment

This implementation aligns with the project's architectural principles:

1. **Expo Framework**: No changes required - existing framework continues to be used
2. **React Native Elements**: No UI changes required - existing components continue to be used
3. **Expo Background Task**: No changes required - existing background task system continues to be used
4. **NativeWind**: No styling changes required - existing styling patterns continue to be used
5. **Agent Prompt Management**: Updates prompts in centralized location per constitution Principle 6
6. **Backward Compatibility**: Maintains all existing functional behaviors while adding context awareness

## Technical Context

### Technology Stack

- **Framework**: Expo (React Native) - No changes required
- **UI Components**: React Native Elements - No changes required
- **State Management**: React hooks - No changes required
- **Network Requests**: Expo background task - No changes required
- **Styling**: Tailwind CSS via NativeWind - No changes required
- **AI/LLM Integration**: DashScope (阿里百炼) API with Qwen models - Context passing via message arrays
- **Prompt Management**: Centralized prompt files in `.specify/prompts/` directories - Content updates for duplicate prevention instructions

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

- **Agent Response Services**: Modify `technique-coach-service.ts`, `agent-response-service.ts`, `tactics-coach-service.ts` to accept and pass context
- **Chat Dialog Component**: Update `components/chat-dialog.tsx` to pass previous responses as context
- **Prompt Management System**: Update prompts in `.specify/prompts/` directories to include duplicate prevention instructions
- **Summary Generation Service**: Create new service for generating summaries of previous responses when context is too long

### Technical Decisions (Resolved in research.md)

1. **Context Passing Method**: Pass previous responses through API message array as assistant messages
2. **Duplicate Prevention**: Explicitly instruct in prompts to avoid duplication while relying on LLM to understand context
3. **Failure Handling**: Only pass successful responses as context, failed or timed-out responses not passed
4. **Context Length Handling**: If context exceeds token limits, generate summaries using LLM
5. **Summary Generation**: Use LLM to automatically generate summaries via API call
6. **Backward Compatibility**: Maintain all existing functional behaviors, add context awareness as enhancement

## Implementation Steps

### Phase 0: Research & Design

1. **Research Context Passing Patterns**
   - Review best practices for passing context in chat completion APIs
   - Research message array structure for multi-turn conversations
   - Study token limit handling strategies
   - Document context passing patterns and examples

2. **Research Duplicate Prevention Strategies**
   - Review prompt engineering techniques for avoiding duplication
   - Research how LLMs handle context to identify covered topics
   - Study effective prompt instructions for complementing previous responses
   - Document duplicate prevention patterns

3. **Research Summary Generation**
   - Review LLM-based summarization techniques
   - Research token-efficient summary generation
   - Study how to preserve key information in summaries for duplicate prevention
   - Document summary generation patterns

### Phase 1: Service Design & Implementation

1. **Create Summary Generation Service**
   - Create `services/response-summary-service.ts` module
   - Implement summary generation using DashScope API
   - Add token limit checking and summary generation logic
   - Follow same patterns as other agent services

2. **Update Agent Response Services**
   - Modify `technique-coach-service.ts` to accept optional context parameter (for future use, currently unused)
   - Modify `agent-response-service.ts` to accept previous responses as context
   - Modify `tactics-coach-service.ts` to accept previous responses as context
   - Update API calls to include context messages in message array
   - Add context length checking and summary generation when needed

3. **Update Agent Prompts**
   - Update science coach prompt to include duplicate prevention instructions
   - Update tactics coach prompt to include duplicate prevention instructions
   - Maintain technique coach prompt (no changes, first agent)
   - Store updated prompts in centralized prompt management location

4. **Update Chat Dialog Component**
   - Modify `triggerScienceCoachResponse` to pass technique coach's response as context
   - Modify `triggerTacticsCoachResponse` to pass both previous responses as context
   - Add context passing logic (only for successful responses)
   - Maintain existing error handling and timeout behavior

### Phase 2: Testing & Validation

1. **Functional Testing**
   - Test context passing from technique coach to science coach
   - Test context passing from both previous coaches to tactics coach
   - Test duplicate prevention in responses
   - Test context passing when previous agents fail or timeout
   - Test summary generation for long contexts
   - Test fallback behavior when context cannot be passed

2. **Quality Validation**
   - Review sample responses for duplicate prevention effectiveness
   - Verify responses remain informative and valuable
   - Check that responses complement each other
   - Validate summary quality and information preservation

3. **Performance Testing**
   - Verify response generation time remains within acceptable limits
   - Test summary generation performance
   - Verify context passing does not introduce noticeable delays

4. **Backward Compatibility Testing**
   - Verify response sequence remains unchanged
   - Test conditional triggering logic still works
   - Verify error handling and timeout behavior unchanged
   - Test that all existing functional behaviors continue to work

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
- Test context passing logic
- Test summary generation logic
- Test context length checking
- Test duplicate prevention prompt instructions

### Integration Testing
- Test complete context sharing flow: technique coach → science coach → tactics coach
- Test context passing with successful and failed agents
- Test summary generation integration
- Test error handling scenarios
- Test fallback behavior

### Manual Testing
- Review sample responses for duplicate prevention
- Evaluate context sharing effectiveness
- Test on iOS simulator
- Test on Android emulator
- Validate response quality and coherence

## Risks and Mitigations

### Risk 1: Context Passing Complexity
- **Risk**: Passing context through message arrays may introduce bugs or performance issues
- **Mitigation**: Follow existing API patterns, thorough testing, clear error handling

### Risk 2: Duplicate Prevention Effectiveness
- **Risk**: Prompts may not effectively prevent duplication
- **Mitigation**: Iterate on prompt design, test with various questions, gather feedback

### Risk 3: Summary Generation Quality
- **Risk**: Summaries may not preserve enough information for effective duplicate prevention
- **Mitigation**: Test summary quality, iterate on summary generation prompts, validate information preservation

### Risk 4: Performance Impact
- **Risk**: Context passing and summary generation may increase response time
- **Mitigation**: Optimize context passing, efficient summary generation, monitor performance metrics

### Risk 5: Token Limit Issues
- **Risk**: Context may exceed token limits even with summaries
- **Mitigation**: Implement robust token checking, efficient summary generation, fallback to no context if needed

### Risk 6: Integration with Existing Chat
- **Risk**: Changes may break existing chat dialog functionality
- **Mitigation**: Maintain existing component structure, add context passing as extension, thorough regression testing

