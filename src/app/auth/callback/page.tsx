'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/lib/config/client-supabase';

export default function AuthCallbackPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Check if we have a hash in the URL
        const hash = window.location.hash;
        const searchParams = new URLSearchParams(window.location.search);
        
        // Handle hash-based auth (OAuth flow)
        if (hash) {
          // Parse the hash parameters
          const params = new URLSearchParams(hash.substring(1));
          const accessToken = params.get('access_token');
          const refreshToken = params.get('refresh_token');
          
          if (accessToken && refreshToken) {
            // Set the session
            const { error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });
            
            if (sessionError) {
              console.error('Error setting session:', sessionError);
              setError('Failed to authenticate');
              setLoading(false);
              return;
            }
            
            // Redirect to dashboard
            router.push('/admin');
            return;
          }
        }
        
        // Handle email verification flow
        const token = searchParams.get('token');
        const type = searchParams.get('type');
        
        if (token && type === 'signup') {
          // Verify the email
          const { error: verifyError } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: 'signup',
          });
          
          if (verifyError) {
            console.error('Error verifying email:', verifyError);
            setError('Failed to verify your email. The link may have expired.');
            setLoading(false);
            return;
          }
          
          // After verification, try to get the session
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          
          if (sessionError) {
            console.error('Error getting session:', sessionError);
            setError('Failed to authenticate after verification');
            setLoading(false);
            return;
          }
          
          if (session) {
            // User is now authenticated, redirect to dashboard
            router.push('/admin');
            return;
          }
          
          // Verification successful but no session, redirect to login
          router.push('/login?verified=true');
          return;
        }
        
        // If we get here, we don't have valid authentication data
        setError('Invalid authentication data');
        setLoading(false);
      } catch (err) {
        console.error('Error handling auth callback:', err);
        setError('An unexpected error occurred');
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-theme">
        <div className="text-center">
          <Loader2 className="animate-spin h-8 w-8 mx-auto text-theme mb-4" />
          <p className="text-theme">Verifying your account...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-theme p-4">
        <div className="w-full max-w-md">
          <div className="card-theme p-8 rounded-lg border border-theme">
            <h2 className="text-2xl font-bold mb-6 text-center text-theme">Authentication Error</h2>
            <div className="bg-destructive/10 text-destructive p-3 rounded-lg mb-4">
              {error}
            </div>
            <div className="text-center">
              <button
                type="button"
                onClick={() => router.push('/login')}
                className="text-theme hover:text-theme-secondary transition-colors"
              >
                Return to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
} 