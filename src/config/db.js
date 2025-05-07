const mongoose = require('mongoose');

// Cache global pour la connexion Mongoose (persistance entre les rechargements HMR)
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

// Options de connexion optimisées
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  bufferCommands: false,
  maxPoolSize: 10, // Limite le nombre de connexions simultanées
  serverSelectionTimeoutMS: 10000, // Timeout plus élevé pour stabiliser les connexions
  heartbeatFrequencyMS: 5000, // Vérifier la connexion plus fréquemment
};

// URL de connexion (utilise la variable d'environnement ou une URL par défaut)
const connectionUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/ewebsite2-francise';

/**
 * Fonction robuste de connexion à MongoDB avec Mongoose
 * Gère la persistance des connexions et les reconnexions automatiques
 */
const connectDB = async () => {
  if (cached.conn) {
    // Utiliser la connexion en cache si elle existe et est active
    if (mongoose.connection.readyState === 1) {
      console.log('MongoDB déjà connecté');
      return cached.conn;
    }
    // Si la connexion est fermée mais en cache, tenter une reconnexion
    console.log('Tentative de reconnexion à MongoDB...');
  }

  // Si aucune promesse de connexion n'est en cours, en créer une nouvelle
  if (!cached.promise) {
    try {
      cached.promise = mongoose.connect(connectionUrl, options).then((conn) => {
        console.log(`MongoDB connecté: ${conn.connection.host}`);
        return conn;
      });
    } catch (error) {
      console.error(`Erreur de connexion à MongoDB: ${error.message}`);
      cached.promise = null;
      throw error;
    }
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
};

// Optimiser les événements de connexion pour détecter les problèmes
mongoose.connection.on('connected', () => {
  console.log('Mongoose connecté à MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error(`Erreur de connexion Mongoose: ${err.message}`);
  // Ne pas tuer la connexion sur erreur, laisser Mongoose réessayer
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose déconnecté de MongoDB');
  // La reconnexion sera gérée par la fonction connectDB lors du prochain appel
});

// On ne ferme pas la connexion sur SIGINT en développement
// car cela peut interférer avec le HMR
if (process.env.NODE_ENV === 'production') {
  process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('Connexion à MongoDB fermée suite à l\'arrêt de l\'application');
    process.exit(0);
  });
}

module.exports = connectDB;
