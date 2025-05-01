// Configuration d'environnement pour le client
// Ce fichier expose les variables d'environnement de manière sécurisée pour le frontend

// Variables d'API publiques (sécurisées à exposer)
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export const FIREBASE_API_KEY = import.meta.env.VITE_APIKEY;
export const FIREBASE_AUTH_DOMAIN = import.meta.env.VITE_AUTHDOMAIN;

// Autres configurations
export const IS_PRODUCTION = import.meta.env.MODE === 'production';
export const IS_DEVELOPMENT = import.meta.env.MODE === 'development';

// utilser cette fonction pour obtenir les variables d'environnement
export const getEnv = (key, defaultValue = '') => {
  return import.meta.env[`VITE_${key}`] || defaultValue;
};
