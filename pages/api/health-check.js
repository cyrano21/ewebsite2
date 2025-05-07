// pages/api/health-check.js
import mongoose from 'mongoose';
import db from '../../config/db';

export default async function handler(req, res) {
  // Résumé de l'état de l'application
  const health = {
    uptime: process.uptime(),
    timestamp: Date.now(),
    status: 'OK',
    environment: process.env.NODE_ENV,
    appUrl: process.env.NEXT_PUBLIC_APP_URL || 'Non configuré',
    mongodb: {
      status: 'Déconnecté',
      connection: null,
      error: null
    },
    nextjsConfig: {
      distDir: process.env.NEXT_DIST_DIR || '.next',
      assetPrefix: process.env.NEXT_PUBLIC_SITE_URL || ''
    },
    memoryUsage: process.memoryUsage()
  };

  try {
    // Vérifier la connexion MongoDB
    const conn = await db();
    if (conn && mongoose.connection.readyState === 1) {
      health.mongodb = {
        status: 'Connecté',
        connection: {
          host: mongoose.connection.host,
          port: mongoose.connection.port,
          database: mongoose.connection.name
        },
        error: null
      };
    } else {
      health.mongodb = {
        status: 'Erreur',
        connection: null,
        error: 'Impossible d\'établir une connexion'
      };
      health.status = 'Dégradé';
    }
  } catch (error) {
    health.mongodb = {
      status: 'Erreur',
      connection: null,
      error: error.message
    };
    health.status = 'Dégradé';
  }

  // Vérifier les variables d'environnement essentielles
  const essentialEnvVars = [
    'MONGODB_URI', 
    'NEXT_PUBLIC_SITE_URL',
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET'
  ];
  
  health.envStatus = essentialEnvVars.reduce((acc, varName) => {
    acc[varName] = !!process.env[varName];
    return acc;
  }, {});

  // Renvoyer les informations d'état
  res.status(health.status === 'OK' ? 200 : 503).json(health);
}