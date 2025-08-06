-- Add video_link column to blog_posts table
ALTER TABLE public.blog_posts 
ADD COLUMN video_link TEXT;

-- Add comment to describe the column
COMMENT ON COLUMN public.blog_posts.video_link IS 'URL to embedded video (YouTube, Vimeo, etc.)'; 