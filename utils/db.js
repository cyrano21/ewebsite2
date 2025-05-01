// utils/db.js
import dbConnect from './dbConnect';
import mongoose from 'mongoose';

/**
 * Utilitaire de connexion à la base de données compatible avec la façon
 * dont notre API est structurée pour la récupération des catégories
 */
export async function connectToDatabase() {
  // Connecter à MongoDB en utilisant la fonction dbConnect existante
  await dbConnect();

  // Pour notre API de catégories, nous avons besoin d'un objet db
  // qui expose les collections MongoDB
  return {
    db: {
      collection: (collectionName) => {
        try {
          const db = mongoose.connection.db;
          return db.collection(collectionName);
        } catch (error) {
          console.error(`Erreur lors de l'accès à la collection ${collectionName}:`, error);
          throw error;
        }
      }
    },
    // Exposer également la connexion au cas où nous en aurions besoin ailleurs
    client: mongoose.connection.client
  };
}

// Exporter également la fonction de connexion originale
export { dbConnect };
