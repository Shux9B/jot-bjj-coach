# Technique Coach Prompt Management

This directory contains prompts for the BJJ Technique Coach Agent (004-bjj-technique-coach).

## Structure

- `technique-coach-prompt.md` - Main prompt for technique-focused responses

## Prompt Management

All prompts follow the metadata header format:
- **Purpose**: Brief description of the prompt's role
- **Target Agent**: LLM model or service used
- **Version**: Semantic version number
- **Last Modified**: Date of last update

## Usage

Prompts are loaded via `services/prompt-loader.ts` using the `loadTechniqueCoachPrompt()` function.

## Version Control

Prompts are version-controlled and changes should be documented in commit messages. When updating prompts:
1. Update the version number
2. Update the Last Modified date
3. Document the change in the commit message

