import { ChatBorderRadius, ChatColors, ChatSenderNameStyles, ChatShadows, ChatSpacing } from '@/constants/chat-styles';
import { Message } from '@/types/chat';
import { getSenderName } from '@/utils/sender-name-utils';
import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LoadingIndicator } from './loading-indicator';

interface MessageItemProps {
  message: Message;
}

export const MessageItem = memo(function MessageItem({ message }: MessageItemProps) {
  const isUser = message.sender === 'user';
  const senderName = getSenderName(message);
  
  // Handle loading indicator
  if (message.isLoading) {
    return <LoadingIndicator agentType={message.agentType} />;
  }
  
  // Handle system messages with special styling
  const isSystemMessage = message.isSystemMessage;
  
  return (
    <View 
      style={[
        styles.container,
        isUser ? styles.userMessage : styles.otherMessage,
        isSystemMessage && styles.systemMessage
      ]}
      accessibilityLabel={senderName ? `${senderName}: ${message.text}` : message.text}
    >
      {senderName && (
        <Text style={[styles.senderName, isUser ? styles.userSenderName : styles.agentSenderName]}>
          {senderName}
        </Text>
      )}
      <Text style={[styles.text, isSystemMessage && styles.systemText]}>
        {message.text}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    maxWidth: '80%',
    borderRadius: ChatBorderRadius.lg,
    padding: ChatSpacing.md,
    marginVertical: ChatSpacing.xs,
    marginHorizontal: ChatSpacing.sm,
    ...ChatShadows.glass,
  },
  userMessage: {
    alignSelf: 'flex-start',
    backgroundColor: ChatColors.userMessageBg,
    borderWidth: 1,
    borderColor: ChatColors.glassBorder,
  },
  otherMessage: {
    alignSelf: 'flex-end',
    backgroundColor: ChatColors.otherMessageBg,
    borderWidth: 1,
    borderColor: ChatColors.glassBorder,
  },
  text: {
    color: ChatColors.textPrimary,
    fontSize: 16,
    lineHeight: 22,
  },
  systemMessage: {
    backgroundColor: ChatColors.otherMessageBg,
    opacity: 0.7,
  },
  systemText: {
    fontStyle: 'italic',
    fontSize: 14,
  },
  senderName: {
    fontSize: ChatSenderNameStyles.fontSize,
    lineHeight: ChatSenderNameStyles.lineHeight,
    marginBottom: ChatSenderNameStyles.marginBottom,
    color: ChatSenderNameStyles.color,
    fontWeight: ChatSenderNameStyles.fontWeight,
  },
  userSenderName: {
    // User sender name aligns with left-aligned message (default)
  },
  agentSenderName: {
    // Agent sender name aligns with right-aligned message (default)
  },
});

