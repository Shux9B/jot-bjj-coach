# Quick Start Guide: Science Coach Agent Implementation

## Prerequisites

- Existing chat dialog component (001-chat-dialog) must be functional
- DashScope (阿里百炼) API key (get from https://dashscope.console.aliyun.com/)
- Expo development environment set up

## File Structure

```
.specify/
  prompts/
    002-science-coach-agent/
      bjj-detection-prompt.md      # BJJ detection prompt
      sports-science-coach-prompt.md  # Agent response prompt
      README.md                     # Prompt metadata

services/
  bjj-detection-service.ts         # BJJ question detection service
  agent-response-service.ts        # Agent response generation service
  openai-client.ts                 # OpenAI API client wrapper

components/
  chat-dialog.tsx                  # Extended chat dialog (existing, modified)
  loading-indicator.tsx            # Loading indicator component (new)

utils/
  response-truncation.ts           # Response truncation utility

types/
  chat.ts                          # Extended Message interface (existing, modified)
```

## Implementation Steps

### Step 1: Set Up Environment Variables

1. Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

2. Edit `.env` file and add your DashScope API key:

   ```bash
   # DashScope (阿里百炼) API Configuration
   EXPO_PUBLIC_DASHSCOPE_API_KEY=your_dashscope_api_key_here

   # Optional: Customize base URL (defaults to Beijing region)
   # EXPO_PUBLIC_DASHSCOPE_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1

   # Optional: Customize model (defaults to qwen-turbo for detection, qwen-plus for generation)
   # EXPO_PUBLIC_DASHSCOPE_MODEL=qwen-turbo
   ```

3. Get your API key from: https://dashscope.console.aliyun.com/

**Note**: 
- The `.env` file is already in `.gitignore` and will not be committed to version control
- For production, consider using a backend proxy to protect API keys
- Expo automatically loads environment variables from `.env` file at build time

### Step 2: Install Dependencies

```bash
npm install openai
# or
yarn add openai
```

**Note**: We use the `openai` package with DashScope's OpenAI-compatible endpoint, so no additional SDK is needed.

### Step 3: Create Prompt Files

Create `.specify/prompts/002-science-coach-agent/bjj-detection-prompt.md`:

```markdown
# BJJ Detection Prompt

**Purpose**: Classify user messages to determine BJJ relevance
**Target Agent**: OpenAI GPT-3.5-turbo
**Version**: 1.0.0
**Last Modified**: 2026-01-02

## Prompt

You are a classifier that determines if a message is related to Brazilian Jiu-Jitsu (BJJ).
Score the message on a scale of 0-100 where:
- 0-49: Not primarily BJJ-related
- 50-100: Primarily BJJ-related

Consider BJJ topics: techniques, positions, submissions, training methods, competition strategies, BJJ terminology.

Respond with only a number between 0 and 100.
```

Create `.specify/prompts/002-science-coach-agent/sports-science-coach-prompt.md`:

```markdown
# Sports Science Coach Prompt

**Purpose**: Generate sports science explanations for BJJ questions
**Target Agent**: OpenAI GPT-3.5-turbo
**Version**: 1.0.0
**Last Modified**: 2026-01-02

## Prompt

You are a sports science coach specializing in Brazilian Jiu-Jitsu. Provide clear, accurate explanations of BJJ techniques, positions, and training methods from a sports science perspective. Focus on biomechanics, physiology, and exercise science principles. Keep responses concise and informative. Maximum 2000 characters.
```

### Step 4: Create OpenAI Client

Create `services/openai-client.ts`:

```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.EXPO_PUBLIC_DASHSCOPE_API_KEY,
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
});

export default openai;
```

### Step 5: Create BJJ Detection Service

Create `services/bjj-detection-service.ts`:

```typescript
import openai from './openai-client';
import fs from 'fs';
import path from 'path';

async function getDetectionPrompt(): Promise<string> {
  const promptPath = path.join(
    __dirname,
    '../../.specify/prompts/002-science-coach-agent/bjj-detection-prompt.md'
  );
  const content = fs.readFileSync(promptPath, 'utf-8');
  // Extract prompt from markdown (implementation detail)
  return extractPromptFromMarkdown(content);
}

export async function detectBJJRelevance(message: string): Promise<number> {
  try {
    const systemPrompt = await getDetectionPrompt();
    
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
      temperature: 0.3,
      max_tokens: 10,
    });

    const score = parseInt(response.choices[0].message.content || '0', 10);
    return Math.max(0, Math.min(100, score)); // Clamp to 0-100
  } catch (error) {
    console.error('BJJ detection error:', error);
    return 0; // Default to non-BJJ on error
  }
}
```

### Step 6: Create Agent Response Service

Create `services/agent-response-service.ts`:

```typescript
import openai from './openai-client';
import { truncateResponse } from '@/utils/response-truncation';

async function getCoachPrompt(): Promise<string> {
  // Similar to detection prompt loading
  // Load from .specify/prompts/002-science-coach-agent/sports-science-coach-prompt.md
}

export async function generateResponse(message: string): Promise<string> {
  try {
    const systemPrompt = await getCoachPrompt();
    
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const responseText = response.choices[0].message.content || '';
    return truncateResponse(responseText, 2000);
  } catch (error) {
    console.error('Agent response error:', error);
    throw error;
  }
}
```

### Step 7: Create Response Truncation Utility

Create `utils/response-truncation.ts`:

```typescript
export function truncateResponse(text: string, maxLength: number = 2000): string {
  if (text.length <= maxLength) {
    return text;
  }
  
  const truncated = text.substring(0, maxLength - 3);
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastSpace > maxLength * 0.8) {
    return truncated.substring(0, lastSpace) + '...';
  }
  
  return truncated + '...';
}
```

### Step 8: Extend Message Type

Update `types/chat.ts`:

```typescript
export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'other';
  timestamp?: number;
  isLoading?: boolean;
  isSystemMessage?: boolean;
  bjjRelevanceScore?: number;
}
```

### Step 9: Create Loading Indicator Component

Create `components/loading-indicator.tsx`:

```typescript
import { ActivityIndicator, View } from 'react-native';
import { ActivityIndicator as RNEActivityIndicator } from '@rneui/themed';

export function LoadingIndicator() {
  return (
    <View className="p-4 items-end">
      <RNEActivityIndicator size="small" color="#007AFF" />
    </View>
  );
}
```

### Step 10: Extend Chat Dialog Component

Update `components/chat-dialog.tsx`:

```typescript
import { detectBJJRelevance } from '@/services/bjj-detection-service';
import { generateResponse } from '@/services/agent-response-service';
import { LoadingIndicator } from './loading-indicator';

export function ChatDialog() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [processingStates, setProcessingStates] = useState<Map<string, boolean>>(new Map());

  const handleSend = async (text: string) => {
    // Add user message
    const userMessage: Message = {
      id: generateMessageId(),
      text,
      sender: 'user'
    };
    setMessages(prev => [...prev, userMessage]);

    // Detect BJJ relevance
    try {
      const score = await detectBJJRelevance(text);
      
      if (score >= 50) {
        // Add loading indicator
        const loadingId = generateMessageId();
        const loadingMessage: Message = {
          id: loadingId,
          text: '',
          sender: 'other',
          isLoading: true
        };
        setMessages(prev => [...prev, loadingMessage]);

        // Generate response with timeout
        try {
          const responseText = await Promise.race([
            generateResponse(text),
            new Promise<string>((_, reject) => 
              setTimeout(() => reject(new Error('Timeout')), 10000)
            )
          ]);

          // Remove loading, add response
          setMessages(prev => 
            prev.filter(m => m.id !== loadingId).concat({
              id: generateMessageId(),
              text: responseText,
              sender: 'other'
            })
          );
        } catch (error) {
          // Remove loading, add timeout message
          setMessages(prev => 
            prev.filter(m => m.id !== loadingId).concat({
              id: generateMessageId(),
              text: 'Response timeout. Please try again.',
              sender: 'other',
              isSystemMessage: true
            })
          );
        }
      }
      // If score < 50, silently skip (no response)
    } catch (error) {
      // Silently handle detection errors
      console.error('Agent processing error:', error);
    }
  };

  // Render loading indicator for isLoading messages
  const renderItem = ({ item }: { item: Message }) => {
    if (item.isLoading) {
      return <LoadingIndicator />;
    }
    return <MessageItem message={item} />;
  };

  // ... rest of component
}
```

## Testing

### Test Cases

1. **BJJ Question Detection**
   - Send "What is an armbar?" → Should detect as BJJ-related (score >= 50)
   - Send "How do I improve my cardio?" → Should detect as non-BJJ (score < 50)
   - Send "Explain the guard position in BJJ" → Should detect as BJJ-related

2. **Agent Response Generation**
   - Send BJJ question → Should show loading indicator → Should display response
   - Verify response is truncated if > 2000 characters
   - Verify response appears on right side

3. **Timeout Handling**
   - Simulate timeout (mock slow API) → Should show timeout message
   - Verify timeout message styling

4. **Non-BJJ Questions**
   - Send non-BJJ question → Should not show loading or response
   - Verify chat continues normally

5. **Concurrent Messages**
   - Send multiple BJJ questions rapidly → Each should get independent response
   - Verify responses appear in order

## Environment Setup

1. Create `.env` file in project root directory
2. Add DashScope API key: `EXPO_PUBLIC_DASHSCOPE_API_KEY=your_api_key_here`
3. (Optional) Configure base URL and model if needed
4. Restart Expo development server

See [ENV_SETUP.md](../../ENV_SETUP.md) for detailed configuration instructions.

## Troubleshooting

**Issue**: API key not found
- **Solution**: Verify `.env` file exists and contains `EXPO_PUBLIC_DASHSCOPE_API_KEY`

**Issue**: Responses not appearing
- **Solution**: Check console for errors, verify API key is valid, check network connectivity

**Issue**: Timeout always occurring
- **Solution**: Check API response times, verify network connection, consider increasing timeout

**Issue**: Detection always returning 0
- **Solution**: Verify prompt is loaded correctly, check API response format

