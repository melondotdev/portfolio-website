'use client';

import { ProjectModal } from '@/components/ProjectModal';
import { ThemeToggle } from '@/components/ThemeToggle';
import type { Project } from '@/lib/types/cms';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch('/api/projects');
        if (response.ok) {
          const data = await response.json();
          setProjects(data || []);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
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
                <Link href="/projects" className="text-foreground">
                  Projects
                </Link>
                <Link
                  href="/blog"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
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
              Projects
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A collection of my work, experiments, and contributions to the
              tech community
            </p>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading
              ? // Loading skeleton
                Array.from({ length: 6 }, (_, i) => (
                  <div
                    key={`project-skeleton-${i}-${Date.now()}`}
                    className="bg-card rounded-lg shadow-md p-6 animate-pulse"
                  >
                    <div className="h-4 bg-muted rounded w-3/4 mb-4" />
                    <div className="h-4 bg-muted rounded w-1/2 mb-4" />
                    <div className="h-4 bg-muted rounded w-full" />
                  </div>
                ))
              : projects.map((project) => (
                  <button
                    type="button"
                    key={project.id}
                    onClick={() => setSelectedProject(project)}
                    className="block w-full text-left bg-card rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <article>
                      {project.cover_image && (
                        <div className="relative h-48 w-full">
                          <img
                            src={project.cover_image}
                            alt={project.title}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <h2 className="text-xl font-semibold text-foreground mb-2">
                          {project.title}
                        </h2>
                        <p className="text-sm text-muted-foreground mb-4">
                          {project.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.technologies?.map((tech) => (
                            <span
                              key={tech}
                              className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>{project.author_id}</span>
                          <span>
                            {new Date(project.created_at).toLocaleDateString(
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
                  </button>
                ))}
          </div>
        </div>
      </div>

      {/* Project Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
}
