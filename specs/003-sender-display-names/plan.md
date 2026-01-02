# Implementation Plan

## Constitution Check

This plan MUST comply with the following constitutional principles:
- ✅ Expo-based React Native development
- ✅ React Native Elements component library
- ✅ Expo background task for network requests
- ✅ Tailwind CSS via NativeWind
- ✅ Centralized change documentation management

## Overview

This plan implements sender name display functionality in the existing chat dialog interface. The feature adds sender name labels above message content, with "本人" for user messages and agent-specific names (e.g., "运动健康助理" for sports science agent) for agent messages. The implementation extends the existing Message interface with an optional `agentType` field and updates the MessageItem component to display sender names in a vertical layout.

## Architecture Alignment

This implementation aligns with the project's architectural principles:

1. **Expo Framework**: Uses Expo for React Native development, ensuring cross-platform compatibility
2. **React Native Elements**: Leverages existing chat dialog components built with React Native Elements
3. **NativeWind**: Maintains existing styling patterns using Tailwind CSS via NativeWind
4. **Component Architecture**: Extends existing components without breaking changes

## Technical Context

### Technology Stack

- **Framework**: Expo (React Native)
- **UI Components**: React Native Elements (existing chat dialog components)
- **State Management**: React hooks (useState, useRef) for local component state
- **Styling**: Tailwind CSS via NativeWind (existing patterns)
- **TypeScript**: Type-safe Message interface extension

### Dependencies

**Existing Dependencies** (Already in project):
- `@rneui/themed`: React Native Elements themed components
- `@rneui/base`: React Native Elements base components
- `expo-router`: File-based routing system
- `react-native`: Core React Native framework
- `nativewind`: Tailwind CSS for React Native
- `typescript`: Type safety

**No New Dependencies Required**

### Integration Points

- **Message Interface (`types/chat.ts`)**: Extend with optional `agentType` field
- **MessageItem Component (`components/message-item.tsx`)**: Add sender name display logic
- **ChatDialog Component (`components/chat-dialog.tsx`)**: Update to include `agentType` when creating agent messages
- **LoadingIndicator Component (`components/loading-indicator.tsx`)**: Extend to support sender name display
- **Chat Styles (`constants/chat-styles.ts`)**: Add styles for sender name labels

### Technical Decisions (Resolved in research.md)

1. **Agent Type Identification**: Optional `agentType?: 'sports-science' | string` field added to Message interface
2. **Sender Name Mapping**: Utility function to map `agentType` to display name (e.g., 'sports-science' → "运动健康助理")
3. **Layout Approach**: Vertical layout with sender name above message content using React Native View/Text components
4. **Backward Compatibility**: Messages without `agentType` field do not display sender names
5. **Loading Indicator**: LoadingIndicator component extended to accept and display sender name

## Implementation Steps

### Phase 0: Research & Design

1. **Research React Native Text Styling Patterns**
   - Review best practices for label text styling in chat interfaces
   - Research font size and color contrast requirements for accessibility
   - Document vertical spacing patterns between label and content
   - Review screen reader accessibility patterns for sender names

2. **Research Agent Name Mapping Patterns**
   - Review utility function patterns for mapping agent types to display names
   - Consider future extensibility for multiple agent types
   - Document naming conventions and constants management

3. **Research Component Extension Patterns**
   - Review React Native component extension best practices
   - Research backward compatibility patterns for optional fields
   - Document conditional rendering patterns for optional UI elements

### Phase 1: Data Model & Component Design

1. **Extend Message Interface**
   - Add optional `agentType?: 'sports-science' | string` field to `types/chat.ts`
   - Update TypeScript types to maintain type safety
   - Document field usage and validation rules

2. **Create Sender Name Utility**
   - Create utility function to map `agentType` to display name
   - Support 'sports-science' → "运动健康助理" mapping
   - Design for future extensibility with multiple agent types
   - Handle undefined/null `agentType` gracefully

3. **Update MessageItem Component**
   - Add sender name display logic above message content
   - Implement vertical layout (name above content)
   - Handle user messages ("本人") vs agent messages
   - Support conditional rendering for messages without `agentType`
   - Maintain existing message alignment (left/right)
   - Ensure proper spacing between name and content

4. **Update LoadingIndicator Component**
   - Extend to accept optional `agentType` prop
   - Display sender name above loading indicator when `agentType` is provided
   - Maintain backward compatibility for existing usage

5. **Update ChatDialog Component**
   - Add `agentType: 'sports-science'` to agent response messages
   - Add `agentType` to system messages (timeout, non-BJJ notifications)
   - Add `agentType` to loading indicator messages
   - Ensure all new agent messages include `agentType` field

6. **Add Chat Styles for Sender Names**
   - Define font size, color, and spacing for sender name labels
   - Ensure sufficient contrast for accessibility
   - Match existing chat design aesthetic
   - Add styles to `constants/chat-styles.ts`

### Phase 2: Testing & Refinement

1. **Unit Testing**
   - Test sender name utility function with various `agentType` values
   - Test MessageItem component with different message types
   - Test conditional rendering for messages without `agentType`
   - Test loading indicator with and without sender names

2. **Integration Testing**
   - Test complete message flow with sender names
   - Verify backward compatibility with existing messages
   - Test all message types (user, agent, system, loading)
   - Verify alignment and spacing consistency

3. **Accessibility Testing**
   - Verify screen reader announces sender names correctly
   - Test color contrast ratios meet WCAG requirements
   - Verify touch target sizes are appropriate
   - Test with different font size settings

4. **Performance Testing**
   - Measure message rendering time with sender names
   - Verify scrolling performance remains smooth
   - Test with large message lists
   - Ensure no memory leaks

5. **Visual Testing**
   - Verify sender names display correctly on different screen sizes
   - Test vertical layout spacing and alignment
   - Verify visual consistency across message types
   - Test dark mode compatibility

## Risk Assessment

### Low Risk
- **Component Extension**: Extending existing components is low risk with proper testing
- **Type Safety**: TypeScript ensures type safety for new field
- **Backward Compatibility**: Optional field maintains backward compatibility

### Medium Risk
- **Performance Impact**: Additional rendering for sender names may impact performance (mitigated by memoization and performance testing)
- **Visual Consistency**: Ensuring consistent styling across all message types requires careful attention

### Mitigation Strategies
- Use React.memo for MessageItem component to prevent unnecessary re-renders
- Performance testing to ensure rendering time increase stays under 10%
- Comprehensive visual testing across different message types
- Accessibility testing to ensure WCAG compliance

## Success Metrics

1. **Functional Completeness**
   - 100% of user messages display "本人"
   - 100% of agent messages with `agentType` display correct agent name
   - 100% of messages without `agentType` do not display sender names

2. **Performance**
   - Message rendering time increase < 10%
   - Scrolling remains smooth (60 FPS)
   - No noticeable lag when new messages appear

3. **Accessibility**
   - Screen readers announce sender names correctly
   - Color contrast meets WCAG AA standards
   - All interactive elements accessible

4. **Visual Quality**
   - Consistent styling across all message types
   - Proper spacing and alignment
   - Seamless integration with existing design

