
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

  // Configuration HMR améliorée (en utilisant la méthode correcte)
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: /node_modules/,
      };
      
      // Désactiver la limite de taille des hot updates pour éviter les erreurs
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        chunks: 'all',
        cacheGroups: {
          ...config.optimization.splitChunks.cacheGroups,
          default: false,
        },
      };
    }
    
    // Améliorer la gestion des règles CSS pour éviter le problème "@import rules are not allowed here"
    const rules = config.module.rules.find(rule => typeof rule.oneOf === 'object').oneOf;
    
    // Configuration pour les data URLs SVG dans les CSS
    config.module.rules.push({
      test: /\.svg$/i,
      type: 'asset',
      resourceQuery: /url/, // *.svg?url
    });
    
    // Configuration spécifique pour CSS Modules
    config.module.rules.push({
      test: /\.module\.css$/,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            modules: {
              localIdentName: '[local]_[hash:base64:5]',
            },
            importLoaders: 1,
            url: {
              filter: (url) => !url.startsWith('data:'),
            },
          },
        },
      ],
    });
    
    // Configuration générale pour les fichiers CSS standards
    const cssRule = rules.find(rule => rule.sideEffects === false && rule.test && rule.test.toString().includes('css'));
    
    if (cssRule) {
      cssRule.use = cssRule.use.map(rule => {
        if (rule.loader && rule.loader.includes('css-loader')) {
          return {
            ...rule,
            options: {
              ...rule.options,
              importLoaders: 2,
              url: {
                filter: (url) => !url.startsWith('data:'),
              },
              import: true,
              modules: {
                auto: true,
                localIdentName: '[local]_[hash:base64:5]',
              }
            }
          };
        }
        return rule;
      });
    }
    
    // Ajouter une règle spécifique pour Bootstrap et autres fichiers CSS standards
    config.module.rules.push({
      test: /\.css$/,
      use: [
        'style-loader', 
        {
          loader: 'css-loader',
          options: {
            url: {
              filter: (url) => !url.startsWith('data:'),
            },
            importLoaders: 1,
          }
        }
      ],
      exclude: /\.module\.css$/,
    });
    
    // Configuration d'alias existante
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
  
  poweredByHeader: false,
  
  // Améliorer la stabilité du HMR
  onDemandEntries: {
    maxInactiveAge: 60 * 60 * 1000, // 1 heure
    pagesBufferLength: 5,
  },

  sassOptions: {
    includePaths: ['./styles'],
  },

  // La configuration webpack a été déplacée et fusionnée avec celle ci-dessus

  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:4000',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:4000',
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
  }
};

module.exports = nextConfig;
