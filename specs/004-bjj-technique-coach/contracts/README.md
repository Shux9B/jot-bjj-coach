# API Contracts: BJJ Technique Coach Agent

## Overview

This feature extends the existing chat dialog interface with a technique coach agent. The implementation reuses existing services and follows the same patterns as the science coach (002-science-coach-agent). No new external API contracts are required - all services are internal to the application.

## Internal Service Contracts

### Technique Coach Response Service

**Service**: `services/technique-coach-service.ts`

**Function**: `generateTechniqueCoachResponse(message: string): Promise<string>`

**Input**:
- `message: string` - User's BJJ-related question

**Output**:
- `Promise<string>` - Technique-focused response (truncated to 2000 characters)

**Errors**:
- `Error('Response generation timeout')` - If generation exceeds 10 seconds
- `Error('Technique coach response generation failed: ...')` - For other failures

**Behavior**:
- Uses DashScope API with Qwen models (qwen-plus)
- Applies technique coach prompt from `.specify/prompts/004-bjj-technique-coach/technique-coach-prompt.md`
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
- Shared between technique coach and science coach
- Single detection call per user message
- Result shared between both coaches

### Chat Dialog Component Integration

**Component**: `components/chat-dialog.tsx`

**Function**: `processAgentResponse(userText: string, userMessageId: string): Promise<void>`

**Flow**:
1. Detect BJJ relevance (shared service)
2. If score < 50: Display informative message, return
3. If score >= 50:
   a. Add technique coach loading indicator
   b. Generate technique coach response
   c. Display technique coach response
   d. Trigger science coach response (after technique coach completes)
   e. Display science coach response

**Error Handling**:
- Technique coach failure: Trigger science coach response
- Technique coach timeout: Display timeout notification, trigger science coach response
- Detection failure: Silently handle, no response

## Message Format

### Technique Coach Response Message

```typescript
{
  id: string;
  text: string; // Technique-focused response (max 2000 chars)
  sender: 'other';
  agentType: 'technique-coach';
  bjjRelevanceScore?: number; // Shared detection score
}
```

### Technique Coach Loading Indicator

```typescript
{
  id: string;
  text: '';
  sender: 'other';
  isLoading: true;
  agentType: 'technique-coach';
}
```

### Technique Coach Timeout Notification

```typescript
{
  id: string;
  text: 'Response timeout. Please try again.';
  sender: 'other';
  isSystemMessage: true;
  agentType: 'technique-coach';
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

**Ordering Guarantee**: Technique coach response always appears before science coach response for the same user message.

**Failure Handling**: If technique coach fails or times out, science coach response is still triggered.

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
    { "role": "system", "content": "<technique coach prompt>" },
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
        "content": "<technique coach response>"
      }
    }
  ]
}
```

**Rate Limits**: As per DashScope API documentation

**Timeout**: 10 seconds per request

## Integration Contracts

### Sender Display Name System (003-sender-display-names)

**Contract**: Maps `agentType: 'technique-coach'` to sender name "技术教练"

**Function**: `getSenderName(message: Message): string | null`

**Mapping**:
- `'technique-coach'` → `'技术教练'`
- `'sports-science'` → `'运动健康助理'`
- `'user'` → `'本人'`

### Science Coach Integration (002-science-coach-agent)

**Contract**: Science coach response triggered after technique coach response completes

**Trigger Condition**: After technique coach response is displayed (success, failure, or timeout)

**Function**: `triggerScienceCoachResponse(userText: string, score: number): Promise<void>`

**Behavior**: Generates and displays science coach response using existing `generateResponse` service

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
```

## Error Handling Contracts

### Technique Coach Generation Failure
- **Action**: Log error silently, trigger science coach response
- **User Experience**: No error message, receives science coach response

### Technique Coach Timeout
- **Action**: Display timeout notification, trigger science coach response
- **User Experience**: Sees timeout message, then receives science coach response

### BJJ Detection Failure
- **Action**: Return score 0, no agent responses triggered
- **User Experience**: No response (treated as non-BJJ question)

### Network Failure
- **Action**: Handle gracefully, trigger fallback (science coach) if applicable
- **User Experience**: Chat interface remains functional

