'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

export default function VerifyEmailPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Check if we're in a callback from Supabase
    const hash = window.location.hash;
    if (hash) {
      // We're in a callback, let the auth callback page handle it
      router.push(`/auth/callback${hash}`);
      return;
    }

    // Check if we have a session
    const checkSession = async () => {
      try {
        const { data: { session } } = await fetch('/api/auth/session').then(res => res.json());
        if (session) {
          // User is already logged in, redirect to dashboard
          router.push('/admin');
          return;
        }
      } catch (err) {
        console.error('Error checking session:', err);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="text-center">
          <Loader2 className="animate-spin h-8 w-8 mx-auto text-white mb-4" />
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4">
      <div className="w-full max-w-md">
        <div className="bg-zinc-900 p-8 rounded-lg border border-zinc-800">
          <h2 className="text-2xl font-bold mb-6 text-center text-white">Check Your Email</h2>
          {error && (
            <div className="bg-red-500/10 text-red-400 p-3 rounded-lg mb-4">
              {error}
            </div>
          )}
          <div className="text-zinc-300 mb-6">
            <p>We've sent a verification link to your email address.</p>
            <p className="mt-2">Please check your inbox and click the link to verify your account.</p>
          </div>
          <div className="text-center">
            <Link href="/login" className="text-white hover:text-zinc-300 transition-colors">
              Return to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 