import { supabaseServerClient } from '@/lib/config/server-supabase';
import type { UserResponse } from '@/lib/types/cms';

// Save user response to a page (all users)
export async function saveUserResponse(userId: string, pageId: string, response: Record<string, unknown>, score?: number) {
  const supabase = supabaseServerClient();
  
  // Check if a response already exists and update it, or create a new one
  const { data: existingResponse } = await supabase
    .from('user_responses')
    .select('id')
    .eq('user_id', userId)
    .eq('page_id', pageId)
    .single();

  if (existingResponse) {
    const typedResponse = existingResponse as { id: string };
    
    // Update existing response
    const { data, error } = await supabase
      .from('user_responses')
      .update({
        response,
        score,
        completed: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', typedResponse.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating user response:', error);
      throw new Error('Failed to save response');
    }

    return {
      id: data.id,
      userId: data.user_id,
      pageId: data.page_id,
      response: data.response,
      score: data.score,
      completed: data.completed,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    } as UserResponse;
  }

  // Create new response
  const { data, error } = await supabase
    .from('user_responses')
    .insert({
      user_id: userId,
      page_id: pageId,
      response,
      score,
      completed: true
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating user response:', error);
    throw new Error('Failed to save response');
  }

  return {
    id: data.id,
    userId: data.user_id,
    pageId: data.page_id,
    response: data.response,
    score: data.score,
    completed: data.completed,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  } as UserResponse;
} 