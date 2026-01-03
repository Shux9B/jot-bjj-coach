# Data Model: Shared Context Between Agents

## Overview

This feature extends the existing agent response generation services to support context sharing between multiple agents. The implementation adds context parameters to service functions and introduces a summary generation service for handling long contexts.

## Extended Service Function Signatures

### Agent Response Service Functions

```typescript
// Technique Coach Service (unchanged - first agent, no context)
function generateTechniqueCoachResponse(message: string): Promise<string>

// Science Coach Service (extended - receives technique coach response as context)
function generateResponse(
  message: string, 
  previousResponses?: string[]
): Promise<string>

// Tactics Coach Service (extended - receives both previous responses as context)
function generateTacticsCoachResponse(
  message: string,
  previousResponses?: string[]
): Promise<string>
```

### Summary Generation Service

```typescript
// New service for generating summaries
function generateResponseSummary(response: string): Promise<string>
```

## Context Data Structure

### Context Passing Format

```typescript
interface ContextMessage {
  role: 'assistant';
  content: string; // Previous agent response text or summary
}

// Example API message array structure:
const messages = [
  { role: 'system', content: systemPrompt },
  { role: 'assistant', content: techniqueCoachResponse }, // Context from technique coach
  { role: 'assistant', content: scienceCoachResponse },    // Context from science coach (for tactics coach)
  { role: 'user', content: userQuestion }
];
```

### Context State

```typescript
interface AgentContext {
  previousResponses: string[];      // Array of previous agent responses
  hasContext: boolean;               // Whether context is available
  needsSummary: boolean;             // Whether context needs summarization
  summaries?: string[];              // Generated summaries if needed
}
```

## State Transitions

### Technique Coach Response Generation

```typescript
// Initial state: No context (first agent)
const context: AgentContext = {
  previousResponses: [],
  hasContext: false,
  needsSummary: false
};

// Generate response
const techniqueResponse = await generateTechniqueCoachResponse(userText);

// Store response for context sharing
const storedResponse = techniqueResponse;
```

### Science Coach Response Generation

```typescript
// State: Has technique coach response as context
const context: AgentContext = {
  previousResponses: [techniqueResponse], // Only if technique coach succeeded
  hasContext: techniqueCoachSucceeded,
  needsSummary: false // Check if summary needed
};

// Check token limits
if (contextExceedsTokenLimit(context)) {
  context.needsSummary = true;
  context.summaries = [await generateResponseSummary(techniqueResponse)];
}

// Generate response with context
const scienceResponse = await generateResponse(
  userText,
  context.hasContext ? (context.summaries || context.previousResponses) : undefined
);
```

### Tactics Coach Response Generation

```typescript
// State: Has both previous responses as context
const context: AgentContext = {
  previousResponses: [techniqueResponse, scienceResponse], // Only if both succeeded
  hasContext: techniqueCoachSucceeded && scienceCoachSucceeded,
  needsSummary: false // Check if summary needed
};

// Check token limits
if (contextExceedsTokenLimit(context)) {
  context.needsSummary = true;
  context.summaries = await Promise.all(
    context.previousResponses.map(r => generateResponseSummary(r))
  );
}

// Generate response with context
const tacticsResponse = await generateTacticsCoachResponse(
  userText,
  context.hasContext ? (context.summaries || context.previousResponses) : undefined
);
```

## Validation Rules

### Context Validation

1. **Response Success Check**
   - Only successful responses can be passed as context
   - Failed or timed-out responses must not be included
   - Check response completion status before passing

2. **Context Length Validation**
   - Total context length (system prompt + previous responses + user question) must not exceed token limits
   - If exceeds limit, generate summaries
   - Summaries must preserve key information

3. **Context Ordering**
   - Previous responses must be added in chronological order
   - Technique coach response before science coach response
   - Both before tactics coach response

4. **Summary Quality**
   - Summaries must preserve key information for duplicate prevention
   - Summaries should be 20-30% of original length
   - Summaries must maintain semantic meaning

## Relationships

### Agent Response Flow

```
User Question
    ↓
Technique Coach (no context)
    ↓
Technique Coach Response (stored)
    ↓
Science Coach (receives technique coach response as context)
    ↓
Science Coach Response (stored)
    ↓
Tactics Coach (receives both previous responses as context)
    ↓
Tactics Coach Response
```

### Context Dependency

- Science coach context depends on technique coach success
- Tactics coach context depends on both technique coach and science coach success
- If any previous agent fails, subsequent agents receive no context from failed agent

## Constraints

1. **Context Availability**: Context only available if previous agents succeeded
2. **Token Limits**: Context must not exceed API token limits
3. **Response Order**: Context must be passed in chronological order
4. **Summary Quality**: Summaries must preserve information for duplicate prevention
5. **Backward Compatibility**: Services must work without context (fallback behavior)

## Example Data

### Context Passing Example

```typescript
// Technique coach response
const techniqueResponse = "当使用这个技术时，注意保持正确的姿势...";

// Science coach receives context
const scienceContext = [techniqueResponse];
const scienceResponse = await generateResponse(userText, scienceContext);

// Tactics coach receives both contexts
const tacticsContext = [techniqueResponse, scienceResponse];
const tacticsResponse = await generateTacticsCoachResponse(userText, tacticsContext);
```

### Summary Generation Example

```typescript
// Long response that needs summarization
const longResponse = "这是一个很长的响应，包含很多详细信息..."; // 2000+ characters

// Generate summary
const summary = await generateResponseSummary(longResponse);
// Result: "技术教练提到：注意姿势、安全考虑、常见错误..." // ~500 characters

// Use summary as context
const context = [summary];
```

## Implementation Notes

- Context passing is optional (services work without context)
- Summary generation is only triggered when context exceeds token limits
- All existing data structures remain unchanged
- Only service function signatures are extended (optional parameters)
- Message entity structure remains unchanged

