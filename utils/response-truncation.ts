/**
 * Truncates text to a maximum length, attempting to break at word boundaries
 * @param text - The text to truncate
 * @param maxLength - Maximum length (default: 2000)
 * @returns Truncated text with ellipsis if truncated
 */
export function truncateResponse(text: string, maxLength: number = 2000): string {
  if (text.length <= maxLength) {
    return text;
  }
  
  // Truncate at word boundary
  const truncated = text.substring(0, maxLength - 3);
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastSpace > maxLength * 0.8) {
    // If space is reasonably close to end, truncate there
    return truncated.substring(0, lastSpace) + '...';
  }
  
  // Otherwise truncate at character boundary
  return truncated + '...';
}

