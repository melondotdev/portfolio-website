import { useState } from 'react';
import { supabasePublicClient } from '../config/client-supabase';
import { AuthError } from '@supabase/supabase-js';

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const supabase = supabasePublicClient();

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError('');

      // 1. Sign up the user with role in metadata
      const { data: { user }, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: 'student'
          }
        }
      });

      if (signUpError) throw signUpError;
      if (!user) throw new Error('Signup failed');

      // The database trigger handle_new_user() will automatically create the user record
      // with the default 'student' role, so we don't need to do it manually

      return { user, error: null };
    } catch (err: unknown) {
      const errorMessage = err instanceof AuthError ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      return { user: null, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    signUp,
    loading,
    error,
  };
}