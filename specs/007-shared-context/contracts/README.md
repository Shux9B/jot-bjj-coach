# API Contracts: Shared Context Between Agents

## Overview

This feature extends existing agent response generation services to support context sharing. The implementation modifies service function signatures to accept optional context parameters and adds a new summary generation service.

## Internal Service Contracts

### Agent Response Services (Extended)

**Services**: 
- `services/agent-response-service.ts` (Science Coach)
- `services/tactics-coach-service.ts` (Tactics Coach)
- `services/technique-coach-service.ts` (Technique Coach - unchanged)

**Function Signatures**:

```typescript
// Science Coach (extended)
export async function generateResponse(
  message: string,
  previousResponses?: string[]
): Promise<string>

// Tactics Coach (extended)
export async function generateTacticsCoachResponse(
  message: string,
  previousResponses?: string[]
): Promise<string>

// Technique Coach (unchanged - first agent)
export async function generateTechniqueCoachResponse(
  message: string
): Promise<string>
```

**Input**:
- `message: string` - User's BJJ-related question
- `previousResponses?: string[]` - Optional array of previous agent responses (or summaries)

**Output**:
- `Promise<string>` - Agent response (truncated to 2000 characters)

**Behavior**:
- If `previousResponses` provided, add them to API message array as assistant messages
- If `previousResponses` not provided, use current behavior (no context)
- Maintain existing timeout and error handling

### Summary Generation Service (New)

**Service**: `services/response-summary-service.ts`

**Function**: `generateResponseSummary(response: string): Promise<string>`

**Input**:
- `response: string` - Previous agent response to summarize

**Output**:
- `Promise<string>` - Summary of response (preserves key information)

**Errors**:
- `Error('Summary generation timeout')` - If generation exceeds timeout
- `Error('Summary generation failed: ...')` - For other failures

**Behavior**:
- Uses DashScope API with Qwen models
- Generates concise summary preserving key information
- Optimized for duplicate prevention needs
- Times out after reasonable duration (e.g., 5 seconds)

## External API Contracts

### DashScope (阿里百炼) API

**Endpoint**: `https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions`

**Request Format (with context)**:
```json
{
  "model": "qwen-plus",
  "messages": [
    { "role": "system", "content": "<agent prompt>" },
    { "role": "assistant", "content": "<previous response 1>" },
    { "role": "assistant", "content": "<previous response 2>" },
    { "role": "user", "content": "<user question>" }
  ],
  "temperature": 0.7,
  "max_tokens": 500
}
```

**Request Format (summary generation)**:
```json
{
  "model": "qwen-plus",
  "messages": [
    { "role": "system", "content": "<summary prompt>" },
    { "role": "user", "content": "<response to summarize>" }
  ],
  "temperature": 0.5,
  "max_tokens": 200
}
```

**Response Format**: Unchanged
```json
{
  "choices": [
    {
      "message": {
        "content": "<agent response or summary>"
      }
    }
  ]
}
```

## Chat Dialog Component Integration

**Component**: `components/chat-dialog.tsx`

**Function Modifications**:

```typescript
// triggerScienceCoachResponse - Extended
const triggerScienceCoachResponse = async (
  userText: string, 
  score: number, 
  techniqueCoachSucceeded: boolean,
  techniqueCoachResponse?: string  // New parameter
) => {
  // Pass technique coach response as context if available
  const context = techniqueCoachSucceeded && techniqueCoachResponse 
    ? [techniqueCoachResponse] 
    : undefined;
  
  const scienceResponseText = await generateResponse(userText, context);
  // ... rest of function
};

// triggerTacticsCoachResponse - Extended
const triggerTacticsCoachResponse = async (
  userText: string,
  score: number,
  techniqueCoachResponse?: string,  // New parameter
  scienceCoachResponse?: string     // New parameter
) => {
  // Pass both previous responses as context if available
  const context = techniqueCoachResponse && scienceCoachResponse
    ? [techniqueCoachResponse, scienceCoachResponse]
    : undefined;
  
  const tacticsResponseText = await generateTacticsCoachResponse(userText, context);
  // ... rest of function
};
```

## Context Passing Contract

### Context Format

```typescript
interface ContextData {
  responses: string[];        // Previous agent responses (or summaries)
  hasContext: boolean;        // Whether context is available
  needsSummary: boolean;      // Whether summaries are needed
}
```

### Context Passing Rules

1. **Success Check**: Only pass responses from successful agents
2. **Ordering**: Pass responses in chronological order (technique → science)
3. **Length Check**: Check token limits before passing
4. **Summary Generation**: Generate summaries if context exceeds limits
5. **Fallback**: If context unavailable, pass undefined (use current behavior)

## Summary Generation Contract

### Summary Service Interface

```typescript
interface SummaryService {
  generateSummary(response: string): Promise<string>;
  checkNeedsSummary(context: string[]): boolean;
  estimateTokenCount(text: string): number;
}
```

### Summary Quality Requirements

- Preserve key information for duplicate prevention
- Maintain semantic meaning
- Target 20-30% of original length
- Include main points and important details

## Error Handling Contracts

### Context Passing Failures

- **If context cannot be passed**: Fallback to current behavior (no context)
- **If summary generation fails**: Fallback to no context or truncated context
- **If token limit exceeded**: Generate summaries or fallback to no context
- **If API call fails**: Fallback to current behavior, maintain error handling

### Summary Generation Failures

- **If summary generation times out**: Fallback to truncated context or no context
- **If summary generation fails**: Fallback to no context
- **If summary quality is poor**: Still use summary, but log for improvement

## Data Flow

### Successful Context Sharing Flow

```
User Question
    ↓
Technique Coach (no context)
    ↓
Technique Coach Response (stored)
    ↓
Check Success → Pass as context
    ↓
Science Coach (receives context)
    ↓
Science Coach Response (stored)
    ↓
Check Success → Pass both as context
    ↓
Tactics Coach (receives both contexts)
    ↓
Tactics Coach Response
```

### Failure Handling Flow

```
User Question
    ↓
Technique Coach (no context)
    ↓
Technique Coach Fails/Timeouts
    ↓
Science Coach (no context - fallback)
    ↓
Science Coach Response (may succeed or fail)
    ↓
Tactics Coach (no context if technique failed, or only science context)
```

## Backward Compatibility

### Compatibility Guarantee

- **API Compatibility**: Service functions work without context (optional parameter)
- **Service Compatibility**: Existing calls without context continue to work
- **Data Compatibility**: All data structures remain unchanged
- **Functional Compatibility**: All functional behaviors remain unchanged

## Implementation Notes

- Context passing is optional (backward compatible)
- Summary generation only triggered when needed
- All existing contracts remain valid
- New contracts extend existing functionality
- Services automatically handle context availability

