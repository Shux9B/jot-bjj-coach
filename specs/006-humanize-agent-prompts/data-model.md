# Data Model: Humanize Agent Prompts

## Overview

This feature does not introduce new data entities or modify existing data models. The implementation only updates prompt content stored in centralized prompt management locations. All existing data models remain unchanged.

## Existing Entities (No Changes)

### Message Entity
- **Status**: No changes required
- **Description**: Existing `Message` interface continues to be used as-is
- **Fields**: All existing fields remain unchanged (id, text, sender, agentType, etc.)

### Agent Response Entity
- **Status**: No changes required
- **Description**: Agent responses continue to use existing structure
- **Fields**: Response text format remains the same, only content style changes

## Prompt Metadata (Updated)

### Prompt File Structure
Each prompt file contains metadata that will be updated:

```typescript
interface PromptMetadata {
  purpose: string;           // Purpose of the prompt
  targetAgent: string;       // Target agent (DashScope Qwen models)
  version: string;           // Version number (will be incremented)
  lastModified: string;      // Last modified date (will be updated)
  usageContext?: string;     // Optional usage context
}
```

### Version Updates
- **Science Coach Prompt**: 1.0.0 → 1.1.0
- **Technique Coach Prompt**: 1.0.0 → 1.1.0
- **Tactics Coach Prompt**: 1.0.0 → 1.1.0

## Prompt Constants (Updated)

### Prompt Loader Constants
Constants in `services/prompt-loader.ts` will be updated:

```typescript
// Updated constants (content changes, structure unchanged)
export const SPORTS_SCIENCE_COACH_PROMPT = `...`;  // Updated content
export const TECHNIQUE_COACH_PROMPT = `...`;       // Updated content
export const TACTICS_COACH_PROMPT = `...`;         // Updated content
```

## State Transitions

### No State Changes
- No new state variables introduced
- No state transitions modified
- All existing state management remains unchanged

## Validation Rules

### Prompt Content Validation
- Prompt content must maintain technical accuracy
- Humanized style must be appropriate for coaching context
- Chinese language must be natural and culturally appropriate
- Response length limits (2000 characters) must be maintained

### Backward Compatibility
- All existing validation rules remain unchanged
- Message validation continues as before
- Response validation continues as before

## Relationships

### No New Relationships
- No new relationships between entities
- Existing relationships remain unchanged
- Prompt-to-service relationship unchanged (only content updated)

## Constraints

1. **Prompt Content**: Must maintain technical accuracy while being more humanized
2. **Language**: Must remain in Chinese (Simplified) with natural expressions
3. **Length**: Response length limits (2000 characters) must be maintained
4. **Backward Compatibility**: All existing functional behaviors must remain unchanged

## Example Data

### Updated Prompt Content (Example)
```
# Science Coach Prompt (Humanized)

You are a sports science coach specializing in Brazilian Jiu-Jitsu. 
I'm here to help you understand BJJ techniques from a sports science perspective, 
focusing on biomechanics, physiology, and exercise science principles.

When explaining techniques, I'll use clear, accessible language while maintaining 
scientific accuracy. I want to make sure you understand not just what to do, 
but why it works from a scientific standpoint.

Remember, understanding the science behind techniques can help you train more 
effectively and avoid injuries. Let's explore how your body moves and responds 
during BJJ training.

IMPORTANT: All responses must be in Chinese (Simplified).
```

### Response Example (Humanized)
```
关于这个问题，让我从运动科学的角度来帮你理解。

在巴西柔术中，这个技术涉及到几个重要的生物力学原理。首先，你的身体需要...
记住，理解这些原理可以帮助你更有效地训练，同时避免受伤。

如果你有任何疑问，随时可以问我！
```

## Implementation Notes

- No database schema changes required
- No API contract changes required
- No data migration needed
- Only prompt content files need to be updated
- Prompt loader constants need to be updated
- All existing data structures remain unchanged

