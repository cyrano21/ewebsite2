// config/db.js
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Veuillez définir la variable d\'environnement MONGODB_URI dans .env.local'
  );
}

/**
 * Cache global pour la connexion Mongoose afin d'éviter des connexions multiples en développement.
 */
let cached = global.mongooseConn;

if (!cached) {
  cached = global.mongooseConn = { conn: null, promise: null };
}

/**
 * Établit ou retourne une connexion Mongoose en cache.
 * Gère les promesses en cours pour éviter les conditions de concurrence.
 * @returns {Promise<mongoose.Connection>} La connexion Mongoose.
 * @throws {Error} Si la connexion échoue après les tentatives.
 */
async function dbConnect() {
  if (cached.conn && mongoose.connection.readyState === 1) {
    // console.log('MongoDB: Utilisation de la connexion en cache');
    return cached.conn;
  }

  if (cached.promise) {
    // console.log('MongoDB: Attente de la promesse de connexion existante');
    try {
      const conn = await cached.promise;
      if (mongoose.connection.readyState === 1) {
        cached.conn = conn;
        // console.log('MongoDB: Connexion existante prête après attente');
        return cached.conn;
      } else {
        // console.warn('MongoDB: Connexion de la promesse précédente invalide, tentative de nouvelle connexion.');
        cached.promise = null;
        cached.conn = null;
      }
    } catch (e) {
      // console.error('MongoDB: Erreur en attente de la promesse précédente:', e.message);
      cached.promise = null;
      cached.conn = null;
      // Ne pas relancer l'erreur ici, laisser la logique ci-dessous créer une nouvelle connexion
    }
  }

  // Créer une nouvelle promesse si aucune n'est valide ou en cours
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Recommandé pour une meilleure gestion des erreurs
      serverSelectionTimeoutMS: 5000,
      // Ajoutez d'autres options Mongoose modernes ici si nécessaire
    };

    // console.log('MongoDB: Création d\'une nouvelle promesse de connexion');
    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongooseInstance) => {
        console.log(`MongoDB connecté: ${mongooseInstance.connection.host}`);
        cached.conn = mongooseInstance.connection;
        return mongooseInstance.connection;
      })
      .catch(error => {
        console.error('MongoDB: Erreur de connexion initiale:', error.message);
        cached.promise = null; // Nettoyer la promesse en cas d'échec
        cached.conn = null;
        throw error; // Propager pour que l'appelant sache
      });
  }

  // Attendre la résolution de la promesse (nouvelle ou en cours récupérée)
  try {
    // console.log('MongoDB: Attente de la résolution de la promesse');
    cached.conn = await cached.promise;
  } catch (e) {
    // L'erreur est déjà logguée. S'assurer que l'état est propre.
    cached.promise = null;
    cached.conn = null;
    // Relancer l'erreur pour que l'appelant API puisse renvoyer une 500
    throw new Error(`Échec final de la connexion à MongoDB: ${e.message}`);
  }

  // Vérifier l'état final avant de retourner
  if (mongoose.connection.readyState !== 1) {
     cached.conn = null; // S'assurer que conn est null si l'état n'est pas connecté
     cached.promise = null; // Permettre une nouvelle tentative la prochaine fois
     throw new Error(`MongoDB n'est pas connecté. État: ${mongoose.connection.readyState}`);
  }

  return cached.conn;
}

export default dbConnect;

// Listeners d'événements (Optionnel mais utile pour le débogage)
// Assurer qu'ils ne sont attachés qu'une seule fois
if (!mongoose.connection.listenerCount('connected')) {
    mongoose.connection.on('connected', () => {
        console.log('Mongoose Événement: Connecté');
    });
    mongoose.connection.on('error', (err) => {
        console.error(`Mongoose Événement Erreur: ${err.message}`);
        if (cached) { cached.promise = null; cached.conn = null; } // Réinitialiser en cas d'erreur
    });
    mongoose.connection.on('disconnected', () => {
        console.log('Mongoose Événement: Déconnecté');
        if (cached) { cached.conn = null; cached.promise = null; } // Réinitialiser
    });
     mongoose.connection.on('reconnected', () => {
        console.log('Mongoose Événement: Reconnecté');
     });
     mongoose.connection.on('close', () => {
        console.log('Mongoose Événement: Connexion fermée');
        if (cached) { cached.conn = null; cached.promise = null; } // Réinitialiser
     });
}

// Fermeture propre lors de l'arrêt de l'application Node
process.on('SIGINT', async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.close();
    console.log('Connexion MongoDB fermée (SIGINT)');
  }
  process.exit(0);
});