# 聊天对话框样式配置

## 概述

`chat-styles.ts` 提供了统一的样式配置，参考了 ZiZ prototype.html 的设计风格，采用深色主题和玻璃态效果。

## 设计特点

1. **深色主题**：使用 `#0a0a2a` 和 `#1c1c1e` 作为背景色
2. **玻璃态效果**：半透明背景配合模糊效果
3. **渐变色彩**：紫色到粉色的渐变（`#8b5cf6` → `#ec4899`）
4. **圆角设计**：统一的圆角规范

## 使用方式

### 导入样式配置

```typescript
import { 
  ChatColors, 
  ChatSpacing, 
  ChatBorderRadius, 
  ChatShadows 
} from '@/constants/chat-styles';
```

### 颜色使用

```typescript
// 背景色
backgroundColor: ChatColors.screenBackground

// 玻璃态效果
backgroundColor: ChatColors.glassBackground
borderColor: ChatColors.glassBorder

// 文本颜色
color: ChatColors.textPrimary
color: ChatColors.textSecondary
```

### 间距使用

```typescript
padding: ChatSpacing.md
margin: ChatSpacing.lg
```

### 圆角使用

```typescript
borderRadius: ChatBorderRadius.lg
borderRadius: ChatBorderRadius.full  // 完全圆形
```

### 阴影使用

```typescript
// 玻璃态阴影
...ChatShadows.glass

// 按钮阴影
...ChatShadows.button
```

## 样式变量说明

### ChatColors

- `background`: 主背景色 `#0a0a2a`
- `screenBackground`: 屏幕背景色 `#1c1c1e`
- `glassBackground`: 玻璃态背景 `rgba(255, 255, 255, 0.1)`
- `glassBorder`: 玻璃态边框 `rgba(255, 255, 255, 0.15)`
- `gradientStart`: 渐变起始色（紫色）`#8b5cf6`
- `gradientEnd`: 渐变结束色（粉色）`#ec4899`
- `userMessageBg`: 用户消息背景 `rgba(139, 92, 246, 0.8)`
- `otherMessageBg`: 对方消息背景 `rgba(107, 114, 128, 0.8)`
- `textPrimary`: 主要文本颜色 `#ffffff`
- `textSecondary`: 次要文本颜色 `rgba(255, 255, 255, 0.7)`
- `textTertiary`: 第三级文本颜色 `rgba(255, 255, 255, 0.5)`

### ChatSpacing

- `xs`: 4px
- `sm`: 8px
- `md`: 12px
- `lg`: 16px
- `xl`: 20px
- `xxl`: 24px

### ChatBorderRadius

- `sm`: 8px
- `md`: 12px
- `lg`: 16px
- `xl`: 20px
- `full`: 9999px（完全圆形）

### ChatShadows

- `glass`: 玻璃态阴影效果
- `button`: 按钮阴影效果（带紫色光晕）

## 示例

### 消息气泡样式

```typescript
const messageStyle = {
  backgroundColor: ChatColors.userMessageBg,
  borderRadius: ChatBorderRadius.lg,
  padding: ChatSpacing.md,
  borderWidth: 1,
  borderColor: ChatColors.glassBorder,
  ...ChatShadows.glass,
};
```

### 输入框样式

```typescript
const inputStyle = {
  backgroundColor: ChatColors.inputBackground,
  borderWidth: 1,
  borderColor: ChatColors.inputBorder,
  borderRadius: ChatBorderRadius.lg,
  paddingHorizontal: ChatSpacing.md,
};
```

### 按钮样式

```typescript
const buttonStyle = {
  backgroundColor: ChatColors.gradientStart,
  borderRadius: ChatBorderRadius.md,
  padding: ChatSpacing.md,
  ...ChatShadows.button,
};
```

## 注意事项

1. React Native 不支持 CSS 的 `backdrop-filter`，玻璃态效果通过半透明背景色模拟
2. 阴影效果在 iOS 和 Android 上的表现可能略有不同
3. 渐变效果需要使用 `expo-linear-gradient` 或类似的库实现，当前使用纯色作为替代

