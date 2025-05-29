'use client';

import type { BlogPost, Project } from '@/lib/types/cms';
import { useSession } from '@/lib/providers/SessionProvider';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';

type ContentType = 'blog' | 'projects';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: sessionLoading } = useSession();
  const [activeTab, setActiveTab] = useState<ContentType>('blog');
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchBlogPosts = useCallback(async () => {
    try {
      console.log('Fetching blog posts...');
      const response = await fetch('/api/blog', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      console.log('Blog API Response status:', response.status);
      const data = await response.json();
      console.log('Blog API Response data:', data);
      if (data.error) {
        throw new Error(data.error);
      }
      setBlogPosts(data);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      setError('Failed to fetch blog posts');
    }
  }, []);

  const fetchProjects = useCallback(async () => {
    try {
      console.log('Fetching projects...');
      const response = await fetch('/api/projects', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      console.log('Projects API Response status:', response.status);
      const data = await response.json();
      console.log('Projects API Response data:', data);
      if (data.error) {
        throw new Error(data.error);
      }
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError('Failed to fetch projects');
    }
  }, []);

  // Handle authentication redirect in useEffect
  useEffect(() => {
    console.log('Session state:', { user, sessionLoading });
    if (!sessionLoading && !user) {
      console.log('No user found, redirecting to login...');
      router.push('/login');
    }
  }, [user, sessionLoading, router]);

  useEffect(() => {
    if (user) {
      console.log('User authenticated, fetching content...', user);
      Promise.all([fetchBlogPosts(), fetchProjects()])
        .then(([blogData, projectData]) => {
          console.log('Fetched blog posts:', blogData);
          console.log('Fetched projects:', projectData);
        })
        .catch((error) => {
          console.error('Error fetching content:', error);
          setError('Failed to fetch content');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [user, fetchBlogPosts, fetchProjects]);
  
  if (sessionLoading || loading) {
    console.log('Loading state:', { sessionLoading, loading });
    return (
      <div className="container mx-auto p-6">
        <div className="card-theme shadow-md rounded-lg p-6 mb-6 border border-theme">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    console.log('Error state:', error);
    return (
      <div className="container mx-auto p-6">
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <div className="border-b border-border">
          <nav className="-mb-px flex justify-between items-center">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('blog')}
                className={`${
                  activeTab === 'blog'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium`}
              >
                Blog Posts
              </button>
              <button
                onClick={() => setActiveTab('projects')}
                className={`${
                  activeTab === 'projects'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium`}
              >
                Projects
              </button>
            </div>
            <Link
              href={`/admin/content/new/${activeTab === 'blog' ? 'blog' : 'project'}`}
              className="flex items-center gap-2 px-4 py-2 text-primary rounded-lg hover:bg-primary/10 transition-colors"
            >
              <Plus size={20} />
              <span>New {activeTab === 'blog' ? 'Blog Post' : 'Project'}</span>
            </Link>
          </nav>
        </div>
      </div>

      <div className="grid gap-4">
        {activeTab === 'blog' ? (
          blogPosts.length > 0 ? (
            blogPosts.map((post) => (
              <Link
                key={post.id}
                href={`/admin/content/blog/${post.id}`}
                className="block bg-card border border-border rounded-lg p-4 hover:bg-card/80 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {post.cover_image && (
                    <img
                      src={post.cover_image}
                      alt={post.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  )}
                  <div>
                    <h2 className="font-medium text-foreground">{post.title}</h2>
                    <p className="text-sm text-muted-foreground">
                      {post.excerpt || post.content.substring(0, 100) + '...'}
                    </p>
                    <div className="flex gap-2 mt-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-12">
              <h3 className="mt-2 text-sm font-medium text-foreground">
                No blog posts
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Get started by creating a new blog post.
              </p>
            </div>
          )
        ) : projects.length > 0 ? (
          projects.map((project) => (
            <Link
              key={project.id}
              href={`/admin/content/project/${project.id}`}
              className="block bg-card border border-border rounded-lg p-4 hover:bg-card/80 transition-colors"
            >
              <div className="flex items-center gap-4">
                {project.cover_image && (
                  <img
                    src={project.cover_image}
                    alt={project.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                )}
                <div>
                  <h2 className="font-medium text-foreground">
                    {project.title}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {project.description}
                  </p>
                  <div className="flex gap-2 mt-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center py-12">
            <h3 className="mt-2 text-sm font-medium text-foreground">
              No projects
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Get started by creating a new project.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
