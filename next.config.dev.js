/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  // Désactiver temporairement le mode strict pour éviter les doubles rendus
  reactStrictMode: false,

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
      ? process.env.NEXT_PUBLIC_SITE_URL || '' 
      : '',

  // Configuration optimisée pour résoudre les problèmes de Fast Refresh
  webpack: (config, { dev, isServer }) => {
    // Uniquement pour le développement
    if (dev) {
      // Optimisations pour Fast Refresh
      config.optimization = {
        ...config.optimization,
        moduleIds: 'named',
        runtimeChunk: 'single',
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all'
            }
          }
        }
      };
      
      // Désactiver le hashing des noms de fichiers en développement
      // pour réduire les problèmes de Hot Reload
      config.output = {
        ...config.output,
        filename: dev ? 'static/chunks/[name].js' : 'static/chunks/[name].[contenthash].js',
        chunkFilename: dev ? 'static/chunks/[name].js' : 'static/chunks/[name].[contenthash].js'
      };
      
      // Paramètres de watch optimisés
      config.watchOptions = {
        ignored: ['**/.git/**', '**/node_modules/**'],
        aggregateTimeout: 500,
        poll: false
      };
    }
    return config;
  },

  // Votre configuration pour onDemandEntries (optimisée)
  onDemandEntries: {
    maxInactiveAge: 60 * 60 * 1000, // 1 heure
    pagesBufferLength: 5,
  },

  // Paramètres supplémentaires pour améliorer la performance
  swcMinify: true,
  experimental: {
    optimizeCss: true,  // Optimizer la CSS
    esmExternals: 'loose',
    serverComponentsExternalPackages: []
  }
};

// Ajout de configuration pour éviter les erreurs d'authentification
nextConfig.env = {
  ...nextConfig.env,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'https://' + process.env.REPL_SLUG + '.' + process.env.REPL_OWNER + '.repl.co',
};

module.exports = nextConfig;
