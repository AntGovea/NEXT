import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images:{
    remotePatterns:[
      {
        protocol:"https",
        hostname:"tailus.io",
      },
      {
        protocol:"https",
        hostname:"avatars.githubusercontent.com",
      }
    ]
  }
};

module.exports= nextConfig;
