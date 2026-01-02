/**
 * Message interface for chat dialog
 * @see data-model.md for detailed specification
 */
export interface Message {
  id: string;              // Unique message identifier
  text: string;            // Message content
  sender: 'user' | 'other'; // Message sender type
  timestamp?: number;      // Optional timestamp (not displayed per spec)
  isLoading?: boolean;     // Optional: indicates agent is processing response
  isSystemMessage?: boolean; // Optional: indicates system notification (e.g., timeout)
  bjjRelevanceScore?: number; // Optional: BJJ relevance score (0-100) from detection
}

