# API Contracts: Sender Display Names

## Overview

This feature does not introduce new external API contracts. It extends the existing Message interface and component props.

## Internal Contracts

### Message Interface Extension

**Type**: TypeScript Interface Extension  
**Location**: `types/chat.ts`

```typescript
interface Message {
  // ... existing fields ...
  agentType?: 'sports-science' | string;
}
```

**Contract**:
- `agentType` is optional
- When present with `sender: 'other'`, determines which sender name to display
- Known values: `'sports-science'` (maps to "运动健康助理")
- Future agent types can be added as string literals

### Sender Name Utility Function

**Type**: Pure Function  
**Location**: `utils/sender-name-utils.ts` (new)

```typescript
function getSenderName(message: Message): string | null
```

**Contract**:
- Input: Message object
- Output: Sender name string or null
- Returns "本人" for user messages
- Returns agent name for messages with `agentType`
- Returns null for messages without `agentType` (backward compatibility)

**Behavior**:
- User messages (`sender: 'user'`) → "本人"
- Agent messages with `agentType: 'sports-science'` → "运动健康助理"
- Agent messages without `agentType` → null (no name displayed)
- Unknown `agentType` values → null (graceful degradation)

### MessageItem Component Props

**Type**: React Component Props  
**Location**: `components/message-item.tsx`

```typescript
interface MessageItemProps {
  message: Message;
}
```

**Contract**:
- Accepts Message object with optional `agentType` field
- Displays sender name above message content when available
- Maintains backward compatibility for messages without `agentType`
- Handles all message types: user, agent, system, loading

### LoadingIndicator Component Props

**Type**: React Component Props  
**Location**: `components/loading-indicator.tsx`

```typescript
interface LoadingIndicatorProps {
  agentType?: 'sports-science' | string;
}
```

**Contract**:
- Optional `agentType` prop
- Displays sender name above loading indicator when `agentType` is provided
- Maintains backward compatibility when `agentType` is not provided

## Agent Name Mapping

**Type**: Static Configuration  
**Location**: `utils/sender-name-utils.ts`

```typescript
const AGENT_NAME_MAP: Record<string, string> = {
  'sports-science': '运动健康助理',
};
```

**Contract**:
- Maps agent type identifiers to display names
- Extensible: new agent types can be added to the mapping
- Unknown agent types return null (no name displayed)

## Component Contracts

### MessageItem Component

**Input Contract**:
- `message: Message` - Required message object

**Output Contract**:
- Renders message with sender name (if available) above content
- Maintains existing message bubble styling
- Preserves message alignment (left for user, right for agent)

**Side Effects**:
- None (pure component)

### ChatDialog Component

**Input Contract**:
- None (self-contained component)

**Output Contract**:
- Creates messages with `agentType` field for agent responses
- Maintains backward compatibility for existing message creation

**State Contract**:
- Messages array contains Message objects
- New agent messages include `agentType: 'sports-science'`

## Data Flow

1. **Message Creation**: ChatDialog creates messages with `agentType` field
2. **Name Resolution**: MessageItem calls `getSenderName()` utility
3. **Display**: Sender name rendered above message content
4. **Backward Compatibility**: Messages without `agentType` skip name display

## Error Handling

- **Unknown Agent Type**: Returns null, no sender name displayed (graceful degradation)
- **Missing agentType**: Returns null, no sender name displayed (backward compatibility)
- **Invalid Message**: Component handles gracefully, displays message without sender name

## Future Extensibility

- New agent types can be added to `AGENT_NAME_MAP`
- Component logic handles unknown agent types gracefully
- Type system supports string literal union for type safety

