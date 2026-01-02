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

- Q: How should the system handle technique coach (004) and science coach (002) responses when a user asks a BJJ question? → A: Technique coach responds first, science coach provides supplementary response after technique coach response completes
- Q: How should the system handle technique coach response generation failures (excluding timeouts)? → A: Still trigger science coach response to ensure user receives at least one form of guidance
- Q: How should users distinguish between technique coach (004) and science coach (002) responses? → A: Use different sender names to identify each coach (e.g., "技术教练" and "科学教练")
- Q: Should technique coach (004) and science coach (002) share the same BJJ detection service? → A: Share the same BJJ detection service, both coaches use the same detection result
- Q: How should the system handle technique coach response generation timeouts (exceeding 10 seconds)? → A: Display timeout notification, then still trigger science coach response

## Scope

### Included

- Integration with existing chat dialog interface (001-chat-dialog)
- Automatic agent response generation when user sends a message
- Brazilian Jiu-Jitsu (BJJ) question detection and validation
- Technique-focused explanations for BJJ-related questions, emphasizing practical details and usage considerations
- Informative message for non-BJJ questions ("我只能回答巴西柔术相关问题")
- Agent response display in chat dialog as "other" party messages

### Excluded

- User interface changes to chat dialog (uses existing 001-chat-dialog interface)
- Multiple agent types or agent selection
- Agent response editing or modification
- Conversation history persistence for agent responses
- Agent response caching or optimization
- User feedback mechanism for agent responses
- Agent response streaming or progressive display
- Multi-language support for agent responses
- Agent personality customization
- Sports science explanations (handled by 002-science-coach-agent, which provides supplementary responses after technique coach responses)

## Requirements

### Functional Requirements

1. **Message Processing**
   - The system MUST automatically process user messages sent through the chat dialog interface
   - When a user sends a message, the system MUST trigger agent response evaluation
   - The system MUST not require any additional user action to trigger agent processing

2. **Brazilian Jiu-Jitsu Question Detection**
   - The system MUST analyze user input to determine if the question is related to Brazilian Jiu-Jitsu
   - The system MUST share the same BJJ detection service with the science coach (002-science-coach-agent) to ensure consistency and avoid duplicate detection calls
   - Both technique coach and science coach MUST use the same detection result for a given user message
   - The system MUST identify BJJ-related topics including but not limited to: techniques, positions, submissions, training methods, competition strategies, and BJJ-specific terminology
   - The detection MUST be automatic and occur for every user message
   - For mixed messages (containing both BJJ-related and unrelated content), the system MUST only generate a response if the message is primarily (>50%) BJJ-related

3. **Technique Coach Agent Response**
   - When a user question is identified as BJJ-related, the system MUST generate a response from a technique coach agent first (before any science coach response)
   - The technique coach response MUST be generated and displayed before triggering any science coach response (002-science-coach-agent)
   - The response MUST focus on practical details and usage considerations for the BJJ technique or question asked
   - The response MUST emphasize important details that users should pay attention to when using the technique
   - The response MUST include common mistakes, safety considerations, and practical tips relevant to the user's question
   - The response MUST be relevant to the user's specific question
   - The response MUST be displayed in the chat dialog as a message from the "other" party
   - The response MUST appear in the conversation list after the user's message
   - When multiple BJJ-related messages are sent in rapid succession before previous responses complete, the system MUST generate an independent response for each message and display them in chronological order
   - Agent responses MUST be limited to a maximum of 2000 characters
   - If an agent response exceeds 2000 characters, the system MUST truncate it and append an ellipsis ("...") to indicate truncation

4. **Non-BJJ Question Handling**
   - When a user question is NOT related to Brazilian Jiu-Jitsu (or is less than 50% BJJ-related for mixed messages), the system MUST display an informative message: "我只能回答巴西柔术相关问题"
   - The message MUST be displayed as a system message (isSystemMessage: true) aligned to the right side of the screen
   - The chat dialog MUST continue to function normally after displaying the message
   - The system MUST NOT generate an agent response for non-BJJ questions

