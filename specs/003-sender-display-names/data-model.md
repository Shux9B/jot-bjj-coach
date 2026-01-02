# Data Model: Sender Display Names

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
  agentType?: 'sports-science' | string; // Optional: agent type identifier for sender name display
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
| `agentType` | `'sports-science' \| string` | No | Agent type identifier. Used to determine which sender name to display. When present with `sender: 'other'`, displays corresponding agent name. |

### Validation Rules

1. **Text Validation**
   - `text` must be a non-empty string after trimming whitespace (unless `isLoading` is true)
   - Maximum length: 2000 characters for agent responses (truncated if exceeded)
   - User messages: No explicit limit, but should be reasonable (e.g., 1000 characters)

2. **Sender Validation**
   - `sender` must be exactly `'user'` or `'other'`
   - User messages always have `sender: 'user'` and should not have `agentType`
   - Agent responses always have `sender: 'other'` and may have `agentType`
   - Loading indicators have `sender: 'other'` and may have `agentType`
   - System messages (timeouts) have `sender: 'other'` and may have `agentType`

3. **Agent Type Validation**
   - `agentType` is optional and only meaningful when `sender: 'other'`
   - When `agentType` is present, it must be a non-empty string
   - Known agent types: `'sports-science'` (maps to "运动健康助理")
   - Future agent types can be added as string literals
   - Messages with `sender: 'other'` but no `agentType` do not display sender names (backward compatibility)

4. **ID Validation**
   - `id` must be unique within the message list
   - Should be generated using a reliable method (e.g., UUID, timestamp + random)

5. **Loading State Validation**
   - `isLoading: true` messages should have minimal or placeholder text
   - Only one loading indicator should exist per pending agent request
   - Loading indicator should be removed when response arrives or timeout occurs
   - Loading indicators with `agentType` display sender name above the indicator

6. **BJJ Relevance Score Validation**
   - `bjjRelevanceScore` must be between 0 and 100 (inclusive)
   - Only present for user messages that were sent and analyzed
   - Score >= 50 triggers agent response generation

### Sender Name Display Rules

1. **User Messages** (`sender: 'user'`)
   - Always display "本人" as sender name
   - Positioned above message content
   - Left-aligned with message bubble

2. **Agent Messages** (`sender: 'other'` with `agentType`)
   - Display agent-specific name based on `agentType`:
     - `agentType: 'sports-science'` → "运动健康助理"
     - Future agent types will have their own display names
   - Positioned above message content
   - Right-aligned with message bubble
   - Applies to: regular responses, system messages, loading indicators

3. **Legacy Messages** (`sender: 'other'` without `agentType`)
   - Do not display sender name (backward compatibility)
   - Message content displays normally
   - Maintains existing behavior for messages created before this feature

### State Transitions

#### User Message with Sender Name
```typescript
const userMessage: Message = {
  id: generateId(),
  text: 'What is the armbar technique?',
  sender: 'user'
  // No agentType for user messages
};
```
- Message appears on left side
- Displays "本人" above message content
- Triggers agent processing

#### Agent Response with Sender Name
```typescript
const agentResponse: Message = {
  id: generateId(),
  text: 'The armbar (juji-gatame) involves...',
  sender: 'other',
  agentType: 'sports-science',
  bjjRelevanceScore: 95
};
```
- Message appears on right side
- Displays "运动健康助理" above message content
- Shows agent response text

#### Loading Indicator with Sender Name
```typescript
const loadingMessage: Message = {
  id: generateId(),
  text: '',
  sender: 'other',
  isLoading: true,
  agentType: 'sports-science'
};
```
- Loading indicator appears on right side
- Displays "运动健康助理" above loading indicator
- Shows ActivityIndicator instead of text

#### System Message with Sender Name
```typescript
const systemMessage: Message = {
  id: generateId(),
  text: '我只能回答巴西柔术相关问题',
  sender: 'other',
  isSystemMessage: true,
  agentType: 'sports-science'
};
```
- System message appears on right side
- Displays "运动健康助理" above message content
- Uses system message styling (reduced opacity)

#### Legacy Message (No Sender Name)
```typescript
const legacyMessage: Message = {
  id: generateId(),
  text: 'Legacy message text',
  sender: 'other'
  // No agentType field
};
```
- Message appears on right side
- No sender name displayed (backward compatibility)
- Message content displays normally

### Sender Name Mapping

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

### Relationships

**Message to Sender Name**:
- One-to-one relationship: Each message has zero or one sender name
- User messages always have sender name "本人"
- Agent messages with `agentType` have corresponding agent name
- Agent messages without `agentType` have no sender name

**Agent Type to Display Name**:
- One-to-many relationship: One agent type can have many messages
- Mapping is static and defined in utility function
- Future extensibility: New agent types can be added to mapping

### Constraints

1. **Message Order**: Messages must maintain chronological order (FIFO - First In First Out)
2. **Sender Name Display**: Only messages with `sender: 'user'` or `sender: 'other'` with `agentType` display sender names
3. **Backward Compatibility**: Messages without `agentType` field do not display sender names
4. **Agent Type Consistency**: All messages from the same agent should use the same `agentType` value
5. **Name Mapping**: Agent types must be registered in `AGENT_NAME_MAP` to display names

### Example Data

```typescript
const exampleMessages: Message[] = [
  {
    id: 'msg-001',
    text: 'What is the biomechanics of an armbar?',
    sender: 'user'
    // Displays "本人"
  },
  {
    id: 'msg-002',
    text: '',
    sender: 'other',
    isLoading: true,
    agentType: 'sports-science'
    // Displays "运动健康助理" above loading indicator
  },
  {
    id: 'msg-003',
    text: 'The armbar (juji-gatame) involves hyperextension...',
    sender: 'other',
    agentType: 'sports-science',
    bjjRelevanceScore: 95
    // Displays "运动健康助理" above message content
  },
  {
    id: 'msg-004',
    text: '我只能回答巴西柔术相关问题',
    sender: 'other',
    isSystemMessage: true,
    agentType: 'sports-science'
    // Displays "运动健康助理" above system message
  },
  {
    id: 'msg-005',
    text: 'Legacy message without agentType',
    sender: 'other'
    // No sender name displayed (backward compatibility)
  }
];
```

### Component State Structure

```typescript
interface ChatDialogState {
  messages: Message[];        // Array of all messages
  inputText: string;          // Current text in input field
}

interface MessageItemProps {
  message: Message;           // Message to display
}

interface SenderNameProps {
  message: Message;            // Message to get sender name for
}
```

### State Management

- **Local Component State**: Use `useState` hook for messages and inputText
- **No Global State**: Messages are scoped to the chat dialog component
- **No Persistence**: State is lost when component unmounts (per specification)
- **Sender Name Utility**: Pure function, no state required

### Migration Notes

**Backward Compatibility**:
- Existing messages without `agentType` field continue to work
- No sender names displayed for legacy messages
- New messages should include `agentType` when creating agent responses

**Forward Compatibility**:
- New agent types can be added by extending `AGENT_NAME_MAP`
- `agentType` field accepts string type for future extensibility
- Component logic handles unknown agent types gracefully (no name displayed)

