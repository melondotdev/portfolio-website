'use client';

import { useSession } from '@/lib/providers/SessionProvider';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { BlogPost, Project } from '@/lib/types/cms';
import ContentEditor from '@/components/ContentEditor';

interface PageProps {
  params: {
    type: 'blog' | 'project';
    id: string;
  };
}

export default function ContentEditorPage({ params }: PageProps) {
  const router = useRouter();
  const { user, loading: sessionLoading } = useSession();
  const [content, setContent] = useState<BlogPost | Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionLoading && !user) {
      router.push('/login');
    }
  }, [user, sessionLoading, router]);

  useEffect(() => {
    const fetchContent = async () => {
      if (!user || params.id === 'new') {
        setLoading(false);
        return;
      }

      try {
        console.log(`Fetching ${params.type} with ID:`, params.id);
        const endpoint = params.type === 'blog' ? '/api/blog' : '/api/projects';
        const response = await fetch(`${endpoint}/${params.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || data.details || 'Failed to fetch content');
        }

        console.log(`Successfully fetched ${params.type}:`, data);
        setContent(data);
      } catch (error) {
        console.error(`Error fetching ${params.type}:`, error);
        setError(error instanceof Error ? error.message : 'Failed to fetch content');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [user, params.id, params.type]);

  if (sessionLoading || loading) {
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
    return (
      <div className="container mx-auto p-6">
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg">
          <h2 className="font-semibold mb-2">Error</h2>
          <p>{error}</p>
          <button
            onClick={() => router.push('/admin')}
            className="mt-4 text-sm underline hover:text-destructive/80"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <ContentEditor
        type={params.type}
        content={content}
        isNew={params.id === 'new'}
      />
    </div>
  );
} 