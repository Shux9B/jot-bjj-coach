/**
 * Chat Dialog Styles
 * 参考 ZiZ prototype.html 的样式设计
 * 使用深色主题和玻璃态效果
 */

export const ChatColors = {
  // 背景色
  background: '#0a0a2a',        // 深邃的背景色
  screenBackground: '#1c1c1e',  // 屏幕背景色
  
  // 玻璃态效果
  glassBackground: 'rgba(255, 255, 255, 0.1)',
  glassBorder: 'rgba(255, 255, 255, 0.15)',
  glassNavBackground: 'rgba(30, 30, 30, 0.7)',
  
  // 渐变色（用于按钮和强调）
  gradientStart: '#8b5cf6',     // 紫色
  gradientEnd: '#ec4899',      // 粉色
  
  // 消息气泡颜色
  userMessageBg: 'rgba(139, 92, 246, 0.8)',    // 紫色半透明（用户消息）
  otherMessageBg: 'rgba(107, 114, 128, 0.8)',  // 灰色半透明（对方消息）
  
  // 文本颜色
  textPrimary: '#ffffff',
  textSecondary: 'rgba(255, 255, 255, 0.7)',
  textTertiary: 'rgba(255, 255, 255, 0.5)',
  
  // 输入框
  inputBackground: 'rgba(255, 255, 255, 0.05)',
  inputBorder: 'rgba(255, 255, 255, 0.1)',
  inputPlaceholder: 'rgba(255, 255, 255, 0.4)',
  
  // 按钮
  buttonDisabled: 'rgba(255, 255, 255, 0.2)',
};

export const ChatSpacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
};

export const ChatBorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

export const ChatShadows = {
  // React Native 阴影效果
  glass: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  button: {
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
};


