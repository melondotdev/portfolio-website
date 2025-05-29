-- Insert sample blog posts
INSERT INTO public.blog_posts (
    id,
    title,
    slug,
    content,
    excerpt,
    cover_image,
    author_id,
    published,
    published_at,
    tags,
    metadata
) VALUES
(
    '123e4567-e89b-12d3-a456-426614174001',
    'Building a Modern Portfolio with Next.js and Supabase',
    'building-modern-portfolio-nextjs-supabase',
    '# Building a Modern Portfolio with Next.js and Supabase

In this post, I''ll share my journey of building a modern portfolio website using Next.js 14 and Supabase. We''ll explore the key features, challenges, and solutions that made this project a success.

## Why Next.js and Supabase?

Next.js provides an excellent developer experience with its built-in features like:
- Server Components
- App Router
- API Routes
- Built-in optimizations

Supabase offers a powerful backend with:
- Authentication
- Database
- Storage
- Real-time subscriptions

## Key Features

1. **Content Management**
   - Blog posts
   - Project showcases
   - Markdown support
   - Image uploads

2. **Authentication**
   - Secure login
   - Role-based access
   - Protected routes

3. **Performance**
   - Server-side rendering
   - Static generation
   - Image optimization

## Challenges and Solutions

### Challenge 1: Content Management
Building a flexible CMS that supports both blog posts and projects required careful planning. The solution involved creating separate tables with common fields and specific requirements for each content type.

### Challenge 2: Authentication
Implementing secure authentication with role-based access control was crucial. Supabase''s built-in auth system made this straightforward, but we needed to add custom policies for content management.

### Challenge 3: Image Handling
Managing images for blog posts and projects required a robust solution. We implemented:
- Image upload to Supabase Storage
- Automatic optimization
- Responsive loading

## Conclusion

Building this portfolio has been a great learning experience. The combination of Next.js and Supabase provides a powerful, scalable solution for modern web applications.

Stay tuned for more posts about specific features and implementation details!',
    'A deep dive into building a modern portfolio website using Next.js 14 and Supabase, exploring key features, challenges, and solutions.',
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80&w=600',
    (SELECT id FROM auth.users WHERE email = 'admin@example.com'),
    true,
    CURRENT_TIMESTAMP,
    ARRAY['Next.js', 'Supabase', 'Web Development', 'Portfolio'],
    '{"readTime": "5 min read", "category": "Web Development"}'::jsonb
),
(
    '123e4567-e89b-12d3-a456-426614174002',
    'The Future of Web Development: AI and Developer Experience',
    'future-web-development-ai-dx',
    '# The Future of Web Development: AI and Developer Experience

The landscape of web development is rapidly evolving, with AI playing an increasingly important role in how we build and maintain applications. Let''s explore how AI is shaping the future of developer experience.

## AI in Development

### Code Generation
AI-powered tools like GitHub Copilot are revolutionizing how we write code. These tools can:
- Suggest code completions
- Generate entire functions
- Explain complex code
- Help with debugging

### Testing and Quality
AI is also transforming how we ensure code quality:
- Automated test generation
- Bug prediction
- Code review assistance
- Performance optimization

## Impact on Developer Experience

### Productivity
AI tools are helping developers:
- Write code faster
- Reduce boilerplate
- Focus on creative solutions
- Learn new technologies

### Learning and Growth
AI is changing how we learn programming:
- Personalized learning paths
- Interactive code examples
- Real-time feedback
- Documentation generation

## Future Trends

1. **AI-First Development**
   - More sophisticated code generation
   - Better understanding of context
   - Improved accuracy

2. **Enhanced Collaboration**
   - AI-assisted pair programming
   - Automated code reviews
   - Smart documentation

3. **New Development Paradigms**
   - Natural language programming
   - Visual development
   - Automated optimization

## Conclusion

The future of web development is exciting, with AI playing a crucial role in enhancing developer experience. As these tools evolve, we''ll see new ways of building and maintaining web applications.

What are your thoughts on AI in web development? Share your experiences in the comments!',
    'Exploring how AI is transforming web development and developer experience, from code generation to testing and beyond.',
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=600',
    (SELECT id FROM auth.users WHERE email = 'admin@example.com'),
    true,
    CURRENT_TIMESTAMP,
    ARRAY['AI', 'Web Development', 'Developer Experience', 'Future Tech'],
    '{"readTime": "4 min read", "category": "Technology"}'::jsonb
);

