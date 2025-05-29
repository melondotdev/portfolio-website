'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { BlogPost, Project } from '@/lib/types/cms';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface ContentEditorProps {
  type: 'blog' | 'project';
  content: BlogPost | Project | null;
  isNew: boolean;
}

type FormData = {
  title: string;
  content: string;
  cover_image: string;
  published: boolean;
  tags?: string[];
  technologies?: string[];
  excerpt?: string;
  description?: string;
};

export default function ContentEditor({ type, content, isNew }: ContentEditorProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    title: '',
    content: '',
    cover_image: '',
    published: false,
    ...(type === 'blog' ? { tags: [], excerpt: '' } : { technologies: [], description: '' }),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (content) {
      setFormData(content as FormData);
    }
  }, [content]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const endpoint = type === 'blog' ? '/api/blog' : '/api/projects';
      const method = isNew ? 'POST' : 'PUT';
      const url = isNew ? endpoint : `${endpoint}/${content?.id}`;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to save content');
      }

      const data = await response.json();
      router.push('/admin');
    } catch (error) {
      console.error('Error saving content:', error);
      setError('Failed to save content');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!content?.id) return;

    if (!confirm('Are you sure you want to delete this content?')) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const endpoint = type === 'blog' ? '/api/blog' : '/api/projects';
      const response = await fetch(`${endpoint}/${content.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete content');
      }

      router.push('/admin');
    } catch (error) {
      console.error('Error deleting content:', error);
      setError('Failed to delete content');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-theme">
          {isNew ? `New ${type === 'blog' ? 'Blog Post' : 'Project'}` : 'Edit Content'}
        </h1>
        {!isNew && (
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            Delete
          </Button>
        )}
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>

        {type === 'blog' ? (
          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, excerpt: e.target.value })}
            />
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, content: e.target.value })}
            required
            className="min-h-[200px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cover_image">Cover Image URL</Label>
          <Input
            id="cover_image"
            type="url"
            value={formData.cover_image}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, cover_image: e.target.value })}
          />
        </div>

        {type === 'blog' && (
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={formData.tags?.join(', ') || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({
                  ...formData,
                  tags: e.target.value.split(',').map((tag: string) => tag.trim()),
                })
              }
            />
          </div>
        )}

        {type === 'project' && (
          <div className="space-y-2">
            <Label htmlFor="technologies">Technologies (comma-separated)</Label>
            <Input
              id="technologies"
              value={formData.technologies?.join(', ') || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({
                  ...formData,
                  technologies: e.target.value.split(',').map((tech: string) => tech.trim()),
                })
              }
            />
          </div>
        )}

        <div className="flex items-center space-x-2">
          <Switch
            id="published"
            checked={formData.published}
            onCheckedChange={(checked: boolean) =>
              setFormData({ ...formData, published: checked })
            }
          />
          <Label htmlFor="published">Published</Label>
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin')}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </form>
    </div>
  );
} 