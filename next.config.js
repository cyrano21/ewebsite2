/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // pas besoin ici de l'env, Next.js lit le .env.local tout seul
};

module.exports = nextConfig;
