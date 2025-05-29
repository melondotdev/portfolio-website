import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Github, ExternalLink, Calendar, User, X } from 'lucide-react';
import type { Project } from '@/lib/types/cms';
import { Button } from '@/components/ui/button';

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  if (!project) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="relative">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>

          {/* Project Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              {project.title}
            </h2>
            <div className="flex flex-wrap gap-4 items-center text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{project.author_id}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(project.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
              {project.published && (
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-primary/10 text-primary text-sm rounded-full">
                    Published
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Project Links */}
          {(project.live_url || project.github_url) && (
            <div className="flex gap-4 mb-8">
              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Live Demo</span>
                </a>
              )}
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-card text-foreground rounded-lg hover:bg-card/80 transition-colors"
                >
                  <Github className="w-4 h-4" />
                  <span>View Source</span>
                </a>
              )}
            </div>
          )}

          {/* Cover Image */}
          {project.cover_image && (
            <div className="relative w-full h-[300px] mb-8 rounded-lg overflow-hidden">
              <img
                src={project.cover_image}
                alt={project.title}
                className="object-cover w-full h-full"
              />
            </div>
          )}

          {/* Project Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
            <div dangerouslySetInnerHTML={{ __html: project.content }} />
          </div>

          {/* Technologies */}
          {project.technologies && project.technologies.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-foreground mb-4">Technologies Used</h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-foreground mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-muted text-muted-foreground rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          {project.metadata && Object.keys(project.metadata).length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4">Additional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(project.metadata).map(([key, value]) => (
                  <div key={key} className="bg-card p-4 rounded-lg">
                    <h4 className="font-medium text-foreground mb-2">{key}</h4>
                    <p className="text-muted-foreground">{String(value)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 