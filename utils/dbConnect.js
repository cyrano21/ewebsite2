// utils/dbConnect.js
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';

// Cache pour éviter les connexions multiples
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    console.log('✅ Utilisation d\'une connexion MongoDB existante');
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferCommands: false,
    };

    console.log('🔄 Connexion à MongoDB...');
    
    try {
      cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
        console.log('✅ Connexion MongoDB établie avec succès');
        return mongoose;
      });
    } catch (error) {
      cached.promise = null;
      console.error('❌ Erreur de connexion à MongoDB:', error);
      throw error;
    }
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    console.error('❌ Erreur d\'attente de connexion MongoDB:', error);
    throw error;
  }
}

export default dbConnect;
