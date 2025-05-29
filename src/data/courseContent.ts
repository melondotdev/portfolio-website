import type { Course, Module, Page, ModulePage } from '@/lib/types/cms';

// Sample pages
const samplePages: Page[] = [
  // Lecture page
  {
    id: 'page1',
    title: 'Introduction to Job Search',
    slug: 'introduction-to-job-search',
    pageType: 'lecture',
    content: `
# Introduction to Job Search

Job searching can be a challenging process, but with the right approach, you can navigate it successfully.

## Key Elements of a Successful Job Search

1. **Clear Goals**: Define what you're looking for in your next role
2. **Strong Resume**: Highlight your skills and achievements
3. **Networking**: Connect with professionals in your field
4. **Interview Preparation**: Practice answering common questions

Remember that finding the right job takes time and persistence. Stay positive and be patient with the process.
    `,
    bannerImage: '/assets/course-images/job-search-intro.png',
    authorId: 'instructor1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    metadata: {
      duration: '15 minutes',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
    }
  },
  
  // Quiz page
  {
    id: 'page2',
    title: 'Job Search Fundamentals Quiz',
    slug: 'job-search-fundamentals-quiz',
    pageType: 'quiz',
    content: 'Test your knowledge of job search fundamentals',
    authorId: 'instructor1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    metadata: {
      duration: '10 minutes',
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
      questions: [
        {
          id: 'q1',
          question: 'What is the most important element of a resume?',
          options: [
            'Professional summary',
            'Education history',
            'Relevant skills and experience',
            'References'
          ],
          correctAnswer: 2
        },
        {
          id: 'q2',
          question: 'Which of the following is NOT typically part of the job application process?',
          options: [
            'Submitting a resume',
            'Interviewing with the hiring manager',
            'Negotiating salary',
            'Designing the company logo'
          ],
          correctAnswer: 3
        }
      ]
    }
  },
  
  // Worksheet page
  {
    id: 'page3',
    title: 'Job Search Action Plan Worksheet',
    slug: 'job-search-action-plan-worksheet',
    pageType: 'worksheet',
    content: `
# Job Search Action Plan Worksheet

Use this worksheet to create your personalized job search action plan.

## Career Goals

1. What type of role are you looking for?
2. What industries interest you most?
3. What are your salary expectations?

## Timeline

1. When do you want to start your new job?
2. How many hours per week can you dedicate to job searching?
3. What milestones do you want to set for your search?

## Skills Assessment

1. What are your top 3 technical skills?
2. What are your top 3 soft skills?
3. What skills do you need to develop for your target role?
    `,
    authorId: 'instructor1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    metadata: {
      duration: '20 minutes'
    }
  },
  
  // Resume lecture
  {
    id: 'page4',
    title: 'Resume Structure and Format',
    slug: 'resume-structure-format',
    pageType: 'lecture',
    content: `
# Resume Structure and Format

A well-structured resume is essential for making a good first impression with potential employers.

## Key Sections

1. **Contact Information**: Your name, email, phone number, and LinkedIn profile
2. **Professional Summary**: A brief overview of your experience and skills
3. **Work Experience**: Your relevant work history with accomplishments
4. **Education**: Your educational background
5. **Skills**: Technical and soft skills relevant to the position

## Formatting Tips

- Keep your resume to 1-2 pages
- Use a clean, professional font
- Include white space for readability
- Be consistent with formatting
- Use bullet points for easy scanning
    `,
    bannerImage: '/assets/course-images/resume-format.png',
    authorId: 'instructor2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    metadata: {
      duration: '25 minutes'
    }
  },
  
  // Resume worksheet
  {
    id: 'page5',
    title: 'Resume Building Worksheet',
    slug: 'resume-building-worksheet',
    pageType: 'worksheet',
    content: `
# Resume Building Worksheet

Use this worksheet to gather all the information you need for your resume.

## Contact Information
- Full Name:
- Email:
- Phone:
- LinkedIn URL:
- Portfolio/Website (if applicable):

## Professional Summary
Write a brief (2-3 sentence) summary of your professional background and key strengths:

## Work Experience
For each relevant position, list:
- Company name:
- Job title:
- Dates of employment:
- 3-5 bullet points highlighting accomplishments:
  1.
  2.
  3.

## Education
- Degree:
- Institution:
- Graduation date:
- Relevant coursework:

## Skills
List your relevant technical and soft skills:
    `,
    authorId: 'instructor2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    metadata: {
      duration: '30 minutes'
    }
  },
  
  // STAR method lecture
  {
    id: 'page6',
    title: 'Understanding the STAR Method',
    slug: 'understanding-star-method',
    pageType: 'lecture',
    content: `
# Understanding the STAR Method

The STAR method is a structured approach to answering behavioral interview questions.

## What is STAR?

- **S**ituation: Describe the context and background
- **T**ask: Explain your responsibility or challenge
- **A**ction: Detail the specific steps you took
- **R**esult: Share the outcomes of your actions

## Example STAR Response

**Question**: Tell me about a time you solved a difficult problem at work.

**Situation**: At my previous company, we were experiencing a significant drop in website conversion rates after launching a new design.

**Task**: I was responsible for identifying the issue and implementing a solution to improve conversion rates.

**Action**: I conducted A/B testing to compare elements of the old and new designs. Through data analysis, I discovered that the new call-to-action buttons were less visible to users. I redesigned the buttons with higher contrast and a clearer value proposition.

**Result**: Within two weeks of implementing the changes, our conversion rate increased by 25%, surpassing even the rates we had before the redesign.
    `,
    bannerImage: '/assets/course-images/star-method.png',
    authorId: 'instructor1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    metadata: {
      duration: '30 minutes'
    }
  }
];

