import { supabasePublicClient } from '../config/client-supabase';

// Get the Supabase client instance
const supabase = supabasePublicClient();

// Fetch user role from profiles table
export async function fetchUserRole(userId: string) {
  const { data: userData, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user role:', error);
    return null;
  }

  return userData?.role;
}

// Sign up with email and password
export async function signUp(email: string, password: string) {
  try {
    // Debug log
    console.log(
      'Attempting signup with Supabase URL:',
      process.env.NEXT_PUBLIC_SUPABASE_URL,
    );

    // 1. First create the auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          role: 'student', // Set default role in user metadata
        },
      },
    });

    if (authError) {
      console.error('Auth error during signup:', authError);
      return { data: null, error: authError };
    }

    if (!authData.user) {
      console.error('No user data returned from auth signup');
      return {
        data: null,
        error: {
          message: 'Failed to create user account.',
        },
      };
    }

    return { data: authData, error: null };
  } catch (err) {
    console.error('Unexpected error during signup:', err);
    // Log full error details
    console.error('Full error object:', JSON.stringify(err, null, 2));
    return {
      data: null,
      error: {
        message: 'An unexpected error occurred. Please try again later.',
      },
    };
  }
}

// Sign in with email and password
export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { data, error };
  } catch (err) {
    console.error('Unexpected error during signin:', err);
    return {
      data: null,
      error: {
        message: 'An unexpected error occurred. Please try again later.',
      },
    };
  }
}

// Sign out
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// Reset password
export async function resetPassword(email: string) {
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    return { data, error };
  } catch (err) {
    console.error('Unexpected error during password reset:', err);
    return {
      data: null,
      error: {
        message: 'An unexpected error occurred. Please try again later.',
      },
    };
  }
}

// Update password
export async function updatePassword(newPassword: string) {
  try {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    return { data, error };
  } catch (err) {
    console.error('Unexpected error during password update:', err);
    return {
      data: null,
      error: {
        message: 'An unexpected error occurred. Please try again later.',
      },
    };
  }
}

// Get current user
export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}
