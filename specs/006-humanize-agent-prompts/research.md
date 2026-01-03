# Research Findings: Humanize Agent Prompts

## Humanized Prompt Design Patterns

### Decision
Use friendlier tone while keeping third person perspective, add encouraging expressions, and use more natural language structure.

**Rationale**:
- Third person perspective maintains professional coaching context
- Friendlier tone makes responses more approachable without losing authority
- Encouraging expressions enhance user engagement and motivation
- Natural language structure improves readability and conversational flow
- Balanced approach preserves professionalism while enhancing humanization

**Humanization Techniques**:
1. **Tone Enhancement**: Use warmer, more approachable language while maintaining professional boundaries
2. **Encouraging Expressions**: Add supportive phrases like "你可以尝试...", "建议你...", "记住..."
3. **Natural Language Structure**: Use conversational sentence patterns instead of formal lists
4. **Personal Connection**: Use language that makes users feel understood and supported
5. **Professional Balance**: Maintain technical terminology while making explanations more accessible

**Alternatives Considered**:
- **First person perspective**: Rejected - may reduce professional authority, less appropriate for coaching context
- **Completely casual tone**: Rejected - may compromise professionalism and coaching credibility
- **Formal with minimal changes**: Rejected - doesn't achieve humanization goal

**Implementation Details**:
- Keep "You are a..." structure but add personality and warmth
- Replace formal instructions with conversational guidance
- Add encouraging expressions naturally within responses
- Use natural sentence flow instead of bullet points in prompt instructions
- Maintain professional terminology while explaining in accessible language

## Agent Personality Differentiation

### Decision
Consistent humanization level but distinct personalities: science coach (rigorous), technique coach (encouraging), tactics coach (motivational).

**Rationale**:
- Consistent humanization level ensures unified user experience
- Distinct personalities reflect each agent's expertise and role
- Personality differentiation helps users understand each agent's unique value
- Balanced approach maintains consistency while allowing personality expression

**Personality Traits**:

1. **Science Coach (Rigorous)**:
   - Precise and methodical in explanations
   - Uses scientific terminology with clarity
   - Provides evidence-based insights
   - Friendly but maintains scientific rigor
   - Encourages understanding through clear explanations

2. **Technique Coach (Encouraging)**:
   - Supportive and patient in guidance
   - Uses practical, actionable language
   - Provides step-by-step encouragement
   - Emphasizes safety and correct practice
   - Motivates through positive reinforcement

3. **Tactics Coach (Motivational)**:
   - Inspiring and strategic in guidance
   - Uses competitive and energetic language
   - Provides tactical insights with enthusiasm
   - Emphasizes strategic thinking and competition
   - Motivates through competitive scenarios

**Alternatives Considered**:
- **Completely uniform style**: Rejected - loses personality differentiation, reduces agent distinctiveness
- **Very different styles**: Rejected - may feel inconsistent, confusing user experience
- **No personality**: Rejected - doesn't achieve humanization goal

**Implementation Details**:
- Use consistent humanization techniques across all agents
- Apply personality-specific language patterns for each agent
- Maintain professional boundaries while expressing personality
- Ensure personality traits align with agent expertise areas
- Test personality differentiation through sample responses

## Professional Balance Strategy

### Decision
Balance natural conversation with professional terminology and accuracy.

**Rationale**:
- Natural conversation enhances user engagement and understanding
- Professional terminology maintains technical accuracy and credibility
- Balanced approach ensures both accessibility and expertise
- Users benefit from approachable explanations without losing depth

**Balance Techniques**:
1. **Accessible Explanations**: Use natural language to explain complex concepts
2. **Technical Accuracy**: Maintain proper terminology and scientific accuracy
3. **Contextual Adaptation**: Adjust language complexity based on topic
4. **Progressive Disclosure**: Start with accessible language, add technical details as needed
5. **Cultural Appropriateness**: Use Chinese language patterns that feel natural

**Alternatives Considered**:
- **Prioritize professionalism**: Rejected - may reduce humanization, less engaging
- **Prioritize naturalness**: Rejected - may compromise technical accuracy
- **No balance needed**: Rejected - balance is essential for coaching context

**Implementation Details**:
- Use natural Chinese conversation patterns
- Maintain technical terms but explain them accessibly
- Provide context for complex concepts
- Use examples and analogies when appropriate
- Ensure cultural appropriateness in Chinese expressions

## Chinese Language Humanization

### Decision
Use natural Chinese conversation patterns with encouraging expressions appropriate for coaching context.

**Rationale**:
- Natural Chinese patterns make responses feel authentic and relatable
- Encouraging expressions in Chinese enhance motivation and engagement
- Cultural appropriateness ensures responses feel genuine
- Professional yet friendly tone in Chinese maintains coaching credibility

**Chinese Humanization Patterns**:
1. **Natural Greetings**: Use appropriate opening phrases like "关于这个问题..." or "让我来帮你..."
2. **Encouraging Expressions**: "你可以尝试...", "建议你...", "记住...", "重要的是..."
3. **Supportive Language**: "不用担心...", "慢慢来...", "你已经做得很好了..."
4. **Conversational Flow**: Use natural sentence connections and transitions
5. **Cultural Context**: Use expressions appropriate for Chinese coaching culture

**Alternatives Considered**:
- **Formal Chinese**: Rejected - too formal, doesn't achieve humanization
- **Very casual Chinese**: Rejected - may not be appropriate for professional coaching
- **Mixed language**: Rejected - should maintain Chinese (Simplified) requirement

**Implementation Details**:
- Research natural Chinese conversation patterns for coaching
- Use encouraging expressions that feel natural in Chinese
- Maintain professional boundaries in Chinese cultural context
- Test with native Chinese speakers for naturalness
- Ensure clarity and readability in Simplified Chinese

## Prompt Modification Strategy

### Decision
Update prompt content only, no changes to response generation logic or service code.

**Rationale**:
- Prompt modifications are sufficient to achieve humanization
- No code changes reduce risk and implementation complexity
- Maintains backward compatibility with existing systems
- Allows for easy iteration and A/B testing of prompts
- Aligns with constitution Principle 6 (Agent Prompt Management)

**Modification Approach**:
1. **Update Prompt Files**: Modify markdown files in `.specify/prompts/` directories
2. **Update Constants**: Update corresponding constants in `services/prompt-loader.ts`
3. **Version Control**: Increment version numbers in prompt metadata
4. **Documentation**: Update last modified dates and document changes
5. **Testing**: Test updated prompts with existing response generation services

**Alternatives Considered**:
- **Modify response generation logic**: Rejected - unnecessary complexity, violates scope
- **Add post-processing**: Rejected - not needed, prompt modifications sufficient
- **Create new agents**: Rejected - out of scope, should enhance existing agents

**Implementation Details**:
- Update three prompt files: science coach, technique coach, tactics coach
- Update three constants in prompt-loader.ts
- Increment version numbers (1.0.0 → 1.1.0)
- Update last modified dates
- Test that services automatically use updated prompts

## Additional Research Findings

### Versioning Strategy
- Increment minor version (1.0.0 → 1.1.0) for prompt content updates
- Document changes in prompt metadata headers
- Maintain version history for prompt iterations

### Testing Approach
- Generate sample responses with updated prompts
- Review humanization level and personality differentiation
- Validate technical accuracy and professional balance
- Test with various BJJ questions to ensure consistency

### Iteration Strategy
- Start with moderate humanization, iterate based on feedback
- A/B test different humanization levels if needed
- Gather user feedback on dialogue naturalness
- Refine prompts based on response quality metrics

