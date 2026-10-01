import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
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
