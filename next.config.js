/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { 
    ignoreDuringBuilds: true 
  },
  typescript: { 
    ignoreBuildErrors: true 
  },
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
  // Configuration supplémentaire pour les styles
  sassOptions: {
    includePaths: ['./styles'],
  },
  // Optimiser la gestion des assets statiques
  assetPrefix: process.env.NODE_ENV === 'production' ? undefined : undefined,
  
  // Configuration webpack pour résoudre le problème d'importation CSS
  webpack: (config) => {
    // Modifier la règle pour les fichiers CSS
    const rules = config.module.rules
      .find((rule) => typeof rule.oneOf === 'object')
      ?.oneOf;
    
    if (rules) {
      // S'assurer que la règle CSS utilise les bons loaders
      rules.forEach((rule) => {
        if (rule.test && rule.test.test && rule.test.test('file.css')) {
          if (rule.use && Array.isArray(rule.use)) {
            rule.use.forEach((loader) => {
              if (loader.options && loader.options.modules) {
                // Désactiver les modules CSS pour bootstrap
                loader.options.modules = {
                  ...loader.options.modules,
                  auto: (resourcePath) => !resourcePath.includes('node_modules')
                };
              }
            });
          }
        }
      });
    }
    
    return config;
  },
  
  // pas besoin ici de l'env, Next.js lit le .env.local tout seul
};

module.exports = nextConfig;
