import { ChatBorderRadius, ChatColors, ChatShadows, ChatSpacing } from '@/constants/chat-styles';
import { Message } from '@/types/chat';
import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface MessageItemProps {
  message: Message;
}

export const MessageItem = memo(function MessageItem({ message }: MessageItemProps) {
  const isUser = message.sender === 'user';
  
  return (
    <View 
      style={[
        styles.container,
        isUser ? styles.userMessage : styles.otherMessage
      ]}
    >
      <Text style={styles.text}>{message.text}</Text>
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
});

