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

This plan implements humanization enhancements for all three BJJ coaching agents (science coach, technique coach, tactics coach) by modifying their prompts to produce more natural, conversational, and human-like dialogue while maintaining professionalism and technical accuracy. The implementation involves updating prompt content stored in centralized prompt management locations per constitution Principle 6, without modifying agent response generation service logic.

## Architecture Alignment

This implementation aligns with the project's architectural principles:

1. **Expo Framework**: No changes required - existing framework continues to be used
2. **React Native Elements**: No UI changes required - existing components continue to be used
3. **Expo Background Task**: No changes required - existing background task system continues to be used
4. **NativeWind**: No styling changes required - existing styling patterns continue to be used
5. **Agent Prompt Management**: Updates prompts in centralized location per constitution Principle 6
6. **Backward Compatibility**: Maintains all existing functional behaviors and response generation logic

## Technical Context

### Technology Stack

- **Framework**: Expo (React Native) - No changes required
- **UI Components**: React Native Elements - No changes required
- **State Management**: React hooks - No changes required
- **Network Requests**: Expo background task - No changes required
- **Styling**: Tailwind CSS via NativeWind - No changes required
- **AI/LLM Integration**: DashScope (阿里百炼) API with Qwen models - No changes required
- **Prompt Management**: Centralized prompt files in `.specify/prompts/` directories - Content updates only

### Dependencies

**Existing Dependencies** (Already in project):
- `@rneui/themed`: React Native Elements themed components
- `@rneui/base`: React Native Elements base components
- `expo-router`: File-based routing system
- `react-native`: Core React Native framework
- `nativewind`: Tailwind CSS for React Native
- `openai`: OpenAI-compatible client for DashScope API

**New Dependencies** (To be added):
- None (no new dependencies required)

### Integration Points

- **Prompt Management System**: Update prompt files in `.specify/prompts/002-science-coach-agent/`, `.specify/prompts/004-bjj-technique-coach/`, and `.specify/prompts/005-tactics-coach/` directories
- **Prompt Loader Service**: Update `services/prompt-loader.ts` to load updated prompt constants
- **Agent Response Services**: No changes required - services will automatically use updated prompts
- **Chat Dialog Component**: No changes required - existing component will display humanized responses

### Technical Decisions (Resolved in research.md)

1. **Humanization Approach**: Keep third person perspective but use friendlier tone, add encouraging expressions, use more natural language structure
2. **Agent Personalities**: Consistent humanization level but distinct personalities (science: rigorous, technique: encouraging, tactics: motivational)
3. **Professional Balance**: Balance natural conversation with professional terminology and accuracy
4. **Prompt Modification Strategy**: Update prompt content only, no changes to response generation logic
5. **Versioning**: Increment version numbers in prompt metadata headers
6. **Backward Compatibility**: All existing functional behaviors remain unchanged

## Implementation Steps

### Phase 0: Research & Design

1. **Research Humanized Prompt Design Patterns**
   - Review best practices for humanizing AI agent prompts
   - Research conversational tone while maintaining professionalism
   - Study Chinese language natural conversation patterns
   - Document humanization techniques and examples

2. **Research Agent Personality Differentiation**
   - Review how to maintain distinct personalities while achieving consistent humanization
   - Research coaching communication styles (rigorous, encouraging, motivational)
   - Document personality traits for each agent
   - Create personality guidelines for prompt design

3. **Research Chinese Language Humanization**
   - Review natural Chinese conversation patterns
   - Research encouraging expressions in Chinese
   - Study professional yet friendly tone in Chinese
   - Document appropriate cultural context for coaching

### Phase 1: Prompt Design & Implementation

1. **Update Science Coach Prompt**
   - Modify `.specify/prompts/002-science-coach-agent/sports-science-coach-prompt.md`
   - Add friendlier tone while maintaining scientific rigor
   - Include encouraging expressions appropriate for scientific context
   - Use more natural language structure
   - Update version number and last modified date
   - Update corresponding constant in `services/prompt-loader.ts`

2. **Update Technique Coach Prompt**
   - Modify `.specify/prompts/004-bjj-technique-coach/technique-coach-prompt.md`
   - Add encouraging and supportive language
   - Include motivational expressions for practical guidance
   - Use more natural language structure
   - Update version number and last modified date
   - Update corresponding constant in `services/prompt-loader.ts`

3. **Update Tactics Coach Prompt**
   - Modify `.specify/prompts/005-tactics-coach/tactics-coach-prompt.md`
   - Add engaging and motivational language
   - Include inspiring expressions for strategic guidance
   - Use more natural language structure
   - Update version number and last modified date
   - Update corresponding constant in `services/prompt-loader.ts`

### Phase 2: Testing & Validation

1. **Functional Testing**
   - Test that all three agents generate responses with humanized style
   - Verify responses maintain technical accuracy and relevance
   - Test that agent personalities are distinct yet consistent
   - Verify responses remain in Chinese (Simplified)
   - Test that response length limits (2000 characters) are maintained

2. **Quality Validation**
   - Review sample responses for humanization level
   - Verify professional terminology is maintained
   - Check that encouraging expressions are appropriate
   - Validate natural language structure
   - Confirm personality differentiation

3. **Backward Compatibility Testing**
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
- None (no new dependencies required)

## Testing Strategy

### Unit Testing
- Test prompt loading from updated constants
- Verify prompt content matches updated files
- Test that prompt metadata is correctly updated

### Integration Testing
- Test complete response flow with humanized prompts
- Verify all three agents produce humanized responses
- Test that response quality and accuracy are maintained
- Verify backward compatibility with existing functionality

### Manual Testing
- Review sample responses from each agent
- Evaluate humanization level and personality differentiation
- Verify natural language structure and encouraging expressions
- Test on iOS simulator
- Test on Android emulator
- Validate Chinese language naturalness and cultural appropriateness

## Risks and Mitigations

### Risk 1: Over-Humanization Losing Professionalism
- **Risk**: Humanized prompts may make responses too casual, losing professional coaching tone
- **Mitigation**: Balance natural conversation with professional terminology, maintain rigorous review process

### Risk 2: Inconsistent Humanization Level
- **Risk**: Three agents may have inconsistent humanization levels
- **Mitigation**: Establish clear guidelines, review all prompts together, ensure consistent approach

### Risk 3: Personality Differentiation Not Clear
- **Risk**: Agent personalities may not be distinct enough
- **Mitigation**: Define clear personality traits for each agent, use specific language patterns for each

### Risk 4: Chinese Language Naturalness
- **Risk**: Humanized Chinese may not sound natural or culturally appropriate
- **Mitigation**: Research Chinese conversation patterns, review with native speakers, test extensively

### Risk 5: Response Quality Degradation
- **Risk**: Humanization may compromise technical accuracy or information depth
- **Mitigation**: Maintain focus on technical accuracy, test response quality, iterate based on feedback

