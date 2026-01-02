# 环境变量配置说明

## 快速开始

1. 在项目根目录创建 `.env` 文件
2. 复制以下配置模板到 `.env` 文件
3. 填入你的 DashScope API Key
4. 重启 Expo 开发服务器

## 配置模板

创建 `.env` 文件并添加以下内容：

```bash
# DashScope (阿里百炼) API Configuration
# 获取 API Key: https://dashscope.console.aliyun.com/

# 必需: DashScope API Key
EXPO_PUBLIC_DASHSCOPE_API_KEY=your_dashscope_api_key_here

# 可选: DashScope Base URL (默认使用北京地域)
# 北京地域: https://dashscope.aliyuncs.com/compatible-mode/v1
# 新加坡地域: https://dashscope-intl.aliyuncs.com/compatible-mode/v1
EXPO_PUBLIC_DASHSCOPE_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1

# 可选: 模型名称 (默认: qwen-turbo 用于检测, qwen-plus 用于生成)
# 可选值: qwen-turbo, qwen-plus, qwen-max
EXPO_PUBLIC_DASHSCOPE_MODEL=qwen-turbo

# 向后兼容: 如果设置了此变量，也会被使用（优先级低于 EXPO_PUBLIC_DASHSCOPE_API_KEY）
# EXPO_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here
```

## 环境变量说明

### EXPO_PUBLIC_DASHSCOPE_API_KEY (必需)

DashScope (阿里百炼) API Key，用于调用阿里百炼的 AI 服务。

**获取方式**:
1. 访问 https://dashscope.console.aliyun.com/
2. 注册/登录阿里云账号
3. 在控制台创建 API Key
4. 将 API Key 复制到 `.env` 文件中

### EXPO_PUBLIC_DASHSCOPE_BASE_URL (可选)

DashScope API 的基础 URL。默认使用北京地域。

**可选值**:
- 北京地域: `https://dashscope.aliyuncs.com/compatible-mode/v1` (默认)
- 新加坡地域: `https://dashscope-intl.aliyuncs.com/compatible-mode/v1`

### EXPO_PUBLIC_DASHSCOPE_MODEL (可选)

使用的 Qwen 模型名称。不同服务使用不同的默认值：

- **BJJ 检测服务**: 默认使用 `qwen-turbo` (快速、成本低)
- **响应生成服务**: 默认使用 `qwen-plus` (平衡性能和成本)

**可选值**:
- `qwen-turbo`: 快速响应，适合分类任务
- `qwen-plus`: 平衡性能和成本，适合文本生成
- `qwen-max`: 最强性能，适合复杂任务

### EXPO_PUBLIC_OPENAI_API_KEY (可选，向后兼容)

如果设置了此变量，代码也会使用它（优先级低于 `EXPO_PUBLIC_DASHSCOPE_API_KEY`）。主要用于向后兼容。

## 重要提示

1. **`.env` 文件已添加到 `.gitignore`**: 不会提交到版本控制系统
2. **重启开发服务器**: 修改 `.env` 文件后需要重启 Expo 开发服务器才能生效
3. **生产环境**: 考虑使用后端代理来保护 API Key，避免在客户端代码中暴露
4. **Expo 环境变量**: 只有以 `EXPO_PUBLIC_` 开头的变量才会暴露给客户端代码

## 验证配置

配置完成后，启动应用并发送一条 BJJ 相关的问题（如 "什么是 armbar？"），如果看到 agent 响应，说明配置成功。

如果遇到问题，检查：
1. `.env` 文件是否在项目根目录
2. API Key 是否正确
3. 是否重启了 Expo 开发服务器
4. 控制台是否有错误信息


