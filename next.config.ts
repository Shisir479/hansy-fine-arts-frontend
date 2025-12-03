import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
   remotePatterns: [
      {
        protocol: 'http',
        hostname: '**', // Matches any hostname
      },
      {
        protocol: 'https',
        hostname: '**', // Matches any hostname
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
