export interface Page {
  id: string;
  title: string;
  slug: string;
  pageType: 'lecture' | 'quiz' | 'worksheet';
  content?: string;
  bannerImage?: string;
  authorId?: string;
  authorName?: string;
  createdAt: string;
  updatedAt: string;
  intLinks?: string[];
  extLinks?: string[];
  metadata?: {
    duration?: string;
    dueDate?: string;
    [key: string]: unknown;
  };
}

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  cover_image?: string;
  author_id: string;
  published: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
  tags: string[];
  metadata: Record<string, unknown>;
};

export type Project = {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  cover_image?: string;
  author_id: string;
  published: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
  tags: string[];
  technologies: string[];
  live_url?: string;
  github_url?: string;
  metadata: Record<string, unknown>;
};
