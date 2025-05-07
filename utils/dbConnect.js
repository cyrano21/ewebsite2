// utils/dbConnect.js
// Assurez-vous que ce fichier importe bien le nouveau 'config/db.js'
import configDBConnect from '../config/db'; // Chemin vers votre fichier de connexion principal
import mongoose from 'mongoose'; // Importer mongoose pour getStatus

// Assurer la compatibilité avec le code existant
async function dbConnect() {
  return await configDBConnect();
}

// Méthode pour obtenir le statut (simplifiée, car la logique principale est dans config/db)
dbConnect.getConnectionStatus = () => {
  const readyStateMap = {
    0: 'Déconnecté',
    1: 'Connecté',
    2: 'Connexion en cours',
    3: 'Déconnexion en cours',
    99: 'Non initialisé',
  };
  const rs = mongoose.connection.readyState;
  const MONGODB_URI = process.env.MONGODB_URI || '';
  return {
    connected: rs === 1,
    readyState: rs,
    status: readyStateMap[rs] || 'Inconnu',
    uri: MONGODB_URI.replace(/\/\/[^@]+@/, '//***@'), // Masquer les identifiants
  };
};

export default dbConnect;
// utils/dbConnect.js