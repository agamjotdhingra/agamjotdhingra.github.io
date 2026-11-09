/**
 * Normalizes tech_stack into an array of clean strings.
 * Handles arrays, JSON-encoded arrays, and comma-delimited strings.
 */
export function normalizeTechStack(techStack: unknown): string[] {
  if (!techStack) return [];

  if (Array.isArray(techStack)) {
    return techStack
      .map((item) => (typeof item === 'string' ? item.trim() : String(item).trim()))
      .filter((item) => item.length > 0);
  }

  if (typeof techStack === 'string') {
    const trimmed = techStack.trim();
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed
            .map((item) => (typeof item === 'string' ? item.trim() : String(item).trim()))
            .filter((item) => item.length > 0);
        }
      } catch {
        // Fallback to comma separation
      }
    }
    return trimmed
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }

  return [];
}

