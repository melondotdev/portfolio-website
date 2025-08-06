'use client';

import { Header } from '@/components/Header';
import { ProjectModal } from '@/components/ProjectModal';
import type { Project } from '@/lib/types/cms';
import { useEffect, useState } from 'react';

export default function Home() {
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
      <Header activePage="projects" />

      {/* Hero Section */}
      <div className="pt-24 pb-4 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-start gap-8">
            <div className="flex-1">
              <div className="max-w-[75%]">
                <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-2">
                  behold, some truly exceptional works
                </h1>
                <p className="text-md text-muted-foreground">
                  i.e. web applications, tools, games, videos
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Gallery */}
      <div className="relative pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading
              ? // Loading skeleton
                Array.from({ length: 6 }).map((_) => (
                  <div
                    key={`skeleton-${crypto.randomUUID()}`}
                    className="bg-card rounded-lg shadow-md p-6 animate-pulse"
                  >
                    <div className="h-4 bg-muted rounded w-3/4 mb-4" />
                    <div className="h-4 bg-muted rounded w-1/2 mb-4" />
                    <div className="h-4 bg-muted rounded w-full" />
                  </div>
                ))
              : projects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => setSelectedProject(project)}
                    className="block w-full text-left bg-card rounded-lg shadow-md hover:shadow-lg transition-shadow h-full"
                    type="button"
                  >
                    <article className="flex flex-col h-full">
                      {project.cover_image && (
                        <div className="relative h-48 w-full rounded-t-lg overflow-hidden">
                          <img
                            src={project.cover_image}
                            alt={project.title}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      )}
                      <div className="p-6 flex-1 flex flex-col">
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
                        <div className="flex items-center justify-between text-sm text-muted-foreground mt-auto">
                          <span>melondotdev</span>
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

      {/* Footer */}
      <footer className="border-t border-border mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} melondotdev. all rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
