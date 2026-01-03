import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,

  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
    // Speed up dev render by avoiding heavy optimization during dev
    unoptimized: process.env.NODE_ENV === "development",
  },
  experimental: {
    // Helps Turbopack resolve imports faster
    optimizePackageImports: [
      "@hugeicons/react",
      "@hugeicons/core-free-icons",
      "motion/react",
    ],
  },
};

export default nextConfig;
