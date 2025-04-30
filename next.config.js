/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**",
        pathname: "/**",
      },
    ],
  },
  // Ajout de redirections pour gérer les problèmes de casse (majuscules/minuscules)
  async redirects() {
    return [
      {
        source: "/Shop/:id*",
        destination: "/shop/:id*",
        permanent: true,
      },
    ];
  },
  // pas besoin ici de l'env, Next.js lit le .env.local tout seul
};

module.exports = nextConfig;
