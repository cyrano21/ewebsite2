/**
 * no-hmr.js
 * Lancement de l'application Next.js sans HMR et patch Mongoose pour les options de connexion
 */

const http     = require('http');
const next     = require('next');
const mongoose = require('mongoose');
const { parse } = require('url');

// Passez NODE_ENV=production pour désactiver le mode dev et HMR
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
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
    // Désactivation du HMR en production (si NODE_ENV=production)
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(4000, (err) => {
    if (err) throw err;
    console.log(`> Serveur démarré sur http://localhost:4000  (dev=${dev})`);
  });
});
