export function getVideoEmbedUrl(url: string): string | null {
  if (!url) return null;

  // YouTube video URL patterns
  const youtubePatterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/,
    /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]+)/,
  ];

  // Vimeo video URL patterns
  const vimeoPatterns = [
    /vimeo\.com\/(\d+)/,
    /player\.vimeo\.com\/video\/(\d+)/,
  ];

  // Check YouTube patterns
  for (const pattern of youtubePatterns) {
    const match = url.match(pattern);
    if (match) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
  }

  // Check Vimeo patterns
  for (const pattern of vimeoPatterns) {
    const match = url.match(pattern);
    if (match) {
      return `https://player.vimeo.com/video/${match[1]}`;
    }
  }

  // If it's already an embed URL, return as is
  if (url.includes('/embed/')) {
    return url;
  }

  return null;
}

export function isVideoUrl(url: string): boolean {
  return getVideoEmbedUrl(url) !== null;
} 