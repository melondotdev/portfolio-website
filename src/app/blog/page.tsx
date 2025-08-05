'use client';

import { Header } from '@/components/Header';
import type { BlogPost } from '@/lib/types/cms';
import Link from 'next/link';
import { useEffect, useState } from 'react';

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
      <Header activePage="blog" />

      {/* Hero Section */}
      <div className="pt-24 pb-4 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-start gap-8">
            <div className="flex-1">
              <div className="max-w-[75%]">
                <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-2">
                  behold, some truly exceptional thoughts
                </h1>
                <p className="text-md text-muted-foreground">
                  i.e. insights, tutorials, thoughts on development
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading
              ? // Loading skeleton
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
              : posts.map((post) => (
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
                          {post.excerpt ||
                            post.content.substring(0, 100) + '...'}
                        </p>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>{post.author_id}</span>
                          <span>
                            {new Date(post.created_at).toLocaleDateString(
                              'en-US',
                              {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              },
                            )}
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
}
