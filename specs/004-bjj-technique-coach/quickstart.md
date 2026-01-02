# Quick Start Guide: BJJ Technique Coach Agent Implementation

## Prerequisites

- Existing chat dialog component (001-chat-dialog) must be functional
- Science coach agent (002-science-coach-agent) must be functional
- Sender display name system (003-sender-display-names) must be functional
- DashScope (阿里百炼) API key (reuse from science coach setup)
- Expo development environment set up

## File Structure

```
.specify/
  prompts/
    004-bjj-technique-coach/
      technique-coach-prompt.md    # Technique coach response prompt
      README.md                     # Prompt metadata

services/
  technique-coach-service.ts       # Technique coach response generation service (new)
  bjj-detection-service.ts         # BJJ question detection service (existing, reused)
  agent-response-service.ts        # Science coach response service (existing)
  openai-client.ts                 # OpenAI API client wrapper (existing, reused)
  prompt-loader.ts                 # Prompt loading utility (existing, extended)

components/
  chat-dialog.tsx                  # Extended chat dialog (existing, modified)

utils/
  response-truncation.ts           # Response truncation utility (existing, reused)

types/
  chat.ts                          # Message interface (existing, supports agentType)
```

## Implementation Steps

### Step 1: Verify Existing Setup

Ensure the following are already set up (from 002-science-coach-agent):

1. **Environment Variables**: `.env` file with `EXPO_PUBLIC_DASHSCOPE_API_KEY`
2. **Dependencies**: `openai` package installed
3. **BJJ Detection Service**: `services/bjj-detection-service.ts` exists and works
4. **OpenAI Client**: `services/openai-client.ts` exists and works
5. **Sender Name System**: `utils/sender-name-utils.ts` exists and supports agentType mapping

### Step 2: Create Technique Coach Prompt

Create `.specify/prompts/004-bjj-technique-coach/technique-coach-prompt.md`:

```markdown
# Technique Coach Prompt

**Purpose**: Generate practical technique guidance for BJJ questions
**Target Agent**: DashScope Qwen models (qwen-plus)
**Version**: 1.0.0
**Last Modified**: 2026-01-02

## Prompt

You are a Brazilian Jiu-Jitsu technique coach. Your role is to provide practical, actionable guidance on BJJ techniques, focusing on:

1. **Practical Details**: Important details users should pay attention to when using the technique
2. **Usage Considerations**: When and how to apply the technique effectively
3. **Common Mistakes**: Typical errors practitioners make and how to avoid them
4. **Safety Considerations**: Important safety aspects and injury prevention

Your responses should be:
- Practical and actionable
- Focused on real-world application
- Clear about what to do and what to avoid
- Safety-conscious
- Concise (aim for 2000 characters or less)

Provide guidance that helps practitioners apply techniques correctly and safely.
```

### Step 3: Extend Prompt Loader

Update `services/prompt-loader.ts` to include technique coach prompt loading:

```typescript
// Add new function
export function loadTechniqueCoachPrompt(): string {
  // Load from .specify/prompts/004-bjj-technique-coach/technique-coach-prompt.md
  // Extract prompt from markdown
  // Return prompt text
}
```

### Step 4: Create Technique Coach Service

Create `services/technique-coach-service.ts`:

```typescript
import { truncateResponse } from '@/utils/response-truncation';
import openai from './openai-client';
import { loadTechniqueCoachPrompt } from './prompt-loader';

/**
 * Generates a technique-focused explanation for a BJJ-related question
 * @param message - User's BJJ-related question
 * @returns Promise<string> - Agent response (truncated to 2000 characters)
 * @throws Error if generation fails or times out
 */
export async function generateTechniqueCoachResponse(message: string): Promise<string> {
  try {
    const systemPrompt = loadTechniqueCoachPrompt();
    
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
    console.error('[Technique Coach] Error:', error instanceof Error ? error.message : 'Unknown error', {
      message: message.substring(0, 50) + '...',
      timestamp: new Date().toISOString()
    });
    
    // Re-throw error for caller to handle
    if (error instanceof Error && error.message.includes('timeout')) {
      throw new Error('Response generation timeout');
    }
    throw new Error(`Technique coach response generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
```

### Step 5: Update Sender Name Utility

Verify `utils/sender-name-utils.ts` maps 'technique-coach' to '技术教练':

```typescript
const senderNameMap: Record<string, string> = {
  'sports-science': '运动健康助理',
  'technique-coach': '技术教练', // Add this mapping
};

