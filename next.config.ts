import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images:{
    remotePatterns:[
      {
        protocol: 'https',
        hostname: 'assets.awwwards.com',
        port: '',
        pathname: '/awards/media/cache/**',
      },
     {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/storage/**',
      },
    ]
  }
};

export default nextConfig;
