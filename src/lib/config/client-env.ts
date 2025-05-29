import { z } from 'zod';

const clientEnvSchema = z.object({
  supabaseUrl: z.string().url(),
  supabaseAnonKey: z.string().min(1),
});

export type ClientEnv = z.infer<typeof clientEnvSchema>;

// Cache the environment variables to avoid repeated validation
let cachedEnv: ClientEnv | null = null;

export function getClientEnv(): ClientEnv {
  // Return cached environment if available
  if (cachedEnv) {
    return cachedEnv;
  }
  
  // Access environment variables directly
  const env = {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  };
  
  // Validate and cache the environment
  try {
    cachedEnv = clientEnvSchema.parse(env);
    return cachedEnv;
  } catch (error) {
    console.error('Environment validation error:', error);
    return env;
  }
}
