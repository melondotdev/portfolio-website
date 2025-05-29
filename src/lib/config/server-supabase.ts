import { createServerClient } from '@supabase/ssr';
import type { CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { getServerEnv } from './server-env';

// Create a single instance for server operations
let supabaseServerInstance: ReturnType<typeof createServerClient> | null = null;

export function supabaseServerClient() {
  if (supabaseServerInstance) {
    return supabaseServerInstance;
  }

  const serverEnv = getServerEnv();
  const cookieStore = cookies();

  supabaseServerInstance = createServerClient(
    serverEnv.supabaseUrl,
    serverEnv.supabaseServiceRoleKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set(name, value, options);
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set(name, '', options);
        },
      },
    },
  );

  return supabaseServerInstance;
}

// Helper function to create a new user with a default role
export async function createUserWithRole(
  email: string,
  password: string,
  name?: string,
) {
  const supabase = supabaseServerClient();

  // Create the user in Supabase Auth
  const { data: authData, error: authError } =
    await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name },
    });

  if (authError || !authData.user) {
    console.error('Error creating user:', authError);
    throw new Error('Failed to create user');
  }

  // Insert the user into the users table with default student role
  const { error: profileError } = await supabase.from('profiles').insert({
    id: authData.user.id,
    email: authData.user.email,
    role: 'student',
    created_at: new Date().toISOString(),
  });

  if (profileError) {
    console.error('Error creating user profile:', profileError);
    // If profile creation fails, we should clean up the auth user
    await supabase.auth.admin.deleteUser(authData.user.id);
    throw new Error('Failed to create user profile');
  }

  return authData.user;
}

// Helper function to update a user's role (admin only)
export async function updateUserRole(
  userId: string,
  newRole: 'admin' | 'instructor' | 'student',
) {
  const supabase = supabaseServerClient();

  const { error } = await supabase
    .from('profiles')
    .update({ role: newRole })
    .eq('id', userId);

  if (error) {
    console.error('Error updating user role:', error);
    throw new Error('Failed to update user role');
  }

  return true;
}

// Helper function to get a user's role
export async function getUserRole(userId: string) {
  const supabase = supabaseServerClient();

  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user role:', error);
    return 'student'; // Default role
  }

  return data?.role || 'student';
}
