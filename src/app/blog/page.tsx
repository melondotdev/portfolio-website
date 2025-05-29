'use client';

import { ThemeToggle } from '@/components/ThemeToggle';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { BookOpen, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import type { BlogPost } from '@/lib/types/cms';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlogPosts() {
      try {
        const response = await fetch('/api/blog');
        if (response.ok) {
          const data = await response.json();
          setPosts(data || []);
        }
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchBlogPosts();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-xl font-bold text-foreground">
                melondotdev
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                <Link href="/projects" className="text-muted-foreground hover:text-foreground transition-colors">
                  Projects
                </Link>
                <Link href="/blog" className="text-foreground">
                  Blog
                </Link>
              </nav>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Blog Posts
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Insights, tutorials, and thoughts on web development and technology
            </p>
          </div>

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-card rounded-lg shadow-md p-6 animate-pulse"
                >
                  <div className="h-4 bg-muted rounded w-3/4 mb-4" />
                  <div className="h-4 bg-muted rounded w-1/2 mb-4" />
                  <div className="h-4 bg-muted rounded w-full" />
                </div>
              ))
            ) : (
              posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.id}`}
                  className="block bg-card rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <article>
                    {post.cover_image && (
                      <div className="relative h-48 w-full">
                        <img
                          src={post.cover_image}
                          alt={post.title}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <h2 className="text-xl font-semibold text-foreground mb-2">
                        {post.title}
                      </h2>
                      <p className="text-sm text-muted-foreground mb-4">
                        {post.excerpt || post.content.substring(0, 100) + '...'}
                      </p>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{post.author_id}</span>
                        <span>
                          {new Date(post.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
