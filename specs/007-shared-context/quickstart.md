# Quick Start Guide: Shared Context Between Agents

## Prerequisites

- Existing agent response generation services must be functional
- Chat dialog component (001-chat-dialog) must be functional
- DashScope (阿里百炼) API key must be configured
- Prompt management system must be functional

## File Structure

```
services/
  response-summary-service.ts      # New: Summary generation service
  agent-response-service.ts         # Modified: Add context parameter
  tactics-coach-service.ts          # Modified: Add context parameter
  technique-coach-service.ts       # Unchanged: First agent, no context
  openai-client.ts                  # Existing: Reused
  prompt-loader.ts                  # Existing: Reused

components/
  chat-dialog.tsx                  # Modified: Pass context between agents

.specify/
  prompts/
    002-science-coach-agent/
      sports-science-coach-prompt.md  # Modified: Add duplicate prevention instructions
    005-tactics-coach/
      tactics-coach-prompt.md         # Modified: Add duplicate prevention instructions
```

## Implementation Steps

### Step 1: Create Summary Generation Service

Create `services/response-summary-service.ts`:

```typescript
import openai from './openai-client';

const SUMMARY_PROMPT = `You are a summarization assistant. Generate a concise summary of the following response that preserves key information needed to understand what has been covered. Focus on main points and important details. Keep summary to 20-30% of original length.

IMPORTANT: All summaries must be in Chinese (Simplified).`;

export async function generateResponseSummary(response: string): Promise<string> {
  try {
    const timeoutPromise = new Promise<string>((_, reject) => {
      setTimeout(() => reject(new Error('Summary generation timeout')), 5000);
    });
    
    const model = process.env.EXPO_PUBLIC_DASHSCOPE_MODEL || 'qwen-plus';
    
    const generationPromise = openai.chat.completions.create({
      model: model,
      messages: [
        { role: 'system', content: SUMMARY_PROMPT },
        { role: 'user', content: response },
      ],
      temperature: 0.5,
      max_tokens: 200,
    }).then(response => {
      return response.choices[0]?.message?.content || '';
    });
    
    return await Promise.race([generationPromise, timeoutPromise]);
  } catch (error) {
    console.error('[Summary Service] Error:', error);
    throw new Error(`Summary generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export function estimateTokenCount(text: string): number {
  // Rough estimation: 1 token ≈ 4 characters for Chinese
  return Math.ceil(text.length / 4);
}

export function checkNeedsSummary(context: string[], systemPrompt: string, userQuestion: string, maxTokens: number = 3000): boolean {
  const totalLength = systemPrompt.length + 
    context.reduce((sum, r) => sum + r.length, 0) + 
    userQuestion.length;
  return estimateTokenCount(totalLength.toString()) > maxTokens;
}
```

### Step 2: Update Science Coach Service

Modify `services/agent-response-service.ts`:

```typescript
import { generateResponseSummary, checkNeedsSummary } from './response-summary-service';

export async function generateResponse(
  message: string,
  previousResponses?: string[]
): Promise<string> {
  try {
    const systemPrompt = loadSportsScienceCoachPrompt();
    
    // Build messages array with context
    const messages: Array<{role: string, content: string}> = [
      { role: 'system', content: systemPrompt },
    ];
    
    // Add previous responses as context if available
    if (previousResponses && previousResponses.length > 0) {
      // Check if summaries needed
      const needsSummary = checkNeedsSummary(previousResponses, systemPrompt, message);
      
      if (needsSummary) {
        // Generate summaries
        const summaries = await Promise.all(
          previousResponses.map(r => generateResponseSummary(r))
        );
        summaries.forEach(summary => {
          messages.push({ role: 'assistant', content: summary });
        });
      } else {
        // Use full responses
        previousResponses.forEach(response => {
          messages.push({ role: 'assistant', content: response });
        });
      }
    }
    
    // Add user question
    messages.push({ role: 'user', content: message });
    
    // ... rest of existing implementation using messages array
  } catch (error) {
    // ... existing error handling
  }
}
```

### Step 3: Update Tactics Coach Service

Modify `services/tactics-coach-service.ts` similarly to add `previousResponses` parameter and context passing logic.

### Step 4: Update Agent Prompts

Update `.specify/prompts/002-science-coach-agent/sports-science-coach-prompt.md`:

```markdown
# Sports Science Coach Prompt

