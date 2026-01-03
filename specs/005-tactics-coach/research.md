# Research Findings: BJJ Tactics Coach Agent

## Agent API Service Selection

### Decision
Reuse DashScope (阿里百炼) API with Qwen models, same as technique coach (004-bjj-technique-coach) and science coach (002-science-coach-agent).

**Rationale**:
- Already integrated and working in the project
- Consistent API interface across all coaches
- Same performance characteristics and reliability
- No additional dependencies needed
- Shared infrastructure reduces maintenance overhead

**Alternatives Considered**:
- **Different API service for tactics coach**: Rejected - adds complexity, inconsistent user experience
- **Local LLM models**: Rejected - too resource-intensive for mobile devices
- **Other cloud LLM services**: Rejected - DashScope already proven and integrated

**Implementation Details**:
- Reuse existing `openai-client.ts` for DashScope API access
- Use same Qwen models (qwen-turbo for detection, qwen-plus for generation)
- Follow same patterns as `technique-coach-service.ts` and `agent-response-service.ts`
- Store API key in same environment variables

## BJJ Question Detection Method

### Decision
Reuse existing BJJ detection service shared with technique coach and science coach.

**Rationale**:
- Ensures consistency: all three coaches use same detection logic
- Avoids duplicate API calls (cost and performance)
- Single source of truth for BJJ relevance scoring
- Already proven to meet 90% accuracy requirement
- Simplifies implementation and maintenance

**Alternatives Considered**:
- **Separate detection service for tactics coach**: Rejected - unnecessary duplication, potential inconsistency
- **Different detection threshold**: Rejected - should be consistent across coaches

**Implementation Details**:
- Reuse `bjj-detection-service.ts` module
- All three coaches use same detection result for a given message
- Detection happens once per user message, result shared across all coaches
- Same threshold: score >= 50 triggers responses

## Tactics Coach Prompt Design

### Decision
Design prompt focused on tactics, strategies, competitive applications, strategic thinking, and tactical decision-making.

**Rationale**:
- Aligns with specification: tactics coach focuses on strategic and tactical applications
- Complements technique coach (practical details) and science coach (biomechanical explanations)
- Provides strategic guidance for competitive scenarios
- Emphasizes tactical considerations to help users understand competitive applications

