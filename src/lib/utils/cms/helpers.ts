// Helper function to safely get metadata
export function getSafeMetadata(obj: unknown): Record<string, unknown> {
  if (!obj || typeof obj !== 'object') return {};
  const metadata = (obj as { metadata?: Record<string, unknown> }).metadata;
  return metadata || {};
}

// Helper function to safely get links
export function getSafeLinks(obj: unknown, key: 'int_links' | 'ext_links'): string[] {
  if (!obj || typeof obj !== 'object') return [];
  const links = (obj as { [key: string]: unknown })[key];
  return Array.isArray(links) ? links.filter((link): link is string => typeof link === 'string') : [];
} 