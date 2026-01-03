import OpenAI from 'openai';

/**
 * DashScope (阿里百炼) client wrapper using OpenAI compatible interface
 * Initializes client with DashScope API key and base URL
 */
const apiKey = process.env.EXPO_PUBLIC_DASHSCOPE_API_KEY || process.env.EXPO_PUBLIC_OPENAI_API_KEY;

if (!apiKey) {
  console.warn('EXPO_PUBLIC_DASHSCOPE_API_KEY is not set. Agent features will not work.');
}

// DashScope compatible endpoint
// 新加坡地域: https://dashscope-intl.aliyuncs.com/compatible-mode/v1
// 华北2（北京）: https://dashscope.aliyuncs.com/compatible-mode/v1
const baseURL = process.env.EXPO_PUBLIC_DASHSCOPE_BASE_URL || 'https://dashscope.aliyuncs.com/compatible-mode/v1';

const openai = new OpenAI({
  apiKey: apiKey || '',
  baseURL: baseURL,
  dangerouslyAllowBrowser: true,
});

export default openai;

