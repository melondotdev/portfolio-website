-- First, verify the page exists
SELECT id, title FROM public.pages WHERE id = '123e4567-e89b-12d3-a456-426614174000';

-- Then, link it to the blog module
INSERT INTO public.module_pages (
    id,
    module_id,
    page_id,
    order_index,
    created_at,
    updated_at
) VALUES (
    '123e4567-e89b-12d3-a456-426614174001',
    '00000000-0000-0000-0000-000000000002', -- Blog module ID from the logs
    '123e4567-e89b-12d3-a456-426614174000',
    3, -- This will be the fourth post in the blog module
    '2024-03-20T00:00:00Z',
    '2024-03-20T00:00:00Z'
)
ON CONFLICT (id) DO UPDATE
SET order_index = 3,
    updated_at = '2024-03-20T00:00:00Z'; 