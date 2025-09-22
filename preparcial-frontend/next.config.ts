import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static1.mujerhoy.com',
      },
      {
        protocol: 'https',
        hostname: 'imagenes1.casadellibro.com',
      },
      {
        protocol: 'https',
        hostname: 'trabalibros.com',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org', 
      },
    ],
  },
};

export default nextConfig;
