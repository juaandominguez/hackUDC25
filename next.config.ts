import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  crossOrigin: "anonymous",
  images: {
    domains: ['static.zara.net', 'static.massimodutti.net', 'static.bershka.net', 'static.oysho.net', 'encrypted-tbn0.gstatic.com'],
  }
};

export default nextConfig;
