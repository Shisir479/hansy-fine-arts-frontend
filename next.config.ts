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
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
