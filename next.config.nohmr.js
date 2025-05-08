/** @type {import('next').NextConfig} */
const path = require('path');

// Configuration Next.js sans HMR - solution aux rechargements en boucle
const nextConfig = {
  // Désactiver complètement le mode strict 
  reactStrictMode: false,

  // Configuration pour les images
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: 'localhost' }
    ],
  },

  // Désactiver complètement les erreurs d'hydratation en dev
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Webpack - configurations nécessaires pour désactiver HMR et éviter les rechargements
  webpack: (config, { dev, isServer }) => {
    // Désactiver le HMR complètement en dev
    if (dev && !isServer) {
      // Supprimer les plugins de HMR qui causent les rechargements
      config.plugins = config.plugins.filter(
        (plugin) => 
          !plugin.constructor.name.includes('HotModuleReplacement') &&
          !plugin.constructor.name.includes('ReactRefreshPlugin')
      );
      
      // Supprimer les entrées HMR
      const entry = config.entry;
      config.entry = async () => {
        const entries = await entry();
        
        // Supprimer toutes les entrées liées au HMR
        Object.keys(entries).forEach((key) => {
          if (key.includes('webpack-hmr') || key.includes('hot-update')) {
            delete entries[key];
          }
          
          // Filtrer les entrées de type tableau pour supprimer les scripts HMR
          if (Array.isArray(entries[key])) {
            entries[key] = entries[key].filter(
              (item) => !item.includes('webpack-hmr') && !item.includes('hot-update')
            );
          }
        });
        
        return entries;
      };
      
      // Désactiver watchOptions pour éviter les rechargements
      config.watchOptions = {
        ignored: ['**/*'],
      };
    }
    
    // Ajouter les alias
    config.resolve.alias = {
      ...config.resolve.alias,
      '@components': path.join(__dirname, 'components'),
      '@styles': path.join(__dirname, 'styles'),
      '@utils': path.join(__dirname, 'utils'),
      '@lib': path.join(__dirname, 'lib'),
      '@hooks': path.join(__dirname, 'hooks'),
      '@context': path.join(__dirname, 'context'),
      '@public': path.join(__dirname, 'public'),
    };
    
    return config;
  },

  // Variables d'environnement (port spécifié selon préférence utilisateur)
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:5173',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:5173',
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5173/api'
  }
};

module.exports = nextConfig;
