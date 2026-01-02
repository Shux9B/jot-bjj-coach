# 添加变更文档管理原则

**日期**: 2025-01-27  
**类型**: 宪法修订  
**版本**: 1.0.0 → 1.1.0

## 变更描述

在宪法中新增 Principle 5: Centralized Change Documentation Management，要求所有变更文档统一管理在 `.specify/changes/` 目录中。

## 变更内容

### 新增原则

**Principle 5: Centralized Change Documentation Management**
- 必须将所有变更文档维护在 `.specify/changes/` 目录中
- 所有宪法、原则、架构或依赖的变更必须在此目录中记录
- 变更文档必须遵循命名规范：`YYYY-MM-DD-变更类型-简短描述.md`
- 每个变更文档必须包含：变更日期、变更类型、描述、原因、影响范围和相关文件列表

### 修订治理规则

更新了 Amendment Procedure 第5步，要求创建变更文档在 `.specify/changes/` 目录中。

## 变更原因

集中管理变更文档可以确保可追溯性，便于审查流程，并为所有项目决策和修改提供清晰的审计跟踪。这种结构便于导航和项目演进的历史分析。

## 影响范围

- 所有后续的宪法修订必须创建相应的变更文档
- 建立了变更文档的目录结构（constitution/, principles/, architecture/, dependencies/）
- 更新了所有模板文件以反映新的变更文档管理要求

## 相关文件

- `.specify/memory/constitution.md` - 宪法主文档（已更新）
- `.specify/changes/README.md` - 变更文档管理说明（新建）
- `.specify/changes/constitution/` - 宪法变更目录（新建）
- `.specify/changes/principles/` - 原则变更目录（新建）
- `.specify/changes/architecture/` - 架构变更目录（新建）
- `.specify/changes/dependencies/` - 依赖变更目录（新建）

