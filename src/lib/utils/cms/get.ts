import { supabaseServerClient } from '@/lib/config/server-supabase';
import type { Course, Module } from '@/lib/types/cms';
import type {} from '@/lib/types/response/cms';
import { isValidModulePage, isValidPage } from '@/lib/validators/cms';
import { getSafeLinks, getSafeMetadata } from './helpers';

// Get all courses
export async function getAllCourses() {
  const supabase = supabaseServerClient();
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching courses:', error);
    return [];
  }

  return data.map(
    (course: {
      id: string;
      title: string;
      description: string;
      thumbnail: string | null;
      instructor_id: string;
      created_at: string;
      updated_at: string;
    }) => ({
      id: course.id,
      title: course.title,
      description: course.description,
      thumbnail: course.thumbnail,
      instructorId: course.instructor_id,
      createdAt: course.created_at,
      updatedAt: course.updated_at,
      modules: [],
    }),
  ) as Course[];
}

// Get a single course with all modules and pages
export async function getCourseById(courseId: string) {
  const supabase = supabaseServerClient();

  // First get the course
  const { data: course, error: courseError } = await supabase
    .from('courses')
    .select('*')
    .eq('id', courseId)
    .single();

  if (courseError) {
    console.error('Error fetching course:', courseError);
    return null;
  }

  // Then get the modules for this course
  const { data: modules, error: modulesError } = await supabase
    .from('modules')
    .select('*')
    .eq('course_id', courseId)
    .order('order_index', { ascending: true });

  if (modulesError) {
    console.error('Error fetching modules:', modulesError);
    return {
      id: course.id,
      title: course.title,
      description: course.description,
      thumbnail: course.thumbnail,
      instructorId: course.instructor_id,
      createdAt: course.created_at,
      updatedAt: course.updated_at,
      modules: [],
    } as Course;
  }

  // For each module, get its pages
  const enrichedModules: Module[] = [];

  if (modules && Array.isArray(modules)) {
    for (const module of modules) {
      const typedModule = module as {
        id: string;
        title: string;
        description: string;
        course_id: string;
        order_index: number;
        created_at: string;
        updated_at: string;
      };

      // Get module_pages relationships
      const { data: modulePages, error: modulePagesError } = await supabase
        .from('module_pages')
        .select(`
          id,
          module_id,
          page_id,
          order_index,
          page:pages (
            id,
            title,
            slug,
            page_type,
            content,
            banner_image,
            author_id,
            created_at,
            updated_at,
            int_links,
            ext_links,
            metadata
          )
        `)
        .eq('module_id', typedModule.id)
        .order('order_index', { ascending: true });

      if (modulePagesError) {
        console.error('Error fetching module pages:', modulePagesError);
        enrichedModules.push({
          id: typedModule.id,
          title: typedModule.title,
          description: typedModule.description,
          courseId: typedModule.course_id,
          orderIndex: typedModule.order_index,
          createdAt: typedModule.created_at,
          updatedAt: typedModule.updated_at,
          pages: [],
        } as Module);
        continue;
      }

      if (!modulePages || !Array.isArray(modulePages)) {
        enrichedModules.push({
          id: typedModule.id,
          title: typedModule.title,
          description: typedModule.description,
          courseId: typedModule.course_id,
          orderIndex: typedModule.order_index,
          createdAt: typedModule.created_at,
          updatedAt: typedModule.updated_at,
          pages: [],
        } as Module);
        continue;
      }

      const validModulePages = modulePages.filter(isValidModulePage);

      enrichedModules.push({
        id: typedModule.id,
        title: typedModule.title,
        description: typedModule.description,
        courseId: typedModule.course_id,
        orderIndex: typedModule.order_index,
        createdAt: typedModule.created_at,
        updatedAt: typedModule.updated_at,
        pages: validModulePages.map((mp) => {
          if (!isValidPage(mp.page)) {
            console.error('Invalid page data:', mp.page);
            return {
              id: mp.id,
              moduleId: mp.module_id,
              pageId: mp.page_id,
              orderIndex: mp.order_index,
              page: {
                id: '',
                title: 'Invalid Page',
                slug: '',
                pageType: '',
                content: '',
                bannerImage: null,
                authorId: '',
                createdAt: '',
                updatedAt: '',
                intLinks: [],
                extLinks: [],
                metadata: {},
              },
            };
          }
          return {
            id: mp.id,
            moduleId: mp.module_id,
            pageId: mp.page_id,
            orderIndex: mp.order_index,
            page: {
              id: mp.page.id,
              title: mp.page.title,
              slug: mp.page.slug,
              pageType: mp.page.page_type,
              content: mp.page.content,
              bannerImage: mp.page.banner_image,
              authorId: mp.page.author_id,
              createdAt: mp.page.created_at,
              updatedAt: mp.page.updated_at,
              intLinks: getSafeLinks(mp.page, 'int_links'),
              extLinks: getSafeLinks(mp.page, 'ext_links'),
              metadata: getSafeMetadata(mp.page),
            },
          };
        }),
      } as Module);
    }
  }

  // Return the fully hydrated course
  return {
    id: course.id,
    title: course.title,
    description: course.description,
    thumbnail: course.thumbnail,
    instructorId: course.instructor_id,
    createdAt: course.created_at,
    updatedAt: course.updated_at,
    modules: enrichedModules,
  } as Course;
}

// Get user's progress for a course
export async function getUserCourseProgress(userId: string, courseId: string) {
  const supabase = supabaseServerClient();

  // Get all pages in this course
  const { data: course, error: courseError } = await supabase
    .from('courses')
    .select(`
      id,
      modules:modules(
        id,
        module_pages:module_pages(
          page_id
        )
      )
    `)
    .eq('id', courseId)
    .single();

  if (courseError || !course) {
    console.error('Error fetching course:', courseError);
    return 0;
  }

  // Extract all page IDs from the course
  const pageIds: string[] = [];
  if (course.modules && Array.isArray(course.modules)) {
    for (const module of course.modules) {
      if (module.module_pages && Array.isArray(module.module_pages)) {
        for (const modulePage of module.module_pages) {
          pageIds.push(modulePage.page_id);
        }
      }
    }
  }

  if (pageIds.length === 0) {
    return 0;
  }

  // Get completed user responses
  const { data: responses, error } = await supabase
    .from('user_responses')
    .select('id')
    .eq('user_id', userId)
    .eq('completed', true)
    .in('page_id', pageIds);

  if (error) {
    console.error('Error fetching user progress:', error);
    return 0;
  }

  // Calculate progress percentage
  return Math.round((responses.length / pageIds.length) * 100);
}
