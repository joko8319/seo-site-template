import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static export for fast hosting
  // output: "export", // Uncomment for fully static site

  images: {
    // Add domains for external images
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
