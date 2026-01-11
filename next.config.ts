import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "pkvsfnyfnuqvuwgiqcxs.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],

    // Keep this – dev faster, prod optimized
    unoptimized: process.env.NODE_ENV === "development",
  },

  experimental: {
    optimizePackageImports: [
      "@hugeicons/react",
      "@hugeicons/core-free-icons",
      "motion/react",
    ],
  },
};

export default nextConfig;
