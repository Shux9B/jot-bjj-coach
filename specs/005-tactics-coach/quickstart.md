# Quick Start Guide: BJJ Tactics Coach Agent Implementation

## Prerequisites

- Existing chat dialog component (001-chat-dialog) must be functional
- Technique coach agent (004-bjj-technique-coach) must be functional
- Science coach agent (002-science-coach-agent) must be functional
- Sender display name system (003-sender-display-names) must be functional
- DashScope (阿里百炼) API key (reuse from other coaches setup)
- Expo development environment set up

## File Structure

```
.specify/
  prompts/
    005-tactics-coach/
      tactics-coach-prompt.md    # Tactics coach response prompt
      README.md                   # Prompt metadata

services/
  tactics-coach-service.ts       # Tactics coach response generation service (new)
  technique-coach-service.ts     # Technique coach service (existing)
  agent-response-service.ts      # Science coach service (existing)
  bjj-detection-service.ts       # BJJ question detection service (existing, reused)
  openai-client.ts               # OpenAI API client wrapper (existing, reused)
  prompt-loader.ts               # Prompt loading utility (existing, extended)

components/
  chat-dialog.tsx                # Extended chat dialog (existing, modified)

utils/
  response-truncation.ts         # Response truncation utility (existing, reused)
  sender-name-utils.ts          # Sender name utility (existing, extended)

types/
  chat.ts                        # Message interface (existing, supports agentType)
```

## Implementation Steps

### Step 1: Verify Existing Setup

Ensure the following are already set up (from 002 and 004):

1. **Environment Variables**: `.env` file with `EXPO_PUBLIC_DASHSCOPE_API_KEY`
2. **Dependencies**: `openai` package installed
3. **BJJ Detection Service**: `services/bjj-detection-service.ts` exists and works
4. **OpenAI Client**: `services/openai-client.ts` exists and works
5. **Sender Name System**: `utils/sender-name-utils.ts` exists and supports agentType mapping
6. **Technique Coach**: `services/technique-coach-service.ts` exists and works
7. **Science Coach**: `services/agent-response-service.ts` exists and works

### Step 2: Create Tactics Coach Prompt

Create `.specify/prompts/005-tactics-coach/tactics-coach-prompt.md`:

```markdown
# Tactics Coach Prompt

**Purpose**: Generate tactical and strategic guidance for BJJ questions
**Target Agent**: DashScope Qwen models (qwen-plus)
**Version**: 1.0.0
**Last Modified**: 2026-01-02

## Prompt

You are a Brazilian Jiu-Jitsu tactics and strategy coach. Your role is to provide strategic and tactical guidance on BJJ techniques, focusing on:

1. **Tactical Applications**: When and how to apply techniques in competitive scenarios
2. **Strategic Thinking**: Strategic decision-making and match management
3. **Competition Strategies**: How to set up attacks, counter opponent strategies, and manage position transitions
4. **Tactical Considerations**: Timing, positioning, and tactical decision-making in competitive situations

Your responses should be:
- Strategic and tactical
- Focused on competitive applications
- Clear about tactical considerations and strategic thinking
- Competition-oriented
- Concise (aim for 2000 characters or less)

IMPORTANT: All responses must be in Chinese (Simplified).

Provide guidance that helps practitioners understand how to apply techniques strategically in competitive scenarios.
```

### Step 3: Extend Prompt Loader

Update `services/prompt-loader.ts` to include tactics coach prompt loading:

```typescript
// Add new constant
export const TACTICS_COACH_PROMPT = `...`; // Prompt content from tactics-coach-prompt.md

// Add new function
export function loadTacticsCoachPrompt(): string {
  return TACTICS_COACH_PROMPT;
}
```

### Step 4: Create Tactics Coach Service

Create `services/tactics-coach-service.ts`:

```typescript
import { truncateResponse } from '@/utils/response-truncation';
import openai from './openai-client';
import { loadTacticsCoachPrompt } from './prompt-loader';

/**
 * Generates a tactics-focused explanation for a BJJ-related question
 * @param message - User's BJJ-related question
 * @returns Promise<string> - Agent response (truncated to 2000 characters)
 * @throws Error if generation fails or times out
 */
export async function generateTacticsCoachResponse(message: string): Promise<string> {
  try {
    const systemPrompt = loadTacticsCoachPrompt();
    
    // Set up timeout (10 seconds)
    const timeoutPromise = new Promise<string>((_, reject) => {
      setTimeout(() => reject(new Error('Response generation timeout')), 10000);
    });
    
    // Use Qwen model for DashScope (阿里百炼)
    const model = process.env.EXPO_PUBLIC_DASHSCOPE_MODEL || 'qwen-plus';
    
    const generationPromise = openai.chat.completions.create({
      model: model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
      temperature: 0.7,
      max_tokens: 500,
    }).then(response => {
      const responseText = response.choices[0]?.message?.content || '';
      // Truncate to 2000 characters
      return truncateResponse(responseText, 2000);
    });
    
    // Race between generation and timeout
    const response = await Promise.race([generationPromise, timeoutPromise]);
    return response;
  } catch (error) {
    // Log error for debugging
    console.error('[Tactics Coach] Error:', error instanceof Error ? error.message : 'Unknown error', {
      message: message.substring(0, 50) + '...',
      timestamp: new Date().toISOString()
    });
    
    // Re-throw error for caller to handle
    if (error instanceof Error && error.message.includes('timeout')) {
      throw new Error('Response generation timeout');
    }
    throw new Error(`Tactics coach response generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
