# Feature Specification

## Constitution Check

This specification MUST comply with the following constitutional principles:
- ✅ Expo-based React Native development
- ✅ React Native Elements component library
- ✅ Expo background task for network requests
- ✅ Tailwind CSS via NativeWind
- ✅ Centralized change documentation management
- ✅ Agent prompt management

## Clarifications

### Session 2026-01-02

- Q: What specific forms should humanization take? → A: Keep third person but use friendlier tone, add encouraging expressions, use more natural language structure (balanced approach)
- Q: Should the three agents have consistent humanization style? → A: Consistent humanization level but allow different personalities - science coach more rigorous, technique coach more encouraging, tactics coach more motivational
- Q: What is the balance between humanization and professionalism? → A: Balance professionalism and humanization, use natural conversation while maintaining professional terminology and accuracy

## Scope

### Included

- Modification of prompts for all three BJJ coaching agents (science coach, technique coach, tactics coach)
- Enhancement of dialogue style to be more humanized and natural
- Maintaining all existing functional requirements and response quality
- Preserving agent-specific focus areas (sports science, practical techniques, tactical strategies)
- Maintaining Chinese language requirement for all responses
- Keeping response length limits (2000 characters)

### Excluded

- Changes to agent response generation logic or API integration
- Modifications to chat dialog UI components
- Changes to message display or formatting
- Addition of new agents or removal of existing agents
- Changes to BJJ detection service
- Modifications to response sequencing or coordination logic

## Requirements

### Functional Requirements

1. **Humanized Dialogue Style**
   - The system MUST modify prompts for all three agents to produce more natural, human-like conversations
   - Responses MUST use more conversational and friendly language while maintaining professionalism
   - Responses SHOULD feel like talking to a real coach rather than reading a technical manual
   - The dialogue style MUST remain appropriate for a coaching context
   - Responses MUST use friendlier tone while keeping third person perspective (not switching to first person)
   - Responses MUST include encouraging expressions and more natural language structure
   - Responses MUST balance natural conversation with professional terminology and accuracy

2. **Science Coach Prompt Enhancement**
   - The science coach prompt MUST be updated to generate more humanized responses
   - Responses MUST maintain focus on biomechanics, physiology, and exercise science principles
   - The tone MUST be more conversational while preserving scientific accuracy
   - Responses MUST still be concise and informative (maximum 2000 characters)
   - The personality MUST be more rigorous and precise while being friendly and approachable
   - Responses MUST use natural language structure while maintaining scientific terminology

3. **Technique Coach Prompt Enhancement**
   - The technique coach prompt MUST be updated to generate more humanized responses
   - Responses MUST maintain focus on practical details, usage considerations, common mistakes, and safety
   - The tone MUST be more approachable and encouraging while preserving practical value
   - Responses MUST still be actionable and safety-conscious (maximum 2000 characters)
   - The personality MUST be more encouraging and supportive while maintaining practical focus
   - Responses MUST include encouraging expressions and motivational language while providing actionable guidance

4. **Tactics Coach Prompt Enhancement**
   - The tactics coach prompt MUST be updated to generate more humanized responses
   - Responses MUST maintain focus on tactical applications, strategic thinking, and competition strategies
   - The tone MUST be more engaging and motivational while preserving strategic value
   - Responses MUST still be competition-oriented and tactical (maximum 2000 characters)
   - The personality MUST be more motivational and inspiring while maintaining strategic depth
   - Responses MUST use engaging and motivational language while providing tactical insights

5. **Language Consistency**
   - All three agents MUST continue to respond in Chinese (Simplified)
   - The humanized style MUST be appropriate for Chinese language and cultural context
   - Responses MUST maintain clarity and readability in Chinese

6. **Backward Compatibility**
   - The system MUST maintain all existing functional behaviors
   - Response sequence (technique coach → science coach → tactics coach) MUST remain unchanged
   - Conditional triggering logic MUST remain unchanged
   - Error handling and timeout behavior MUST remain unchanged

### Non-Functional Requirements

1. **Response Quality**
   - Humanized responses MUST maintain the same level of accuracy and relevance as before
   - Responses MUST not sacrifice technical accuracy for conversational style
   - The humanized style MUST enhance user experience without compromising information quality