-- Insert sample projects
INSERT INTO public.projects (
    id,
    title,
    slug,
    description,
    content,
    cover_image,
    author_id,
    published,
    published_at,
    tags,
    technologies,
    live_url,
    github_url,
    metadata
) VALUES
(
    '123e4567-e89b-12d3-a456-426614174003',
    'AI-Powered Resume Builder',
    'ai-resume-builder',
    'An intelligent resume builder that uses AI to help users create tailored resumes for specific job applications.',
    '# AI-Powered Resume Builder

## Overview
This project leverages AI to help job seekers create tailored resumes for specific positions. The application analyzes job descriptions and suggests relevant content for users'' resumes.

## Features
- AI-powered job description analysis
- Resume content suggestions
- Multiple resume templates
- Export to PDF
- Real-time preview
- ATS optimization

## Technical Details
Built with:
- Next.js 14
- OpenAI API
- Tailwind CSS
- PDF generation
- Responsive design

## Challenges
1. **AI Integration**
   - Fine-tuning prompts
   - Cost optimization
   - Response quality

2. **PDF Generation**
   - Complex layouts
   - Font handling
   - Cross-browser compatibility

## Results
- 90% user satisfaction
- 50% faster resume creation
- 30% more interview calls

## Future Plans
- Resume scoring
- Cover letter generation
- Interview preparation
- Career path suggestions',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600',
    (SELECT id FROM auth.users WHERE email = 'admin@example.com'),
    true,
    CURRENT_TIMESTAMP,
    ARRAY['AI', 'Career', 'Productivity'],
    ARRAY['Next.js', 'OpenAI', 'Tailwind CSS', 'PDF Generation'],
    'https://ai-resume-builder.example.com',
    'https://github.com/username/ai-resume-builder',
    '{"duration": "3 months", "role": "Full Stack Developer"}'::jsonb
),
(
    '123e4567-e89b-12d3-a456-426614174004',
    'Real-time Collaborative Code Editor',
    'collaborative-code-editor',
    'A real-time collaborative code editor with syntax highlighting, live preview, and team collaboration features.',
    '# Real-time Collaborative Code Editor

## Overview
A web-based code editor that enables real-time collaboration between developers. Built with modern web technologies, it supports multiple programming languages and provides a seamless coding experience.

## Features
- Real-time collaboration
- Syntax highlighting
- Live preview
- File management
- Team chat
- Version control integration

## Technical Details
Built with:
- WebSocket
- Monaco Editor
- React
- Node.js
- PostgreSQL

## Challenges
1. **Real-time Sync**
   - Conflict resolution
   - Latency handling
   - State management

2. **Performance**
   - Large file handling
   - Memory optimization
   - Browser compatibility

## Results
- 1000+ active users
- 99.9% uptime
- 50ms sync latency

## Future Plans
- Code execution
- Debugging tools
- Plugin system
- Mobile support',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600',
    (SELECT id FROM auth.users WHERE email = 'admin@example.com'),
    true,
    CURRENT_TIMESTAMP,
    ARRAY['Collaboration', 'Development', 'Real-time'],
    ARRAY['WebSocket', 'Monaco Editor', 'React', 'Node.js', 'PostgreSQL'],
    'https://collab-editor.example.com',
    'https://github.com/username/collab-editor',
    '{"duration": "6 months", "role": "Lead Developer"}'::jsonb
); 