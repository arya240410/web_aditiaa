import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimisasi keamanan dan performa
  poweredByHeader: false, // Sembunyikan X-Powered-By header

  // Headers keamanan tambahan
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
      // Static assets
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

  // Redirect untuk URL mencurigakan
  async redirects() {
    return [
      // Block common spam/judol URL patterns
      {
        source: "/:path*slot:rest*",
        destination: "/",
        permanent: false,
      },
      {
        source: "/:path*gacor:rest*",
        destination: "/",
        permanent: false,
      },
      {
        source: "/:path*togel:rest*",
        destination: "/",
        permanent: false,
      },
      {
        source: "/:path*casino:rest*",
        destination: "/",
        permanent: false,
      },
      {
        source: "/:path*poker:rest*",
        destination: "/",
        permanent: false,
      },
      {
        source: "/:path*judi:rest*",
        destination: "/",
        permanent: false,
      },
    ];
  },

  // Images configuration
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    // Blokir domain gambar yang tidak diizinkan bisa ditambahkan di sini
  },
};

export default nextConfig;
