# Research Findings: Chat Dialog Interface

## React Native Elements Components for Chat Interface

### Decision
Use the following React Native Elements components:
- `Input` from `@rneui/themed` for text input field
- `Button` from `@rneui/themed` for send button
- `FlatList` or `ScrollView` from React Native for message list
- Custom `MessageItem` component using React Native Elements styling patterns

### Rationale
- React Native Elements provides well-tested, accessible components
- Components support theming and customization
- Aligns with constitutional requirement to use React Native Elements
- Components are already installed in the project

### Alternatives Considered
- **Native React Native TextInput**: Rejected - doesn't align with constitution requirement to use React Native Elements
- **Custom input component**: Rejected - unnecessary when React Native Elements provides suitable component
- **Third-party chat libraries**: Rejected - too heavy for this simple use case, violates constitution

### Component Details

#### Input Component
- Supports placeholder, value, onChangeText props
- Can be styled with NativeWind classes
- Handles keyboard interactions automatically
- Accessible by default

#### Button Component
- Supports onPress handler
- Can be styled with NativeWind classes
- Has built-in touch feedback
- Accessible by default

#### Message List
- Use React Native `FlatList` for performance with long lists
- Use `ScrollView` if message count is guaranteed to be small
- Both support NativeWind styling

## Expo Router Default Route Configuration

### Decision
Modify the app routing structure to set chat dialog as the default route by creating the chat dialog component at `app/index.tsx` (root route), replacing or modifying the current index route.

### Rationale
- Expo Router uses file-based routing where `app/index.tsx` is the default route
- Simplest approach is to replace or modify the current index route
- Maintains consistency with existing routing structure
- No additional configuration needed

### Implementation Approach
1. Create chat dialog component at `app/index.tsx`
2. This will automatically become the default route
3. Existing tabs structure can remain for other navigation if needed

### Alternatives Considered
- **Separate route with redirect**: More complex, unnecessary overhead
- **Modal presentation**: Doesn't meet requirement for default route
- **Nested routing**: Overcomplicated for this use case

### File Structure Impact
```
app/
  index.tsx              # Chat dialog (default route) - NEW
  _layout.tsx            # Root layout (may need minor updates)
  (tabs)/                # Existing tabs structure (can remain)
    index.tsx            # Can be moved or repurposed
```

## NativeWind Styling for Message Alignment

### Decision
Use Tailwind utility classes for message alignment:
- User messages: `items-start` (left alignment) with `self-start` and appropriate padding
- Other party messages: `items-end` (right alignment) with `self-end` and appropriate padding
- Container: `flex-1`, `flex-col` for vertical layout
- Input container: `absolute bottom-0` or use KeyboardAvoidingView with `flex-shrink-0` to keep at bottom

### Rationale
- Tailwind utility classes provide clear, maintainable styling
- Alignment classes are semantic and easy to understand
- Consistent with constitutional requirement for NativeWind
- No need for custom StyleSheet definitions

### Styling Patterns

#### Message Container
```tsx
// User message (left)
className="self-start max-w-[80%] bg-blue-500 rounded-lg p-3 m-2"

// Other party message (right)
className="self-end max-w-[80%] bg-gray-500 rounded-lg p-3 m-2"
```

#### Input Container
```tsx
className="flex-row items-center p-2 border-t border-gray-300 bg-white"
```

### Alternatives Considered
- **Inline styles**: Rejected - violates constitution requirement for NativeWind
- **StyleSheet API**: Rejected - should use NativeWind per constitution
- **Styled components**: Rejected - not part of tech stack

## Keyboard Handling

### Decision
Use React Native's `KeyboardAvoidingView` component with platform-specific behavior to ensure input field remains accessible when keyboard appears.

### Rationale
- Built-in React Native solution
- Handles platform differences (iOS vs Android)
- Simple to implement
- No additional dependencies needed

### Implementation
```tsx
<KeyboardAvoidingView 
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  style={{ flex: 1 }}
>
  {/* Chat content */}
</KeyboardAvoidingView>
```

### Alternatives Considered
- **Expo Keyboard API**: More complex, unnecessary for this use case
- **Manual keyboard event handling**: Too complex, KeyboardAvoidingView handles it

## State Management

### Decision
Use React hooks (useState, useRef) for local component state management. No need for external state management library.

### Rationale
- Simple use case with local component state
- No need for global state or persistence
- React hooks provide sufficient functionality
- Aligns with specification that excludes persistence

### State Structure
```typescript
const [messages, setMessages] = useState<Message[]>([]);
const [inputText, setInputText] = useState<string>('');
const scrollViewRef = useRef<ScrollView>(null);
```

### Alternatives Considered
- **Context API**: Unnecessary for single component state
- **Redux/Zustand**: Overkill for local component state
- **AsyncStorage**: Not needed per specification (no persistence)

## Message Scrolling Behavior

### Decision
Use `FlatList` with `onContentSizeChange` to automatically scroll to bottom when new messages are added.

### Rationale
- FlatList provides better performance than ScrollView for lists
- Automatic scrolling improves user experience
- Built-in React Native solution

### Implementation
```tsx
<FlatList
  ref={flatListRef}
  data={messages}
  renderItem={renderMessage}
  keyExtractor={(item) => item.id}
  onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
/>
```

### Alternatives Considered
- **ScrollView with manual scrollTo**: More manual work, less performant
- **Third-party libraries**: Unnecessary for this simple use case

