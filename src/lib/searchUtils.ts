/**
 * Search utilities for safe SQL operations
 */

/**
 * Escape special characters in ILIKE patterns to prevent SQL injection
 * @param value - The search value to escape
 * @returns Escaped value safe for ILIKE patterns
 */
export function escapeLikePattern(value: string): string {
  if (!value || typeof value !== 'string') {
    return '';
  }
  
  // Double-escape backslashes for PostgreSQL LIKE patterns
  // First escape for the LIKE pattern, then escape for the JS/SQL string literal
  return value
    .replace(/\\/g, '\\\\')  // Double-escape backslash: \ -> \\
    .replace(/%/g, '\\%')    // Escape percent
    .replace(/_/g, '\\_');   // Escape underscore
}

/**
 * Create a safe ILIKE pattern with wildcards
 * @param value - The search value
 * @param prefix - Whether to add % at the beginning (default: true)
 * @param suffix - Whether to add % at the end (default: true)
 * @returns Safe pattern for ILIKE
 */
export function createSafeLikePattern(value: string, prefix = true, suffix = true): string {
  const escaped = escapeLikePattern(value);
  const prefixWildcard = prefix ? '%' : '';
  const suffixWildcard = suffix ? '%' : '';
  return `${prefixWildcard}${escaped}${suffixWildcard}`;
}

/**
 * Build safe OR conditions for multiple ILIKE searches
 * @param searchTerm - The search term to escape
 * @param columns - Array of column names to search
 * @returns Safe OR condition string
 */
export function buildSafeSearchCondition(searchTerm: string, columns: string[]): string {
  if (!searchTerm || !columns.length) {
    return '';
  }
  
  const safePattern = createSafeLikePattern(searchTerm);
  
  if (columns.length === 1) {
    // Single column: column=ilike.%pattern%
    return `${columns[0]}=ilike.${safePattern}`;
  } else {
    // Multiple columns: or(column1=ilike.%pattern%,column2=ilike.%pattern%)
    const conditions = columns.map(column => `${column}=ilike.${safePattern}`);
    return `or(${conditions.join(',')})`;
  }
}

/**
 * Validate and sanitize search input
 * @param input - Raw search input
 * @param maxLength - Maximum allowed length (default: 100)
 * @returns Sanitized search term
 */
export function sanitizeSearchInput(input: string, maxLength = 100): string {
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  // Trim and limit length
  let sanitized = input.trim();
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }
  
        // Remove control characters and normalize
      sanitized = sanitized.replace(/[\u0000-\u001f\u007f]/g, '');
  
  return sanitized;
}
