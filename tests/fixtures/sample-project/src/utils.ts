/**
 * Format a Date as an ISO date string (YYYY-MM-DD).
 */
export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

/**
 * Convert a string to a URL-friendly slug.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export const DEFAULT_PAGE_SIZE = 25;
