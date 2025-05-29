'use client';

import { ThemeToggle } from '@/components/ThemeToggle';
import { MarkdownContent } from '@/components/blog/MarkdownContent';
import type { Page } from '@/lib/types/cms';
import { fetchWithRetry } from '@/lib/utils/fetch';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface BlogPost extends Page {
  metadata: {
    category?: string;
    readTime?: string;
  };
  authorName: string;
}

export default function BlogPostPage() {
  const params = useParams();
  const id = params.id as string;

  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryAttempt, setRetryAttempt] = useState(0);

  useEffect(() => {
    async function fetchBlogPost() {
      try {
        const baseUrl =
          process.env.NODE_ENV === 'development'
            ? 'http://localhost:3000'
            : process.env.NEXT_PUBLIC_SITE_URL ||
              'https://tech-jobs-canada.vercel.app';

        const data = await fetchWithRetry(
          `${baseUrl}/api/blog/${id}`,
          3,
          1000,
          (attempt) => {
            setRetryAttempt(attempt);
          },
        );

        setBlogPost(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchBlogPost();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
            <p className="text-muted-foreground">
              {retryAttempt > 0
                ? `Loading blog post... (Attempt ${retryAttempt + 1})`
                : 'Loading blog post...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !blogPost) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center text-destructive">
            {error || 'Blog post not found'}
          </div>
        </div>
      </div>
    );
  }

  const category = blogPost.metadata?.category as string | undefined;
  const readTime = blogPost.metadata?.readTime as string | undefined;
  const authorName = blogPost.authorName || 'Anonymous';
  const createdAt = new Date(blogPost.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Header with Back Button and Theme Toggle */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Blog</span>
          </Link>
          <ThemeToggle />
        </div>

        {/* Blog Post Content */}
        <article className="max-w-3xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <span>{category || 'Uncategorized'}</span>
              <span>•</span>
              <span>{readTime || 'N/A'}</span>
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              {blogPost.title}
            </h1>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{authorName}</span>
              <span>{createdAt}</span>
            </div>
          </div>

          <MarkdownContent content={blogPost.content || ''} />
        </article>
      </div>
    </div>
  );
}
