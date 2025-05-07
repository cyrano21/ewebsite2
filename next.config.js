/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  // reactStrictMode: false, // Vous aviez mis false. true est recommandé pour détecter les problèmes potentiels.
  reactStrictMode: true, // Recommandé, mais laissez false si cela cause d'autres soucis pour le moment.

  // Gardez ces lignes si vous avez besoin d'ignorer les erreurs ESLint/TypeScript
  // pendant la build, mais l'idéal est de corriger ces erreurs.
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // Votre configuration pour les images
  images: {
    domains: ['localhost', 'res.cloudinary.com'],
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },

  // Votre configuration pour SASS
  sassOptions: {
    includePaths: ['./styles'], // Assurez-vous que ce chemin est correct
  },

  // Votre configuration pour assetPrefix (pour déploiement)
  assetPrefix:
    process.env.NODE_ENV === 'production'
      ? process.env.NEXT_PUBLIC_SITE_URL || '' // Ajoutez un fallback vide au cas où
      : '',

  // --- SECTION WEBPACK SUPPRIMÉE ---
  // La section 'webpack' qui supprimait les plugins HMR et ReactRefresh a été enlevée
  // pour permettre à Fast Refresh de fonctionner.

  // Votre configuration pour onDemandEntries (peut être gardée si utile)
  onDemandEntries: {
    maxInactiveAge: 60 * 60 * 1000, // 1 heure
    pagesBufferLength: 5,
  },
};

// Ajout de configuration pour éviter les erreurs d'authentification
nextConfig.env = {
  ...nextConfig.env,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'https://' + process.env.REPL_SLUG + '.' + process.env.REPL_OWNER + '.repl.co',
};

module.exports = nextConfig;