// diagnose-reviews.js
require('dotenv').config(); // Charger les variables d'environnement
const mongoose = require('mongoose');
const Product = require('./models/Product');
const dbConnect = require('./utils/dbConnect').default;

async function diagnoseReviews() {
  let connection = null;
  
  try {
    // Connexion à MongoDB en utilisant dbConnect de l'application
    console.log('Tentative de connexion à MongoDB...');
    
    // Utiliser la connexion de l'application
    connection = await dbConnect();
    console.log('Connecté à MongoDB avec succès');
    
    // 1. Compter tous les produits
    const totalProducts = await Product.countDocuments();
    console.log(`Total des produits dans la base de données : ${totalProducts}`);
    
    if (totalProducts === 0) {
      console.log('Aucun produit trouvé dans la base de données. Vérifiez votre connexion et vos données.');
      return;
    }
    
    // 2. Rechercher tous les produits ayant au moins un avis
    const productsWithReviews = await Product.find({ 'reviews.0': { $exists: true } });
    console.log(`Produits avec au moins un avis : ${productsWithReviews.length}`);
    
    // 3. Utiliser une requête différente pour trouver les avis en attente
    console.log('Recherche des produits avec avis non approuvés...');
    
    // Utiliser l'opérateur $elemMatch pour trouver les produits avec au moins un avis non approuvé
    const productsWithPendingReviews = await Product.find({
      'reviews': { $elemMatch: { 'approved': false } }
    });
    
    console.log(`Produits avec des avis en attente (méthode $elemMatch) : ${productsWithPendingReviews.length}`);
    
    // 4. Créer un avis de test si aucun avis n'est trouvé
    if (productsWithReviews.length === 0 || productsWithPendingReviews.length === 0) {
      console.log('\nCréation d\'un avis de test pour vérifier le système...');
      
      // Récupérer un produit
      const product = await Product.findOne();
      
      if (!product) {
        console.log('Aucun produit trouvé pour tester');
        return;
      }
      
      console.log(`Produit sélectionné pour le test : ${product.name} (ID: ${product._id})`);
      
      // Créer un avis de test explicitement non approuvé
      const testReview = {
        user: new mongoose.Types.ObjectId('6808ceba46ea3f58ac26c135'), // ID utilisateur existant
        rating: 4,
        comment: 'Ceci est un avis de test créé le ' + new Date().toISOString(),
        date: new Date(),
        approved: false
      };
      
      // Ajouter l'avis au produit
      product.reviews.push(testReview);
      
      // Sauvegarder les modifications avec gestion d'erreur
      try {
        await product.save();
        console.log('✅ Avis de test ajouté avec succès au produit.');
        
        // Vérifier si l'avis a bien été ajouté
        const updatedProduct = await Product.findById(product._id);
        console.log(`Nombre d'avis après ajout : ${updatedProduct.reviews.length}`);
        console.log(`Dernier avis ajouté - approuvé: ${updatedProduct.reviews[updatedProduct.reviews.length - 1].approved}`);
      } catch (saveError) {
        console.error('❌ Erreur lors de l\'enregistrement de l\'avis de test:', saveError);
      }
    }
    
    // 5. Afficher les détails des avis en attente
    if (productsWithPendingReviews.length > 0) {
      console.log('\n📋 Détails des produits avec avis en attente :');
      productsWithPendingReviews.forEach(product => {
        console.log(`\n📦 Produit : ${product.name} (ID: ${product._id})`);
        
        // Filtrer pour ne récupérer que les avis non approuvés
        const pendingReviews = product.reviews.filter(r => r.approved === false);
        console.log(`Nombre d'avis en attente : ${pendingReviews.length}`);
        
        pendingReviews.forEach((review, index) => {
          console.log(`  ⭐ Avis #${index + 1}:`);
          console.log(`    ID utilisateur : ${review.user}`);
          console.log(`    Note : ${review.rating}/5`);
          console.log(`    Commentaire : ${review.comment}`);
          console.log(`    Date : ${review.date}`);
          console.log(`    Approuvé : ${review.approved}`);
        });
      });
    } else {
      console.log('❌ Aucun produit avec des avis en attente n\'a été trouvé.');
    }
    
    // 6. Vérifier l'implémentation de l'API pending-reviews
    console.log('\n🔍 Suggestion pour améliorer l\'API pending-reviews:');
    console.log(`
    Dans G:\\ewebsite2\\pages\\api\\admin\\pending-reviews.js:
    
    Modification recommandée pour la requête MongoDB:
    
    Actuel:
    const productsWithPendingReviews = await Product.find({
      'reviews.approved': false
    })
    
    Recommandé:
    const productsWithPendingReviews = await Product.find({
      'reviews': { $elemMatch: { 'approved': false } }
    })
    `);
    
  } catch (error) {
    console.error('❌ Erreur lors du diagnostic :', error);
  } finally {
    console.log('Diagnostic terminé');
  }
}

// Exécuter la fonction de diagnostic
diagnoseReviews().catch(err => {
  console.error('Erreur non interceptée:', err);
});