export function getSenderName(message: Message): string | null {
  if (message.sender === 'user') {
    return '本人';
  }
  if (message.agentType && senderNameMap[message.agentType]) {
    return senderNameMap[message.agentType];
  }
  return null; // Backward compatibility
}
```

### Step 6: Extend Chat Dialog Component

Update `components/chat-dialog.tsx` to integrate technique coach:

```typescript
import { generateTechniqueCoachResponse } from '@/services/technique-coach-service';
import { generateResponse } from '@/services/agent-response-service'; // Science coach
import { detectBJJRelevance } from '@/services/bjj-detection-service';

const processAgentResponse = async (userText: string, userMessageId: string) => {
  try {
    // Shared BJJ detection (reused from science coach)
    const score = await detectBJJRelevance(userText);
    
    // If not BJJ-related (score < 50), show informative message
    if (score < 50) {
      setMessages(prev => [...prev, {
        id: generateMessageId(),
        text: '我只能回答巴西柔术相关问题',
        sender: 'other',
        isSystemMessage: true,
        agentType: 'sports-science' // Use science coach for system messages
      }]);
      return;
    }
    
    // Add loading indicator for technique coach
    const techniqueLoadingId = generateMessageId();
    const techniqueLoadingMessage: Message = {
      id: techniqueLoadingId,
      text: '',
      sender: 'other',
      isLoading: true,
      agentType: 'technique-coach'
    };
    setMessages(prev => [...prev, techniqueLoadingMessage]);
    
    try {
      // Generate technique coach response with timeout handling
      const techniqueResponseText = await Promise.race([
        generateTechniqueCoachResponse(userText),
        new Promise<string>((_, reject) => {
          setTimeout(() => reject(new Error('Timeout')), 10000);
        })
      ]);
      
      // Remove loading indicator and add technique coach response
      setMessages(prev => {
        const withoutLoading = prev.filter(m => m.id !== techniqueLoadingId);
        return [...withoutLoading, {
          id: generateMessageId(),
          text: techniqueResponseText,
          sender: 'other',
          agentType: 'technique-coach',
          bjjRelevanceScore: score
        }];
      });
      
      // Trigger science coach response after technique coach completes
      triggerScienceCoachResponse(userText, score);
      
    } catch (error) {
      // Handle timeout or generation error for technique coach
      setMessages(prev => {
        const withoutLoading = prev.filter(m => m.id !== techniqueLoadingId);
        return [...withoutLoading, {
          id: generateMessageId(),
          text: 'Response timeout. Please try again.',
          sender: 'other',
          isSystemMessage: true,
          agentType: 'technique-coach'
        }];
      });
      
      // Still trigger science coach response on technique coach failure/timeout
      triggerScienceCoachResponse(userText, score);
    }
  } catch (error) {
    // Silently handle detection errors
    console.error('BJJ detection error:', error);
  }
};

const triggerScienceCoachResponse = async (userText: string, score: number) => {
  // Add loading indicator for science coach
  const scienceLoadingId = generateMessageId();
  const scienceLoadingMessage: Message = {
    id: scienceLoadingId,
    text: '',
    sender: 'other',
    isLoading: true,
    agentType: 'sports-science'
  };
  setMessages(prev => [...prev, scienceLoadingMessage]);
  
  try {
    // Generate science coach response (existing logic)
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
  } catch (error) {
    // Handle science coach timeout/error
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
```

## Testing

### Test Cases

1. **Technique Coach Response Sequence**
   - Send "How do I perform an armbar?" → Should show technique coach loading → Technique coach response → Science coach loading → Science coach response
   - Verify technique coach response appears before science coach response
   - Verify sender names: "技术教练" and "运动健康助理"

2. **Technique Coach Failure Handling**
   - Simulate technique coach failure → Should trigger science coach response
   - Simulate technique coach timeout → Should show timeout message, then trigger science coach response
   - Verify user always receives at least one response

3. **Shared BJJ Detection**
   - Send BJJ question → Verify single detection call shared between coaches
   - Verify both coaches use same `bjjRelevanceScore`

4. **Non-BJJ Questions**
   - Send non-BJJ question → Should show informative message only (no coach responses)

5. **Concurrent Messages**
   - Send multiple BJJ questions rapidly → Each should get independent technique coach → science coach sequence
   - Verify responses appear in chronological order

## Environment Setup

No additional environment setup needed - reuses existing DashScope API configuration from science coach setup.

## Troubleshooting

**Issue**: Technique coach responses not appearing
- **Solution**: Check console for errors, verify prompt is loaded correctly, check API key is valid

**Issue**: Science coach not triggered after technique coach
- **Solution**: Verify `triggerScienceCoachResponse` is called after technique coach completes (success, failure, or timeout)

**Issue**: Sender names not displaying correctly
- **Solution**: Verify `sender-name-utils.ts` includes 'technique-coach' → '技术教练' mapping

**Issue**: Responses appearing in wrong order
- **Solution**: Ensure technique coach response is added before triggering science coach, use message timestamps for ordering

