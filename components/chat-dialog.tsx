import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { useRef, useState } from 'react';
import { Message } from '@/types/chat';
import { generateMessageId } from '@/utils/message-utils';
import { MessageItem } from './message-item';
import { MessageInput } from './message-input';
import { ChatColors } from '@/constants/chat-styles';

export function ChatDialog() {
  const [messages, setMessages] = useState<Message[]>([]);
  const flatListRef = useRef<FlatList<Message>>(null);

  const handleSend = (text: string) => {
    const newMessage: Message = {
      id: generateMessageId(),
      text,
      sender: 'user'
    };
    setMessages(prev => [...prev, newMessage]);
    
    // Simulate other party response (for demo purposes)
    setTimeout(() => {
      const response: Message = {
        id: generateMessageId(),
        text: 'This is a response',
        sender: 'other'
      };
      setMessages(prev => [...prev, response]);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={({ item }) => <MessageItem message={item} />}
          keyExtractor={(item) => item.id}
          onContentSizeChange={() => {
            flatListRef.current?.scrollToEnd({ animated: true });
          }}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
        <MessageInput onSend={handleSend} />
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ChatColors.screenBackground,
  },
  keyboardView: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
});

