# Data Model: Science Coach Agent

## Extended Message Entity

### Definition

```typescript
interface Message {
  id: string;                    // Unique message identifier
  text: string;                   // Message content
  sender: 'user' | 'other';      // Message sender type
  timestamp?: number;             // Optional timestamp (not displayed per spec)
  isLoading?: boolean;            // Optional: indicates agent is processing response
  isSystemMessage?: boolean;      // Optional: indicates system notification (e.g., timeout)
  bjjRelevanceScore?: number;     // Optional: BJJ relevance score (0-100) from detection
}
```

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | Yes | Unique identifier for each message. Used as React key for list rendering. |
| `text` | `string` | Yes | The message content. Must be non-empty after trimming (except for loading indicators). |
| `sender` | `'user' \| 'other'` | Yes | Identifies whether message is from current user or other party. Determines message alignment. |
| `timestamp` | `number` | No | Optional timestamp in milliseconds. Not displayed per specification scope. |
| `isLoading` | `boolean` | No | Indicates message is a loading indicator placeholder. When true, display ActivityIndicator instead of text. |
| `isSystemMessage` | `boolean` | No | Indicates message is a system notification (e.g., timeout). Used for special styling. |
| `bjjRelevanceScore` | `number` | No | BJJ relevance score (0-100) from detection API. Only present for user messages that were analyzed. |

### Validation Rules

1. **Text Validation**
   - `text` must be a non-empty string after trimming whitespace (unless `isLoading` is true)
   - Maximum length: 2000 characters for agent responses (truncated if exceeded)
   - User messages: No explicit limit, but should be reasonable (e.g., 1000 characters)

2. **Sender Validation**
   - `sender` must be exactly `'user'` or `'other'`
   - Agent responses always have `sender: 'other'`
   - Loading indicators have `sender: 'other'`
   - System messages (timeouts) have `sender: 'other'`

3. **ID Validation**
   - `id` must be unique within the message list
   - Should be generated using a reliable method (e.g., UUID, timestamp + random)

4. **Loading State Validation**
   - `isLoading: true` messages should have minimal or placeholder text
   - Only one loading indicator should exist per pending agent request
   - Loading indicator should be removed when response arrives or timeout occurs

5. **BJJ Relevance Score Validation**
   - `bjjRelevanceScore` must be between 0 and 100 (inclusive)
   - Only present for user messages that were sent and analyzed
   - Score >= 50 triggers agent response generation

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
- Agent processing triggered automatically

#### During Agent Processing
```typescript
// Loading indicator added
const loadingMessage: Message = {
  id: generateId(),
  text: '', // Placeholder
  sender: 'other',
  isLoading: true
};
setMessages([...messages, loadingMessage]);
```
- Loading indicator appears on right side
- ActivityIndicator displayed instead of text
- User can continue sending messages

#### After Agent Response Generated
```typescript
// Agent response received
const agentResponse: Message = {
  id: generateId(),
  text: truncatedResponse, // Max 2000 chars, truncated if needed
  sender: 'other',
  bjjRelevanceScore: relevanceScore // From detection
};
// Remove loading indicator and add response
setMessages(messages.filter(m => !m.isLoading).concat(agentResponse));
```
- Loading indicator removed
- Agent response added to end of list
- Response appears on right side (other party alignment)
- Response truncated to 2000 characters if needed

#### After Timeout
```typescript
// Timeout notification
const timeoutMessage: Message = {
  id: generateId(),
  text: 'Response timeout. Please try again.',
  sender: 'other',
  isSystemMessage: true
};
// Remove loading indicator and add timeout message
setMessages(messages.filter(m => !m.isLoading).concat(timeoutMessage));
```
- Loading indicator removed
- Timeout message added to end of list
- Message appears on right side with system message styling

#### After Non-BJJ Question
```typescript
// No message added, user message remains
// Agent processing completes silently, no response generated
```
- User message remains in list
- No agent response added
- No loading indicator (or removed if was shown)
- Chat continues normally

### Relationships

**Message Processing State**:
- Each user message can have associated processing state
- Processing state tracked separately from message entity
- Multiple concurrent processing states possible

### Constraints

1. **Message Order**: Messages must maintain chronological order (FIFO - First In First Out)
2. **Loading Indicator**: Only one loading indicator per pending request
3. **Response Length**: Agent responses limited to 2000 characters, truncated with ellipsis if exceeded
4. **Concurrent Processing**: Multiple agent requests can be processed concurrently, responses displayed in order
5. **BJJ Detection**: Only messages with `bjjRelevanceScore >= 50` receive agent responses

### Agent Processing State

```typescript
interface AgentProcessingState {
  messageId: string;           // ID of user message being processed
  startTime: number;           // Timestamp when processing started
  status: 'pending' | 'processing' | 'completed' | 'timeout' | 'failed';
  bjjRelevanceScore?: number;   // Detection score
  responseText?: string;        // Generated response (if completed)
}
```

### Example Data

```typescript
const exampleMessages: Message[] = [
  {
    id: 'msg-001',
    text: 'What is the biomechanics of an armbar?',
    sender: 'user',
    bjjRelevanceScore: 95
  },
  {
    id: 'msg-002',
    text: '',
    sender: 'other',
    isLoading: true
  },
  {
    id: 'msg-003',
    text: 'The armbar (juji-gatame) involves hyperextension of the elbow joint...',
    sender: 'other'
  },
  {
    id: 'msg-004',
    text: 'How do I improve my cardio?',
    sender: 'user',
    bjjRelevanceScore: 30
  },
  // No agent response for msg-004 (score < 50)
  {
    id: 'msg-005',
    text: 'Explain the guard position',
    sender: 'user',
    bjjRelevanceScore: 88
  },
  {
    id: 'msg-006',
    text: '',
    sender: 'other',
    isLoading: true
  },
  {
    id: 'msg-007',
    text: 'Response timeout. Please try again.',
    sender: 'other',
    isSystemMessage: true
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

### Component State Structure

```typescript
interface ChatDialogState {
  messages: Message[];                    // Array of all messages
  inputText: string;                      // Current text in input field
  processingStates: AgentProcessingState[]; // Active agent processing states
  isProcessing: boolean;                   // Overall processing status
}
```

### State Management

- **Local Component State**: Use `useState` hook for messages, inputText, and processing states
- **No Global State**: Messages and processing states are scoped to the chat dialog component
- **No Persistence**: State is lost when component unmounts (per specification)
- **Concurrent Processing**: Multiple processing states can exist simultaneously

### Response Truncation Logic

```typescript
function truncateResponse(text: string, maxLength: number = 2000): string {
  if (text.length <= maxLength) {
    return text;
  }
  
  // Truncate at word boundary
  const truncated = text.substring(0, maxLength - 3);
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastSpace > maxLength * 0.8) {
    // If space is reasonably close to end, truncate there
    return truncated.substring(0, lastSpace) + '...';
  }
  
  // Otherwise truncate at character boundary
  return truncated + '...';
}
```

