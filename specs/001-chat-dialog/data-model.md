# Data Model: Chat Dialog Interface

## Message Entity

### Definition

```typescript
interface Message {
  id: string;              // Unique message identifier
  text: string;            // Message content
  sender: 'user' | 'other'; // Message sender type
  timestamp?: number;      // Optional timestamp (not displayed per spec)
}
```

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | Yes | Unique identifier for each message. Used as React key for list rendering. |
| `text` | `string` | Yes | The message content. Must be non-empty after trimming. |
| `sender` | `'user' \| 'other'` | Yes | Identifies whether message is from current user or other party. Determines message alignment. |
| `timestamp` | `number` | No | Optional timestamp in milliseconds. Not displayed per specification scope. |

### Validation Rules

1. **Text Validation**
   - `text` must be a non-empty string after trimming whitespace
   - Maximum length: No explicit limit in spec, but should be reasonable (e.g., 1000 characters)

2. **Sender Validation**
   - `sender` must be exactly `'user'` or `'other'`
   - No other values allowed

3. **ID Validation**
   - `id` must be unique within the message list
   - Should be generated using a reliable method (e.g., UUID, timestamp + random)

### State Transitions

#### Initial State
```typescript
messages: Message[] = []
```
- Empty message list
- No messages displayed

#### After User Sends Message
```typescript
// User types text and clicks send
const newMessage: Message = {
  id: generateId(),
  text: inputText.trim(),
  sender: 'user'
};
setMessages([...messages, newMessage]);
```
- New message added to end of list
- Message appears on left side (user alignment)
- Input field cleared

#### After Other Party Sends Message
```typescript
// Simulated or received from external source
const newMessage: Message = {
  id: generateId(),
  text: receivedText,
  sender: 'other'
};
setMessages([...messages, newMessage]);
```
- New message added to end of list
- Message appears on right side (other party alignment)

### Relationships

No relationships with other entities. Messages are self-contained and independent.

### Constraints

1. **Message Order**: Messages must maintain chronological order (FIFO - First In First Out)
2. **No Persistence**: Messages are not persisted to storage (per specification scope)
3. **No Deletion**: Messages cannot be deleted or edited (per specification scope)
4. **No Duplicates**: Message IDs must be unique within the list

### Example Data

```typescript
const exampleMessages: Message[] = [
  {
    id: 'msg-001',
    text: 'Hello!',
    sender: 'user'
  },
  {
    id: 'msg-002',
    text: 'Hi there!',
    sender: 'other'
  },
  {
    id: 'msg-003',
    text: 'How are you?',
    sender: 'user'
  }
];
```

### ID Generation Strategy

**Recommended**: Use a combination of timestamp and random string to ensure uniqueness:

```typescript
function generateMessageId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
```

**Alternative**: Use UUID library if available:
```typescript
import { v4 as uuidv4 } from 'uuid';
const id = uuidv4();
```

### Component State Structure

```typescript
interface ChatDialogState {
  messages: Message[];        // Array of all messages
  inputText: string;          // Current text in input field
  isKeyboardVisible: boolean;  // Optional: track keyboard state
}
```

### State Management

- **Local Component State**: Use `useState` hook for messages and inputText
- **No Global State**: Messages are scoped to the chat dialog component
- **No Persistence**: State is lost when component unmounts (per specification)