**Prompt Structure**:
```
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

**Alternatives Considered**:
- **General BJJ advice**: Rejected - too broad, doesn't focus on tactics and strategies
- **Biomechanical explanations**: Rejected - that's the science coach's role
- **Practical technique details**: Rejected - that's the technique coach's role

**Implementation Details**:
- Store prompt in `.specify/prompts/005-tactics-coach/tactics-coach-prompt.md`
- Include metadata header (purpose, version, last modified)
- Use same prompt loading pattern as other coaches
- Version control for prompt iterations

## Three-Agent Response Coordination

### Decision
Tactics coach responds third, triggered only after both technique coach and science coach complete successfully.

**Rationale**:
- Technique coach provides immediate practical guidance
- Science coach supplements with biomechanical context
- Tactics coach provides strategic and tactical guidance as final supplement
- Sequential responses maintain conversation flow
- Conditional triggering ensures quality: only when previous coaches succeed

**Coordination Flow**:
1. User sends BJJ-related message
2. Shared BJJ detection confirms relevance (score >= 50)
3. Technique coach generates response (with loading indicator)
4. On technique coach success: Display response, then trigger science coach
5. On science coach success: Display response, then trigger tactics coach
6. On technique coach or science coach failure/timeout: Do NOT trigger tactics coach

**Alternatives Considered**:
- **Parallel responses**: Rejected - may cause confusion, harder to coordinate
- **User selection**: Rejected - violates specification (no agent selection)
- **Always trigger tactics coach**: Rejected - specification requires only trigger when both previous coaches succeed
- **Tactics coach responds first**: Rejected - doesn't align with specification (technique coach first)

**Implementation Details**:
- Modify `triggerScienceCoachResponse` in `chat-dialog.tsx` to trigger tactics coach after science coach completes successfully
- Add tactics coach response generation after science coach response completes
- Use Promise chaining or async/await for sequential execution
- Handle failures: do not trigger tactics coach if technique coach or science coach fails/timeouts
- Maintain message order: technique coach → science coach → tactics coach

## Sender Name Integration

### Decision
Use `agentType: 'tactics-coach'` with sender name "战术教练" via existing sender display name system.

**Rationale**:
- Reuses existing 003-sender-display-names infrastructure
- Consistent with other coaches pattern (`agentType: 'technique-coach'` → "技术教练", `agentType: 'sports-science'` → "运动健康助理")
- Clear differentiation between all three coaches
- No additional implementation needed

**Alternatives Considered**:
- **No sender name differentiation**: Rejected - users need to distinguish coaches
- **Visual styling only**: Rejected - less accessible, sender names are clearer
- **Text prefix in response**: Rejected - less clean, sender names are better UX

**Implementation Details**:
- Set `agentType: 'tactics-coach'` on tactics coach messages
- Verify `sender-name-utils.ts` maps "tactics-coach" to "战术教练"
- If mapping doesn't exist, add it to sender name utility
- Test sender name display in chat dialog

## Failure Handling Strategy

### Decision
Only trigger tactics coach when both technique coach and science coach complete successfully. On tactics coach failure or timeout, display timeout notification (no further action needed).

**Rationale**:
- Ensures quality: tactics coach only provides strategic supplement when previous coaches succeed
- Tactics coach is the last response, so no further fallback needed
- Better user experience: user already has technique and science coach responses
- Aligns with specification requirements

**Failure Scenarios**:
1. **Technique coach or science coach fails/timeouts**: 
   - Do NOT trigger tactics coach response
   - User receives responses from successful coaches only

2. **Tactics coach generation fails (non-timeout)**:
   - Log error silently
   - Do not display error message to user
   - No further action (tactics coach is last response)

3. **Tactics coach timeout (>10 seconds)**:
   - Display timeout notification: "Response timeout. Please try again."
   - No further action (tactics coach is last response)

4. **Network failure during tactics coach**:
   - Handle gracefully
   - Do not block chat interface
   - No further action

**Alternatives Considered**:
- **Always trigger tactics coach regardless of previous coaches**: Rejected - violates specification requirement
- **Show error to user on tactics coach failure**: Rejected - specification says no error messages (excluding timeouts)

**Implementation Details**:
- Wrap tactics coach generation in try-catch
- Only trigger tactics coach after verifying both technique coach and science coach completed successfully
- On failure, catch error silently (no user notification)
- On timeout, display timeout notification
- Ensure tactics coach trigger only happens when both previous coaches succeed

## Response Truncation

### Decision
Reuse existing response truncation logic (2000 character limit with ellipsis).

**Rationale**:
- Consistent with other coaches behavior
- Already implemented and tested
- Meets specification requirements

**Implementation Details**:
- Reuse `truncateResponse` utility from `utils/response-truncation.ts`
- Apply to tactics coach responses before display
- Same truncation logic: word boundary when possible, ellipsis indicator

## Loading Indicator and Timeout Notification

### Decision
Reuse existing loading indicator and timeout notification patterns from other coaches.

**Rationale**:
- Consistent user experience across all coaches
- Already implemented and tested
- No need to reinvent

**Implementation Details**:
- Use same loading indicator pattern: React Native Elements ActivityIndicator
- Use same timeout notification: "Response timeout. Please try again."
- Display with `agentType: 'tactics-coach'` for proper sender name
- Same styling and positioning as other coaches

## Additional Research Findings

### Prompt Management Location
- Store prompts in `.specify/prompts/005-tactics-coach/` directory
- Follow same structure as other coach prompts
- Include metadata headers in prompt files
- Version control for prompt iterations

### Response Ordering
- Tactics coach response must appear after technique coach and science coach responses
- Use message timestamps or sequence to maintain order
- Display in chronological order regardless of completion time

### Concurrent Message Handling
- Each user message triggers independent three-coach response sequence
- Multiple concurrent sequences possible
- Responses displayed in chronological order
- Use existing message ordering mechanisms

### Conditional Triggering
- Tactics coach only triggered when both technique coach and science coach complete successfully
- If either previous coach fails or times out, tactics coach is not triggered
- This ensures quality and prevents incomplete response sequences

