import { Message } from '@/types/chat';

/**
 * Mapping of agent types to their display names
 */
const AGENT_NAME_MAP: Record<string, string> = {
  'sports-science': '运动健康助理',
  'technique-coach': '技术教练',
  'tactics-coach': '战术教练',
  // Future agent types can be added here
};

/**
 * Gets the sender name for a message
 * @param message - The message to get the sender name for
 * @returns The sender name string, or null if no name should be displayed
 */
export function getSenderName(message: Message): string | null {
  if (message.sender === 'user') {
    return '本人';
  }
  if (message.agentType) {
    return AGENT_NAME_MAP[message.agentType] || null;
  }
  return null; // No sender name for backward compatibility
}

