import { View, ActivityIndicator } from 'react-native';

/**
 * Loading indicator component displayed while agent is processing
 * Styled with NativeWind for right alignment (same as agent responses)
 */
export function LoadingIndicator() {
  return (
    <View className="p-4 items-end">
      <ActivityIndicator size="small" color="#007AFF" />
    </View>
  );
}

