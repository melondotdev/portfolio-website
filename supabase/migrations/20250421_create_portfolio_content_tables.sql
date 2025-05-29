-- Create blog_posts table
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content TEXT NOT NULL,
    excerpt TEXT,
    cover_image TEXT,
    author_id UUID REFERENCES auth.users(id),
    published BOOLEAN DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp,
    tags TEXT[] DEFAULT '{}'::TEXT[],
    metadata JSONB DEFAULT '{}'::JSONB,
    CONSTRAINT blog_posts_pkey PRIMARY KEY (id)
);

-- Create projects table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    content TEXT NOT NULL,
    cover_image TEXT,
    author_id UUID REFERENCES auth.users(id),
    published BOOLEAN DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp,
    tags TEXT[] DEFAULT '{}'::TEXT[],
    technologies TEXT[] DEFAULT '{}'::TEXT[],
    live_url TEXT,
    github_url TEXT,
    metadata JSONB DEFAULT '{}'::JSONB,
    CONSTRAINT projects_pkey PRIMARY KEY (id)
);

-- Create triggers for updated_at
CREATE TRIGGER update_blog_posts_updated_at
    BEFORE UPDATE ON public.blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Blog posts policies
CREATE POLICY "Public blog posts are viewable by everyone"
    ON public.blog_posts FOR SELECT
    USING (published = true);

CREATE POLICY "Admins can view all blog posts"
    ON public.blog_posts FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Only admins can insert blog posts"
    ON public.blog_posts FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Only admins can update blog posts"
    ON public.blog_posts FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Only admins can delete blog posts"
    ON public.blog_posts FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Projects policies
CREATE POLICY "Public projects are viewable by everyone"
    ON public.projects FOR SELECT
    USING (published = true);

CREATE POLICY "Admins can view all projects"
    ON public.projects FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Only admins can insert projects"
    ON public.projects FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Only admins can update projects"
    ON public.projects FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Only admins can delete projects"
    ON public.projects FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    ); 