import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('API: Courses endpoint hit');
    const cookieStore = cookies();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    console.log('API: Environment variables check:', {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseAnonKey,
    });

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('API: Missing Supabase environment variables');
      throw new Error('Missing Supabase environment variables');
    }

    // Create a Supabase client configured to use cookies
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    });

    console.log('API: Attempting to fetch courses from database...');
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('API: Database error fetching courses:', error);
      throw error;
    }

    console.log('API: Courses fetched successfully:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('API: Error in courses endpoint:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase environment variables');
    }

    // Create a Supabase client configured to use cookies
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    });

    const body = await request.json();
    const { data, error } = await supabase
      .from('courses')
      .insert({
        title: body.title,
        description: body.description,
        thumbnail: body.thumbnail,
        instructor_id: body.instructorId,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating course:', error);
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500 },
    );
  }
}
