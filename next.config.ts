import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Configuration pour servir les fichiers statiques du dossier uploads
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: '/api/static/:path*',
      },
    ];
  },
  // Configuration pour les gros fichiers sur Vercel
  experimental: {
    serverComponentsExternalPackages: ['@octokit/rest'],
  },
  // Augmenter la limite de taille des API routes
  api: {
    bodyParser: {
      sizeLimit: '35mb',
    },
    responseLimit: '70mb',
  },
  // Configuration spécifique Vercel pour les gros fichiers
  async headers() {
    return [
      {
        source: '/api/admin/upload-multiple-to-git',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'POST, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
