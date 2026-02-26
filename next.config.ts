import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow larger file uploads (100MB for videos)
  experimental: {
    serverActions: {
      bodySizeLimit: '100mb',
    },
  },
  // Required for FFmpeg WASM
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
        ],
      },
    ];
  },
  // Handle canvas module for pdfjs-dist
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false,
        fs: false,
        path: false,
      };
    }
    // Also alias canvas to empty module
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: false,
    };
    return config;
  },
};

export default nextConfig;
