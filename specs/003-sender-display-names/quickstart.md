# Quick Start: Sender Display Names

## Overview

This feature adds sender name labels to messages in the chat dialog. User messages display "本人" and agent messages display agent-specific names (e.g., "运动健康助理" for sports science agent).

## Key Changes

### 1. Message Interface Extension

**File**: `types/chat.ts`

Add optional `agentType` field to Message interface:

```typescript
export interface Message {
  // ... existing fields ...
  agentType?: 'sports-science' | string; // New field
}
```

### 2. Sender Name Utility

**File**: `utils/sender-name-utils.ts` (new file)

Create utility function to map agent types to display names:

```typescript
const AGENT_NAME_MAP: Record<string, string> = {
  'sports-science': '运动健康助理',
};

export function getSenderName(message: Message): string | null {
  if (message.sender === 'user') {
    return '本人';
  }
  if (message.agentType) {
    return AGENT_NAME_MAP[message.agentType] || null;
  }
  return null;
}
```

### 3. Update MessageItem Component

**File**: `components/message-item.tsx`

Add sender name display above message content:

```typescript
import { getSenderName } from '@/utils/sender-name-utils';

export const MessageItem = memo(function MessageItem({ message }: MessageItemProps) {
  const isUser = message.sender === 'user';
  const senderName = getSenderName(message);
  
  // Handle loading indicator
  if (message.isLoading) {
    return (
      <View style={styles.loadingContainer}>
        {senderName && (
          <Text style={[styles.senderName, styles.agentName]}>
            {senderName}
          </Text>
        )}
        <LoadingIndicator />
      </View>
    );
  }
  
  return (
    <View style={[styles.container, isUser ? styles.userMessage : styles.otherMessage]}>
      {senderName && (
        <Text style={[styles.senderName, isUser ? styles.userName : styles.agentName]}>
          {senderName}
        </Text>
      )}
      <Text style={styles.text}>{message.text}</Text>
    </View>
  );
});
```

### 4. Update ChatDialog Component

**File**: `components/chat-dialog.tsx`

Add `agentType` to agent messages:

```typescript
// Agent response
setMessages(prev => [...prev, {
  id: generateMessageId(),
  text: responseText,
  sender: 'other',
  agentType: 'sports-science', // Add this
  bjjRelevanceScore: score
}]);

// System message
setMessages(prev => [...prev, {
  id: generateMessageId(),
  text: '我只能回答巴西柔术相关问题',
  sender: 'other',
  isSystemMessage: true,
  agentType: 'sports-science' // Add this
}]);

// Loading indicator
const loadingMessage: Message = {
  id: loadingId,
  text: '',
  sender: 'other',
  isLoading: true,
  agentType: 'sports-science' // Add this
};
```

### 5. Add Sender Name Styles

**File**: `constants/chat-styles.ts`

Add styles for sender name labels:

```typescript
export const ChatSenderNameStyles = {
  fontSize: 12,
  lineHeight: 16,
  marginBottom: 4,
  color: ChatColors.textSecondary,
  fontWeight: '500' as const,
};
```

## Testing Checklist

- [ ] User messages display "本人" above content
- [ ] Agent messages with `agentType: 'sports-science'` display "运动健康助理"
- [ ] Messages without `agentType` do not display sender names
- [ ] Loading indicators display sender name when `agentType` is present
- [ ] System messages display sender name when `agentType` is present
- [ ] Sender names are positioned above message content (vertical layout)
- [ ] Sender names respect message alignment (left for user, right for agent)
- [ ] Screen readers announce sender names correctly
- [ ] Performance remains smooth with sender names displayed

## Migration Notes

- Existing messages without `agentType` continue to work (no sender name displayed)
- New agent messages should include `agentType` field
- Backward compatible: no breaking changes to existing Message interface usage