```

### Step 5: Update Sender Name Utility

Verify `utils/sender-name-utils.ts` maps 'tactics-coach' to '战术教练':

```typescript
const AGENT_NAME_MAP: Record<string, string> = {
  'sports-science': '运动健康助理',
  'technique-coach': '技术教练',
  'tactics-coach': '战术教练', // Add this mapping
};
```

### Step 6: Extend Chat Dialog Component

Update `components/chat-dialog.tsx` to integrate tactics coach after science coach:

```typescript
import { generateTacticsCoachResponse } from '@/services/tactics-coach-service';

const triggerScienceCoachResponse = async (userText: string, score: number) => {
  // ... existing science coach logic ...
  
  try {
    // Generate science coach response with timeout handling
    const scienceResponseText = await Promise.race([
      generateResponse(userText),
      new Promise<string>((_, reject) => {
        setTimeout(() => reject(new Error('Timeout')), 10000);
      })
    ]);
    
    // Remove loading indicator and add science coach response
    setMessages(prev => {
      const withoutLoading = prev.filter(m => m.id !== scienceLoadingId);
      return [...withoutLoading, {
        id: generateMessageId(),
        text: scienceResponseText,
        sender: 'other',
        agentType: 'sports-science',
        bjjRelevanceScore: score
      }];
    });
    
    // Trigger tactics coach response after science coach completes successfully
    triggerTacticsCoachResponse(userText, score);
  } catch (error) {
    // Handle science coach timeout or generation error
    // Do NOT trigger tactics coach on science coach failure/timeout
    setMessages(prev => {
      const withoutLoading = prev.filter(m => m.id !== scienceLoadingId);
      return [...withoutLoading, {
        id: generateMessageId(),
        text: 'Response timeout. Please try again.',
        sender: 'other',
        isSystemMessage: true,
        agentType: 'sports-science'
      }];
    });
  }
};

const triggerTacticsCoachResponse = async (userText: string, score: number) => {
  // Add loading indicator for tactics coach
  const tacticsLoadingId = generateMessageId();
  const tacticsLoadingMessage: Message = {
    id: tacticsLoadingId,
    text: '',
    sender: 'other',
    isLoading: true,
    agentType: 'tactics-coach'
  };
  setMessages(prev => [...prev, tacticsLoadingMessage]);
  
  try {
    // Generate tactics coach response with timeout handling
    const tacticsResponseText = await Promise.race([
      generateTacticsCoachResponse(userText),
      new Promise<string>((_, reject) => {
        setTimeout(() => reject(new Error('Timeout')), 10000);
      })
    ]);
    
    // Remove loading indicator and add tactics coach response
    setMessages(prev => {
      const withoutLoading = prev.filter(m => m.id !== tacticsLoadingId);
      return [...withoutLoading, {
        id: generateMessageId(),
        text: tacticsResponseText,
        sender: 'other',
        agentType: 'tactics-coach',
        bjjRelevanceScore: score
      }];
    });
  } catch (error) {
    // Handle tactics coach timeout or generation error
    setMessages(prev => {
      const withoutLoading = prev.filter(m => m.id !== tacticsLoadingId);
      return [...withoutLoading, {
        id: generateMessageId(),
        text: 'Response timeout. Please try again.',
        sender: 'other',
        isSystemMessage: true,
        agentType: 'tactics-coach'
      }];
    });
  }
};
```

## Testing

### Test Cases

1. **Three-Coach Response Sequence**
   - Send "How should I approach the guard position in competition?" → Should show technique coach loading → Technique coach response → Science coach loading → Science coach response → Tactics coach loading → Tactics coach response
   - Verify all three responses appear in correct order: technique coach → science coach → tactics coach
   - Verify sender names: "技术教练", "运动健康助理", "战术教练"

2. **Conditional Triggering**
   - Simulate technique coach failure → Should NOT trigger science coach or tactics coach
   - Simulate science coach failure → Should NOT trigger tactics coach
   - Verify tactics coach only triggers when both technique coach and science coach succeed

3. **Shared BJJ Detection**
   - Send BJJ question → Verify single detection call shared between all three coaches
   - Verify all coaches use same `bjjRelevanceScore`

4. **Non-BJJ Questions**
   - Send non-BJJ question → Should show informative message only (no coach responses)

5. **Concurrent Messages**
   - Send multiple BJJ questions rapidly → Each should get independent three-coach sequence
   - Verify responses appear in chronological order

## Environment Setup

No additional environment setup needed - reuses existing DashScope API configuration from other coaches setup.

## Troubleshooting

**Issue**: Tactics coach responses not appearing
- **Solution**: Check console for errors, verify prompt is loaded correctly, check API key is valid, verify both technique coach and science coach completed successfully

**Issue**: Tactics coach triggered even when previous coaches fail
- **Solution**: Verify conditional logic: tactics coach only triggered when both technique coach and science coach complete successfully

**Issue**: Sender names not displaying correctly
- **Solution**: Verify `sender-name-utils.ts` includes 'tactics-coach' → '战术教练' mapping

**Issue**: Responses appearing in wrong order
- **Solution**: Ensure tactics coach response is added after science coach response, use message timestamps for ordering

