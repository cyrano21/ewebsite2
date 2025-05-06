import mongoose from 'mongoose';

// Variable globale pour suivre l'état de la connexion
let isConnected = false;
let connectionPromise = null;

/**
 * Connecte l'application à MongoDB avec gestion des connexions existantes
 * @returns {Promise<boolean>} true si la connexion est établie, false sinon
 */
const connectDB = async () => {
  // Si une tentative de connexion est déjà en cours, attendez-la au lieu d'en démarrer une nouvelle
  if (connectionPromise) {
    try {
      return await connectionPromise;
    } catch (error) {
      // Si la promesse précédente a échoué, on réinitialise pour réessayer
      connectionPromise = null;
    }
  }

  // Si déjà connecté, retourner la connexion existante
  if (isConnected && mongoose.connection.readyState === 1) {
    console.log('MongoDB déjà connecté');
    return mongoose.connection;
  }

  const { MONGODB_URI } = process.env;

  if (!MONGODB_URI) {
    console.error('MONGODB_URI manquant dans les variables d\'environnement');
    return false;
  }

  // Si une connexion est en état de fermeture ou déconnectée, fermez-la proprement
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
    console.log('Connexion précédente fermée');
  }

  // Créer une nouvelle promesse de connexion
  connectionPromise = (async () => {
    try {
      const conn = await mongoose.connect(MONGODB_URI, {
        // Ces options sont maintenant obsolètes dans les nouvelles versions de MongoDB
        // mais on les garde pour la compatibilité avec les anciennes versions
        useNewUrlParser: true,
        useUnifiedTopology: true,
        bufferCommands: true,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });

      isConnected = true;
      console.log(`MongoDB connecté: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      console.error(`Erreur de connexion MongoDB: ${error.message}`);
      // Mode fallback - utiliser des données locales
      console.warn('utilisation du mode hors ligne avec des données locales.');
      return null;
    } finally {
      // Libérer la promesse de connexion une fois terminée
      connectionPromise = null;
    }
  })();

  return connectionPromise;
};

// Gestion des événements de connexion
mongoose.connection.on('connected', () => {
  console.log('Mongoose connecté à MongoDB');
  isConnected = true;
});

mongoose.connection.on('error', (err) => {
  console.error(`Erreur de connexion Mongoose: ${err.message}`);
  isConnected = false;
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose déconnecté de MongoDB');
  isConnected = false;
});

// Fermeture propre lors de l'arrêt de l'application
process.on('SIGINT', async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.close();
    console.log('Connexion à MongoDB fermée suite à l\'arrêt de l\'application');
  }
  process.exit(0);
});

export default connectDB;