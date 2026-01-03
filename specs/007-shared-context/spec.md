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

- Q: How should previous agent responses be passed as context to subsequent agents? → A: Through API message array by adding previous responses as assistant messages (e.g., `{role: 'assistant', content: 'technique coach response...'}`)
- Q: How should agents be instructed to avoid duplicating information? → A: Explicitly instruct in prompts to avoid duplication while relying on LLM to understand context
- Q: Should context be passed when previous agents fail or timeout? → A: Only pass successful responses as context, failed or timed-out responses should not be passed
- Q: How should long context be handled if it exceeds API token limits? → A: If context is too long, pass summaries of previous responses instead of full text
- Q: How should summaries of previous agent responses be generated? → A: Use LLM to automatically generate summaries (call API to generate summaries)

## Scope

### Included

- Context sharing mechanism between multiple BJJ coaching agents (technique coach, science coach, tactics coach)
- Passing previous agent responses as context to subsequent agents
- Preventing duplicate information in agent responses
- Maintaining response sequence (technique coach → science coach → tactics coach)
- Preserving agent-specific focus areas while avoiding repetition
- Context-aware response generation for all three agents

### Excluded

- Changes to agent response generation logic or API integration structure
- Modifications to chat dialog UI components
- Changes to message display or formatting
- Addition of new agents or removal of existing agents
- Changes to BJJ detection service
- Modifications to response sequencing or coordination logic (sequence remains the same)
- Conversation history persistence beyond current response sequence
- Context sharing across different user messages (only within same user message's response sequence)

## Requirements

### Functional Requirements

1. **Context Sharing Between Agents**
   - The system MUST pass previous agent responses as context to subsequent agents in the response sequence
   - When science coach generates a response, it MUST receive technique coach's response as context (only if technique coach succeeded)
   - When tactics coach generates a response, it MUST receive both technique coach's and science coach's responses as context (only if both succeeded)
   - Context MUST include response text from previous agents that completed successfully
   - If previous responses are within token limits, context MUST include full response text
   - If previous responses exceed token limits, context MUST include summaries of previous responses instead of full text
   - Summaries MUST be generated using LLM (automatic summary generation via API call)
   - Summaries MUST preserve key information from previous responses to enable duplicate prevention
   - Context MUST NOT include responses from agents that failed or timed out
   - Context MUST be passed through API message array by adding previous responses (or summaries) as assistant messages (e.g., `{role: 'assistant', content: 'technique coach response...'}`)
   - Previous agent responses (or summaries) MUST be added to the messages array before the user's question in the API request

2. **Duplicate Prevention**
   - Subsequent agents MUST avoid repeating information already provided by previous agents
   - Agents MUST be explicitly instructed in their prompts to avoid duplicating information from previous agent responses
   - Prompts MUST instruct agents to focus on their unique expertise areas while acknowledging what has been covered
   - Prompts MUST instruct agents to complement previous responses rather than duplicate them
   - The system MUST rely on LLM's ability to understand context and follow prompt instructions to avoid duplication
   - The system MUST ensure responses remain informative and valuable even when avoiding duplication

3. **Technique Coach Response (First Agent)**
   - Technique coach MUST continue to generate responses based only on user's question (no previous context)
   - Technique coach response MUST be stored for context sharing with subsequent agents
   - Response MUST maintain focus on practical details, usage considerations, common mistakes, and safety

4. **Science Coach Response (Second Agent)**
   - Science coach MUST receive technique coach's response as context (only if technique coach succeeded)
   - If technique coach failed or timed out, science coach MUST generate response without context (fallback to current behavior)
   - Science coach MUST generate responses that complement technique coach's response without duplicating information (when context is available)
   - Science coach MUST focus on biomechanics, physiology, and exercise science principles not already covered
   - Response MUST acknowledge technique coach's guidance when relevant but avoid repeating it (when context is available)

5. **Tactics Coach Response (Third Agent)**
   - Tactics coach MUST receive both technique coach's and science coach's responses as context (only if both succeeded)
   - If either technique coach or science coach failed or timed out, tactics coach MUST NOT receive context from the failed agent
   - Tactics coach MUST generate responses that complement previous successful responses without duplicating information (when context is available)
   - Tactics coach MUST focus on tactical applications, strategic thinking, and competition strategies not already covered
   - Response MUST acknowledge previous guidance when relevant but avoid repeating it (when context is available)

6. **Response Quality Maintenance**
   - Responses MUST maintain technical accuracy and relevance even when avoiding duplication
   - Responses MUST remain comprehensive and informative
   - Each agent MUST still provide valuable insights within their expertise area
   - Responses MUST not become too brief or incomplete due to duplication avoidance

7. **Backward Compatibility**
   - The system MUST maintain all existing functional behaviors
   - Response sequence (technique coach → science coach → tactics coach) MUST remain unchanged
   - Conditional triggering logic MUST remain unchanged
   - Error handling and timeout behavior MUST remain unchanged
   - Response length limits (2000 characters) MUST remain unchanged

### Non-Functional Requirements

1. **Performance**
   - Context sharing MUST not significantly increase response generation time
   - Agent response generation MUST still complete within 10 seconds for 95% of requests
   - Context passing MUST not introduce noticeable delays in the response sequence

2. **User Experience**
   - Users MUST perceive responses as more coherent and complementary
   - Responses MUST feel like a coordinated coaching session rather than independent answers
   - The conversation flow MUST feel natural and seamless
   - Users MUST not notice technical implementation of context sharing

3. **Reliability**
   - Context sharing MUST work correctly even if previous agent responses are long (by using summaries when needed)
   - The system MUST handle context length limits by generating summaries of previous responses when full text exceeds token limits
   - Summaries MUST be generated automatically using LLM API calls before passing context to subsequent agents
   - Summary generation MUST preserve key information to enable effective duplicate prevention
   - The system MUST handle context sharing failures gracefully without disrupting the response sequence
   - If context cannot be passed, agents MUST still generate responses (fallback to current behavior)
   - The chat dialog MUST remain functional even if context sharing is unavailable

4. **Accuracy**
   - Context-aware responses MUST maintain the same level of accuracy as before
   - Duplicate prevention MUST not compromise information completeness
   - Agents MUST correctly identify what has been covered to avoid duplication
   - Responses MUST remain factually accurate and relevant

## Technical Constraints

- MUST integrate with existing agent response generation services (technique-coach-service.ts, agent-response-service.ts, tactics-coach-service.ts)
- MUST use existing DashScope API with Qwen models
- MUST maintain existing prompt management system per constitution
- MUST not modify agent response generation service function signatures unless necessary
- MUST preserve existing timeout and error handling mechanisms
- Context sharing MUST be implemented without breaking existing functionality

## User Stories

- As a BJJ practitioner, I want to receive complementary responses from multiple coaches so that I get comprehensive guidance without redundant information
- As a user, I want agent responses to build upon each other so that the conversation feels like a coordinated coaching session
- As a BJJ learner, I want each coach to focus on their unique expertise without repeating what others have already explained

## Acceptance Criteria

- [ ] Science coach receives technique coach's response as context when generating its response
- [ ] Tactics coach receives both technique coach's and science coach's responses as context when generating its response
- [ ] Subsequent agents avoid repeating information already provided by previous agents
- [ ] Responses remain informative and valuable even when avoiding duplication
- [ ] Each agent maintains focus on their specific expertise area (practical techniques, sports science, tactical strategies)
- [ ] Responses complement each other rather than duplicate information
- [ ] Response sequence (technique coach → science coach → tactics coach) remains unchanged
- [ ] All existing functional behaviors remain unchanged (conditional triggering, error handling, timeout behavior)
- [ ] Response length limits (2000 characters) are maintained
- [ ] Response generation time remains within acceptable limits (10 seconds for 95% of requests)
- [ ] Users perceive responses as more coherent and complementary
- [ ] Context sharing works correctly even with truncated responses

## Success Criteria

1. **Functional Completeness**
   - 95% of response sequences successfully share context between agents
   - 90% of subsequent agent responses avoid duplicating information from previous agents
   - 100% of agent responses remain informative and valuable

2. **User Experience**
   - At least 80% of users find responses more coherent and complementary
   - Users report feeling like they're receiving coordinated coaching rather than independent answers
   - Response sequences feel more natural and seamless

3. **System Reliability**
   - Context sharing failures occur in less than 5% of response sequences
   - Chat interface remains fully functional even when context sharing fails
   - Fallback behavior ensures responses are still generated when context cannot be passed

4. **Response Quality**
   - Technical accuracy is maintained at the same level as before
   - Responses remain comprehensive and informative
   - Duplicate prevention does not compromise information completeness
   - Each agent still provides valuable insights within their expertise area

5. **Performance**
   - Response generation time does not increase by more than 20% due to context sharing
   - 95% of agent responses still complete within 10 seconds
   - Context passing does not introduce noticeable delays

## Assumptions

- Context sharing can be implemented by passing previous responses as additional messages in the API request
- LLM models can effectively use context to avoid duplication while maintaining response quality
- Passing context will not significantly increase API costs or response times
- Agents can identify and avoid duplicating information while still providing valuable insights
- Context sharing will enhance user experience by making responses more coherent
- Fallback behavior (no context) will still produce acceptable responses if context sharing fails
- Context sharing is only needed within the same user message's response sequence, not across different messages

## Dependencies

- Existing agent response generation services (technique-coach-service.ts, agent-response-service.ts, tactics-coach-service.ts) must be functional
- DashScope API with Qwen models must support context passing in API requests
- Chat dialog component (001-chat-dialog) must be functional for displaying responses
- Response sequence coordination logic must be functional

## Implementation Notes

This feature implements context sharing between multiple BJJ coaching agents to prevent duplicate information and create more coherent, complementary responses. The implementation involves passing previous agent responses as context to subsequent agents in the response sequence.

The context sharing mechanism should allow each agent to understand what has already been covered by previous agents, enabling them to focus on their unique expertise areas while avoiding repetition. This creates a more coordinated coaching experience where responses build upon each other rather than being independent answers to the same question.

The implementation should maintain all existing functional behaviors while adding context awareness. If context sharing fails for any reason, agents should still be able to generate responses using the current behavior (no context) as a fallback.

