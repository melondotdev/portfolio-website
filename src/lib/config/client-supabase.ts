import { createBrowserClient } from '@supabase/ssr';
import { getClientEnv } from './client-env';

// Create a single instance for client operations
let supabaseClientInstance: ReturnType<typeof createBrowserClient> | null =
  null;

export function supabasePublicClient() {
  if (supabaseClientInstance) {
    return supabaseClientInstance;
  }

  const clientEnv = getClientEnv();

  if (!clientEnv.supabaseUrl || !clientEnv.supabaseAnonKey) {
    console.error('Supabase environment variables are not properly configured');
    throw new Error('Supabase configuration is missing');
  }

  supabaseClientInstance = createBrowserClient(
    clientEnv.supabaseUrl,
    clientEnv.supabaseAnonKey,
  );

  return supabaseClientInstance;
}

// Export the Supabase client for use in components
export const supabase = supabasePublicClient();
