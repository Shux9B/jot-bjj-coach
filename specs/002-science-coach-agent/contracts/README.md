# API Contracts: Science Coach Agent

## Overview

This feature integrates with DashScope (阿里百炼) API for BJJ question detection and sports science response generation. The implementation uses OpenAI-compatible interface with two main API endpoints:

1. **BJJ Question Detection**: Classifies user messages to determine if they are BJJ-related
2. **Agent Response Generation**: Generates sports science explanations for BJJ questions

## DashScope (阿里百炼) API Integration

### Base Configuration

- **API Base URL**: 
  - 华北2（北京）: `https://dashscope.aliyuncs.com/compatible-mode/v1`
  - 新加坡: `https://dashscope-intl.aliyuncs.com/compatible-mode/v1`
- **Authentication**: Bearer token via `Authorization` header
- **API Key**: Stored in Expo environment variables (`EXPO_PUBLIC_DASHSCOPE_API_KEY`)
- **Model**: Qwen series (qwen-turbo, qwen-plus, qwen-max)

### Endpoint 1: BJJ Question Detection

**Purpose**: Determine if a user message is primarily (>50%) BJJ-related

**Endpoint**: `POST https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions`

**Request Headers**:
```
Authorization: Bearer {API_KEY}
Content-Type: application/json
```

**Request Body**:
```json
{
  "model": "gpt-3.5-turbo",
  "messages": [
    {
      "role": "system",
      "content": "You are a classifier that determines if a message is related to Brazilian Jiu-Jitsu (BJJ). Score the message on a scale of 0-100 where 0-49 means not primarily BJJ-related and 50-100 means primarily BJJ-related. Consider BJJ topics: techniques, positions, submissions, training methods, competition strategies, BJJ terminology. Respond with only a number between 0 and 100."
    },
    {
      "role": "user",
      "content": "{user_message}"
    }
  ],
  "temperature": 0.3,
  "max_tokens": 10
}
```

**Response**:
```json
{
  "id": "chatcmpl-...",
  "object": "chat.completion",
  "created": 1234567890,
  "model": "gpt-3.5-turbo",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "85"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 150,
    "completion_tokens": 1,
    "total_tokens": 151
  }
}
```

**Response Processing**:
- Extract score from `choices[0].message.content`
- Parse as integer (0-100)
- If score >= 50, proceed to response generation
- If score < 50, silently skip response generation

**Error Handling**:
- Network errors: Retry up to 2 times with exponential backoff
- API errors (4xx/5xx): Log error, skip response generation silently
- Timeout: Treat as timeout scenario, display timeout notification

### Endpoint 2: Sports Science Response Generation

**Purpose**: Generate sports science explanation for BJJ-related question

**Endpoint**: `POST https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions`

**Request Headers**:
```
Authorization: Bearer {API_KEY}
Content-Type: application/json
```

**Request Body**:
```json
{
  "model": "gpt-3.5-turbo",
  "messages": [
    {
      "role": "system",
      "content": "You are a sports science coach specializing in Brazilian Jiu-Jitsu. Provide clear, accurate explanations of BJJ techniques, positions, and training methods from a sports science perspective. Focus on biomechanics, physiology, and exercise science principles. Keep responses concise and informative. Maximum 2000 characters."
    },
    {
      "role": "user",
      "content": "{user_message}"
    }
  ],
  "temperature": 0.7,
  "max_tokens": 500
}
```

**Response**:
```json
{
  "id": "chatcmpl-...",
  "object": "chat.completion",
  "created": 1234567890,
  "model": "gpt-3.5-turbo",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "The armbar (juji-gatame) involves hyperextension of the elbow joint..."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 200,
    "completion_tokens": 150,
    "total_tokens": 350
  }
}
```

**Response Processing**:
- Extract text from `choices[0].message.content`
- Truncate to 2000 characters if needed (at word boundary)
- Add ellipsis if truncated
- Display as agent response in chat

**Error Handling**:
- Network errors: Retry up to 2 times with exponential backoff
- API errors (4xx/5xx): Log error, skip response generation silently
- Timeout: Display timeout notification message

## Internal Service Contracts

### BJJ Detection Service

**Module**: `services/bjj-detection-service.ts`

**Function**: `detectBJJRelevance(message: string): Promise<number>`

**Input**:
- `message`: User message text (string)

**Output**:
- `Promise<number>`: BJJ relevance score (0-100)

**Errors**:
- Throws `DetectionError` on API failure
- Returns 0 on network timeout (treated as non-BJJ)

### Agent Response Service

**Module**: `services/agent-response-service.ts`

**Function**: `generateResponse(message: string): Promise<string>`

**Input**:
- `message`: User message text (string)

**Output**:
- `Promise<string>`: Agent response text (max 2000 characters)

**Errors**:
- Throws `ResponseError` on API failure
- Throws `TimeoutError` if exceeds 10 seconds

### Chat Dialog Integration

**Component**: `components/chat-dialog.tsx`

**Function**: `handleAgentProcessing(message: Message): Promise<void>`

**Flow**:
1. User sends message
2. Trigger BJJ detection
3. If score >= 50:
   - Show loading indicator
   - Generate agent response
   - Replace loading with response
4. If score < 50:
   - Silently skip (no response)
5. Handle timeouts and errors

## Rate Limiting

- DashScope API rate limits apply
- Implement request queuing for concurrent messages
- Respect rate limits to avoid API errors
- Consider implementing local caching for repeated questions (future enhancement)

## Timeout Configuration

- **Detection Timeout**: 5 seconds
- **Response Generation Timeout**: 10 seconds
- **Overall Timeout**: 10 seconds (from user message to response display)

## Security Considerations

- API key stored in environment variables, never in code
- API key not exposed to client-side code (if using backend proxy)
- Consider using backend proxy for production to protect API keys
- Implement request validation to prevent abuse

## Environment Variables

- `EXPO_PUBLIC_DASHSCOPE_API_KEY`: DashScope API key (required)
- `EXPO_PUBLIC_DASHSCOPE_BASE_URL`: Base URL (optional, defaults to Beijing region)
- `EXPO_PUBLIC_DASHSCOPE_MODEL`: Model name (optional, defaults to qwen-turbo for detection, qwen-plus for generation)

