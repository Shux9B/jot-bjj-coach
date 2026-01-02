<!--
Sync Impact Report:
Version: 1.1.0 → 1.2.0 (Added agent prompt management principle)
Modified principles: N/A
Added sections: Principle 6 (Agent Prompt Management)
Removed sections: N/A
Templates requiring updates:
  ✅ .specify/templates/plan-template.md (updated)
  ✅ .specify/templates/spec-template.md (updated)
  ✅ .specify/templates/tasks-template.md (updated)
Follow-up TODOs: None
-->

# Project Constitution

**Project**: multi-agent-bjj  
**Version**: 1.2.0  
**Ratified**: 2025-01-27  
**Last Amended**: 2026-01-02

## Purpose

This constitution establishes the foundational principles, architectural decisions, and governance rules for the multi-agent-bjj project. All development work MUST align with these principles unless explicitly amended through the governance process.

## Principles

### Principle 1: Expo-Based React Native Development

**MUST** use Expo as the primary development framework for React Native application development. All platform-specific features and native modules MUST be accessed through Expo's managed workflow or Expo modules. When native functionality is required, prefer Expo SDK modules over direct native code integration.

**Rationale**: Expo provides a streamlined development experience, cross-platform compatibility, and simplified deployment process. It reduces the complexity of managing native build configurations and ensures consistent behavior across iOS, Android, and Web platforms.

### Principle 2: React Native Elements Component Library

**MUST** use React Native Elements (@rneui/themed and @rneui/base) as the primary UI component library. All reusable UI components MUST be built using or extending React Native Elements components. Custom components SHOULD follow React Native Elements design patterns and theming system.

**Rationale**: React Native Elements provides a comprehensive, well-maintained component library with consistent theming support, reducing development time and ensuring UI consistency across the application.

### Principle 3: Expo Background Task for Network Requests

**MUST** use Expo's background task management (expo-task-manager and expo-background-fetch) for network requests that need to execute in the background. All background network operations MUST be registered and managed through Expo's task manager API. Foreground network requests MAY use standard fetch or axios, but background operations MUST use the designated Expo background task system.

**Rationale**: Expo's background task system provides reliable, platform-agnostic background execution capabilities, ensuring network requests can complete even when the app is in the background, while respecting platform-specific background execution limits.

### Principle 4: Tailwind CSS via NativeWind

**MUST** use Tailwind CSS for styling management through NativeWind (the Tailwind CSS implementation for React Native). All component styles MUST be defined using Tailwind utility classes. Inline styles SHOULD be avoided except for dynamic runtime values. Custom Tailwind configurations MUST be defined in tailwind.config.js and extend the default NativeWind configuration.

**Rationale**: Tailwind CSS provides a utility-first approach to styling that promotes consistency, reduces CSS bundle size, and enables rapid UI development. NativeWind brings Tailwind's benefits to React Native while maintaining compatibility with the React Native styling system.

### Principle 5: Centralized Change Documentation Management

**MUST** maintain all change documentation in the `.specify/changes/` directory. All changes to constitution, principles, architecture, or dependencies MUST be documented in this directory with appropriate categorization. Change documents MUST follow the naming convention: `YYYY-MM-DD-变更类型-简短描述.md`. Each change document MUST include: change date, change type, description, rationale, impact scope, and related files list.

**Rationale**: Centralized change documentation ensures traceability, facilitates review processes, and provides a clear audit trail for all project decisions and modifications. This structure enables easy navigation and historical analysis of project evolution.

### Principle 6: Agent Prompt Management

**MUST** maintain all prompts used by agents in a dedicated, centralized location. All agent prompts, including system prompts, instruction prompts, and prompt templates, MUST be stored separately from implementation code. Prompts MUST be organized in a structured directory (e.g., `.specify/prompts/` or similar) with clear naming conventions and version control. Each prompt file MUST include metadata such as: purpose, target agent, version, last modified date, and usage context. Prompts MUST NOT be hardcoded in source code or configuration files.

**Rationale**: Separating prompt management from code enables independent versioning, easier testing and iteration of prompts, better collaboration between developers and prompt engineers, and facilitates A/B testing of different prompt strategies. This separation also ensures prompts can be reviewed, audited, and updated without requiring code changes.

## Governance

### Amendment Procedure

1. Propose amendment: Document the proposed change with rationale and impact analysis.
2. Review: Evaluate alignment with existing principles and project goals.
3. Update constitution: Modify this document, increment version according to semantic versioning.
4. Propagate changes: Update all dependent templates and documentation.
5. Record: Create change document in `.specify/changes/` directory, update LAST_AMENDED_DATE, and include change in Sync Impact Report.

### Versioning Policy

- **MAJOR** (X.0.0): Backward incompatible changes, principle removals, or fundamental redefinitions.
- **MINOR** (0.X.0): New principles added, new sections, or materially expanded guidance.
- **PATCH** (0.0.X): Clarifications, wording improvements, typo fixes, non-semantic refinements.

### Compliance Review

All code contributions, architectural decisions, and dependency additions MUST be reviewed against this constitution. Non-compliance MUST be addressed before merge, unless an explicit exception is documented with rationale and approved through the amendment procedure.
