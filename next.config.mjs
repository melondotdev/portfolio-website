/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [    ],
  },
  webpack: (config, { isServer }) => {
    // For server-side rendering, alias 'lru-cache' to ensure compatibility.
    if (isServer) {
      // In ES modules, we can't use require.resolve
      // Instead, we'll use a simple string alias
      config.resolve.alias['lru-cache'] = 'lru-cache';
    }
    return config;
  },
};

export default nextConfig; 