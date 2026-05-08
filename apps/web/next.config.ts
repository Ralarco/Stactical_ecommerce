import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /** Enable React strict mode for development */
  reactStrictMode: true,

  /** Transpile monorepo packages */
  transpilePackages: [
    '@stactical/shared-types',
    '@stactical/events',
    '@stactical/config',
  ],

  /** Image optimization config */
  images: {
    remotePatterns: [
      // Add CDN domains here when ready
    ],
  },

  /** Security headers */
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

export default nextConfig;
