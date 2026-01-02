# Implementation Plan

## Constitution Check

This plan MUST comply with the following constitutional principles:
- ✅ Expo-based React Native development
- ✅ React Native Elements component library
- ✅ Expo background task for network requests
- ✅ Tailwind CSS via NativeWind
- ✅ Centralized change documentation management

## Overview

This plan implements a chat dialog interface feature that allows users to send and receive messages in a conversation view. The interface includes a message list, text input field at the bottom, and a send button. User messages are displayed on the left, while other party's messages are displayed on the right. The chat dialog page will be set as the default route in the application.

## Architecture Alignment

This implementation aligns with the project's architectural principles:

1. **Expo Framework**: Uses Expo Router for navigation and routing, ensuring cross-platform compatibility
2. **React Native Elements**: All UI components (Input, Button, ListItem, etc.) will be built using React Native Elements components
3. **NativeWind**: All styling will be implemented using Tailwind CSS utility classes via NativeWind
4. **Expo Router**: Default route configuration will be handled through Expo Router's file-based routing system

## Technical Context

### Technology Stack

- **Framework**: Expo (React Native)
- **UI Components**: React Native Elements (@rneui/themed, @rneui/base)
- **Routing**: Expo Router (file-based routing)
- **Styling**: Tailwind CSS via NativeWind
- **State Management**: React hooks (useState, useRef) for local component state
- **Keyboard Handling**: Expo Keyboard API for keyboard visibility management

### Dependencies

- `@rneui/themed`: React Native Elements themed components
- `@rneui/base`: React Native Elements base components
- `expo-router`: File-based routing system
- `react-native`: Core React Native framework
- `nativewind`: Tailwind CSS for React Native

### Integration Points

- **Expo Router**: Integration with app routing structure to set chat dialog as default route
- **React Native Elements**: Component library integration for Input, Button, and List components
- **NativeWind**: Styling system integration for message alignment and layout

### Unknowns / Needs Clarification

All technical decisions are clear based on the constitution and user requirements. No clarifications needed.

## Implementation Steps

### Phase 0: Research & Setup

1. **Research React Native Elements Components**
   - Identify appropriate components for chat interface (Input, Button, List, ListItem)
   - Review theming and styling capabilities
   - Document component props and customization options

2. **Research Expo Router Default Route Configuration**
   - Understand how to configure default route in Expo Router
   - Review file-based routing structure
   - Determine best approach for setting chat dialog as initial screen

3. **Research NativeWind Styling Patterns**
   - Review Tailwind utility classes for flexbox layouts
   - Identify classes for message alignment (left/right)
   - Document responsive design patterns

### Phase 1: Component Design & Implementation

1. **Create Chat Dialog Component Structure**
   - Create main ChatDialog component using React Native Elements
   - Implement message list container with ScrollView
   - Create message item component with conditional alignment

2. **Implement Input Interface**
   - Use React Native Elements Input component for text input
   - Position input field at bottom of screen
   - Integrate send button using React Native Elements Button component

3. **Implement Message Display Logic**
   - Create message state management using React hooks
   - Implement message sending handler
   - Implement message list rendering with proper alignment

4. **Configure Default Route**
   - Update Expo Router configuration to set chat dialog as default
   - Modify app routing structure if needed
   - Ensure proper navigation flow

5. **Apply Styling with NativeWind**
   - Style message items with left/right alignment
   - Style input container at bottom
   - Ensure keyboard doesn't obscure input field

### Phase 2: Testing & Refinement

1. **Functional Testing**
   - Test message sending functionality
   - Test message alignment (left for user, right for other party)
   - Test scrolling behavior
   - Test keyboard interaction

2. **UI/UX Testing**
   - Verify input field accessibility
   - Verify send button visibility and tappability
   - Verify message alignment clarity
   - Test on different screen sizes

3. **Performance Testing**
   - Verify smooth scrolling with multiple messages
   - Verify instant message display after sending
   - Verify no lag during message list updates

## Dependencies

### Existing Dependencies (Already in package.json)
- `@rneui/base`: ^4.0.0-rc.8
- `@rneui/themed`: ^4.0.0-rc.8
- `expo-router`: ~6.0.21
- `react-native`: 0.81.5

### Additional Dependencies (May Need)
- `nativewind`: For Tailwind CSS support (if not already installed)
- `expo-keyboard`: For keyboard visibility management (if needed)

## Testing Strategy

### Unit Testing
- Test message state management logic
- Test message alignment logic based on sender
- Test input field clearing after send

