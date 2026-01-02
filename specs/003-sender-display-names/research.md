# Research: Sender Display Names

## Overview

This document consolidates research findings for implementing sender name display functionality in the chat dialog interface.

## Research Questions & Findings

### 1. React Native Text Styling Patterns for Chat Labels

**Question**: What are the best practices for styling sender name labels in chat interfaces?

**Decision**: Use React Native Text component with appropriate font size and color styling

**Rationale**:
- React Native Text component provides native text rendering with good performance
- Standard font sizes (12-14px) for labels provide good readability without overwhelming content
- Color should match existing chat design system (ChatColors.textSecondary for subtle labels)
- Vertical spacing of 4-8px between label and content provides clear visual hierarchy

**Alternatives Considered**:
- Custom label component: Unnecessary complexity for simple text display
- Icon-based labels: Not suitable for text-based sender names

**Implementation Notes**:
- Font size: 12-14px (smaller than message text which is 16px)
- Color: Use ChatColors.textSecondary for consistency
- Spacing: 4-6px vertical margin between name and content
- Alignment: Match message alignment (left for user, right for agent)

### 2. Agent Name Mapping Patterns

**Question**: How should we map agent types to display names?

**Decision**: Create a utility function with a mapping object for extensibility

**Rationale**:
- Utility function provides centralized name mapping logic
- Mapping object allows easy addition of new agent types
- Type-safe with TypeScript enums or string literals
- Handles undefined/null cases gracefully

**Alternatives Considered**:
- Hardcoded switch statement: Less extensible
- Configuration file: Overkill for simple mapping
- Database lookup: Unnecessary for static mappings

**Implementation Notes**:
```typescript
const AGENT_NAME_MAP: Record<string, string> = {
  'sports-science': '运动健康助理',
  // Future agent types can be added here
};

function getSenderName(message: Message): string | null {
  if (message.sender === 'user') {
    return '本人';
  }
  if (message.agentType) {
    return AGENT_NAME_MAP[message.agentType] || null;
  }
  return null; // No sender name for backward compatibility
}
```

### 3. Component Extension Patterns

**Question**: How should we extend existing components without breaking changes?

**Decision**: Use optional props and conditional rendering

**Rationale**:
- Optional fields maintain backward compatibility
- Conditional rendering prevents errors with undefined values
- React.memo can optimize re-renders
- TypeScript ensures type safety

**Alternatives Considered**:
- Required fields: Would break existing code
- Separate components: Unnecessary duplication
- Wrapper components: Adds complexity

**Implementation Notes**:
- MessageItem: Add conditional sender name rendering
- LoadingIndicator: Add optional agentType prop
- Use optional chaining and nullish coalescing for safe access
- Maintain existing component API surface

### 4. Vertical Layout Implementation

**Question**: How should we implement vertical layout (name above content)?

**Decision**: Use React Native View container with flexbox column layout

**Rationale**:
- View with flexDirection: 'column' provides natural vertical stacking
- Maintains existing message bubble styling
- Easy to control spacing with margin/padding
- Works well with existing alignment system

**Alternatives Considered**:
- Absolute positioning: More complex and less flexible
- Separate containers: Unnecessary complexity
- Custom layout components: Overkill for simple vertical stack

**Implementation Notes**:
- Container View with flexDirection: 'column'
- Sender name Text component with marginBottom
- Message content maintains existing styling
- Alignment handled by parent container (alignSelf)

### 5. Accessibility Patterns for Sender Names

**Question**: How should screen readers announce sender names?

**Decision**: Use accessibilityLabel prop on message container

**Rationale**:
- accessibilityLabel provides semantic information to screen readers
- Announces sender name before message content
- Follows React Native accessibility best practices
- Maintains existing message accessibility

**Alternatives Considered**:
- Separate accessibility component: Unnecessary complexity
- aria-label: Not available in React Native
- Text component accessibility: Less semantic

**Implementation Notes**:
- Add accessibilityLabel to message container View
- Format: "{senderName}: {messageText}"
- Example: "本人: Hello" or "运动健康助理: Response text"
- Test with VoiceOver (iOS) and TalkBack (Android)

### 6. Performance Optimization Patterns

**Question**: How can we ensure sender name display doesn't impact performance?

**Decision**: Use React.memo, avoid unnecessary re-renders, optimize text rendering

**Rationale**:
- React.memo prevents re-renders when props haven't changed
- Memoized utility functions prevent recalculation
- Text component is already optimized in React Native
- FlatList handles large lists efficiently

**Alternatives Considered**:
- Virtual scrolling: Already handled by FlatList
- Lazy loading: Not needed for simple text labels
- Caching: Unnecessary for static text

**Implementation Notes**:
- Wrap MessageItem with React.memo
- Memoize getSenderName utility function
- Use useMemo for computed sender names if needed
- Performance test with 100+ messages

## Summary

All research questions have been resolved. The implementation will:
1. Use React Native Text component with appropriate styling
2. Create a utility function for agent name mapping
3. Extend components with optional props and conditional rendering
4. Use View with flexbox for vertical layout
5. Add accessibility labels for screen readers
6. Optimize with React.memo and memoization

No blocking technical decisions remain. Implementation can proceed.

