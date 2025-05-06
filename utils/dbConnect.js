// utils/dbConnect.js
import mongoose from 'mongoose';

const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb://localhost:27017/ecommerce';

// On évite de polluer `global.mongoose` (qui est l’export de Mongoose).
// On utilise une clé propre pour le cache de la connexion :
const globalWithCache = global;
let cached = globalWithCache._mongooseCache;

if (!cached) {
  cached = globalWithCache._mongooseCache = { conn: null, promise: null };
}

// Désactiver les warnings de query strictes (optionnel)
mongoose.set('strictQuery', false);

// Quelques listeners pour suivre l’état de la connexion
mongoose.connection.on('connected', () => {
  console.log('🔗 Mongoose default connection connected');
});
mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose default connection error:', err);
});
mongoose.connection.on('disconnected', () => {
  console.log('🔌 Mongoose default connection disconnected');
});

async function dbConnect() {
  if (cached.conn) {
    // Réutiliser la connexion existante
    return cached.conn;
  }
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      // poolSize est deprecated, on passe par maxPoolSize
      maxPoolSize: 10,
      minPoolSize: 3,
    };
    console.log('🔄 Création d’une nouvelle promise de connexion…');
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => mongoose);
  }
  try {
    cached.conn = await cached.promise;
    console.log('✅ MongoDB connecté sur', mongoose.connection.host);
    return cached.conn;
  } catch (err) {
    // En cas d’erreur, on vide le cache pour retenter plus tard
    cached.promise = null;
    console.error('❌ Erreur de connexion à MongoDB:', err.message);
    throw err;
  }
}

// Méthode d’inspection
dbConnect.getConnectionStatus = () => {
  const readyStateMap = {
    0: 'Déconnecté',
    1: 'Connecté',
    2: 'Connexion en cours',
    3: 'Déconnexion en cours',
  };
  const rs = mongoose.connection.readyState;
  return {
    connected: rs === 1,
    readyState: rs,
    status: readyStateMap[rs] || 'Inconnu',
    uri: MONGODB_URI.replace(/\/\/[^@]+@/, '//***@'),
  };
};

export default dbConnect;
