import type { Page } from '@/lib/types/cms';
import Link from 'next/link';

interface BlogPostCardProps {
  post: Page;
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  const category = post.metadata?.category as string | undefined;
  const readTime = post.metadata?.readTime as string | undefined;
  const excerpt = post.content
    ? post.content.split('\n')[0].replace('#', '').trim()
    : '';

  return (
    <article className="bg-card rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <span>{category || 'Uncategorized'}</span>
          <span>•</span>
          <span>{readTime || 'N/A'}</span>
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">
          <Link href={`/blog/${post.slug}`} className="hover:text-primary">
            {post.title}
          </Link>
        </h2>
        <p className="text-muted-foreground mb-4">{excerpt}</p>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{post.authorName}</span>
          <span>
            {new Date(post.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>
      </div>
    </article>
  );
}
