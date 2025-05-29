import { supabaseServerClient } from '@/lib/config/server-supabase';
import type { Course, Module, ModulePage, Page } from '@/lib/types/cms';

// Create a new course (admin only)
export async function createCourse(
  courseData: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>,
) {
  const supabase = supabaseServerClient();

  const { data, error } = await supabase
    .from('courses')
    .insert({
      title: courseData.title,
      description: courseData.description,
      thumbnail: courseData.thumbnail,
      instructor_id: courseData.instructorId,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating course:', error);
    throw new Error('Failed to create course');
  }

  return {
    id: data.id,
    title: data.title,
    description: data.description,
    thumbnail: data.thumbnail,
    instructorId: data.instructor_id,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    modules: [],
  } as Course;
}

// Create a new module (admin or instructor only)
export async function createModule(
  moduleData: Omit<Module, 'id' | 'createdAt' | 'updatedAt' | 'pages'>,
) {
  const supabase = supabaseServerClient();

  // Get the current highest order_index for this course
  const { data: modules, error: modulesError } = await supabase
    .from('modules')
    .select('order_index')
    .eq('course_id', moduleData.courseId)
    .order('order_index', { ascending: false })
    .limit(1);

  if (modulesError) {
    console.error('Error getting modules order:', modulesError);
    throw new Error('Failed to create module');
  }

  const nextOrderIndex =
    modules && Array.isArray(modules) && modules.length > 0
      ? (modules[0] as { order_index: number }).order_index + 1
      : 0;

  // Create the module
  const { data, error } = await supabase
    .from('modules')
    .insert({
      title: moduleData.title,
      description: moduleData.description,
      course_id: moduleData.courseId,
      order_index: nextOrderIndex,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating module:', error);
    throw new Error('Failed to create module');
  }

  return {
    id: data.id,
    title: data.title,
    description: data.description,
    courseId: data.course_id,
    orderIndex: data.order_index,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    pages: [],
  } as Module;
}

// Create a new page (admin or instructor only)
export async function createPage(
  pageData: Omit<Page, 'id' | 'createdAt' | 'updatedAt'>,
) {
  const supabase = supabaseServerClient();

  const pageDataToInsert = {
    title: pageData.title,
    slug: pageData.slug,
    page_type: pageData.pageType,
    content: pageData.content || '',
    created_at: new Date().toISOString(),
    ...(pageData.bannerImage && { banner_image: pageData.bannerImage }),
    ...(pageData.authorId && { author_id: pageData.authorId }),
    int_links: pageData.intLinks || [],
    ext_links: pageData.extLinks || [],
    metadata: pageData.metadata || {},
  };

  const { data, error } = await supabase
    .from('pages')
    .insert(pageDataToInsert)
    .select()
    .single();

  if (error) {
    console.error('Error creating page:', error);
    throw new Error('Failed to create page');
  }

  return {
    id: data.id,
    title: data.title,
    slug: data.slug,
    pageType: data.page_type,
    content: data.content,
    bannerImage: data.banner_image,
    authorId: data.author_id,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    intLinks: data.int_links,
    extLinks: data.ext_links,
    metadata: data.metadata,
  } as Page;
}

// Add a page to a module (admin or instructor only)
export async function addPageToModule(moduleId: string, pageId: string) {
  const supabase = supabaseServerClient();

  // Get the current highest order_index for this module
  const { data: modulePages, error: modulePagesError } = await supabase
    .from('module_pages')
    .select('order_index')
    .eq('module_id', moduleId)
    .order('order_index', { ascending: false })
    .limit(1);

  if (modulePagesError) {
    console.error('Error getting module pages order:', modulePagesError);
    throw new Error('Failed to add page to module');
  }

  const nextOrderIndex =
    modulePages && Array.isArray(modulePages) && modulePages.length > 0
      ? (modulePages[0] as { order_index: number }).order_index + 1
      : 0;

  // Create the relationship
  const { data, error } = await supabase
    .from('module_pages')
    .insert({
      module_id: moduleId,
      page_id: pageId,
      order_index: nextOrderIndex,
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding page to module:', error);
    throw new Error('Failed to add page to module');
  }

  // Get the page details
  const { data: page, error: pageError } = await supabase
    .from('pages')
    .select('*')
    .eq('id', pageId)
    .single();

  if (pageError) {
    console.error('Error fetching page:', pageError);
    throw new Error('Failed to add page to module');
  }

  return {
    id: data.id,
    moduleId: data.module_id,
    pageId: data.page_id,
    orderIndex: data.order_index,
    page: {
      id: page.id,
      title: page.title,
      slug: page.slug,
      pageType: page.page_type,
      content: page.content,
      bannerImage: page.banner_image,
      authorId: page.author_id,
      createdAt: page.created_at,
      updatedAt: page.updated_at,
      intLinks: page.int_links,
      extLinks: page.ext_links,
      metadata: page.metadata,
    },
  } as ModulePage;
}
