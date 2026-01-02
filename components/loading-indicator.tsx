import { ChatSenderNameStyles } from '@/constants/chat-styles';
import { getSenderName } from '@/utils/sender-name-utils';
import { Message } from '@/types/chat';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';

interface LoadingIndicatorProps {
  agentType?: 'sports-science' | string;
}

/**
 * Loading indicator component displayed while agent is processing
 * Styled with NativeWind for right alignment (same as agent responses)
 */
export function LoadingIndicator({ agentType }: LoadingIndicatorProps) {
  // Create a temporary message object to get sender name
  const tempMessage: Message = {
    id: '',
    text: '',
    sender: 'other',
    isLoading: true,
    agentType
  };
  const senderName = getSenderName(tempMessage);
  
  return (
    <View style={styles.container}>
      {senderName && (
        <Text style={styles.senderName}>
          {senderName}
        </Text>
      )}
      <View className="p-4 items-end">
        <ActivityIndicator size="small" color="#007AFF" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
  },
  senderName: {
    fontSize: ChatSenderNameStyles.fontSize,
    lineHeight: ChatSenderNameStyles.lineHeight,
    marginBottom: ChatSenderNameStyles.marginBottom,
    color: ChatSenderNameStyles.color,
    fontWeight: ChatSenderNameStyles.fontWeight,
    marginRight: 8,
  },
});

