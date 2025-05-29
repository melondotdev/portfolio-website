import * as dotenvx from '@dotenvx/dotenvx';
import { z } from 'zod';

const serverEnvSchema = z.object({
  supabaseUrl: z.string().url(),
  supabaseServiceRoleKey: z.string().min(1),
  openaiKey: z.string().min(1),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

export function getServerEnv(): ServerEnv {
  return {
    supabaseUrl: dotenvx.get('NEXT_PUBLIC_SUPABASE_URL'),
    supabaseServiceRoleKey: dotenvx.get('SUPABASE_SERVICE_ROLE_KEY'),
    openaiKey: dotenvx.get('OPEN_AI_KEY'),
  };
}
