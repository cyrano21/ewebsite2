// utils/db.js
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';
const options = {};

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
  throw new Error('Veuillez ajouter votre URI Mongo à vos variables d\'environnement');
}

if (process.env.NODE_ENV === 'development') {
  // En développement, utilisez une variable globale pour que la connexion
  // soit maintenue entre les rechargements de l'API
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // En production, c'est préférable d'avoir une nouvelle instance de connexion
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

/**
 * Connecte à la base de données et renvoie le client et la db
 * @returns {Object} Objet contenant le client MongoDB et la base de données
 */
export async function connectToDatabase() {
  const client = await clientPromise;
  const db = client.db();
  return { client, db };
}
