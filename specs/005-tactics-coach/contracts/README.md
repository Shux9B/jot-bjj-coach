# API Contracts: BJJ Tactics Coach Agent

## Overview

This feature extends the existing chat dialog interface with a tactics coach agent. The implementation reuses existing services and follows the same patterns as the technique coach (004-bjj-technique-coach) and science coach (002-science-coach-agent). No new external API contracts are required - all services are internal to the application.

## Internal Service Contracts

### Tactics Coach Response Service

**Service**: `services/tactics-coach-service.ts`

**Function**: `generateTacticsCoachResponse(message: string): Promise<string>`

**Input**:
- `message: string` - User's BJJ-related question

**Output**:
- `Promise<string>` - Tactics-focused response (truncated to 2000 characters)

**Errors**:
- `Error('Response generation timeout')` - If generation exceeds 10 seconds
- `Error('Tactics coach response generation failed: ...')` - For other failures

**Behavior**:
- Uses DashScope API with Qwen models (qwen-plus)
- Applies tactics coach prompt from `.specify/prompts/005-tactics-coach/tactics-coach-prompt.md`
- Truncates response to 2000 characters if needed
- Times out after 10 seconds

### Shared BJJ Detection Service

**Service**: `services/bjj-detection-service.ts` (reused from 002-science-coach-agent)

**Function**: `detectBJJRelevance(message: string): Promise<number>`

**Input**:
- `message: string` - User message to analyze

**Output**:
- `Promise<number>` - BJJ relevance score (0-100), where >= 50 means BJJ-related

**Behavior**:
- Shared across all three coaches (technique coach, science coach, tactics coach)
- Single detection call per user message
- Result shared across all coaches

### Chat Dialog Component Integration

**Component**: `components/chat-dialog.tsx`

**Function**: `triggerTacticsCoachResponse(userText: string, score: number): Promise<void>`

**Flow**:
1. Technique coach generates and displays response
2. Science coach generates and displays response (after technique coach completes)
3. Tactics coach generates and displays response (after science coach completes successfully)
4. If technique coach or science coach fails/timeouts, tactics coach is NOT triggered

**Error Handling**:
- Tactics coach failure: Display timeout notification, no further action
- Tactics coach timeout: Display timeout notification, no further action
- Previous coach failures: Do not trigger tactics coach

## Message Format

### Tactics Coach Response Message

```typescript
{
  id: string;
  text: string; // Tactics-focused response (max 2000 chars)
  sender: 'other';
  agentType: 'tactics-coach';
  bjjRelevanceScore?: number; // Shared detection score
}
```

### Tactics Coach Loading Indicator

```typescript
{
  id: string;
  text: '';
  sender: 'other';
  isLoading: true;
  agentType: 'tactics-coach';
}
```

### Tactics Coach Timeout Notification

```typescript
{
  id: string;
  text: 'Response timeout. Please try again.';
  sender: 'other';
  isSystemMessage: true;
  agentType: 'tactics-coach';
}
```

## Response Sequence Contract

For a BJJ-related question (score >= 50):

1. **Technique Coach Response** (first)
   - Loading indicator appears
   - Response generated and displayed
   - Sender name: "技术教练"

2. **Science Coach Response** (second, after technique coach completes)
   - Loading indicator appears
   - Response generated and displayed
   - Sender name: "运动健康助理"

3. **Tactics Coach Response** (third, after science coach completes successfully)
   - Loading indicator appears
   - Response generated and displayed
   - Sender name: "战术教练"
   - Only triggered if both technique coach and science coach complete successfully

**Ordering Guarantee**: Responses appear in sequence: technique coach → science coach → tactics coach (tactics coach only if both previous coaches succeed).

**Conditional Triggering**: Tactics coach response is only triggered when both technique coach and science coach responses complete successfully. If either previous coach fails or times out, tactics coach is not triggered.

## External API Contracts

### DashScope (阿里百炼) API

**Endpoint**: `https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions`

**Authentication**: API key via `EXPO_PUBLIC_DASHSCOPE_API_KEY` environment variable

**Model**: `qwen-plus` (default) or `qwen-turbo` (for detection)

**Request Format**:
```json
{
  "model": "qwen-plus",
  "messages": [
    { "role": "system", "content": "<tactics coach prompt>" },
    { "role": "user", "content": "<user question>" }
  ],
  "temperature": 0.7,
  "max_tokens": 500
}
```

**Response Format**:
```json
{
  "choices": [
    {
      "message": {
        "content": "<tactics coach response>"
      }
    }
  ]
}
```

**Rate Limits**: As per DashScope API documentation

**Timeout**: 10 seconds per request

## Integration Contracts

### Sender Display Name System (003-sender-display-names)

**Contract**: Maps `agentType: 'tactics-coach'` to sender name "战术教练"

**Function**: `getSenderName(message: Message): string | null`

**Mapping**:
- `'technique-coach'` → `'技术教练'`
- `'sports-science'` → `'运动健康助理'`
- `'tactics-coach'` → `'战术教练'`
- `'user'` → `'本人'`

### Technique Coach Integration (004-bjj-technique-coach)

**Contract**: Technique coach response triggered first, then science coach, then tactics coach

**Trigger Condition**: After user sends BJJ-related message (score >= 50)

**Function**: `processAgentResponse(userText: string, userMessageId: string): Promise<void>`

### Science Coach Integration (002-science-coach-agent)

**Contract**: Science coach response triggered after technique coach completes, then tactics coach triggered after science coach completes successfully

**Trigger Condition**: After technique coach response completes successfully

**Function**: `triggerScienceCoachResponse(userText: string, score: number): Promise<void>`

**Behavior**: After science coach completes successfully, triggers tactics coach response

## Data Flow

```
User Message
    ↓
BJJ Detection (shared)
    ↓
Score >= 50?
    ↓ Yes
Technique Coach Processing
    ↓
Technique Coach Response (displayed)
    ↓
Science Coach Processing (triggered)
    ↓
Science Coach Response (displayed)
    ↓ (only if science coach succeeds)
Tactics Coach Processing (triggered)
    ↓
Tactics Coach Response (displayed)
```

## Error Handling Contracts

### Technique Coach or Science Coach Failure/Timeout
- **Action**: Do not trigger tactics coach response
- **User Experience**: User receives responses from successful coaches only

### Tactics Coach Generation Failure
- **Action**: Log error silently, display timeout notification
- **User Experience**: Sees timeout message, no further action (tactics coach is last response)

### Tactics Coach Timeout
- **Action**: Display timeout notification
- **User Experience**: Sees timeout message, no further action (tactics coach is last response)

### BJJ Detection Failure
- **Action**: Return score 0, no agent responses triggered
- **User Experience**: No response (treated as non-BJJ question)

### Network Failure
- **Action**: Handle gracefully, do not trigger tactics coach if previous coaches fail
- **User Experience**: Chat interface remains functional

