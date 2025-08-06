'use client';

import { getVideoEmbedUrl } from '@/lib/utils/video';

interface VideoEmbedProps {
  videoUrl: string;
  title?: string;
}

export function VideoEmbed({ videoUrl, title }: VideoEmbedProps) {
  const embedUrl = getVideoEmbedUrl(videoUrl);

  if (!embedUrl) {
    return (
      <div className="my-8 p-4 bg-muted rounded-lg text-center text-muted-foreground">
        <p>Invalid video URL</p>
      </div>
    );
  }

  return (
    <div className="my-8">
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <iframe
          src={embedUrl}
          title={title || 'Embedded video'}
          className="absolute top-0 left-0 w-full h-full rounded-lg"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen={true}
        />
      </div>
    </div>
  );
} 