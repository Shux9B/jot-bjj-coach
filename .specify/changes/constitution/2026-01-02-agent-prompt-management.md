# Agent Prompt 管理原则添加

**日期**: 2026-01-02  
**类型**: 宪法修订  
**版本**: 1.1.0 → 1.2.0

## 变更描述

在项目宪法中新增原则 6：Agent Prompt 管理，要求所有 agent 使用的 prompt 进行单独管理，不得硬编码在源代码中。

## 变更内容

### 新增原则

**Principle 6: Agent Prompt Management**
- 必须将所有 agent 使用的 prompt 存储在专门的集中位置
- 所有 agent prompt（包括系统 prompt、指令 prompt 和 prompt 模板）必须与实现代码分离
- Prompt 必须组织在结构化目录中（如 `.specify/prompts/`），使用清晰的命名约定和版本控制
- 每个 prompt 文件必须包含元数据：用途、目标 agent、版本、最后修改日期和使用上下文
- Prompt 不得硬编码在源代码或配置文件中

## 变更原因

分离 prompt 管理与代码可以实现：
- 独立的版本控制和迭代
- 更容易测试和优化 prompt
- 开发者和 prompt 工程师之间更好的协作
- 便于进行不同 prompt 策略的 A/B 测试
- 无需修改代码即可审查、审计和更新 prompt

## 影响范围

- 所有使用 agent 的功能必须遵循此原则
- 所有模板文件已更新以包含新原则的检查项
- 需要建立 `.specify/prompts/` 目录结构（如适用）
- 现有硬编码的 prompt 需要迁移到独立文件

## 相关文件

- `.specify/memory/constitution.md` - 宪法主文档（已更新）
- `.specify/templates/plan-template.md` - 计划模板（已更新）
- `.specify/templates/spec-template.md` - 规范模板（已更新）
- `.specify/templates/tasks-template.md` - 任务模板（已更新）

