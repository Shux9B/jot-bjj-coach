/**
 * Utility functions for message management
 */

/**
 * Generates a unique message ID using timestamp and random string
 * Format: msg-{timestamp}-{randomString}
 * 
 * @returns A unique message identifier
 */
export function generateMessageId(): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 11);
  return `msg-${timestamp}-${randomString}`;
}

/**
 * Validates message text
 * @param text - The message text to validate
 * @returns true if text is valid (non-empty after trimming)
 */
export function isValidMessageText(text: string): boolean {
  return text.trim().length > 0;
}

