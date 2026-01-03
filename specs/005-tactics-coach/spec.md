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

- Q: How should tactics coach (005) coordinate with technique coach (004) and science coach (002)? Should all three coaches respond, and in what order? → A: All three coaches respond in sequence: technique coach responds first, science coach responds second, tactics coach responds third (as strategic supplement)
- Q: How should the system handle tactics coach response when technique coach (004) or science coach (002) response generation fails or times out? → A: Only trigger tactics coach response when both technique coach and science coach responses complete successfully
- Q: How should the system handle tactics coach response generation timeouts (exceeding 10 seconds)? → A: Display timeout notification, no further action needed (tactics coach is the last response in sequence)
- Q: How should users distinguish between tactics coach (005), technique coach (004), and science coach (002) responses? → A: Use different sender names to identify each coach (e.g., "战术教练", "技术教练", "科学教练")
- Q: Should tactics coach (005) share the same BJJ detection service with technique coach (004) and science coach (002)? → A: Share the same BJJ detection service, all coaches use the same detection result

## Scope

### Included

- Integration with existing chat dialog interface (001-chat-dialog)
- Automatic agent response generation when user sends a message
- Brazilian Jiu-Jitsu (BJJ) question detection and validation
- Tactics and strategy-focused explanations for BJJ-related questions, emphasizing competition strategies, tactical applications, and strategic thinking
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
- Sports science explanations (handled by 002-science-coach-agent)
- Technique-focused practical details (handled by 004-bjj-technique-coach)

## Requirements

### Functional Requirements

1. **Message Processing**
   - The system MUST automatically process user messages sent through the chat dialog interface
   - When a user sends a message, the system MUST trigger agent response evaluation
   - The system MUST not require any additional user action to trigger agent processing

2. **Brazilian Jiu-Jitsu Question Detection**
   - The system MUST analyze user input to determine if the question is related to Brazilian Jiu-Jitsu
   - The system MUST share the same BJJ detection service with technique coach (004-bjj-technique-coach) and science coach (002-science-coach-agent) to ensure consistency and avoid duplicate detection calls
   - All three coaches (technique coach, science coach, tactics coach) MUST use the same detection result for a given user message
   - Single detection call per user message, result shared across all coaches
   - The system MUST identify BJJ-related topics including but not limited to: techniques, positions, submissions, training methods, competition strategies, tactical applications, and BJJ-specific terminology
   - The detection MUST be automatic and occur for every user message
   - For mixed messages (containing both BJJ-related and unrelated content), the system MUST only generate a response if the message is primarily (>50%) BJJ-related

3. **Tactics Coach Agent Response**
   - When a user question is identified as BJJ-related, the system MUST generate responses from all three coaches in sequence: technique coach (004) responds first, science coach (002) responds second, tactics coach (005) responds third
   - The tactics coach response MUST be generated and displayed only after both technique coach and science coach responses complete successfully
   - If technique coach or science coach response generation fails or times out, the system MUST NOT trigger tactics coach response
   - The response MUST focus on tactics, strategies, and competitive applications for the BJJ question asked
   - The response MUST emphasize strategic thinking, tactical decision-making, and competition scenarios
   - The response MUST include tactical considerations such as: when to apply techniques, how to set up attacks, how to counter opponent strategies, position transitions, and match management
   - The response MUST be relevant to the user's specific question
   - The response MUST be displayed in the chat dialog as a message from the "other" party
   - The response MUST appear in the conversation list after the user's message and after technique coach and science coach responses
   - When multiple BJJ-related messages are sent in rapid succession before previous responses complete, the system MUST generate an independent response sequence for each message and display them in chronological order
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
   - Tactics coach responses MUST be identified with a distinct sender name (e.g., "战术教练") to differentiate from technique coach ("技术教练") and science coach ("运动健康助理") responses
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
   - Tactics-focused responses MUST emphasize strategic thinking and tactical applications that help users understand competitive scenarios

3. **Reliability**
   - The system MUST handle agent processing failures gracefully without disrupting the chat interface
   - If technique coach or science coach response generation fails or times out, the system MUST NOT trigger tactics coach response
   - If tactics coach response generation fails (excluding timeouts), the system MUST not display error messages to the user
   - If tactics coach response generation exceeds the timeout threshold (10 seconds), the system MUST display a timeout notification message to the user (no further action needed as tactics coach is the last response in sequence)
   - The chat dialog MUST remain functional even if agent processing is unavailable
   - Network failures during agent processing MUST not prevent users from continuing to use the chat

4. **Accuracy**
   - BJJ question detection MUST correctly identify BJJ-related questions with at least 90% accuracy
   - Agent responses MUST be factually accurate and relevant to BJJ tactics and strategy principles
   - The system MUST avoid generating responses for clearly non-BJJ questions
   - Tactics-focused responses MUST provide accurate strategic guidance that helps users understand competitive applications

## Technical Constraints

- MUST integrate with existing chat dialog component (001-chat-dialog)
- MUST use Expo framework for React Native development
- MUST use Expo background task for agent API requests (if network requests are required)
- MUST follow the project's component architecture patterns
- Agent prompts MUST be stored in centralized prompt management location per constitution
- MUST not modify existing chat dialog UI components unless necessary for integration

## User Stories

- As a Brazilian Jiu-Jitsu practitioner, I want to ask questions about BJJ tactics and strategies and receive strategic guidance so that I can understand how to apply techniques in competitive scenarios
- As a user, I want to receive automatic responses to my BJJ questions so that I don't need to manually trigger or request explanations
- As a user, I want the system to only respond to BJJ-related questions so that I can use the chat for other purposes without receiving irrelevant responses
- As a user, I want agent responses to appear naturally in the conversation flow so that the interaction feels like a real coaching session
- As a BJJ competitor, I want to learn about tactical applications and strategic thinking so that I can improve my competitive performance

