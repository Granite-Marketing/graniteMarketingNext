import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "cdn.prod.website-files.com",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
