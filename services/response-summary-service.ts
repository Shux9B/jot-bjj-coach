import { truncateResponse } from '@/utils/response-truncation';
import openai from './openai-client';

/**
 * Summary generation prompt for preserving key information
 */
const SUMMARY_PROMPT = `You are a summarization assistant. Generate a concise summary of the following response that preserves key information needed to understand what has been covered. Focus on main points and important details. Keep summary to 20-30% of original length.

IMPORTANT: All summaries must be in Chinese (Simplified).`;

/**
 * Generates a summary of a previous agent response
 * Preserves key information for duplicate prevention
 * @param response - Previous agent response to summarize
 * @returns Promise<string> - Summary of response (preserves key information)
 * @throws Error if generation fails or times out
 */
export async function generateResponseSummary(response: string): Promise<string> {
  try {
    // Set up timeout (5 seconds for summary generation)
    const timeoutPromise = new Promise<string>((_, reject) => {
      setTimeout(() => reject(new Error('Summary generation timeout')), 5000);
    });
    
    // Use Qwen model for DashScope (阿里百炼)
    const model = process.env.EXPO_PUBLIC_DASHSCOPE_MODEL || 'qwen-plus';
    
    const generationPromise = openai.chat.completions.create({
      model: model,
      messages: [
        { role: 'system', content: SUMMARY_PROMPT },
        { role: 'user', content: response },
      ],
      temperature: 0.5, // Lower temperature for more consistent summaries
      max_tokens: 200, // Shorter summaries
    }).then(apiResponse => {
      const summaryText = apiResponse.choices[0]?.message?.content || '';
      // Truncate to ensure reasonable length
      return truncateResponse(summaryText, 1000);
    });
    
    // Race between generation and timeout
    const summary = await Promise.race([generationPromise, timeoutPromise]);
    return summary;
  } catch (error) {
    // Log error for debugging
    console.error('[Summary Service] Error:', error instanceof Error ? error.message : 'Unknown error', {
      responseLength: response.length,
      timestamp: new Date().toISOString()
    });
    
    // Re-throw error for caller to handle
    if (error instanceof Error && error.message.includes('timeout')) {
      throw new Error('Summary generation timeout');
    }
    throw new Error(`Summary generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Estimates token count for Chinese text
 * Rough estimation: 1 token ≈ 4 characters for Chinese
 * @param text - Text to estimate token count for
 * @returns number - Estimated token count
 */
export function estimateTokenCount(text: string): number {
  // Rough estimation: 1 token ≈ 4 characters for Chinese
  return Math.ceil(text.length / 4);
}

/**
 * Checks if context needs summarization based on token limits
 * @param context - Array of previous responses
 * @param systemPrompt - System prompt text
 * @param userQuestion - User question text
 * @param maxTokens - Maximum token limit (default 3000)
 * @returns boolean - True if context exceeds token limits and needs summarization
 */
export function checkNeedsSummary(
  context: string[],
  systemPrompt: string,
  userQuestion: string,
  maxTokens: number = 3000
): boolean {
  // Calculate total token count
  const contextTokens = context.reduce((sum, response) => sum + estimateTokenCount(response), 0);
  const systemPromptTokens = estimateTokenCount(systemPrompt);
  const userQuestionTokens = estimateTokenCount(userQuestion);
  const totalTokens = contextTokens + systemPromptTokens + userQuestionTokens;
  
  // Check if total exceeds limit
  return totalTokens > maxTokens;
}

