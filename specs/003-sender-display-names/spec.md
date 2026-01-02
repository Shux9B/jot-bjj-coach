# Feature Specification

## Constitution Check

This specification MUST comply with the following constitutional principles:
- ✅ Expo-based React Native development
- ✅ React Native Elements component library
- ✅ Expo background task for network requests
- ✅ Tailwind CSS via NativeWind
- ✅ Centralized change documentation management

## Clarifications

### Session 2026-01-02

- Q: How should the system identify different agent types to display correct sender names? → A: Add optional `agentType?: 'sports-science' | string` field to Message interface
- Q: What sender name should system messages (e.g., timeout notifications) display? → A: System messages display the corresponding agent name (e.g., "运动健康助理")
- Q: Should loading indicator messages display sender names? → A: Loading indicators display the corresponding agent name (e.g., "运动健康助理")
- Q: What sender name should messages with `sender: 'other'` but no `agentType` field display? → A: Do not display sender name (leave blank) for backward compatibility

## Scope

### Included

- Display sender name labels for all messages in the chat dialog
- User messages display "本人" as the sender name
- Agent messages display agent-specific names (e.g., "运动健康助理" for sports science agent)
- Sender name and message content arranged vertically (name above content)
- Visual distinction between different sender types through name labels
- Integration with existing chat dialog interface (001-chat-dialog)
- Support for multiple agent types with different display names

### Excluded

- Sender avatar or profile pictures
- Clickable sender names or profile navigation
- Sender name editing or customization by users
- Sender name color customization
- Sender name font size or style customization
- Sender name positioning options (always vertical layout)
- Historical message sender name updates

## Requirements

### Functional Requirements

1. **Sender Name Display**
   - Messages with `sender: 'user'` MUST display "本人" as the sender name
   - Messages with `sender: 'other'` and `agentType` field MUST display the corresponding agent name
   - Messages with `sender: 'other'` but no `agentType` field MUST NOT display a sender name (for backward compatibility)
   - The sender name MUST be visible and readable when displayed
   - The sender name MUST appear above the message content (vertical arrangement)
   - Loading indicator messages (`isLoading: true`) with `agentType` field MUST display the corresponding agent name above the loading indicator

2. **User Message Sender Name**
   - Messages sent by the user MUST display "本人" as the sender name
   - The "本人" label MUST appear consistently for all user messages
   - The label MUST be positioned above the user's message content

3. **Agent Message Sender Names**
   - Messages sent by agents MUST display agent-specific names
   - Different agent types MUST display different names
   - The sports science agent (identified by `agentType: 'sports-science'`) MUST display "运动健康助理" as its sender name
   - Agent names MUST be positioned above the agent's message content
   - System messages (e.g., timeout notifications, "我只能回答巴西柔术相关问题") MUST display the corresponding agent name (e.g., "运动健康助理") based on `agentType` field
   - Messages with `sender: 'other'` and `agentType` field MUST display the corresponding agent name
   - Messages with `sender: 'other'` but no `agentType` field MUST NOT display a sender name (for backward compatibility with existing messages)
   - System messages with `isSystemMessage: true` MUST still display the agent name if `agentType` is present

4. **Vertical Layout**
   - Sender name and message content MUST be arranged vertically
   - The sender name MUST appear above the message content
   - The sender name and content MUST be visually grouped together
   - The vertical spacing between name and content MUST be appropriate for readability

5. **Visual Consistency**
   - Sender names MUST be visually consistent across all messages of the same type
   - User messages ("本人") MUST have consistent styling
   - Agent messages MUST have consistent styling for their respective agent types
   - The name label styling MUST complement the existing message bubble design

6. **Message Alignment Integration**
   - Sender names MUST respect the existing message alignment (user messages left, agent messages right)
   - The sender name alignment MUST match the message content alignment
   - The vertical layout MUST work correctly with the existing alignment system

### Non-Functional Requirements

1. **Performance**
   - Sender name display MUST not cause noticeable performance degradation
   - Message rendering with sender names MUST remain smooth during scrolling
   - Sender name display MUST not increase message rendering time by more than 10%

2. **User Experience**
   - Sender names MUST be clearly readable with sufficient font size
   - Sender names MUST have appropriate color contrast for visibility
   - The vertical layout MUST not make messages feel cramped or cluttered
   - Users MUST be able to easily distinguish between different senders through name labels

