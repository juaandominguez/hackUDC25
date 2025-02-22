import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  crossOrigin: "anonymous",
  images: {
    domains: ['static.zara.net'],
  }
};

export default nextConfig;
