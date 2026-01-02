# API Contracts

## Overview

This feature does not require external API contracts as it's a local UI-only feature. Messages are managed in component state without persistence or network requests per specification scope.

## Internal Component Contracts

### ChatDialog Component Props

```typescript
interface ChatDialogProps {
  // No props required - self-contained component
  // Optional props for future extensibility:
  initialMessages?: Message[];
  onMessageSend?: (message: Message) => void;
}
```

### MessageItem Component Props

```typescript
interface MessageItemProps {
  message: Message;
  // No other props required
}
```

### MessageInput Component Props

```typescript
interface MessageInputProps {
  onSend: (text: string) => void;
  // No other props required
}
```

## Future API Contracts (Out of Scope)

If this feature is extended to include backend integration, the following contracts would be needed:

### Send Message Endpoint
```
POST /api/messages
Body: { text: string }
Response: { id: string, text: string, sender: string, timestamp: number }
```

### Receive Messages Endpoint
```
GET /api/messages
Response: Message[]
```

These are not part of the current specification scope.

