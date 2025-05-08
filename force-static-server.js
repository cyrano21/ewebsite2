/**
 * Force Static Server - Solution radicale contre les rechargements en boucle
 * Ce script démarre un serveur Next.js sans aucun mécanisme de rechargement
 */

const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const path = require('path');
const fs = require('fs');

// Forcer le mode production pour éviter tout HMR
process.env.NODE_ENV = 'production';

// Désactiver explicitement le HMR de webpack
process.env.DISABLE_WEBPACK_HOT = 'true';
process.env.FAST_REFRESH = 'false';

// Créer l'application Next.js en mode production (pas de HMR)
const app = next({
  dev: false, // Très important: false = pas de rechargement
  conf: {
    distDir: '.next',
    reactStrictMode: false,
    swcMinify: true
  }
});

const handle = app.getRequestHandler();

// Préparer l'application et démarrer le serveur
app.prepare().then(() => {
  // Port du serveur
  const port = parseInt(process.env.PORT, 10) || 4000;
  
  console.log('🛑 MODE STATIQUE: Aucun rechargement automatique ne sera effectué');
  console.log('📌 Les modifications ne seront pas visibles sans redémarrer le serveur');
  
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    
    // Intercepter toutes les requêtes qui pourraient déclencher un rechargement
    if (req.url.includes('hot-update') || 
        req.url.includes('webpack-hmr') || 
        req.url.includes('on-demand-entries')) {
      console.log(`🚫 Blocage de requête HMR: ${req.url}`);
      res.statusCode = 404;
      res.end('HMR est désactivé');
      return;
    }
    
    // Traiter normalement toutes les autres requêtes
    handle(req, res, parsedUrl);
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`✅ Serveur statique démarré sur http://localhost:${port}`);
  });
});
