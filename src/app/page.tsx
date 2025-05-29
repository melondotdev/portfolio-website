'use client';

import { ThemeToggle } from '@/components/ThemeToggle';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { BookOpen, Code2, Github, Youtube, Twitter } from 'lucide-react';
import Link from 'next/link';
import type { BlogPost, Project } from '@/lib/types/cms';

type Tab = 'blogs' | 'projects';

export default function Home() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('blogs');
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContent() {
      try {
        const [blogsRes, projectsRes] = await Promise.all([
          fetch('/api/blog'),
          fetch('/api/projects')
        ]);

        if (blogsRes.ok && projectsRes.ok) {
          const [blogsData, projectsData] = await Promise.all([
            blogsRes.json(),
            projectsRes.json()
          ]);
          setBlogs(blogsData || []);
          setProjects(projectsData || []);
        }
      } catch (error) {
        console.error('Error fetching content:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchContent();
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
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
                <Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
                  Blog
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4">
                <a
                  href="https://github.com/melondotdev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href="https://youtube.com/@melondotdev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Youtube className="w-5 h-5" />
                </a>
                <a
                  href="https://x.com/melondotdev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
              <div className="h-6 w-px bg-border" />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Carousel Background */}
      <div className="relative pt-32 pb-16 overflow-hidden">
        {/* Hero Content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Hi, I'm <span className="text-primary">Melon</span> 👋
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              I'm a full-stack developer passionate about building modern web applications and sharing my knowledge through code and tutorials.
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/projects')}
                className="btn-primary px-6 py-3 rounded-lg inline-flex items-center gap-2"
                type="button"
              >
                <Code2 className="w-5 h-5" />
                <span>View Projects</span>
              </button>
              <button
                onClick={() => router.push('/blog')}
                className="btn-accent px-6 py-3 rounded-lg inline-flex items-center gap-2"
                type="button"
              >
                <BookOpen className="w-5 h-5" />
                <span>Read Blog</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} melondotdev. All rights reserved.
            </div>
            <button
              onClick={() => router.push('/login')}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              type="button"
            >
              <span>Admin Login</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