// Create ModulePages relationship data
const modulePages: ModulePage[] = [
  {
    id: 'mp1',
    moduleId: 'module1',
    pageId: 'page1',
    orderIndex: 0,
    page: samplePages[0]
  },
  {
    id: 'mp2',
    moduleId: 'module1',
    pageId: 'page2',
    orderIndex: 1,
    page: samplePages[1]
  },
  {
    id: 'mp3',
    moduleId: 'module1',
    pageId: 'page3',
    orderIndex: 2,
    page: samplePages[2]
  },
  {
    id: 'mp4',
    moduleId: 'module2',
    pageId: 'page4',
    orderIndex: 0,
    page: samplePages[3]
  },
  {
    id: 'mp5',
    moduleId: 'module2',
    pageId: 'page5',
    orderIndex: 1,
    page: samplePages[4]
  },
  {
    id: 'mp6',
    moduleId: 'module3',
    pageId: 'page6',
    orderIndex: 0,
    page: samplePages[5]
  }
];

// Create modules with pages
const sampleModules: Module[] = [
  {
    id: 'module1',
    title: 'Job Search Fundamentals',
    description: 'Learn the essential skills needed to navigate your job search successfully.',
    courseId: 'course1',
    orderIndex: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    metadata: {
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() // 14 days from now
    },
    pages: modulePages.filter(mp => mp.moduleId === 'module1')
  },
  {
    id: 'module2',
    title: 'Resume Building',
    description: 'Learn how to create a compelling resume that showcases your skills and experience.',
    courseId: 'course1',
    orderIndex: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    pages: modulePages.filter(mp => mp.moduleId === 'module2')
  },
  {
    id: 'module3',
    title: 'Interview Preparation',
    description: 'Master the art of interviewing with proven techniques and strategies.',
    courseId: 'course1',
    orderIndex: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    pages: modulePages.filter(mp => mp.moduleId === 'module3')
  }
];

// Create sample courses
export const updatedCourses: Course[] = [
  {
    id: 'course1',
    title: 'Job Search Fundamentals',
    description: 'Learn the essential skills needed to navigate your job search successfully.',
    thumbnail: '/assets/course-images/job-search.png',
    instructorId: 'instructor1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    modules: sampleModules
  },
  {
    id: 'course2',
    title: 'Resume Writing Mastery',
    description: 'Master the art of creating compelling resumes that stand out to employers.',
    thumbnail: '/assets/course-images/resume-writing.png',
    instructorId: 'instructor2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    modules: []
  },
  {
    id: 'course3',
    title: 'Interview Strategies',
    description: 'Learn proven techniques to ace your interviews and land your dream job.',
    thumbnail: '/assets/course-images/interview-prep.png',
    instructorId: 'instructor1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    modules: []
  },
  {
    id: 'course4',
    title: 'Career Planning',
    description: 'Create a strategic plan for your career growth and professional development.',
    thumbnail: '/assets/course-images/career-planning.png',
    instructorId: 'instructor2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    modules: []
  }
];

// Export sample data - this would normally come from Supabase
export const mockData = {
  courses: updatedCourses,
  modules: sampleModules,
  pages: samplePages,
  modulePages: modulePages
}; 