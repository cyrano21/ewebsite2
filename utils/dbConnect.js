// utils/dbConnect.js
// Ce fichier sert maintenant de proxy vers config/db.js pour la rétrocompatibilité
import configDBConnect from '../config/db';

// Assurer la compatibilité avec le code existant qui utilise utils/dbConnect.js
async function dbConnect() {
  return await configDBConnect();
}

// Conserver la méthode d'inspection pour la rétrocompatibilité
dbConnect.getConnectionStatus = () => {
  const mongoose = require('mongoose');
  const readyStateMap = {
    0: 'Déconnecté',
    1: 'Connecté',
    2: 'Connexion en cours',
    3: 'Déconnexion en cours',
  };
  const rs = mongoose.connection.readyState;
  const MONGODB_URI = process.env.MONGODB_URI || '';
  return {
    connected: rs === 1,
    readyState: rs,
    status: readyStateMap[rs] || 'Inconnu',
    uri: MONGODB_URI.replace(/\/\/[^@]+@/, '//***@'),
  };
};

export default dbConnect;