5. **Response Integration**
   - Agent responses MUST be integrated into the existing chat dialog message flow
   - Agent responses MUST follow the same message format and display rules as defined in 001-chat-dialog
   - Agent responses MUST appear aligned to the right side of the screen (as "other" party messages)
   - Agent responses MUST be displayed in chronological order with user messages
   - Technique coach responses MUST be identified with a distinct sender name (e.g., "技术教练") to differentiate from science coach responses
   - The sender name display MUST follow the patterns established in 003-sender-display-names

### Non-Functional Requirements

1. **Performance**
   - Agent response generation MUST complete within 10 seconds for 95% of requests
   - The system MUST not block the chat interface while processing agent responses
   - User messages MUST appear immediately in the chat dialog, regardless of agent processing status
   - Agent response display MUST occur automatically when the response is ready

2. **User Experience**
   - Agent responses MUST be clear, informative, and relevant to the user's question
   - The transition from user message to agent response MUST feel natural and seamless
   - Users MUST be able to continue sending messages even while an agent response is being generated
   - When an agent response is being generated, the system MUST display a simple loading indicator to provide visual feedback
   - Non-BJJ questions receive a clear informative message explaining the system's scope
   - Technique-focused responses MUST emphasize practical, actionable details that help users apply techniques correctly

3. **Reliability**
   - The system MUST handle agent processing failures gracefully without disrupting the chat interface
   - If technique coach response generation fails (excluding timeouts), the system MUST still trigger science coach response to ensure the user receives at least one form of guidance
   - If technique coach response generation exceeds the timeout threshold (10 seconds), the system MUST display a timeout notification message to the user, then still trigger science coach response
   - If agent response generation fails (excluding timeouts), the system MUST not display error messages to the user
   - If agent response generation exceeds the timeout threshold (10 seconds), the system MUST display a timeout notification message to the user
   - The chat dialog MUST remain functional even if agent processing is unavailable
   - Network failures during agent processing MUST not prevent users from continuing to use the chat

4. **Accuracy**
   - BJJ question detection MUST correctly identify BJJ-related questions with at least 90% accuracy
   - Agent responses MUST be factually accurate and relevant to BJJ technique principles
   - The system MUST avoid generating responses for clearly non-BJJ questions
   - Technique-focused responses MUST provide accurate, practical guidance that helps users avoid common mistakes

## Technical Constraints

- MUST integrate with existing chat dialog component (001-chat-dialog)
- MUST use Expo framework for React Native development
- MUST use Expo background task for agent API requests (if network requests are required)
- MUST follow the project's component architecture patterns
- Agent prompts MUST be stored in centralized prompt management location per constitution
- MUST not modify existing chat dialog UI components unless necessary for integration

## User Stories

- As a Brazilian Jiu-Jitsu practitioner, I want to ask questions about BJJ techniques and receive detailed guidance on practical usage considerations so that I can apply techniques correctly and avoid common mistakes
- As a user, I want to receive automatic responses to my BJJ questions so that I don't need to manually trigger or request explanations
- As a user, I want the system to only respond to BJJ-related questions so that I can use the chat for other purposes without receiving irrelevant responses
- As a user, I want agent responses to appear naturally in the conversation flow so that the interaction feels like a real coaching session
- As a BJJ practitioner, I want to learn about important details and safety considerations when using techniques so that I can train safely and effectively

## Acceptance Criteria

