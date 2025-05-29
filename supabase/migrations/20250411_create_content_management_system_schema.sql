-- Create a function to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = current_timestamp;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Pages table to store all types of content (lectures, quizzes, worksheets)
CREATE TABLE IF NOT EXISTS public.pages (
    id UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    page_type TEXT NOT NULL CHECK (page_type IN ('lecture', 'quiz', 'worksheet')),
    content TEXT,
    banner_image TEXT,
    author_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp,
    int_links TEXT[] DEFAULT '{}'::TEXT[],
    ext_links TEXT[] DEFAULT '{}'::TEXT[],
    metadata JSONB DEFAULT '{}'::JSONB,
    CONSTRAINT pages_pkey PRIMARY KEY (id)
);

-- Create a trigger to update the updated_at column
CREATE TRIGGER update_pages_updated_at
BEFORE UPDATE ON public.pages
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Courses table
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    thumbnail TEXT,
    level TEXT CHECK (level IN ('Beginner', 'Intermediate', 'Advanced')),
    instructor_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp,
    CONSTRAINT courses_pkey PRIMARY KEY (id)
);

-- Create a trigger to update the updated_at column
CREATE TRIGGER update_courses_updated_at
BEFORE UPDATE ON public.courses
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Modules table
CREATE TABLE IF NOT EXISTS public.modules (
    id UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp,
    CONSTRAINT modules_pkey PRIMARY KEY (id),
    CONSTRAINT unique_module_order UNIQUE (course_id, order_index)
);

-- Create a trigger to update the updated_at column
CREATE TRIGGER update_modules_updated_at
BEFORE UPDATE ON public.modules
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Module_pages table (relationship between modules and pages)
CREATE TABLE IF NOT EXISTS public.module_pages (
    id UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
    page_id UUID NOT NULL REFERENCES public.pages(id),
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp,
    CONSTRAINT module_pages_pkey PRIMARY KEY (id),
    CONSTRAINT unique_page_order UNIQUE (module_id, order_index)
);

-- Create a trigger to update the updated_at column
CREATE TRIGGER update_module_pages_updated_at
BEFORE UPDATE ON public.module_pages
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- User_responses table for storing user interaction data
CREATE TABLE IF NOT EXISTS public.user_responses (
    id UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    page_id UUID NOT NULL REFERENCES public.pages(id) ON DELETE CASCADE,
    response JSONB NOT NULL,
    score INTEGER,
    completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp,
    CONSTRAINT user_responses_pkey PRIMARY KEY (id),
    CONSTRAINT unique_user_page_response UNIQUE (user_id, page_id)
);

-- Create a trigger to update the updated_at column
CREATE TRIGGER update_user_responses_updated_at
BEFORE UPDATE ON public.user_responses
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies
-- Enable RLS
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.module_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_responses ENABLE ROW LEVEL SECURITY;

-- Pages policies
CREATE POLICY "Public pages are viewable by everyone" 
ON public.pages FOR SELECT USING (true);

CREATE POLICY "Only admins and instructors can insert pages" 
ON public.pages FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'instructor')
  )
);

CREATE POLICY "Only admins and instructors can update pages" 
ON public.pages FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'instructor')
  )
);

-- Courses policies
CREATE POLICY "Public courses are viewable by everyone" 
ON public.courses FOR SELECT USING (true);

CREATE POLICY "Only admins can insert courses" 
ON public.courses FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Only admins can update courses" 
ON public.courses FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Modules policies
CREATE POLICY "Public modules are viewable by everyone" 
ON public.modules FOR SELECT USING (true);

CREATE POLICY "Only admins and instructors can insert modules" 
ON public.modules FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'instructor')
  )
);

CREATE POLICY "Only admins and instructors can update modules" 
ON public.modules FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'instructor')
  )
);

-- User_responses policies
CREATE POLICY "Users can view their own responses" 
ON public.user_responses FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Instructors and admins can view all responses" 
ON public.user_responses FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'instructor')
  )
);

CREATE POLICY "Users can insert their own responses" 
ON public.user_responses FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own responses" 
ON public.user_responses FOR UPDATE 
USING (auth.uid() = user_id); 