const mongoose = require('mongoose');
const connect = require('mongoose').connect;

// Options de connexion
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// URL de connexion (utilse la variable d'environnement ou une URL par défaut pour le développement local)
const connectionUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/ewebsite2-francise';

// Fonction de connexion à la base de données
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(connectionUrl, options);
    console.log(`MongoDB connecté: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Erreur de connexion à MongoDB: ${error.message}`);
    // Mode fallback - utilser des données locales
    console.warn('utilsation du mode hors ligne avec des données locales.');
    return null;
  }
};

// Vérification de la connexion
mongoose.connection.on('connected', () => {
  console.log('Mongoose connecté à MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error(`Erreur de connexion Mongoose: ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose déconnecté de MongoDB');
});

// Fermeture propre lors de l'arrêt de l'application
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('Connexion à MongoDB fermée suite à l\'arrêt de l\'application');
  process.exit(0);
});

module.exports = connectDB;
