'use client';

import { createBrowserClient } from '@supabase/ssr';
import type { User } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useState } from 'react';
import type { PropsWithChildren } from 'react';

// Create a context for the session
type SessionContextType = {
  user: User | null;
  loading: boolean;
};

const SessionContext = createContext<SessionContextType>({
  user: null,
  loading: true,
});

// Custom hook to use the session
export function useSession() {
  return useContext(SessionContext);
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase environment variables');
      setLoading(false);
      return;
    }

    // Create a Supabase client
    const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

    // Get the initial session
    const getInitialSession = async () => {
      try {
        // First try to get the session from the server
        const response = await fetch('/api/auth/session');
        if (!response.ok) {
          throw new Error('Failed to fetch session from server');
        }
        const { session } = await response.json();

        if (session?.user) {
          setUser(session.user);
          setLoading(false);
          return;
        }

        // If no server session, try client-side user
        const { data: { user: clientUser }, error: userError } = await supabase.auth.getUser();
        if (userError) {
          console.error('Error getting user:', userError);
          setUser(null);
        } else {
          setUser(clientUser);
        }
      } catch (error) {
        console.error('Error getting session:', error);
        // If there's an error, try to get the user directly from Supabase
        try {
          const { data: { user: clientUser }, error: userError } = await supabase.auth.getUser();
          if (userError) {
            console.error('Error getting user from Supabase:', userError);
            setUser(null);
          } else {
            setUser(clientUser);
          }
        } catch (e) {
          console.error('Error getting user from Supabase:', e);
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    // Get initial session
    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event) => {
      // When auth state changes, get the user directly
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error('Error getting user after auth change:', userError);
        setUser(null);
      } else {
        setUser(currentUser);
      }
      setLoading(false);
    });

    // Add a visibility change handler to check session when tab becomes active
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible') {
        setLoading(true);
        try {
          // First try to get the session from the server
          const response = await fetch('/api/auth/session');
          if (response.ok) {
            const { session } = await response.json();
            if (session?.user) {
              setUser(session.user);
              setLoading(false);
              return;
            }
          }

          // If server session fails, try client-side user
          const { data: { user: clientUser }, error: userError } = await supabase.auth.getUser();
          if (userError) {
            console.error('Error getting user:', userError);
            setUser(null);
          } else {
            setUser(clientUser);
          }
        } catch (error) {
          console.error('Error checking session on visibility change:', error);
          // If there's an error, try to get the user directly from Supabase
          try {
            const { data: { user: clientUser }, error: userError } = await supabase.auth.getUser();
            if (userError) {
              console.error('Error getting user from Supabase:', userError);
              setUser(null);
            } else {
              setUser(clientUser);
            }
          } catch (e) {
            console.error('Error getting user from Supabase:', e);
            setUser(null);
          }
        } finally {
          setLoading(false);
        }
      }
    };

    // Add visibility change listener
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      subscription.unsubscribe();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <SessionContext.Provider value={{ user, loading }}>
      {children}
    </SessionContext.Provider>
  );
}
