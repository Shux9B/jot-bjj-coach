import { ChatColors } from '@/constants/chat-styles';
import { generateResponse } from '@/services/agent-response-service';
import { detectBJJRelevance } from '@/services/bjj-detection-service';
import { generateTacticsCoachResponse } from '@/services/tactics-coach-service';
import { generateTechniqueCoachResponse } from '@/services/technique-coach-service';
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
      // Detect BJJ relevance (shared detection service)
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
      
      // Technique coach processing (first)
      const techniqueLoadingId = generateMessageId();
      const techniqueLoadingMessage: Message = {
        id: techniqueLoadingId,
        text: '',
        sender: 'other',
        isLoading: true,
        agentType: 'technique-coach'
      };
      setMessages(prev => [...prev, techniqueLoadingMessage]);
      
      try {
        // Generate technique coach response with timeout handling
        const techniqueResponseText = await Promise.race([
          generateTechniqueCoachResponse(userText),
          new Promise<string>((_, reject) => {
            setTimeout(() => reject(new Error('Timeout')), 10000);
          })
        ]);
        
        // Remove loading indicator and add technique coach response
        setMessages(prev => {
          const withoutLoading = prev.filter(m => m.id !== techniqueLoadingId);
          return [...withoutLoading, {
            id: generateMessageId(),
            text: techniqueResponseText,
            sender: 'other',
            agentType: 'technique-coach',
            bjjRelevanceScore: score
          }];
        });
        
        // Trigger tactics coach response after technique coach completes successfully
        triggerTacticsCoachResponse(userText, score, true, techniqueResponseText);
      } catch (error) {
        // Handle technique coach timeout or generation error
        setMessages(prev => {
          const withoutLoading = prev.filter(m => m.id !== techniqueLoadingId);
          return [...withoutLoading, {
            id: generateMessageId(),
            text: 'Response timeout. Please try again.',
            sender: 'other',
            isSystemMessage: true,
            agentType: 'technique-coach'
          }];
        });
        
        // Still trigger tactics coach response on technique coach failure/timeout
        // But pass false to indicate technique coach failed, so science coach won't be triggered
        triggerTacticsCoachResponse(userText, score, false, '');
      }
    } catch (error) {
      // Silently handle detection errors
      console.error('BJJ detection error:', error);
    }
  };

  const triggerTacticsCoachResponse = async (userText: string, score: number, techniqueCoachSucceeded: boolean, techniqueCoachResponse: string) => {
    // Add loading indicator for tactics coach
    const tacticsLoadingId = generateMessageId();
    const tacticsLoadingMessage: Message = {
      id: tacticsLoadingId,
      text: '',
      sender: 'other',
      isLoading: true,
      agentType: 'tactics-coach'
    };
    setMessages(prev => [...prev, tacticsLoadingMessage]);
    
    let tacticsCoachSucceeded = false;
    let tacticsResponseText = '';
    
    try {
      // Pass technique coach response as context if available
      const context = techniqueCoachSucceeded && techniqueCoachResponse
        ? [techniqueCoachResponse]
        : undefined;
      
      // Generate tactics coach response with timeout handling
      tacticsResponseText = await Promise.race([
        generateTacticsCoachResponse(userText, context),
        new Promise<string>((_, reject) => {
          setTimeout(() => reject(new Error('Timeout')), 10000);
        })
      ]);
      
      // Remove loading indicator and add tactics coach response
      setMessages(prev => {
        const withoutLoading = prev.filter(m => m.id !== tacticsLoadingId);
        return [...withoutLoading, {
          id: generateMessageId(),
          text: tacticsResponseText,
          sender: 'other',
          agentType: 'tactics-coach',
          bjjRelevanceScore: score
        }];
      });
      tacticsCoachSucceeded = true;
    } catch (error) {
      // Handle tactics coach timeout or generation error
      setMessages(prev => {
        const withoutLoading = prev.filter(m => m.id !== tacticsLoadingId);
        return [...withoutLoading, {
          id: generateMessageId(),
          text: 'Response timeout. Please try again.',
          sender: 'other',
          isSystemMessage: true,
          agentType: 'tactics-coach'
        }];
      });
    } finally {
      // Trigger science coach response only if both technique coach and tactics coach succeeded
      if (techniqueCoachSucceeded && tacticsCoachSucceeded) {
        triggerScienceCoachResponse(userText, score, techniqueCoachResponse, tacticsResponseText);
      }
    }
  };

  const triggerScienceCoachResponse = async (userText: string, score: number, techniqueCoachResponse: string, tacticsCoachResponse: string) => {
    // Add loading indicator for science coach
    const scienceLoadingId = generateMessageId();
    const scienceLoadingMessage: Message = {
      id: scienceLoadingId,
      text: '',
      sender: 'other',
      isLoading: true,
      agentType: 'sports-science'
    };
    setMessages(prev => [...prev, scienceLoadingMessage]);
    
    try {
      // Build context array from both previous responses (technique coach and tactics coach)
      const context = [techniqueCoachResponse, tacticsCoachResponse];
      
      // Generate science coach response with timeout handling
      const scienceResponseText = await Promise.race([
        generateResponse(userText, context),
        new Promise<string>((_, reject) => {
          setTimeout(() => reject(new Error('Timeout')), 10000);
        })
      ]);
      
      // Remove loading indicator and add science coach response
      setMessages(prev => {
        const withoutLoading = prev.filter(m => m.id !== scienceLoadingId);
        return [...withoutLoading, {
          id: generateMessageId(),
          text: scienceResponseText,
          sender: 'other',
          agentType: 'sports-science',
          bjjRelevanceScore: score
        }];
      });
    } catch (error) {
      // Handle science coach timeout or generation error
      setMessages(prev => {
        const withoutLoading = prev.filter(m => m.id !== scienceLoadingId);
        return [...withoutLoading, {
          id: generateMessageId(),
          text: 'Response timeout. Please try again.',
          sender: 'other',
          isSystemMessage: true,
          agentType: 'sports-science'
        }];
      });
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

