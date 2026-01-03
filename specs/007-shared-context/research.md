# Research Findings: Shared Context Between Agents

## Context Passing Method

### Decision
Pass previous agent responses through API message array by adding them as assistant messages (e.g., `{role: 'assistant', content: 'technique coach response...'}`).

**Rationale**:
- Standard chat completion API pattern for multi-turn conversations
- LLMs naturally understand assistant messages as previous responses
- No need for custom context parameters or special formatting
- Compatible with existing DashScope API structure
- Easy to implement and maintain

**Implementation Details**:
- Add previous responses to messages array before user's question
- Format: `{role: 'assistant', content: '<previous agent response>'}`
- Multiple previous responses added in sequence order
- User's question remains as `{role: 'user', content: '<user question>'}`
- System prompt remains as `{role: 'system', content: '<agent prompt>'}`

**Alternatives Considered**:
- **Custom context parameter**: Rejected - not standard API pattern, requires API changes
- **System prompt modification**: Rejected - less flexible, harder to manage
- **Separate context API call**: Rejected - adds complexity, increases latency

## Duplicate Prevention Strategy

### Decision
Explicitly instruct in prompts to avoid duplication while relying on LLM to understand context.

**Rationale**:
- Prompt-based approach aligns with constitution Principle 6 (Agent Prompt Management)
- LLMs are effective at understanding context and following instructions
- More reliable than post-processing or keyword matching
- Can be iterated and improved through prompt engineering
- Maintains consistency with existing prompt management approach

**Prompt Instructions**:
- Add explicit instructions to avoid repeating information from previous agent responses
- Instruct agents to focus on their unique expertise areas
- Instruct agents to complement previous responses rather than duplicate them
- Instruct agents to acknowledge what has been covered when relevant

**Alternatives Considered**:
- **Fully automatic (no prompt changes)**: Rejected - less reliable, harder to control
- **Post-processing detection**: Rejected - complex, may remove valid information
- **Hybrid approach**: Considered but adds complexity without significant benefit

## Failure Handling Strategy

### Decision
Only pass successful responses as context, failed or timed-out responses should not be passed.

**Rationale**:
- Failed responses may contain errors or incomplete information
- Timeout responses are not reliable for context
- Prevents passing incorrect or misleading context
- Maintains response quality and accuracy
- Aligns with existing conditional triggering logic

**Implementation Details**:
- Check agent response success status before passing as context
- Only pass context when previous agent completed successfully
- If previous agent failed or timed out, subsequent agent generates response without context (fallback)
- Maintains existing error handling and timeout behavior

**Alternatives Considered**:
- **Always pass all responses**: Rejected - may pass incorrect information
- **Pass error messages as context**: Rejected - not useful for duplicate prevention
- **Retry failed agents**: Rejected - out of scope, adds complexity

## Context Length Handling

### Decision
If context exceeds token limits, generate summaries of previous responses instead of full text.

**Rationale**:
- Token limits are real constraints that must be handled
- Summaries preserve key information while reducing length
- Better than truncation which may lose important information
- Enables context sharing even with long responses
- Maintains duplicate prevention capability

**Implementation Details**:
- Check total context length (system prompt + previous responses + user question)
- If exceeds token limit, generate summaries of previous responses
- Summaries should preserve key information for duplicate prevention
- Use LLM to generate summaries automatically
- Fallback to no context if summaries also exceed limits

**Alternatives Considered**:
- **Always pass full text**: Rejected - may exceed token limits
- **Simple truncation**: Rejected - may lose important information
- **No context if too long**: Rejected - loses duplicate prevention benefit

## Summary Generation Method

### Decision
Use LLM to automatically generate summaries via API call.

**Rationale**:
- LLM-generated summaries preserve semantic meaning better than simple truncation
- Can preserve key information needed for duplicate prevention
- Uses existing API infrastructure
- Can be optimized through prompt engineering
- More reliable than keyword extraction or simple truncation

**Summary Generation Approach**:
- Create summary generation service using DashScope API
- Use dedicated summary prompt to extract key information
- Generate concise summaries that preserve main points
- Optimize for information needed for duplicate prevention
- Handle summary generation failures gracefully

**Alternatives Considered**:
- **Simple text truncation**: Rejected - loses semantic meaning
- **Keyword extraction**: Rejected - may miss important context
- **No summaries (reject long context)**: Rejected - loses duplicate prevention benefit

## Additional Research Findings

### Token Limit Considerations
- DashScope Qwen models have token limits (varies by model)
- Need to account for: system prompt + previous responses + user question + response
- Typical limit: 2000-4000 tokens for qwen-plus
- Summary generation should target 20-30% of original length

### Context Message Ordering
- Previous responses should be added in chronological order
- Format: [system prompt, previous response 1, previous response 2, ..., user question]
- LLMs understand chronological order naturally
- Order matters for context understanding

### Prompt Update Strategy
- Update science coach and tactics coach prompts (receive context)
- Keep technique coach prompt unchanged (first agent, no context)
- Add duplicate prevention instructions to prompts
- Maintain existing prompt structure and metadata
- Version prompts appropriately (1.1.0 → 1.2.0)

### Performance Optimization
- Summary generation adds one API call per long context
- Can be optimized by caching summaries if same context reused
- Summary generation should be fast (< 3 seconds)
- Consider parallel summary generation if multiple contexts needed

### Error Handling
- If summary generation fails, fallback to no context
- If context passing fails, fallback to current behavior
- Maintain existing error handling patterns
- Ensure chat interface remains functional

