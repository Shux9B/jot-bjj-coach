# Quick Start Guide: Chat Dialog Implementation

## File Structure

```
app/
  index.tsx              # Chat dialog (default route) - NEW
  _layout.tsx            # Root layout (may need minor updates)
  (tabs)/                # Existing tabs structure
    index.tsx            # Can be moved or repurposed

components/
  chat-dialog.tsx        # Main chat dialog component - NEW
  message-item.tsx      # Individual message item component - NEW
  message-input.tsx     # Input field and send button component - NEW
```

## Implementation Steps

### Step 1: Create Message Types

Create a types file or add to existing types:

```typescript
// types/chat.ts
export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'other';
  timestamp?: number;
}
```

### Step 2: Create MessageItem Component

```typescript
// components/message-item.tsx
import { Message } from '@/types/chat';
import { Text, View } from 'react-native';

interface MessageItemProps {
  message: Message;
}

export function MessageItem({ message }: MessageItemProps) {
  const isUser = message.sender === 'user';
  
  return (
    <View className={`self-${isUser ? 'start' : 'end'} max-w-[80%] bg-${isUser ? 'blue' : 'gray'}-500 rounded-lg p-3 m-2`}>
      <Text className="text-white">{message.text}</Text>
    </View>
  );
}
```

### Step 3: Create MessageInput Component

```typescript
// components/message-input.tsx
import { Input, Button } from '@rneui/themed';
import { useState } from 'react';

interface MessageInputProps {
  onSend: (text: string) => void;
}

export function MessageInput({ onSend }: MessageInputProps) {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim()) {
      onSend(text.trim());
      setText('');
    }
  };

  return (
    <View className="flex-row items-center p-2 border-t border-gray-300 bg-white">
      <Input
        value={text}
        onChangeText={setText}
        placeholder="Type a message..."
        containerStyle={{ flex: 1 }}
      />
      <Button
        title="Send"
        onPress={handleSend}
        disabled={!text.trim()}
      />
    </View>
  );
}
```

### Step 4: Create ChatDialog Component

```typescript
// components/chat-dialog.tsx
import { FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { Message } from '@/types/chat';
import { MessageItem } from './message-item';
import { MessageInput } from './message-input';
import { useState } from 'react';

export function ChatDialog() {
  const [messages, setMessages] = useState<Message[]>([]);
  const flatListRef = useRef<FlatList>(null);

  const handleSend = (text: string) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text,
      sender: 'user'
    };
    setMessages([...messages, newMessage]);
    
    // Simulate other party response (for demo)
    setTimeout(() => {
      const response: Message = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        text: 'This is a response',
        sender: 'other'
      };
      setMessages(prev => [...prev, response]);
    }, 1000);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={({ item }) => <MessageItem message={item} />}
        keyExtractor={(item) => item.id}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        className="flex-1"
      />
      <MessageInput onSend={handleSend} />
    </KeyboardAvoidingView>
  );
}
```

### Step 5: Set as Default Route

Update `app/index.tsx`:

```typescript
// app/index.tsx
import { ChatDialog } from '@/components/chat-dialog';

export default function HomeScreen() {
  return <ChatDialog />;
}
```

## Key Implementation Points

1. **Use React Native Elements**: All UI components from @rneui/themed
2. **Use NativeWind**: All styling with Tailwind utility classes
3. **Message Alignment**: Use `self-start` for user (left), `self-end` for other (right)
4. **Keyboard Handling**: Use KeyboardAvoidingView for proper keyboard behavior
5. **Auto-scroll**: Use FlatList with onContentSizeChange to scroll to bottom

## Testing Checklist

- [ ] Messages appear immediately after sending
- [ ] User messages align to left
- [ ] Other party messages align to right
- [ ] Input field clears after sending
- [ ] Keyboard doesn't obscure input field
- [ ] Messages scroll automatically to bottom
- [ ] Send button is disabled when input is empty
- [ ] Component is accessible via screen readers

