import openai from './openai-client';
import { loadBJJDetectionPrompt } from './prompt-loader';

/**
 * Detects if a message is BJJ-related by scoring it on a 0-100 scale
 * @param message - User message to analyze
 * @returns Promise<number> - BJJ relevance score (0-100), where >= 50 means BJJ-related
 */
export async function detectBJJRelevance(message: string): Promise<number> {
  try {
    const systemPrompt = loadBJJDetectionPrompt();
    
    // Set up timeout (5 seconds)
    const timeoutPromise = new Promise<number>((_, reject) => {
      setTimeout(() => reject(new Error('Detection timeout')), 5000);
    });
    
    // Use Qwen model for DashScope (阿里百炼)
    // qwen-turbo: 快速响应，适合分类任务
    // qwen-plus: 平衡性能和成本
    // qwen-max: 最强性能
    const model = process.env.EXPO_PUBLIC_DASHSCOPE_MODEL || 'qwen-turbo';
    
    const detectionPromise = openai.chat.completions.create({
      model: model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
      temperature: 0.3,
      max_tokens: 10,
    }).then(response => {
      const scoreText = response.choices[0]?.message?.content?.trim() || '0';
      const score = parseInt(scoreText, 10);
      
      // Validate and clamp score to 0-100
      if (isNaN(score)) {
        return 0;
      }
      return Math.max(0, Math.min(100, score));
    });
    
    // Race between detection and timeout
    const score = await Promise.race([detectionPromise, timeoutPromise]);
    return score;
  } catch (error) {
    // On error or timeout, return 0 (treated as non-BJJ)
    console.error('[BJJ Detection] Error:', error instanceof Error ? error.message : 'Unknown error', {
      message: message.substring(0, 50) + '...',
      timestamp: new Date().toISOString()
    });
    return 0;
  }
}

/**
 * Checks if a message is BJJ-related (score >= 50)
 * @param message - User message to check
 * @returns Promise<boolean> - true if message is BJJ-related
 */
export async function isBJJRelated(message: string): Promise<boolean> {
  const score = await detectBJJRelevance(message);
  return score >= 50;
}

