# Data Model: BJJ Tactics Coach Agent

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
  agentType?: 'sports-science' | 'technique-coach' | 'tactics-coach' | string; // Optional: agent type identifier for sender name display
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
| `bjjRelevanceScore` | `number` | No | BJJ relevance score (0-100) from detection API. Only present for user messages that were analyzed. Shared across all three coaches. |
| `agentType` | `'sports-science' \| 'technique-coach' \| 'tactics-coach' \| string` | No | Agent type identifier for sender name display. 'tactics-coach' maps to "战术教练", 'technique-coach' maps to "技术教练", 'sports-science' maps to "运动健康助理". |

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
   - Each coach (technique, science, tactics) may have separate loading indicators

5. **BJJ Relevance Score Validation**
   - `bjjRelevanceScore` must be between 0 and 100 (inclusive)
   - Only present for user messages that were sent and analyzed
   - Score >= 50 triggers agent response generation
   - Same detection result shared across all three coaches

6. **Agent Type Validation**
   - `agentType` must be a string if present
   - 'tactics-coach' identifies tactics coach responses
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
- BJJ detection score shared with all coaches

#### During Technique Coach Processing
```typescript
// Loading indicator added for technique coach
const techniqueLoadingMessage: Message = {
  id: generateId(),
  text: '',
  sender: 'other',
  isLoading: true,
  agentType: 'technique-coach'
};
setMessages([...messages, techniqueLoadingMessage]);
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
  text: truncatedResponse,
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
  bjjRelevanceScore: relevanceScore // Same score as other coaches
};
setMessages([...messages, scienceResponse]);
// Then trigger tactics coach response...
```
- Science coach response added after technique coach response
- Sender name "运动健康助理" displayed
- Tactics coach processing triggered after science coach response completes successfully

#### During Tactics Coach Processing
```typescript
// Loading indicator added for tactics coach
const tacticsLoadingMessage: Message = {
  id: generateId(),
  text: '',
  sender: 'other',
  isLoading: true,
  agentType: 'tactics-coach'
};
setMessages([...messages, tacticsLoadingMessage]);
```
- Loading indicator appears on right side
- ActivityIndicator displayed instead of text
- Sender name "战术教练" displayed
- User can continue sending messages

#### After Tactics Coach Response Generated
```typescript
// Tactics coach response received (after technique coach and science coach)
const tacticsResponse: Message = {
  id: generateId(),
  text: truncatedResponse,
  sender: 'other',
  agentType: 'tactics-coach',
  bjjRelevanceScore: relevanceScore // Same score as other coaches
};
// Remove loading indicator and add response
setMessages(messages.filter(m => !m.isLoading || m.agentType !== 'tactics-coach').concat(tacticsResponse));
```
- Loading indicator removed
- Tactics coach response added after science coach response
- Response appears on right side (other party alignment)
- Sender name "战术教练" displayed
- Response truncated to 2000 characters if needed
- Complete three-coach response sequence finished

#### After Tactics Coach Timeout
```typescript
// Timeout notification for tactics coach
const timeoutMessage: Message = {
  id: generateId(),
  text: 'Response timeout. Please try again.',
  sender: 'other',
  isSystemMessage: true,
  agentType: 'tactics-coach'
};
// Remove loading indicator and add timeout message
setMessages(messages.filter(m => !m.isLoading || m.agentType !== 'tactics-coach').concat(timeoutMessage));
```
- Loading indicator removed
- Timeout message added to end of list
- Message appears on right side with system message styling
- Sender name "战术教练" displayed
- No further action (tactics coach is last response)

#### After Technique Coach or Science Coach Failure/Timeout
```typescript
// Technique coach or science coach failed/timed out
// Tactics coach NOT triggered
// User receives responses from successful coaches only
```
- No tactics coach response triggered
- User receives responses from successful coaches only
- Chat continues normally

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
- Each user message can have associated processing state for all three coaches
- Processing state tracked separately from message entity
- Multiple concurrent processing states possible
- Tactics coach processing only starts after technique coach and science coach complete successfully

**Shared BJJ Detection**:
- BJJ detection result (`bjjRelevanceScore`) is shared across all three coaches
- Single detection call per user message
- All coaches use same detection result

**Response Ordering**:
- Technique coach response always appears first
- Science coach response always appears second (after technique coach)
- Tactics coach response always appears third (after science coach, only if both previous coaches succeed)
- Responses displayed in chronological order regardless of completion time
- Message timestamps or sequence numbers maintain order

### Constraints

1. **Message Order**: Messages must maintain chronological order (FIFO - First In First Out)
2. **Loading Indicator**: Only one loading indicator per pending agent request (each coach may have separate indicators)
3. **Response Length**: Agent responses limited to 2000 characters, truncated with ellipsis if exceeded
4. **Concurrent Processing**: Multiple agent requests can be processed concurrently, responses displayed in order
5. **BJJ Detection**: Only messages with `bjjRelevanceScore >= 50` receive agent responses
6. **Response Sequence**: Technique coach → science coach → tactics coach (tactics coach only if both previous coaches succeed)
7. **Conditional Triggering**: Tactics coach response only triggered when both technique coach and science coach complete successfully

### Agent Processing State

```typescript
interface AgentProcessingState {
  messageId: string;           // ID of user message being processed
  startTime: number;           // Timestamp when processing started
  status: 'pending' | 'processing' | 'completed' | 'timeout' | 'failed';
  agentType: 'technique-coach' | 'sports-science' | 'tactics-coach'; // Which agent is processing
  bjjRelevanceScore?: number;   // Detection score (shared)
  responseText?: string;        // Generated response (if completed)
}
```

### Example Data

```typescript
const exampleMessages: Message[] = [
  {
    id: 'msg-001',
    text: 'How should I approach the guard position in competition?',
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
    text: 'When using the guard position, focus on controlling the distance and maintaining proper posture...',
    sender: 'other',
    agentType: 'technique-coach',
    bjjRelevanceScore: 95
  },
  {
    id: 'msg-004',
    text: '',
    sender: 'other',
    isLoading: true,
    agentType: 'sports-science'
  },
  {
    id: 'msg-005',
    text: 'The guard position involves biomechanical principles of leverage and control...',
    sender: 'other',
    agentType: 'sports-science',
    bjjRelevanceScore: 95
  },
  {
    id: 'msg-006',
    text: '',
    sender: 'other',
    isLoading: true,
    agentType: 'tactics-coach'
  },
  {
    id: 'msg-007',
    text: 'In competition, use the guard to control the pace and set up attacks. Key tactical considerations include...',
    sender: 'other',
    agentType: 'tactics-coach',
    bjjRelevanceScore: 95
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
  processingStates: AgentProcessingState[]; // Active agent processing states (all coaches)
  isProcessing: boolean;                   // Overall processing status
}
```

### State Management

- **Local Component State**: Use `useState` hook for messages, inputText, and processing states
- **No Global State**: Messages and processing states are scoped to the chat dialog component
- **No Persistence**: State is lost when component unmounts (per specification)
- **Concurrent Processing**: Multiple processing states can exist simultaneously (one per user message)
- **Sequential Coach Responses**: Technique coach → science coach → tactics coach (tactics coach only if both previous coaches succeed)

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
  'sports-science': '运动健康助理',
  'tactics-coach': '战术教练'
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

