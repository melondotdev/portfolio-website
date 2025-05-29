import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { updateUserRole } from '../../../../lib/config/server-supabase';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { z } from 'zod';

// Define validation schema for role update
const updateRoleSchema = z.object({
  userId: z.string().uuid(),
  role: z.enum(['admin', 'instructor', 'student']),
});

export async function PUT(request: NextRequest) {
  try {
    // Create a Supabase client for the route handler
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // Check if user is authenticated and is an admin
    const { data: { session } } = await supabase.auth.getSession();
    const userRole = session?.user?.user_metadata?.role;
    
    if (!session?.user || userRole !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    // Parse and validate request body
    const body = await request.json();
    const validatedData = updateRoleSchema.parse(body);
    
    // Update user role
    await updateUserRole(validatedData.userId, validatedData.role);
    
    return NextResponse.json(
      { success: true, message: 'User role updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Role update error:', error);
    
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: 'Invalid input', errors: error.errors },
        { status: 400 }
      );
    }
    
    // Handle other errors
    return NextResponse.json(
      { success: false, message: 'Failed to update user role' },
      { status: 500 }
    );
  }
} 