3. **Accessibility**
   - Sender names MUST be accessible via screen readers
   - Screen readers MUST announce the sender name before reading the message content
   - Sender name text MUST meet minimum contrast ratio requirements

## Technical Constraints

- MUST integrate with existing chat dialog component (001-chat-dialog)
- MUST use Expo framework for React Native development
- MUST use React Native Elements components for UI elements
- MUST use Tailwind CSS via NativeWind for styling
- MUST follow the project's component architecture patterns
- MUST not break existing message display functionality
- MUST support the existing Message interface structure

## User Stories

- As a user, I want to see "本人" displayed on my messages so that I can easily identify which messages I sent
- As a user, I want to see agent names (like "运动健康助理") on agent messages so that I can distinguish between different agents
- As a user, I want sender names displayed above message content so that I can quickly identify who sent each message
- As a user, I want consistent sender name display across all messages so that the interface feels cohesive and professional

## Acceptance Criteria

- [ ] User messages display "本人" as the sender name above the message content
- [ ] Agent messages with `agentType` field display the corresponding agent name above the message content
- [ ] Messages with `sender: 'other'` but no `agentType` field do not display a sender name
- [ ] Loading indicator messages display the corresponding agent name above the loading indicator
- [ ] User messages display "本人" as the sender name
- [ ] Sports science agent messages display "运动健康助理" as the sender name
- [ ] Sender name and message content are arranged vertically (name above content)
- [ ] Sender names are visually consistent for messages of the same type
- [ ] Sender names respect existing message alignment (user messages left, agent messages right)
- [ ] Sender names are readable with appropriate font size and color contrast
- [ ] The vertical layout does not make messages feel cramped or cluttered
- [ ] Message rendering performance remains smooth with sender names displayed
- [ ] Sender names are accessible via screen readers

## Success Criteria

1. **Functional Completeness**
   - 100% of user messages display "本人"
   - 100% of agent messages with `agentType: 'sports-science'` display "运动健康助理"
   - 100% of messages with sender names have names positioned above content (vertical layout)
   - 100% of messages with `sender: 'other'` but no `agentType` field do not display sender names

2. **User Experience**
   - Users can identify message senders within 1 second of viewing a message
   - 95% of users can correctly identify which messages are from themselves vs. agents
   - Sender name display does not negatively impact message readability
   - Vertical layout is visually appealing and does not feel cluttered

3. **Visual Consistency**
   - Sender names are visually consistent across all messages of the same type
   - Name labels integrate seamlessly with existing message bubble design
   - Alignment and spacing are consistent throughout the conversation

4. **Performance**
   - Message rendering with sender names does not increase rendering time by more than 10%
   - Scrolling through messages remains smooth (60 FPS) with sender names displayed
   - No noticeable lag when new messages appear with sender names

## Assumptions

- The Message interface will be extended with optional `agentType?: 'sports-science' | string` field to identify agent types
- Multiple agent types will be supported in the future, each with their own display name
- The current implementation only has one agent type (sports science agent with `agentType: 'sports-science'`), but the system should support multiple types
- Messages without `agentType` field but with `sender: 'other'` will not display sender names for backward compatibility
- Sender names will be static text labels (not interactive or editable)
- The vertical layout (name above content) is the preferred arrangement for all messages
- Users understand that "本人" refers to themselves

## Dependencies

- Existing chat dialog component (001-chat-dialog) must be functional
- Existing Message interface and message display components
- MessageItem component must support sender name display
- Message interface must be extended with optional `agentType?: 'sports-science' | string` field for agent type identification

## Implementation Notes

This feature enhances the chat dialog interface by adding sender identification through name labels. The implementation should focus on seamless integration with the existing message display system while maintaining the visual design established in 001-chat-dialog.

The vertical layout (name above content) provides clear visual hierarchy and makes it easy for users to quickly identify message senders. The use of "本人" for user messages and specific names for agents (like "运动健康助理") creates a natural distinction between different message sources.

The system should be designed to support multiple agent types in the future, with each agent having its own display name. This requires a mechanism to identify which agent sent a message, which may involve extending the Message interface or using existing fields like `sender` with additional agent type information.