2. **Consistency**
   - All three agents MUST have consistent humanization level (not too formal, not too casual)
   - The humanized style MUST be appropriate for a professional coaching context
   - Responses MUST maintain consistency with each agent's specific role and expertise
   - Each agent MUST have distinct personality traits (science coach: rigorous, technique coach: encouraging, tactics coach: motivational) while sharing consistent humanization level
   - The balance between natural conversation and professional terminology MUST be consistent across all agents

3. **User Experience**
   - Humanized responses MUST make users feel more engaged and connected
   - The conversational style MUST make the coaching experience feel more natural and personal
   - Responses MUST be easier to read and understand while maintaining technical depth

## Technical Constraints

- MUST modify prompts stored in centralized prompt management location per constitution
- MUST update prompt files in `.specify/prompts/` directories for each agent
- MUST maintain existing prompt loading mechanism in `services/prompt-loader.ts`
- MUST not modify agent response generation service logic (only prompt content)
- MUST preserve all existing prompt metadata (purpose, version, last modified)

## User Stories

- As a BJJ practitioner, I want to receive coaching responses that feel more natural and human-like so that the interaction feels like talking to a real coach
- As a user, I want coaching responses to be more conversational and friendly so that I feel more engaged and motivated
- As a BJJ learner, I want technical information presented in a more approachable way so that I can better understand and apply the guidance

## Acceptance Criteria

- [ ] Science coach responses use more conversational and natural language while maintaining scientific accuracy
- [ ] Technique coach responses feel more approachable and encouraging while preserving practical value
- [ ] Tactics coach responses are more engaging and motivational while maintaining strategic depth
- [ ] All three agents maintain their specific focus areas (sports science, practical techniques, tactical strategies)
- [ ] Responses remain in Chinese (Simplified) with appropriate cultural context
- [ ] Response length limits (2000 characters) are maintained
- [ ] All existing functional behaviors remain unchanged (response sequence, conditional triggering, error handling)
- [ ] Response quality and accuracy are maintained or improved
- [ ] Users perceive the dialogue as more natural and human-like
- [ ] The humanized style is consistent across all three agents
- [ ] Prompt modifications are stored in centralized prompt management location

## Success Criteria

1. **User Experience**
   - At least 80% of users find the new dialogue style more engaging and natural
   - Users report feeling more connected to the coaching experience
   - Dialogue feels like talking to a real coach rather than reading documentation

2. **Response Quality**
   - Technical accuracy is maintained at the same level as before
   - Response relevance and helpfulness remain at the same level or improve
   - Information depth and completeness are preserved

3. **Consistency**
   - All three agents demonstrate consistent humanization level
   - Style is appropriate for professional coaching context
   - Responses maintain each agent's distinct personality while being more humanized

4. **Implementation Quality**
   - Prompt modifications are properly versioned and documented
   - Changes are stored in centralized prompt management location
   - All existing functional behaviors continue to work correctly

## Assumptions

- Users prefer more conversational and natural dialogue style over formal technical language
- Humanized responses will enhance user engagement without compromising technical accuracy
- The humanized style can be achieved through prompt modifications without changing response generation logic
- Chinese language allows for natural, conversational expressions while maintaining professionalism
- The three agents can have distinct personalities while sharing a consistent humanization level
- Prompt modifications will not require changes to agent response generation services

## Dependencies

- Existing prompt management system must be functional
- Agent response generation services (science coach, technique coach, tactics coach) must be functional
- Prompt loading mechanism in `services/prompt-loader.ts` must be functional
- All three agent prompt files must exist in `.specify/prompts/` directories

## Implementation Notes

This feature focuses on enhancing the dialogue style of all three BJJ coaching agents to make conversations more natural and human-like. The implementation involves modifying the prompt content for each agent while maintaining their core functional requirements and expertise areas.

The humanization should make responses feel more like talking to a real coach - using more conversational language, being more encouraging and approachable, while still maintaining professionalism and technical accuracy. Each agent should maintain its distinct personality (scientific, practical, strategic) while becoming more humanized.

Prompt modifications should be stored in the centralized prompt management location per constitution, with proper versioning and documentation. The changes should not require modifications to the agent response generation services - only the prompt content needs to be updated.

