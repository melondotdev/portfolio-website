'use client';

import { useSession } from '@/lib/providers/SessionProvider';
import { Ban } from 'lucide-react';
import Link from 'next/link';

export default function UnauthorizedPage() {
  const { user } = useSession();
  const userRole = user?.user_metadata?.role;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white shadow-lg rounded-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            Access Denied
          </h1>
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Ban className="h-8 w-8 text-red-600" />
          </div>
          <p className="text-gray-600 mb-6">
            You don't have permission to access this page.
            {userRole && (
              <span className="block mt-2">
                Your current role:{' '}
                <span className="font-medium">{userRole}</span>
              </span>
            )}
          </p>
          <div className="space-y-4">
            <Link
              href="/"
              className="block w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-center"
            >
              Return to Home
            </Link>
            <Link
              href="/admin"
              className="block w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg text-center"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
