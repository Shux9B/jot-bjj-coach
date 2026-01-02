# Data Model: BJJ Technique Coach Agent

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
  agentType?: 'sports-science' | 'technique-coach' | string; // Optional: agent type identifier for sender name display
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
| `bjjRelevanceScore` | `number` | No | BJJ relevance score (0-100) from detection API. Only present for user messages that were analyzed. Shared between technique coach and science coach. |
| `agentType` | `'sports-science' \| 'technique-coach' \| string` | No | Agent type identifier for sender name display. 'technique-coach' maps to "技术教练", 'sports-science' maps to "运动健康助理". |

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
   - Technique coach and science coach may have separate loading indicators

5. **BJJ Relevance Score Validation**
   - `bjjRelevanceScore` must be between 0 and 100 (inclusive)
   - Only present for user messages that were sent and analyzed
   - Score >= 50 triggers agent response generation
   - Same detection result shared between technique coach and science coach

6. **Agent Type Validation**
   - `agentType` must be a string if present
   - 'technique-coach' identifies technique coach responses
   - 'sports-science' identifies science coach responses
   - Used by sender name display system (003-sender-display-names) to show appropriate sender name

### State Transitions

#### Initial State
```typescript
messages: Message[] = []
```
- Empty message list
- No messages displayed

#### After User Sends BJJ-Related Message
```typescript
// User types text and clicks send
const newMessage: Message = {
  id: generateId(),
  text: inputText.trim(),
  sender: 'user',
  bjjRelevanceScore: 85 // From shared detection service
};
setMessages([...messages, newMessage]);
```
- New message added to end of list
- Message appears on left side (user alignment)
- Input field cleared
- Technique coach processing triggered automatically
- BJJ detection score shared with science coach

#### During Technique Coach Processing
```typescript
// Loading indicator added for technique coach
const loadingMessage: Message = {
  id: generateId(),
  text: '', // Placeholder
  sender: 'other',
  isLoading: true,
  agentType: 'technique-coach'
};
setMessages([...messages, loadingMessage]);
```
- Loading indicator appears on right side
- ActivityIndicator displayed instead of text
- Sender name "技术教练" displayed (via 003-sender-display-names)
- User can continue sending messages

#### After Technique Coach Response Generated
```typescript
// Technique coach response received
const techniqueResponse: Message = {
  id: generateId(),
  text: truncatedResponse, // Max 2000 chars, truncated if needed
  sender: 'other',
  agentType: 'technique-coach',
  bjjRelevanceScore: relevanceScore // From shared detection
};
// Remove loading indicator and add response
setMessages(messages.filter(m => !m.isLoading || m.agentType !== 'technique-coach').concat(techniqueResponse));
// Then trigger science coach response...
```
- Loading indicator removed
- Technique coach response added to end of list
- Response appears on right side (other party alignment)
- Sender name "技术教练" displayed
- Response truncated to 2000 characters if needed
- Science coach processing triggered after technique coach response completes

#### After Science Coach Response Generated
```typescript
// Science coach response received (after technique coach)
const scienceResponse: Message = {
  id: generateId(),
  text: truncatedResponse,
  sender: 'other',
  agentType: 'sports-science',
  bjjRelevanceScore: relevanceScore // Same score as technique coach
};
setMessages([...messages, scienceResponse]);
```
- Science coach response added after technique coach response
- Sender name "运动健康助理" displayed
- Both responses visible in chronological order

#### After Technique Coach Timeout
```typescript
// Timeout notification for technique coach
const timeoutMessage: Message = {
  id: generateId(),
  text: 'Response timeout. Please try again.',
  sender: 'other',
  isSystemMessage: true,
  agentType: 'technique-coach'
};
// Remove loading indicator and add timeout message
setMessages(messages.filter(m => !m.isLoading || m.agentType !== 'technique-coach').concat(timeoutMessage));
// Then trigger science coach response...
```
- Loading indicator removed
- Timeout message added to end of list
- Message appears on right side with system message styling
- Sender name "技术教练" displayed
- Science coach processing triggered after timeout notification

