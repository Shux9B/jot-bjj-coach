import { ChatBorderRadius, ChatColors, ChatShadows, ChatSpacing } from '@/constants/chat-styles';
import { Button, Input } from '@rneui/themed';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

interface MessageInputProps {
  onSend: (text: string) => void;
}

export function MessageInput({ onSend }: MessageInputProps) {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim()) {
      onSend(text.trim());
      setText('');
    }
  };

  const isDisabled = !text.trim();

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <Input
          value={text}
          onChangeText={setText}
          placeholder="输入消息..."
          placeholderTextColor={ChatColors.inputPlaceholder}
          containerStyle={styles.inputContainer}
          inputStyle={styles.inputText}
          inputContainerStyle={styles.inputInnerContainer}
          errorStyle={styles.errorStyle}
          labelStyle={styles.labelStyle}
          accessibilityLabel="消息输入框"
          accessibilityHint="在此输入您的消息"
        />
      </View>
      <Button
        title="发送"
        onPress={handleSend}
        disabled={isDisabled}
        buttonStyle={[
          styles.sendButton,
          isDisabled ? styles.sendButtonDisabled : styles.sendButtonEnabled
        ]}
        titleStyle={styles.sendButtonText}
        accessibilityLabel="发送消息按钮"
        accessibilityHint="点击发送您的消息"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: ChatSpacing.md,
    paddingBottom: ChatSpacing.lg,
    backgroundColor: ChatColors.glassNavBackground,
    borderTopWidth: 1,
    borderTopColor: ChatColors.glassBorder,
    ...ChatShadows.glass,
  },
  inputWrapper: {
    flex: 1,
    marginRight: ChatSpacing.sm,
  },
  inputContainer: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    marginBottom: 0,
    marginTop: 0,
    height: 44,
  },
  inputInnerContainer: {
    backgroundColor: ChatColors.inputBackground,
    borderWidth: 1,
    borderColor: ChatColors.inputBorder,
    borderRadius: ChatBorderRadius.lg,
    paddingHorizontal: ChatSpacing.md,
    paddingVertical: 0,
    margin: 0,
    height: 44,
    borderBottomWidth: 1,
  },
  inputText: {
    color: ChatColors.textPrimary,
    fontSize: 16,
    padding: 0,
    margin: 0,
  },
  errorStyle: {
    height: 0,
    margin: 0,
    padding: 0,
  },
  labelStyle: {
    height: 0,
    margin: 0,
    padding: 0,
  },
  sendButton: {
    minWidth: 60,
    minHeight: 44,
    borderRadius: ChatBorderRadius.md,
  },
  sendButtonEnabled: {
    backgroundColor: ChatColors.gradientStart, // 使用渐变起始色作为主色
    ...ChatShadows.button,
  },
  sendButtonDisabled: {
    backgroundColor: ChatColors.buttonDisabled,
    ...ChatShadows.glass,
  },
  sendButtonText: {
    color: ChatColors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
});

