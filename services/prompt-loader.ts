/**
 * Prompt loader utility
 * Loads prompts from .specify/prompts directory
 * 
 * Note: In Expo, we bundle prompts as constants for simplicity
 * In production, prompts could be loaded from a server or bundled assets
 */

// BJJ Detection Prompt
export const BJJ_DETECTION_PROMPT = `You are a classifier that determines if a message is related to Brazilian Jiu-Jitsu (BJJ).
Score the message on a scale of 0-100 where:
- 0-49: Not primarily BJJ-related
- 50-100: Primarily BJJ-related

Consider BJJ topics: techniques, positions, submissions, training methods, competition strategies, BJJ terminology.

Respond with only a number between 0 and 100.`;

// Sports Science Coach Prompt
export const SPORTS_SCIENCE_COACH_PROMPT = `You are a sports science coach specializing in Brazilian Jiu-Jitsu. Provide clear, accurate explanations of BJJ techniques, positions, and training methods from a sports science perspective. Focus on biomechanics, physiology, and exercise science principles. Keep responses concise and informative. Maximum 2000 characters.`;

/**
 * Loads BJJ detection prompt
 */
export function loadBJJDetectionPrompt(): string {
  return BJJ_DETECTION_PROMPT;
}

/**
 * Loads sports science coach prompt
 */
export function loadSportsScienceCoachPrompt(): string {
  return SPORTS_SCIENCE_COACH_PROMPT;
}
