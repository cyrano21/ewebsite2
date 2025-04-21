const admin = require('firebase-admin');

// Vous devez générer et télécharger votre fichier de clé de service depuis la console Firebase
const serviceAccount = require('./path/to/serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://your-project-id.firebaseio.com" // Remplacez par l'URL de votre base de données
});

const db = admin.database();

function updateDatabase() {
    // Exemple de mise à jour de données
    const ref = db.ref("path/to/data");
    ref.set({
        sampleKey: "sampleValue"
    })
        .then(() => console.log("Database updated successfully!"))
        .catch(error => console.error("Error updating database:", error));
}

updateDatabase();
