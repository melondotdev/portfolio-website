-- Add the AI Resume Tailoring blog post
INSERT INTO public.pages (
    id,
    title,
    slug,
    page_type,
    content,
    banner_image,
    author_id,
    created_at,
    updated_at,
    metadata
) VALUES (
    '123e4567-e89b-12d3-a456-426614174000', -- Using a fixed UUID for the blog post
    'Using AI to Tailor Your Resume: A Strategic Approach',
    'using-ai-to-tailor-your-resume',
    'lecture',
    '# Using AI to Tailor Your Resume: A Strategic Approach

In today''s competitive job market, a one-size-fits-all resume simply won''t cut it. Each job posting is looking for a specific set of skills and experiences, and your resume needs to reflect that. This article will guide you through using AI to strategically tailor your resume for each position.

## Why Tailoring Matters

Every job posting is unique, seeking a specific combination of skills, experiences, and personality traits. When you submit a generic resume, you risk giving the impression that you''re not genuinely interested in the specific role or that you''re applying out of desperation rather than passion.

## The Rise of AI in Resume Writing

AI has revolutionized the job search process by:
- Saving time in analyzing job descriptions
- Identifying key requirements efficiently
- Enabling you to apply to more positions
- Maintaining consistency in your applications

## Step-by-Step Guide to Using AI for Resume Tailoring

### Step 1: Analyzing the Job Description

Use this prompt template to analyze job descriptions:

```
Please analyze this job description and identify key words and phrases. Categorize them into:
1. Critical Requirements (must-have skills/experiences)
2. Important Requirements (strongly preferred)
3. Nice-to-Have Requirements (bonus qualifications)

Also, please separate out technical skills and tools into their own category.

Job Description:
[PASTE JOB DESCRIPTION HERE]

Additional Context:
[ANY ADDITIONAL INFORMATION ABOUT THE COMPANY OR ROLE]

Instructions:
- Do not modify or paraphrase the original wording
- Do not make up information not present in the job description
- Be thorough in identifying all requirements
- Maintain the exact wording from the job description
```

**Important**: Always evaluate the AI''s response. Add any keywords or phrases you think are important that the AI might have missed.

### Step 2: Crafting Your Summary of Qualifications

Using the critical requirements identified in Step 1, create a targeted summary with 5-7 bullet points. Each point should highlight your most relevant experience and skills.

### Step 3: Optimizing Your Technical Skills Section

Reorganize your technical skills section to:
- Prioritize skills mentioned in the job description
- Group related skills together
- Remove irrelevant skills
- Add any missing critical technical skills

### Step 4: Strategic Experience Selection

Review your work and volunteer experience to:
- Identify which experiences best demonstrate the critical requirements
- Determine which experiences need more detailed bullet points
- Decide which experiences can be summarized briefly or removed

### Step 5: Enhancing Individual Experience Descriptions

Use this prompt template for each work experience:

```
Please help me enhance my work experience description for [JOB TITLE] at [COMPANY]. 

Critical Requirements to Address:
[LIST CRITICAL REQUIREMENTS]

Important Requirements to Address:
[LIST IMPORTANT REQUIREMENTS]

Current Experience Description:
[PASTE CURRENT DESCRIPTION]

Instructions:
- Create [NUMBER] accomplishment-based bullet points
- Each bullet point should follow the format: ACTION VERB + CONTEXT + POSITIVE OUTCOME
- Focus on quantifiable achievements
- Ensure each bullet point addresses at least one critical or important requirement
- Do not make up information
- Keep all information factual and verifiable
```

**Remember**: Process each work experience individually for better quality results.

### Step 6: Final Review and Optimization

Ensure that:
- All critical requirements are addressed
- Most important requirements are covered
- Nice-to-have requirements are included where relevant
- The flow and context make sense
- No information is fabricated

## Conclusion

AI can be a powerful tool in your job search arsenal, but it''s not a replacement for human judgment. Use AI to analyze, suggest, and optimize, but always maintain control over the final product. Remember that your resume is a reflection of your professional story - make sure it''s authentic, accurate, and compelling.',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=600',
    NULL, -- author_id will be set to NULL for now
    '2024-03-20T00:00:00Z',
    '2024-03-20T00:00:00Z',
    '{"category": "Career Development", "readTime": "10 min read"}'::jsonb
);

-- Link the blog post to the blog module
INSERT INTO public.module_pages (
    id,
    module_id,
    page_id,
    order_index,
    created_at,
    updated_at
) VALUES (
    '123e4567-e89b-12d3-a456-426614174001', -- Using a fixed UUID for the module page
    (SELECT id FROM public.modules WHERE title = 'Blog Posts'),
    '123e4567-e89b-12d3-a456-426614174000', -- Using the same UUID as the page
    2, -- This will be the third post in the blog module
    '2024-03-20T00:00:00Z',
    '2024-03-20T00:00:00Z'
); 