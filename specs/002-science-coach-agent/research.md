# Research Findings: Science Coach Agent

## Agent API Service Selection

### Decision
Use DashScope (阿里百炼) API with Qwen models for both BJJ question detection and response generation.

**Rationale**:
- DashScope (阿里百炼) provides OpenAI-compatible API interface, making migration seamless
- Supports both classification (for detection) and text generation (for responses)
- Competitive pricing for Chinese market
- Good performance with Qwen models (qwen-turbo, qwen-plus, qwen-max)
- Can handle both detection and response in single API call or separate calls
- Good rate limits for mobile app usage
- Better accessibility in China region

**Alternatives Considered**:
- **OpenAI API**: Considered but may have accessibility issues in China
- **Anthropic Claude API**: Considered for better instruction following, but DashScope has better China region support
- **Local LLM models**: Rejected - too resource-intensive for mobile devices, would require server infrastructure
- **Other cloud LLM services**: Rejected - DashScope has best balance of features, pricing, and China region accessibility

**Implementation Details**:
- Use `openai` npm package with DashScope compatible endpoint
- Implement separate API calls for detection and response generation for better control
- Use qwen-turbo for detection (fast and cost-effective)
- Use qwen-plus for response generation (balanced performance and cost)
- Can upgrade to qwen-max for better accuracy if needed
- Implement retry logic and error handling
- Store API key securely using Expo environment variables
- Base URL: https://dashscope.aliyuncs.com/compatible-mode/v1 (or dashscope-intl.aliyuncs.com for Singapore region)

## BJJ Question Detection Method

### Decision
Use LLM-based classification with confidence scoring to determine if message is >50% BJJ-related.

**Rationale**:
- LLM-based approach provides better accuracy than pattern matching
- Can handle nuanced questions and mixed content
- Confidence scoring allows for >50% threshold implementation
- Can be fine-tuned with prompt engineering
- More flexible for future improvements

**Alternatives Considered**:
- **Pattern matching with keywords**: Rejected - too rigid, misses context, difficult to achieve 90% accuracy
- **Hybrid approach (keywords + LLM)**: Considered but adds complexity without significant benefit
- **Separate classification model**: Rejected - overkill for this use case, requires training data

**Implementation Details**:
- Use OpenAI API with classification prompt
- Prompt asks LLM to score message on 0-100 scale for BJJ relevance
- Threshold: score >= 50 triggers response generation
- Cache detection results for same message to reduce API calls
- Implement fallback to pattern matching if API fails

**Prompt Structure**:
```
You are a classifier that determines if a message is related to Brazilian Jiu-Jitsu (BJJ).
Score the message on a scale of 0-100 where:
- 0-49: Not primarily BJJ-related
- 50-100: Primarily BJJ-related

Consider BJJ topics: techniques, positions, submissions, training methods, competition strategies, BJJ terminology.

Message: {user_message}
Score (0-100): 
```

## Prompt Management Location

### Decision
Store prompts in `.specify/prompts/002-science-coach-agent/` directory with clear naming conventions.

**Rationale**:
- Aligns with constitution Principle 6 (Agent Prompt Management)
- Organized by feature for easy maintenance
- Supports version control and iteration
- Clear separation from code

**Directory Structure**:
```
.specify/prompts/
  002-science-coach-agent/
    bjj-detection-prompt.md
    sports-science-coach-prompt.md
    README.md (metadata and version info)
```

**File Naming Convention**:
- `{purpose}-prompt.md` for individual prompts
- Include metadata header in each file:
  - Purpose
  - Target agent (OpenAI GPT-3.5-turbo)
  - Version
  - Last modified date
  - Usage context

**Alternatives Considered**:
- **Single prompts file**: Rejected - harder to maintain and version
- **Code comments**: Rejected - violates constitution
- **Config files**: Rejected - prompts are content, not configuration

## Loading Indicator Implementation

### Decision
Use React Native Elements `ActivityIndicator` component displayed inline as a temporary message item in the chat list.

**Rationale**:
- React Native Elements provides accessible, styled ActivityIndicator
- Inline display provides clear visual feedback without disrupting chat flow
- Matches common chat app patterns (e.g., WhatsApp, iMessage)
- Easy to style with NativeWind
- Automatically removed when response arrives

**Alternatives Considered**:
- **Separate loading overlay**: Rejected - too intrusive, blocks chat interaction
- **Loading state in input area**: Rejected - less visible, doesn't indicate which message is processing
- **Custom loading component**: Rejected - unnecessary when React Native Elements provides suitable component

**Implementation Details**:
- Display as temporary message with `sender: 'other'` and special loading state
- Position aligned right (same as agent responses)
- Use React Native Elements `ActivityIndicator` with appropriate size
- Style with NativeWind classes for consistency
- Remove automatically when agent response arrives or timeout occurs

## Timeout Notification Format

### Decision
Display timeout notification as a regular message in the chat with `sender: 'other'` and special styling to indicate it's a system notification.

**Rationale**:
- Consistent with chat interface patterns
- Non-intrusive, doesn't block user interaction
- Clear and visible to user
- Can be styled to distinguish from regular messages
- Maintains chat flow continuity

**Alternatives Considered**:
- **Toast notification**: Rejected - too transient, may be missed
- **Modal alert**: Rejected - too intrusive, blocks interaction
- **Separate notification area**: Rejected - adds complexity, inconsistent with chat pattern

**Implementation Details**:
- Message text: "Response timeout. Please try again."
- Display as regular message in chat flow
- Use subtle styling (e.g., italic text, different background color) to indicate system message
- Position aligned right (same as agent responses)
- User can continue chatting normally after timeout

**Message Format**:
```typescript
{
  id: generateMessageId(),
  text: "Response timeout. Please try again.",
  sender: 'other',
  isSystemMessage: true // Optional flag for styling
}
```

## Additional Research Findings

### Background Task Implementation
- Expo background tasks have platform-specific limitations
- iOS: More restrictive, may require foreground execution for reliability
- Android: More flexible background execution
- Recommendation: Use foreground task with non-blocking async/await pattern for better reliability
- Fallback: If background task fails, execute in foreground but show loading indicator

### Response Truncation
- Truncate at word boundary when possible (not mid-word)
- Use ellipsis ("...") to indicate truncation
- Consider preserving sentence structure
- Implementation: Use JavaScript string methods with word boundary detection

### Concurrent Message Handling
- Use Promise.all or Promise.allSettled for parallel processing
- Maintain message order using timestamps or sequence numbers
- Display responses in chronological order regardless of completion time
- Implementation: Queue system with order preservation