#### After Technique Coach Failure (Non-Timeout)
```typescript
// Technique coach failed, trigger science coach silently
// No error message displayed
// Science coach processing triggered immediately
```
- No error message displayed to user
- Science coach processing triggered immediately
- User receives science coach response as fallback

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
- Each user message can have associated processing state for both technique coach and science coach
- Processing state tracked separately from message entity
- Multiple concurrent processing states possible
- Technique coach processing must complete (success, failure, or timeout) before science coach processing starts

**Shared BJJ Detection**:
- BJJ detection result (`bjjRelevanceScore`) is shared between technique coach and science coach
- Single detection call per user message
- Both coaches use same detection result

**Response Ordering**:
- Technique coach response always appears before science coach response for the same user message
- Responses displayed in chronological order regardless of completion time
- Message timestamps or sequence numbers maintain order

### Constraints

1. **Message Order**: Messages must maintain chronological order (FIFO - First In First Out)
2. **Loading Indicator**: Only one loading indicator per pending agent request (technique coach and science coach may have separate indicators)
3. **Response Length**: Agent responses limited to 2000 characters, truncated with ellipsis if exceeded
4. **Concurrent Processing**: Multiple agent requests can be processed concurrently, responses displayed in order
5. **BJJ Detection**: Only messages with `bjjRelevanceScore >= 50` receive agent responses
6. **Response Sequence**: Technique coach response must be generated and displayed before science coach response is triggered
7. **Failure Handling**: On technique coach failure or timeout, science coach response is still triggered

### Agent Processing State

```typescript
interface AgentProcessingState {
  messageId: string;           // ID of user message being processed
  startTime: number;           // Timestamp when processing started
  status: 'pending' | 'processing' | 'completed' | 'timeout' | 'failed';
  agentType: 'technique-coach' | 'sports-science'; // Which agent is processing
  bjjRelevanceScore?: number;   // Detection score (shared)
  responseText?: string;        // Generated response (if completed)
}
```

### Example Data

```typescript
const exampleMessages: Message[] = [
  {
    id: 'msg-001',
    text: 'How do I perform an armbar correctly?',
    sender: 'user',
    bjjRelevanceScore: 95
  },
  {
    id: 'msg-002',
    text: '',
    sender: 'other',
    isLoading: true,
    agentType: 'technique-coach'
  },
  {
    id: 'msg-003',
    text: 'When performing an armbar, focus on controlling the arm at the wrist and elbow. Common mistakes include...',
    sender: 'other',
    agentType: 'technique-coach',
    bjjRelevanceScore: 95
  },
  {
    id: 'msg-004',
    text: 'The armbar (juji-gatame) involves hyperextension of the elbow joint...',
    sender: 'other',
    agentType: 'sports-science',
    bjjRelevanceScore: 95
  },
  {
    id: 'msg-005',
    text: 'How do I improve my cardio?',
    sender: 'user',
    bjjRelevanceScore: 30
  },
  // No agent response for msg-005 (score < 50)
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
  processingStates: AgentProcessingState[]; // Active agent processing states (both coaches)
  isProcessing: boolean;                   // Overall processing status
}
```

### State Management

- **Local Component State**: Use `useState` hook for messages, inputText, and processing states
- **No Global State**: Messages and processing states are scoped to the chat dialog component
- **No Persistence**: State is lost when component unmounts (per specification)
- **Concurrent Processing**: Multiple processing states can exist simultaneously (one per user message)
- **Sequential Coach Responses**: Technique coach processing must complete before science coach processing starts for the same message

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

### Sender Name Mapping

```typescript
// Via 003-sender-display-names utility
const senderNameMap: Record<string, string> = {
  'technique-coach': '技术教练',
  'sports-science': '运动健康助理'
};

function getSenderName(message: Message): string | null {
  if (message.sender === 'user') {
    return '本人';
  }
  if (message.agentType && senderNameMap[message.agentType]) {
    return senderNameMap[message.agentType];
  }
  return null; // Backward compatibility
}
```

