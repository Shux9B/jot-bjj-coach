import { truncateResponse } from '@/utils/response-truncation';
import openai from './openai-client';
import { loadTacticsCoachPrompt } from './prompt-loader';
import { generateResponseSummary, checkNeedsSummary } from './response-summary-service';

/**
 * Generates a tactics-focused explanation for a BJJ-related question
 * @param message - User's BJJ-related question
 * @param previousResponses - Optional array of previous agent responses (or summaries) to use as context
 * @returns Promise<string> - Agent response (truncated to 2000 characters)
 * @throws Error if generation fails or times out
 */
export async function generateTacticsCoachResponse(message: string, previousResponses?: string[]): Promise<string> {
  try {
    const systemPrompt = loadTacticsCoachPrompt();
    
    // Build messages array with context
    const messages: Array<{role: 'system' | 'user' | 'assistant', content: string}> = [
      { role: 'system', content: systemPrompt },
    ];
    
    // Add previous responses as context if available
    if (previousResponses && previousResponses.length > 0) {
      // Check if summaries needed
      const needsSummary = checkNeedsSummary(previousResponses, systemPrompt, message);
      
      if (needsSummary) {
        // Generate summaries
        try {
          const summaries = await Promise.all(
            previousResponses.map(r => generateResponseSummary(r))
          );
          summaries.forEach(summary => {
            messages.push({ role: 'assistant', content: summary });
          });
        } catch (summaryError) {
          // If summary generation fails, fallback to no context
          console.warn('[Tactics Coach] Summary generation failed, using no context:', summaryError);
        }
      } else {
        // Use full responses
        previousResponses.forEach(response => {
          messages.push({ role: 'assistant', content: response });
        });
      }
    }
    
    // Add user question
    messages.push({ role: 'user', content: message });
    
    // Set up timeout (10 seconds)
    const timeoutPromise = new Promise<string>((_, reject) => {
      setTimeout(() => reject(new Error('Response generation timeout')), 10000);
    });
    
    // Use Qwen model for DashScope (阿里百炼)
    // qwen-plus: 平衡性能和成本，适合生成任务
    // qwen-max: 最强性能，适合复杂任务
    const model = process.env.EXPO_PUBLIC_DASHSCOPE_MODEL || 'qwen-plus';
    
    const generationPromise = openai.chat.completions.create({
      model: model,
      messages: messages,
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

