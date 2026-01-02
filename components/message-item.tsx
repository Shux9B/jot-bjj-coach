import { ChatBorderRadius, ChatColors, ChatShadows, ChatSpacing } from '@/constants/chat-styles';
import { Message } from '@/types/chat';
import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LoadingIndicator } from './loading-indicator';

interface MessageItemProps {
  message: Message;
}

export const MessageItem = memo(function MessageItem({ message }: MessageItemProps) {
  const isUser = message.sender === 'user';
  
  // Handle loading indicator
  if (message.isLoading) {
    return <LoadingIndicator />;
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
    >
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
});

