import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  async headers() {
    return [
      {
        source: '/api/audio',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, s-maxage=2592000, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
