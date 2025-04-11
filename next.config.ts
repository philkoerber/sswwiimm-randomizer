import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb" //2mb should be enough, the rom (.gb) i had for testing was just a bit over 1mb
    }
  } 
};

export default nextConfig;
