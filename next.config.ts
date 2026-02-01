import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self), payment=()",
          },
        ],
      },
      {
        source: "/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  async redirects() {
    return [
      {
        source: "/slot/:path*",
        destination: "/",
        permanent: false,
      },
      {
        source: "/gacor/:path*",
        destination: "/",
        permanent: false,
      },
      {
        source: "/togel/:path*",
        destination: "/",
        permanent: false,
      },
      {
        source: "/casino/:path*",
        destination: "/",
        permanent: false,
      },
      {
        source: "/poker/:path*",
        destination: "/",
        permanent: false,
      },
      {
        source: "/judi/:path*",
        destination: "/",
        permanent: false,
      },
      {
        source: "/judol/:path*",
        destination: "/",
        permanent: false,
      },
      {
        source: "/maxwin/:path*",
        destination: "/",
        permanent: false,
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
