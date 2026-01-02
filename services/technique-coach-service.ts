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
    // qwen-plus: 平衡性能和成本，适合生成任务
    // qwen-max: 最强性能，适合复杂任务
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

