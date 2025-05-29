import { createServerClient } from '@supabase/ssr';
import type { CookieOptions } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from './lib/config/middleware';

// Define user roles
export type UserRole = 'admin' | 'instructor' | 'student';

// Define protected routes and their allowed roles
const protectedRoutes: Record<string, UserRole[]> = {
  '/admin': ['admin'],
};

// Define public routes that should never be protected
const publicRoutes = [
  '/',
  '/login',
  '/auth',
  '/unauthorized',
  '/blog',
];

export async function middleware(request: NextRequest) {
  // Get the pathname from the URL
  const { pathname } = new URL(request.url);

  // Skip middleware for public routes
  if (
    publicRoutes.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`),
    )
  ) {
    return NextResponse.next();
  }

  // First update the session
  const response = await updateSession(request);

  // If we're on the login page, don't check roles
  if (pathname === '/login') {
    return response;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
  }

  // Create a Supabase client configured to use cookies
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        response.cookies.set(name, value, options);
      },
      remove(name: string, options: CookieOptions) {
        response.cookies.set(name, '', options);
      },
    },
  });

  // Get user session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If no user, redirect to login
  if (!user) {
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Fetch user role from profiles table
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError || !profileData) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  const userRole = profileData.role as UserRole;

  // Check if the path is protected
  const isProtectedRoute = Object.keys(protectedRoutes).some((route) =>
    pathname.startsWith(route),
  );

  if (isProtectedRoute) {
    // Find the matching route
    const matchingRoute = Object.keys(protectedRoutes).find((route) =>
      pathname.startsWith(route),
    );

    if (matchingRoute && !protectedRoutes[matchingRoute].includes(userRole)) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  return response;
}

// Configure which paths the middleware should run on
export const config = {
  matcher: ['/admin/:path*'],
};
