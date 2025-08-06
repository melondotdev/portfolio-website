export function getOptimizedImageUrl(url: string, width = 1200): string {
  if (!url) return '';

  // If it's already an optimized URL (like from a CDN), return as is
  if (url.includes('?') || url.includes('&')) {
    return url;
  }

  // For Unsplash images, add optimization parameters
  if (url.includes('unsplash.com')) {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}auto=format&fit=crop&w=${width}&q=80`;
  }

  // For other images, return as is
  return url;
}

export function isValidImageUrl(url: string): boolean {
  if (!url) return false;

  // Check if it's a valid URL
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function getImageAltText(url: string): string {
  // Extract filename from URL for alt text
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const filename = pathname.split('/').pop()?.split('.')[0] || 'Image';
    return filename
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());
  } catch {
    return 'Image';
  }
}
