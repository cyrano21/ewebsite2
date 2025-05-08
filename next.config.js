
// Fichier: next.config.js
/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true, // Mettez-le à true pour le développement

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: 'localhost' }
    ],
  },

  // Configuration HMR améliorée (déplacée au niveau racine)
  webpackDevMiddleware: (config) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
      ignored: /node_modules/,
    };
    return config;
  },
  
  poweredByHeader: false,
  
  // Améliorer la stabilité du HMR
  onDemandEntries: {
    maxInactiveAge: 60 * 60 * 1000, // 1 heure
    pagesBufferLength: 5,
  },

  sassOptions: {
    includePaths: ['./styles'],
  },

  webpack: (config) => {
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

  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:4000',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:4000',
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
  }
};

module.exports = nextConfig;
