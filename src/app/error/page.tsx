import Link from 'next/link'

export default function ErrorPage() {
  return (
    <div className="min-h-screen bg-dark-blue flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-900 p-8 rounded-lg border border-gray-800">
        <h1 className="text-2xl font-bold mb-4 text-white">Authentication Error</h1>
        <p className="text-gray-400 mb-6">
          There was a problem with your authentication. This could be due to an expired or invalid link.
        </p>
        <div className="flex justify-center">
          <Link 
            href="/login" 
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Return to Login
          </Link>
        </div>
      </div>
    </div>
  )
} 