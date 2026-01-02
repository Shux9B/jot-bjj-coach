import { ChatColors } from '@/constants/chat-styles';
import { generateResponse } from '@/services/agent-response-service';
import { detectBJJRelevance } from '@/services/bjj-detection-service';
import { Message } from '@/types/chat';
import { generateMessageId } from '@/utils/message-utils';
import { useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { MessageInput } from './message-input';
import { MessageItem } from './message-item';

export function ChatDialog() {
  const [messages, setMessages] = useState<Message[]>([]);
  const flatListRef = useRef<FlatList<Message>>(null);

  const handleSend = async (text: string) => {
    // Add user message immediately
    const userMessage: Message = {
      id: generateMessageId(),
      text,
      sender: 'user'
    };
    setMessages(prev => [...prev, userMessage]);
    
    // Trigger agent processing (non-blocking)
    processAgentResponse(text, userMessage.id).catch(error => {
      console.error('Agent processing error:', error);
      // Silently handle errors - don't disrupt chat flow
    });
  };

  const processAgentResponse = async (userText: string, userMessageId: string) => {
    try {
      // Detect BJJ relevance
      const score = await detectBJJRelevance(userText);
      
      // If not BJJ-related (score < 50), show informative message
      if (score < 50) {
        setMessages(prev => [...prev, {
          id: generateMessageId(),
          text: '我只能回答巴西柔术相关问题',
          sender: 'other',
          isSystemMessage: true,
          agentType: 'sports-science'
        }]);
        return;
      }
      
      // Add loading indicator
      const loadingId = generateMessageId();
      const loadingMessage: Message = {
        id: loadingId,
        text: '',
        sender: 'other',
        isLoading: true,
        agentType: 'sports-science'
      };
      setMessages(prev => [...prev, loadingMessage]);
      
      try {
        // Generate response with timeout handling
        const responseText = await Promise.race([
          generateResponse(userText),
          new Promise<string>((_, reject) => {
            setTimeout(() => reject(new Error('Timeout')), 10000);
          })
        ]);
        
        // Remove loading indicator and add response
        setMessages(prev => {
          const withoutLoading = prev.filter(m => m.id !== loadingId);
          return [...withoutLoading, {
            id: generateMessageId(),
            text: responseText,
            sender: 'other',
            agentType: 'sports-science',
            bjjRelevanceScore: score
          }];
        });
      } catch (error) {
        // Handle timeout or generation error
        setMessages(prev => {
          const withoutLoading = prev.filter(m => m.id !== loadingId);
          return [...withoutLoading, {
            id: generateMessageId(),
            text: 'Response timeout. Please try again.',
            sender: 'other',
            isSystemMessage: true,
            agentType: 'sports-science'
          }];
        });
      }
    } catch (error) {
      // Silently handle detection errors
      console.error('BJJ detection error:', error);
    }
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

