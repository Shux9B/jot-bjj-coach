# API Contracts: Humanize Agent Prompts

## Overview

This feature does not introduce new API endpoints or modify existing API contracts. The implementation only updates prompt content, which affects the output of existing agent response generation services but does not change their interfaces or contracts.

## Existing Service Contracts (No Changes)

### Agent Response Services

**Services**: 
- `services/agent-response-service.ts` (Science Coach)
- `services/technique-coach-service.ts` (Technique Coach)
- `services/tactics-coach-service.ts` (Tactics Coach)

**Function Signatures**: No changes required
- `generateResponse(message: string): Promise<string>`
- `generateTechniqueCoachResponse(message: string): Promise<string>`
- `generateTacticsCoachResponse(message: string): Promise<string>`

**Input/Output**: No changes required
- Input: User message (string)
- Output: Agent response (string, truncated to 2000 characters)

**Behavior**: 
- Services continue to use same API (DashScope with Qwen models)
- Response generation logic unchanged
- Only prompt content is updated, affecting response style

## Prompt Loading Contract (No Changes)

### Prompt Loader Service

**Service**: `services/prompt-loader.ts`

**Functions**: No signature changes
- `loadSportsScienceCoachPrompt(): string`
- `loadTechniqueCoachPrompt(): string`
- `loadTacticsCoachPrompt(): string`

**Constants**: Content updated, structure unchanged
- `SPORTS_SCIENCE_COACH_PROMPT`: Updated content
- `TECHNIQUE_COACH_PROMPT`: Updated content
- `TACTICS_COACH_PROMPT`: Updated content

## External API Contracts (No Changes)

### DashScope (阿里百炼) API

**Endpoint**: `https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions`

**Request Format**: No changes
```json
{
  "model": "qwen-plus",
  "messages": [
    { "role": "system", "content": "<updated prompt>" },
    { "role": "user", "content": "<user question>" }
  ],
  "temperature": 0.7,
  "max_tokens": 500
}
```

**Response Format**: No changes
```json
{
  "choices": [
    {
      "message": {
        "content": "<humanized response>"
      }
    }
  ]
}
```

**Changes**: Only the system prompt content is updated, API contract remains the same

## Internal Service Contracts

### Prompt File Updates

**Files to Update**:
- `.specify/prompts/002-science-coach-agent/sports-science-coach-prompt.md`
- `.specify/prompts/004-bjj-technique-coach/technique-coach-prompt.md`
- `.specify/prompts/005-tactics-coach/tactics-coach-prompt.md`

**Update Contract**:
- Content: Update prompt text with humanized language
- Metadata: Update version (1.0.0 → 1.1.0) and last modified date
- Structure: Maintain existing file structure and metadata format

### Prompt Loader Updates

**File**: `services/prompt-loader.ts`

**Update Contract**:
- Constants: Update `SPORTS_SCIENCE_COACH_PROMPT`, `TECHNIQUE_COACH_PROMPT`, `TACTICS_COACH_PROMPT` with new content
- Functions: No function signature changes, only return updated content
- Structure: Maintain existing constant and function structure

## Response Format Contract (No Changes)

### Message Format

**Format**: No changes to message structure
```typescript
{
  id: string;
  text: string; // Humanized content, same structure
  sender: 'other';
  agentType: 'sports-science' | 'technique-coach' | 'tactics-coach';
  bjjRelevanceScore?: number;
}
```

**Changes**: Only the `text` content style changes (more humanized), structure unchanged

## Error Handling Contract (No Changes)

### Error Handling

**Behavior**: No changes to error handling
- Timeout handling: Unchanged (10 seconds)
- Error messages: Unchanged
- Failure recovery: Unchanged

## Data Flow

### Unchanged Flow

```
User Message
    ↓
BJJ Detection (unchanged)
    ↓
Agent Response Generation (unchanged logic, updated prompt)
    ↓
Humanized Response (updated style, same format)
    ↓
Message Display (unchanged)
```

**Changes**: Only prompt content in response generation step, all other steps unchanged

## Backward Compatibility

### Compatibility Guarantee

- **API Compatibility**: All existing API contracts remain unchanged
- **Service Compatibility**: All service interfaces remain unchanged
- **Data Compatibility**: All data structures remain unchanged
- **Functional Compatibility**: All functional behaviors remain unchanged

## Implementation Notes

- No new API endpoints required
- No API versioning needed
- No contract changes required
- Only prompt content updates needed
- All existing contracts remain valid
- Services automatically use updated prompts