- [ ] When a user sends a BJJ-related question, a technique coach response appears in the chat dialog within 10 seconds (before any science coach response)
- [ ] Agent responses are displayed as "other" party messages aligned to the right side of the screen
- [ ] Technique coach responses are identified with a distinct sender name (e.g., "技术教练") to differentiate from science coach responses
- [ ] Agent responses provide technique-focused explanations emphasizing practical details and usage considerations relevant to the user's BJJ question
- [ ] Agent responses include important details, common mistakes, and safety considerations when applicable
- [ ] When a user sends a non-BJJ question, the system displays "我只能回答巴西柔术相关问题" message
- [ ] The chat dialog continues to function normally when non-BJJ questions are sent
- [ ] User messages appear immediately in the chat dialog regardless of agent processing status
- [ ] Multiple user messages can be sent in sequence, with agent responses appearing for BJJ-related questions and informative messages for non-BJJ questions
- [ ] When multiple BJJ-related messages are sent rapidly, each message receives an independent agent response displayed in chronological order
- [ ] Agent responses are displayed in chronological order with user messages
- [ ] The system handles agent processing failures gracefully without disrupting the chat interface
- [ ] If technique coach response generation fails (excluding timeouts), science coach response is still triggered
- [ ] If technique coach response generation exceeds 10 seconds, timeout notification is displayed and science coach response is still triggered
- [ ] When agent response generation exceeds 10 seconds, a timeout notification message is displayed to the user
- [ ] A loading indicator is displayed while agent is processing a BJJ-related question
- [ ] Agent responses are limited to 2000 characters, with truncation and ellipsis if exceeded
- [ ] BJJ question detection correctly identifies BJJ-related questions at least 90% of the time

## Success Criteria

1. **Functional Completeness**
   - 95% of BJJ-related questions receive appropriate technique-focused explanations within 10 seconds
   - 100% of non-BJJ questions receive the informative message "我只能回答巴西柔术相关问题"
   - 100% of agent responses are displayed correctly in the chat dialog interface

2. **User Experience**
   - Users can send messages and receive agent responses without perceiving any blocking or delays
   - Agent responses are relevant and helpful for at least 85% of BJJ questions
   - Users understand that the system only responds to BJJ-related questions through the informative message
   - Technique-focused responses provide actionable guidance that helps users apply techniques correctly

3. **System Reliability**
   - Agent processing failures occur in less than 5% of BJJ-related questions
   - Chat interface remains fully functional even when agent processing is unavailable
   - System correctly distinguishes BJJ-related questions from non-BJJ questions with 90% accuracy

4. **Integration Quality**
   - Agent responses integrate seamlessly with existing chat dialog interface
   - No visual or functional regressions in the chat dialog component
   - Agent responses follow the same message display patterns as other messages

5. **Content Quality**
   - Technique-focused responses emphasize practical details and usage considerations
   - Responses include relevant safety considerations and common mistakes when applicable
   - Users find the technique guidance helpful for practical application

## Assumptions

- The chat dialog interface (001-chat-dialog) is fully functional and available for integration
- Agent response generation will be implemented using an external API or service (implementation detail not specified)
- BJJ question detection can be implemented using natural language processing or pattern matching
- Technique coach and science coach share the same BJJ detection service to ensure consistency and efficiency
- Agent prompts will be stored in the centralized prompt management location per constitution
- Network connectivity is available for agent API requests (when required)
- The technique coach agent has sufficient knowledge to provide accurate, practical guidance for BJJ techniques
- Users understand that the agent only responds to BJJ-related questions
- The system can handle concurrent user messages and agent response generation
- Technique-focused responses complement sports science explanations (002-science-coach-agent) by focusing on practical application details
- Technique coach responds first to BJJ questions, with science coach providing supplementary responses after technique coach response completes

## Dependencies

- Existing chat dialog component (001-chat-dialog) must be functional
- Sender display name system (003-sender-display-names) must be functional for coach identification
- Agent API or service must be available and accessible
- Network connectivity for agent requests (if external service is used)
- Prompt management system for storing agent prompts

## Implementation Notes

This feature extends the existing chat dialog functionality by adding intelligent agent responses focused on BJJ technique coaching. The implementation should focus on seamless integration with the existing chat interface while maintaining the user experience established in 001-chat-dialog. The BJJ question detection mechanism is critical for ensuring the agent only responds to relevant questions, maintaining a focused and useful coaching experience.

Non-BJJ questions receive an informative message ("我只能回答巴西柔术相关问题") to clearly communicate the system's scope to users. This design choice helps users understand the system's capabilities and prevents confusion about why certain questions don't receive detailed responses.

Agent prompts should be carefully designed to ensure responses are accurate, relevant, and focused on practical technique details, usage considerations, common mistakes, and safety considerations. The technique coach agent complements the sports science coach (002-science-coach-agent) by providing practical application guidance rather than biomechanical explanations. The prompt management system should allow for easy iteration and improvement of agent responses over time.

