# 变更文档管理

本目录用于集中管理项目的所有变更文档。

## 目录结构

- `constitution/` - 宪法变更记录
- `principles/` - 原则变更记录
- `architecture/` - 架构变更记录
- `dependencies/` - 依赖变更记录

## 文件命名规范

变更文档应遵循以下命名规范：
- `YYYY-MM-DD-变更类型-简短描述.md`
- 例如：`2025-01-27-constitution-initial-creation.md`

## 变更文档模板

每个变更文档应包含：
- 变更日期
- 变更类型（宪法/原则/架构/依赖）
- 变更描述
- 变更原因
- 影响范围
- 相关文件列表

可以使用 `change-template.md` 作为模板创建新的变更文档。

## 变更类型说明

- **宪法 (constitution)**: 项目宪法的修订，包括原则的添加、修改或删除
- **原则 (principles)**: 单个原则的详细变更记录
- **架构 (architecture)**: 架构决策和设计变更
- **依赖 (dependencies)**: 依赖库的添加、更新或移除

