// diagnose-mongodb.js
import 'dotenv/config';
import mongoose from 'mongoose';
import { dbConnect, getConnectionStatus } from './utils/dbConnect.js';

async function runDiagnostic() {
  console.log('\n=== DIAGNOSTIC MONGODB ===');
  console.log('Date       :', new Date().toLocaleString('fr-FR'));
  console.log('Node.js    :', process.version);
  console.log('MONGODB_URI:', !!process.env.MONGODB_URI);

  try {
    console.log('\n-- Connexion --');
    const start = Date.now();
    await dbConnect();
    console.log(`✅ Connecté en ${Date.now() - start}ms`);

    console.log('\n-- Statut --');
    console.log(await getConnectionStatus());

    console.log('\n-- Collections --');
    const cols = await mongoose.connection.db.listCollections().toArray();
    console.log('→', cols.map(c => c.name).join(', '));

    console.log('\n-- Ping --');
    const ping = await mongoose.connection.db.admin().ping();
    console.log('→', ping);

    console.log('\n-- Comptage documents --');
    for (const { name } of cols) {
      const count = await mongoose.connection.db.collection(name).countDocuments();
      console.log(`  • ${name}: ${count}`);
    }
  } catch (err) {
    console.error('❌ Erreur de diagnostic:', err);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Connexion fermée');
    process.exit(0);
  }
}

runDiagnostic();
