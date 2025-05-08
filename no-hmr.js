/**
 * no-hmr.js
 * Lancement de l'application Next.js sans HMR - VERSION AGGRESSIVE
 */

const http     = require('http');
const next     = require('next');
const mongoose = require('mongoose');
const { parse } = require('url');
const fs = require('fs');

// Force les variables d'environnement pour empêcher tout rechargement
process.env.DISABLE_WEBPACK_HMR = 'true';
process.env.FAST_REFRESH = 'false';

// Utiliser le mode dev mais avec HMR désactivé
const dev = true;
const app = next({ 
  dev,
  conf: {
    reactStrictMode: false,
    webpack: (config) => {
      // Supprimer les plugins HMR
      if (config.plugins) {
        config.plugins = config.plugins.filter(plugin => 
          !plugin.constructor.name.includes('HotModule') && 
          !plugin.constructor.name.includes('ReactRefresh'));
      }
      return config;
    }
  }
});

const handle = app.getRequestHandler();

// --- OPTIONS MONGOOSE MODERNES (plus de autoReconnect ni reconnectTries) ---
const mongooseOptions = {
  useNewUrlParser:    true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS:          45000,
  heartbeatFrequencyMS:     30000,
  maxPoolSize:              10,
  minPoolSize:              5,
  connectTimeoutMS:         60000,
  family:                   4,
  retryWrites:   true,
  retryReads:    true,
};

// Patch de mongoose.connect
const originalConnect = mongoose.connect.bind(mongoose);
mongoose.connect = async function(uri, options = {}) {
  console.log('🛡️ MongoDB: Tentative de connexion avec options renforcées');
  try {
    const conn = await originalConnect(uri, { ...mongooseOptions, ...options });
    console.log(`✅ MongoDB: Connecté à la base "${conn.connection.name}"`);
    return conn;
  } catch (err) {
    console.error('🔥 MongoDB: Erreur de connexion', err);
    throw err;
  }
};

app.prepare().then(() => {
  http.createServer((req, res) => {
    // Bloc HMR: refuser toutes les requêtes liées au rechargement
    const parsedUrl = parse(req.url, true);
    
    // Bloquer toutes les requêtes liées au HMR ou rechargement
    if (req.url.includes('hot-update') || 
        req.url.includes('webpack-hmr') || 
        req.url.includes('webpack-dev-server') ||
        req.url.includes('on-demand-entries') ||
        req.url.includes('react-refresh')) {
      console.log(`🚫 Blocage requête HMR: ${req.url}`);
      res.statusCode = 404;
      res.end();
      return;
    }
    
    handle(req, res, parsedUrl);
  }).listen(4000, (err) => {
    if (err) throw err;
    console.log('🔒 MODE STABLE: Rechargement automatique totalement désactivé');
    console.log(`✅ Serveur démarré sur http://localhost:4000 (SANS rechargement)`);
  });
});
