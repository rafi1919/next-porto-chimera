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
      }
    ]
  }
};

export default nextConfig;
