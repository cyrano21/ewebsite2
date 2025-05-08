/**
 * Configuration webpack personnalisée pour améliorer le Fast Refresh
 * et résoudre les problèmes de rechargement
 */
module.exports = {
  // Activer le mode développement
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  
  // Configuration avancée pour le HMR
  devServer: {
    hot: true,
    liveReload: false, // Désactiver le Live Reload standard pour éviter les conflits
    client: {
      // Éviter de rafraichir la page en cas d'erreur
      overlay: false,
      // Voir les messages détaillés dans la console
      logging: 'info',
      // Réessayer de se connecter en cas de perte de connexion
      reconnect: true,
      // Essayer 5 fois maximum avec un délai de 2 secondes
      reconnect: 5,
      reconnectInterval: 2000,
    },
    // Augmenter le délai avant de considérer les fichiers mis à jour
    watchOptions: {
      aggregateTimeout: 500, // augmenter le délai pour éviter les rechargements multiples
      poll: false, // éviter le polling qui peut surcharger le CPU
      ignored: ['node_modules/**', '.git/**', '.next/**'] // ignorer les dossiers qui changent rarement
    },
  },

  // Configuration watchOptions spécifique
  watchOptions: {
    aggregateTimeout: 300,
    poll: false,
    ignored: ['node_modules/**', '.git/**', '.next/**']
  },

  // Configuration de l'optimisation
  optimization: {
    moduleIds: 'named', // Aider au debugging
    runtimeChunk: 'single', // Améliorer la réutilisation entre builds
  },

  // Configuration du cache
  cache: {
    type: 'filesystem', // Utiliser le système de fichiers pour le cache
    buildDependencies: {
      config: [__filename] // Invalider le cache quand ce fichier change
    }
  },

  // Plugins spécifiques pour améliorer la stabilité du HMR
  plugins: []
};