## Acceptance Criteria

- [ ] When a user sends a BJJ-related question, all three coaches respond in sequence: technique coach → science coach → tactics coach, with tactics coach response appearing within 10 seconds after science coach response completes (only if both technique coach and science coach complete successfully)
- [ ] Agent responses are displayed as "other" party messages aligned to the right side of the screen
- [ ] Tactics coach responses are identified with a distinct sender name (e.g., "战术教练") to differentiate from technique coach ("技术教练") and science coach ("运动健康助理") responses
- [ ] Agent responses provide tactics-focused explanations emphasizing strategic thinking and tactical applications relevant to the user's BJJ question
- [ ] Agent responses include tactical considerations such as when to apply techniques, how to set up attacks, and how to counter opponent strategies when applicable
- [ ] When a user sends a non-BJJ question, the system displays "我只能回答巴西柔术相关问题" message
- [ ] The chat dialog continues to function normally when non-BJJ questions are sent
- [ ] User messages appear immediately in the chat dialog regardless of agent processing status
- [ ] Multiple user messages can be sent in sequence, with agent responses appearing for BJJ-related questions and informative messages for non-BJJ questions
- [ ] When multiple BJJ-related messages are sent rapidly, each message receives an independent agent response displayed in chronological order
- [ ] Agent responses are displayed in chronological order with user messages
- [ ] The system handles agent processing failures gracefully without disrupting the chat interface
- [ ] If technique coach or science coach response generation fails or times out, tactics coach response is not triggered
- [ ] If tactics coach response generation exceeds 10 seconds, timeout notification is displayed (no further action needed)
- [ ] When agent response generation exceeds 10 seconds, a timeout notification message is displayed to the user
- [ ] A loading indicator is displayed while agent is processing a BJJ-related question
- [ ] Agent responses are limited to 2000 characters, with truncation and ellipsis if exceeded
- [ ] BJJ question detection correctly identifies BJJ-related questions at least 90% of the time

## Success Criteria

1. **Functional Completeness**
   - 95% of BJJ-related questions receive appropriate tactics-focused explanations within 10 seconds
   - 100% of non-BJJ questions receive the informative message "我只能回答巴西柔术相关问题"
   - 100% of agent responses are displayed correctly in the chat dialog interface

2. **User Experience**
   - Users can send messages and receive agent responses without perceiving any blocking or delays
   - Agent responses are relevant and helpful for at least 85% of BJJ questions
   - Users understand that the system only responds to BJJ-related questions through the informative message
   - Tactics-focused responses provide actionable strategic guidance that helps users understand competitive applications

3. **System Reliability**
   - Agent processing failures occur in less than 5% of BJJ-related questions
   - Chat interface remains fully functional even when agent processing is unavailable
   - System correctly distinguishes BJJ-related questions from non-BJJ questions with 90% accuracy

4. **Integration Quality**
   - Agent responses integrate seamlessly with existing chat dialog interface
   - No visual or functional regressions in the chat dialog component
   - Agent responses follow the same message display patterns as other messages

5. **Content Quality**
   - Tactics-focused responses emphasize strategic thinking and tactical applications
   - Responses include relevant tactical considerations and competitive scenarios when applicable
   - Users find the tactical guidance helpful for understanding competitive applications

## Assumptions

- The chat dialog interface (001-chat-dialog) is fully functional and available for integration
- Agent response generation will be implemented using an external API or service (implementation detail not specified)
- BJJ question detection can be implemented using natural language processing or pattern matching
- Tactics coach shares the same BJJ detection service with other coaches to ensure consistency and efficiency
- Tactics coach responds third in the sequence (after technique coach and science coach) as a strategic supplement
- Agent prompts will be stored in the centralized prompt management location per constitution
- Network connectivity is available for agent API requests (when required)
- The tactics coach agent has sufficient knowledge to provide accurate strategic guidance for BJJ tactics and strategies
- Users understand that the agent only responds to BJJ-related questions
- The system can handle concurrent user messages and agent response generation
- Tactics-focused responses complement technique-focused (004-bjj-technique-coach) and sports science (002-science-coach-agent) explanations by focusing on strategic and tactical applications

## Dependencies

- Existing chat dialog component (001-chat-dialog) must be functional
- Sender display name system (003-sender-display-names) must be functional for coach identification with mapping for 'tactics-coach' → '战术教练'
- Agent API or service must be available and accessible
- Network connectivity for agent requests (if external service is used)
- Prompt management system for storing agent prompts

## Implementation Notes

This feature extends the existing chat dialog functionality by adding intelligent agent responses focused on BJJ tactics and strategy coaching. The implementation should focus on seamless integration with the existing chat interface while maintaining the user experience established in 001-chat-dialog. The BJJ question detection mechanism is critical for ensuring the agent only responds to relevant questions, maintaining a focused and useful coaching experience.

Non-BJJ questions receive an informative message ("我只能回答巴西柔术相关问题") to clearly communicate the system's scope to users. This design choice helps users understand the system's capabilities and prevents confusion about why certain questions don't receive detailed responses.

Agent prompts should be carefully designed to ensure responses are accurate, relevant, and focused on tactical and strategic aspects such as competition strategies, tactical applications, strategic thinking, and competitive scenarios. The tactics coach agent complements the technique coach (004-bjj-technique-coach) and sports science coach (002-science-coach-agent) by providing strategic and tactical guidance rather than technical details or biomechanical explanations. The tactics coach responds third in the sequence (after technique coach and science coach) to provide strategic and tactical guidance as a supplement to the technical and scientific explanations. The prompt management system should allow for easy iteration and improvement of agent responses over time.

