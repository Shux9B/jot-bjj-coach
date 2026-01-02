# Research Findings: BJJ Technique Coach Agent

## Agent API Service Selection

### Decision
Reuse DashScope (阿里百炼) API with Qwen models, same as science coach (002-science-coach-agent).

**Rationale**:
- Already integrated and working in the project
- Consistent API interface across both coaches
- Same performance characteristics and reliability
- No additional dependencies needed
- Shared infrastructure reduces maintenance overhead

**Alternatives Considered**:
- **Different API service for technique coach**: Rejected - adds complexity, inconsistent user experience
- **Local LLM models**: Rejected - too resource-intensive for mobile devices
- **Other cloud LLM services**: Rejected - DashScope already proven and integrated

**Implementation Details**:
- Reuse existing `openai-client.ts` for DashScope API access
- Use same Qwen models (qwen-turbo for detection, qwen-plus for generation)
- Follow same patterns as `agent-response-service.ts`
- Store API key in same environment variables

## BJJ Question Detection Method

### Decision
Reuse existing BJJ detection service shared with science coach.

**Rationale**:
- Ensures consistency: both coaches use same detection logic
- Avoids duplicate API calls (cost and performance)
- Single source of truth for BJJ relevance scoring
- Already proven to meet 90% accuracy requirement
- Simplifies implementation and maintenance

**Alternatives Considered**:
- **Separate detection service for technique coach**: Rejected - unnecessary duplication, potential inconsistency
- **Different detection threshold**: Rejected - should be consistent across coaches

**Implementation Details**:
- Reuse `bjj-detection-service.ts` module
- Both technique coach and science coach use same detection result for a given message
- Detection happens once per user message, result shared between coaches
- Same threshold: score >= 50 triggers responses

## Technique Coach Prompt Design

### Decision
Design prompt focused on practical details, usage considerations, common mistakes, and safety considerations.

**Rationale**:
- Aligns with specification: technique coach focuses on practical application
- Complements science coach which focuses on biomechanical explanations
- Provides actionable guidance for users
- Emphasizes safety and common mistakes to help users train effectively

**Prompt Structure**:
```
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

**Alternatives Considered**:
- **General BJJ advice**: Rejected - too broad, doesn't focus on practical details
- **Biomechanical explanations**: Rejected - that's the science coach's role
- **Competition strategies**: Rejected - out of scope for technique coaching

**Implementation Details**:
- Store prompt in `.specify/prompts/004-bjj-technique-coach/technique-coach-prompt.md`
- Include metadata header (purpose, version, last modified)
- Use same prompt loading pattern as science coach
- Version control for prompt iterations

## Multi-Agent Response Coordination

### Decision
Technique coach responds first, science coach triggered after technique coach response completes (success, failure, or timeout).

**Rationale**:
- Technique coach provides immediate practical guidance
- Science coach supplements with biomechanical context
- Sequential responses maintain conversation flow
- Failure handling ensures user always gets at least one response

**Coordination Flow**:
1. User sends BJJ-related message
2. Shared BJJ detection confirms relevance (score >= 50)
3. Technique coach generates response (with loading indicator)
4. On technique coach success: Display response, then trigger science coach
5. On technique coach failure: Trigger science coach immediately
6. On technique coach timeout: Display timeout notification, then trigger science coach

**Alternatives Considered**:
- **Parallel responses**: Rejected - may cause confusion, harder to coordinate
- **User selection**: Rejected - violates specification (no agent selection)
- **Science coach only**: Rejected - doesn't meet specification requirement

**Implementation Details**:
- Modify `processAgentResponse` in `chat-dialog.tsx`
- Add technique coach response generation before science coach
- Use Promise chaining or async/await for sequential execution
- Handle failures gracefully: always trigger science coach on technique coach failure
- Maintain message order: technique coach response appears before science coach response

## Sender Name Integration

### Decision
Use `agentType: 'technique-coach'` with sender name "技术教练" via existing sender display name system.

**Rationale**:
- Reuses existing 003-sender-display-names infrastructure
- Consistent with science coach pattern (`agentType: 'sports-science'` → "运动健康助理")
- Clear differentiation between coaches
- No additional implementation needed

**Alternatives Considered**:
- **No sender name differentiation**: Rejected - users need to distinguish coaches
- **Visual styling only**: Rejected - less accessible, sender names are clearer
- **Text prefix in response**: Rejected - less clean, sender names are better UX

**Implementation Details**:
- Set `agentType: 'technique-coach'` on technique coach messages
- Verify `sender-name-utils.ts` maps "technique-coach" to "技术教练"
- If mapping doesn't exist, add it to sender name utility
- Test sender name display in chat dialog

## Failure Handling Strategy

### Decision
On technique coach failure (excluding timeouts) or timeout, still trigger science coach response.

**Rationale**:
- Ensures user always receives at least one form of guidance
- Graceful degradation: science coach can still provide value
- Better user experience than complete failure
- Aligns with specification requirements

**Failure Scenarios**:
1. **Technique coach generation fails (non-timeout)**: 
   - Log error silently
   - Trigger science coach response immediately
   - No error message to user

2. **Technique coach timeout (>10 seconds)**:
   - Display timeout notification: "Response timeout. Please try again."
   - Trigger science coach response
   - User sees timeout message but still gets science coach guidance

3. **Network failure during technique coach**:
   - Handle gracefully
   - Trigger science coach response
   - Don't block chat interface

**Alternatives Considered**:
- **No fallback to science coach**: Rejected - poor user experience, violates specification
- **Show error to user**: Rejected - specification says no error messages (excluding timeouts)

**Implementation Details**:
- Wrap technique coach generation in try-catch
- On failure, catch error and trigger science coach
- On timeout, display timeout notification then trigger science coach
- Ensure science coach trigger happens regardless of technique coach outcome

## Response Truncation

### Decision
Reuse existing response truncation logic (2000 character limit with ellipsis).

**Rationale**:
- Consistent with science coach behavior
- Already implemented and tested
- Meets specification requirements

**Implementation Details**:
- Reuse `truncateResponse` utility from `utils/response-truncation.ts`
- Apply to technique coach responses before display
- Same truncation logic: word boundary when possible, ellipsis indicator

## Loading Indicator and Timeout Notification

### Decision
Reuse existing loading indicator and timeout notification patterns from science coach.

**Rationale**:
- Consistent user experience across coaches
- Already implemented and tested
- No need to reinvent

**Implementation Details**:
- Use same loading indicator pattern: React Native Elements ActivityIndicator
- Use same timeout notification: "Response timeout. Please try again."
- Display with `agentType: 'technique-coach'` for proper sender name
- Same styling and positioning as science coach

## Additional Research Findings

### Prompt Management Location
- Store prompts in `.specify/prompts/004-bjj-technique-coach/` directory
- Follow same structure as 002-science-coach-agent prompts
- Include metadata headers in prompt files
- Version control for prompt iterations

### Response Ordering
- Technique coach response must appear before science coach response
- Use message timestamps or sequence to maintain order
- Display in chronological order regardless of completion time

### Concurrent Message Handling
- Each user message triggers independent technique coach → science coach sequence
- Multiple concurrent sequences possible
- Responses displayed in chronological order
- Use existing message ordering mechanisms

