import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's.yimg.com',
      },
      {
        protocol: 'https',
        hostname: 'static.reuters.com',
      },
      {
        protocol: 'https',
        hostname: 'images.mktw.net',
      },
      {
        protocol: 'https',
        hostname: 'image.cnbclow.com',
      },
      {
        protocol: 'https',
        hostname: 'finnhub.io',
      },
      {
        protocol: 'https',
        hostname: 'static.finnhub.io',
      },
      {
        protocol: 'https',
        hostname: 'mw3.wsj.net',
      },
      {
        protocol: 'https',
        hostname: 'static2.finnhub.io',
      },
      {
        protocol: 'https',
        hostname: 'image.cnbcfm.com',
      },
      {
        protocol: 'https',
        hostname: '*.cnbcfm.com',
      },
      {
        protocol: 'https',
        hostname: '*.bloomberglp.com',
      },
      {
        protocol: 'https',
        hostname: '*.reuters.com',
      },
      {
        protocol: 'https',
        hostname: '*.wsj.net',
      },
      {
        protocol: 'https',
        hostname: '*.marketwatch.com',
      },
      {
        protocol: 'https',
        hostname: '*.yimg.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'www.gravatar.com',
      }
    ],
  },
};

export default nextConfig;
