import { createServerClient } from '@supabase/ssr';
import type { CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
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
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    });

    // Get the user directly
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error('Error getting user:', userError);
      return NextResponse.json({ session: null }, { status: 200 });
    }

    // Fetch the user's role from the profiles table
    const { data: userData, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Error fetching user role:', profileError);
      return NextResponse.json({ session: null }, { status: 200 });
    }

    // Create a session object with the user and role
    const session = {
      user: {
        ...user,
        user_metadata: {
          ...user.user_metadata,
          role: userData.role,
        },
      },
    };

    return NextResponse.json({ session }, { status: 200 });
  } catch (error) {
    console.error('Error in session route:', error);
    return NextResponse.json({ session: null }, { status: 200 });
  }
}