### Integration Testing
- Test complete message sending flow
- Test message list updates
- Test scrolling behavior

### Manual Testing
- Test on iOS simulator
- Test on Android emulator
- Test keyboard behavior and input field visibility
- Test message alignment visual clarity

## Risks and Mitigations

### Risk 1: Keyboard Obscuring Input Field
- **Mitigation**: Use Expo Keyboard API to adjust layout when keyboard appears
- **Mitigation**: Implement KeyboardAvoidingView or similar component

### Risk 2: Message Alignment Not Visually Distinct
- **Mitigation**: Use clear visual styling differences (background colors, padding, alignment)
- **Mitigation**: Test with multiple users to ensure clarity

### Risk 3: Performance Issues with Long Message Lists
- **Mitigation**: Implement FlatList for efficient rendering
- **Mitigation**: Use React.memo for message item components

### Risk 4: Default Route Configuration Issues
- **Mitigation**: Follow Expo Router documentation for default route setup
- **Mitigation**: Test navigation flow thoroughly

## Phase 0: Research & Design

### Research Findings

#### React Native Elements Components for Chat Interface

**Decision**: Use the following React Native Elements components:
- `Input` from `@rneui/themed` for text input field
- `Button` from `@rneui/themed` for send button
- `FlatList` or `ScrollView` from React Native for message list
- Custom `MessageItem` component using React Native Elements styling patterns

**Rationale**: 
- React Native Elements provides well-tested, accessible components
- Components support theming and customization
- Aligns with constitutional requirement to use React Native Elements

**Alternatives Considered**:
- Native React Native TextInput: Rejected - doesn't align with constitution
- Custom input component: Rejected - unnecessary when React Native Elements provides suitable component

#### Expo Router Default Route Configuration

**Decision**: Modify the app routing structure to set chat dialog as the default route by:
- Creating chat dialog component at `app/index.tsx` (root route)
- Or modifying `app/_layout.tsx` to redirect to chat dialog
- Or updating `app/(tabs)/index.tsx` to be the chat dialog

**Rationale**:
- Expo Router uses file-based routing where `app/index.tsx` is the default route
- Simplest approach is to replace or modify the current index route
- Maintains consistency with existing routing structure

**Alternatives Considered**:
- Separate route with redirect: More complex, unnecessary
- Modal presentation: Doesn't meet requirement for default route

#### NativeWind Styling for Message Alignment

**Decision**: Use Tailwind utility classes for message alignment:
- User messages: `items-start` (left alignment) with appropriate padding
- Other party messages: `items-end` (right alignment) with appropriate padding
- Container: `flex-1`, `flex-col` for vertical layout
- Input container: `absolute bottom-0` or `flex-shrink-0` to keep at bottom

**Rationale**:
- Tailwind utility classes provide clear, maintainable styling
- Alignment classes are semantic and easy to understand
- Consistent with constitutional requirement for NativeWind

**Alternatives Considered**:
- Inline styles: Rejected - violates constitution
- StyleSheet API: Rejected - should use NativeWind per constitution

### Data Model

#### Message Entity

```typescript
interface Message {
  id: string;              // Unique message identifier
  text: string;            // Message content
  sender: 'user' | 'other'; // Message sender type
  timestamp?: number;      // Optional timestamp (not displayed per spec)
}
```

**Fields**:
- `id`: Unique identifier for each message (required for React keys)
- `text`: The message content (required, non-empty string)
- `sender`: Identifies whether message is from user or other party (required)
- `timestamp`: Optional, not displayed per specification

**Validation Rules**:
- `text` must be non-empty string (trimmed)
- `sender` must be either 'user' or 'other'
- `id` must be unique within message list

**State Transitions**:
- Initial state: Empty message list
- After send: New message added to list with sender='user'
- After receiving: New message added to list with sender='other'

### API Contracts

This feature does not require external API contracts as it's a local UI-only feature. Messages are managed in component state without persistence or network requests per specification scope.

### Quick Start Guide

**File Structure**:
```
app/
  index.tsx              # Chat dialog (default route)
  _layout.tsx            # Root layout (may need updates)
  (tabs)/                # Existing tabs structure
```

**Component Structure**:
```
components/
  chat-dialog.tsx        # Main chat dialog component
  message-item.tsx      # Individual message item component
  message-input.tsx     # Input field and send button component
```

**Key Implementation Points**:
1. Create `app/index.tsx` as chat dialog component
2. Use React Native Elements Input and Button components
3. Use NativeWind for styling with alignment classes
4. Manage message state with React hooks
5. Implement scrolling with FlatList or ScrollView