**Version**: 1.2.0  # Updated from 1.1.0

## Prompt

You are a sports science coach specializing in Brazilian Jiu-Jitsu. I'm here to help you understand BJJ techniques from a sports science perspective, focusing on biomechanics, physiology, and exercise science principles.

**IMPORTANT - Context Awareness**: If you receive previous responses from other coaches in the conversation, please:
- Avoid repeating information already covered by previous coaches
- Focus on your unique expertise (biomechanics, physiology, exercise science) that hasn't been covered
- Complement previous responses rather than duplicating them
- Acknowledge what has been covered when relevant, but don't repeat it

When explaining techniques, I'll use clear, accessible language while maintaining scientific accuracy...

[rest of existing prompt]
```

Update `.specify/prompts/005-tactics-coach/tactics-coach-prompt.md` similarly.

### Step 5: Update Chat Dialog Component

Modify `components/chat-dialog.tsx`:

```typescript
// Store technique coach response
let techniqueCoachResponse: string | undefined;

// In processAgentResponse, after technique coach succeeds:
techniqueCoachResponse = techniqueResponseText;

// Update triggerScienceCoachResponse signature
const triggerScienceCoachResponse = async (
  userText: string, 
  score: number, 
  techniqueCoachSucceeded: boolean,
  techniqueCoachResponse?: string
) => {
  // ... existing loading indicator logic
  
  try {
    const context = techniqueCoachSucceeded && techniqueCoachResponse
      ? [techniqueCoachResponse]
      : undefined;
    
    const scienceResponseText = await Promise.race([
      generateResponse(userText, context),
      // ... timeout handling
    ]);
    
    // Store science coach response
    const scienceCoachResponse = scienceResponseText;
    
    // Trigger tactics coach with both contexts
    if (techniqueCoachSucceeded) {
      triggerTacticsCoachResponse(userText, score, techniqueCoachResponse, scienceCoachResponse);
    }
  } catch (error) {
    // ... error handling
  }
};

// Update triggerTacticsCoachResponse signature
const triggerTacticsCoachResponse = async (
  userText: string,
  score: number,
  techniqueCoachResponse?: string,
  scienceCoachResponse?: string
) => {
  // ... existing loading indicator logic
  
  try {
    const context = techniqueCoachResponse && scienceCoachResponse
      ? [techniqueCoachResponse, scienceCoachResponse]
      : undefined;
    
    const tacticsResponseText = await Promise.race([
      generateTacticsCoachResponse(userText, context),
      // ... timeout handling
    ]);
    
    // ... display response
  } catch (error) {
    // ... error handling
  }
};
```

## Testing

### Test Cases

1. **Context Passing**
   - Send BJJ question → Verify science coach receives technique coach response as context
   - Verify tactics coach receives both previous responses as context
   - Verify context only passed when previous agents succeeded

2. **Duplicate Prevention**
   - Send BJJ question → Verify subsequent agents avoid repeating previous information
   - Verify responses complement each other
   - Verify responses remain informative

3. **Failure Handling**
   - Simulate technique coach failure → Verify science coach receives no context
   - Simulate science coach failure → Verify tactics coach receives only technique coach context
   - Verify fallback behavior works correctly

4. **Summary Generation**
   - Send question that generates long responses → Verify summaries generated when needed
   - Verify summaries preserve key information
   - Verify duplicate prevention works with summaries

5. **Backward Compatibility**
   - Verify response sequence unchanged
   - Verify conditional triggering unchanged
   - Verify error handling unchanged

## Environment Setup

No additional environment setup needed - reuses existing DashScope API configuration.

## Troubleshooting

**Issue**: Context not being passed
- **Solution**: Check that previous agents succeeded, verify context parameter is passed correctly

**Issue**: Duplicate information still appearing
- **Solution**: Review prompt instructions, verify context is being received by agents

**Issue**: Summary generation failing
- **Solution**: Check API key, verify summary service is working, check timeout settings

**Issue**: Performance degradation
- **Solution**: Optimize summary generation, check token estimation accuracy, consider caching

