'use client';

import { signIn } from '@/lib/auth/supabase-auth';
import { useSession } from '@/lib/providers/SessionProvider';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: sessionLoading } = useSession();

  useEffect(() => {
    // Check if user is already logged in
    if (!sessionLoading && user) {
      const redirectTo = searchParams.get('redirect') || '/admin';
      router.push(redirectTo);
    }
  }, [user, sessionLoading, router, searchParams]);

  useEffect(() => {
    // Check if user just verified their email
    if (searchParams.get('verified') === 'true') {
      setSuccess('Your email has been verified successfully. Please sign in.');
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const { data, error: signInError } = await signIn(email, password);

      if (signInError) {
        if (signInError.message.includes('Email not confirmed')) {
          setError(
            'Please check your email to confirm your account before signing in.',
          );
        } else if (signInError.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please try again.');
        } else {
          setError(signInError.message);
        }
        return;
      }

      if (data?.user) {
        // Get the redirect URL from search params or default to dashboard
        const redirectTo = searchParams.get('redirect') || '/admin';
        router.push(redirectTo);
        router.refresh();
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An error occurred during login',
      );
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while checking session
  if (sessionLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-theme mx-auto" />
          <p className="mt-4 text-theme">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is already logged in, don't show the login form
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="flex flex-col items-center justify-center">
          <div className="w-full max-w-md space-y-8 rounded-lg card-theme p-6 shadow-lg border border-theme">
            {!success && (
              <div>
                <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-theme">
                  Sign in to your account
                </h2>
              </div>
            )}

            {error && (
              <div className="rounded-md bg-destructive/10 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-destructive">
                      Error
                    </h3>
                    <div className="mt-2 text-sm text-destructive">
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {success ? (
              <div className="rounded-md bg-accent/10 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-accent-foreground">
                      Success
                    </h3>
                    <div className="mt-2 text-sm text-accent-foreground">
                      <p>{success}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-theme-secondary"
                      >
                        Email address
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required={true}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-theme shadow-sm focus:border-accent focus:outline-none focus:ring-accent sm:text-sm"
                        placeholder="Enter your email"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-theme-secondary"
                      >
                        Password
                      </label>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required={true}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-theme shadow-sm focus:border-accent focus:outline-none focus:ring-accent sm:text-sm"
                        placeholder="Enter your password"
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary group relative flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold"
                    >
                      {loading ? 'Signing in...' : 'Sign in'}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
