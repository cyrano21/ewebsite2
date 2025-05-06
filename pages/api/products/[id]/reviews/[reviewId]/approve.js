import { MongoClient, ObjectId } from 'mongodb';

// Configuration de la base de données
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';
const options = {};

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ success: false, message: 'Méthode non autorisée' });
  }

  try {
    const { id: productId, reviewId } = req.query;
    console.log(`[API] Tentative d'approbation de l'avis ${reviewId} pour le produit ${productId}`);

    // Connexion directe à MongoDB
    console.log("[API] Tentative de connexion à MongoDB:", uri.substring(0, uri.indexOf('@') > 0 ? uri.indexOf('@') : 20) + "...");
    
    const client = new MongoClient(uri, options);
    await client.connect();
    const db = client.db();

    console.log("[API] Connexion à la base de données réussie");

    // Lister toutes les collections pour déboguer
    const collections = await db.listCollections().toArray();
    console.log("[API] Collections disponibles:", collections.map(c => c.name));

    // Vérifier si la collection d'avis existe
    const reviewsCollectionExists = collections.some(c => c.name === 'reviews');
    if (!reviewsCollectionExists) {
      console.error("[API] La collection 'reviews' n'existe pas!");
      // Chercher dans d'autres collections potentielles
      for (const collection of collections) {
        const sampleDocs = await db.collection(collection.name).find().limit(2).toArray();
        console.log(`[API] Échantillon de ${collection.name}:`, JSON.stringify(sampleDocs));
      }
    }
    
    // Essayer de trouver l'avis dans toutes les collections possibles
    let reviewFound = null;
    let collectionWithReview = null;
    
    for (const collection of collections) {
      try {
        // Essayer avec ObjectId
        try {
          const reviewObjId = new ObjectId(reviewId);
          const doc = await db.collection(collection.name).findOne({ _id: reviewObjId });
          
          if (doc) {
            reviewFound = doc;
            collectionWithReview = collection.name;
            console.log(`[API] Avis trouvé dans la collection '${collection.name}' avec _id ObjectId:`, doc);
            break;
          }
        } catch (e) {
          // Ignorer l'erreur si reviewId n'est pas un ObjectId valide
        }
        
        // Essayer avec la chaîne brute
        const docByString = await db.collection(collection.name).findOne({ 
          $or: [
            { _id: reviewId },
            { reviewId: reviewId }
          ] 
        });
        
        if (docByString) {
          reviewFound = docByString;
          collectionWithReview = collection.name;
          console.log(`[API] Avis trouvé dans la collection '${collection.name}' avec _id chaîne:`, docByString);
          break;
        }
        
        // Chercher dans les sous-documents
        const docWithSubdoc = await db.collection(collection.name).findOne({ 
          "reviews._id": reviewId 
        });
        
        if (docWithSubdoc) {
          reviewFound = docWithSubdoc.reviews.find(r => r._id.toString() === reviewId);
          collectionWithReview = `${collection.name}.reviews`;
          console.log(`[API] Avis trouvé dans la collection '${collection.name}' comme sous-document:`, reviewFound);
          break;
        }
      } catch (error) {
        console.error(`[API] Erreur lors de la recherche dans ${collection.name}:`, error.message);
      }
    }
    
    if (!reviewFound) {
      // S'il n'y a pas d'avis trouvé, vérifier si l'avis pourrait être imbriqué dans le document du produit
      try {
        const productObjId = new ObjectId(productId);
        const product = await db.collection('products').findOne({ _id: productObjId });
        
        if (product && product.reviews && Array.isArray(product.reviews)) {
          const embeddedReview = product.reviews.find(r => 
            (r._id && r._id.toString() === reviewId) || 
            (r.id && r.id.toString() === reviewId)
          );
          
          if (embeddedReview) {
            reviewFound = embeddedReview;
            collectionWithReview = 'products.reviews';
            console.log(`[API] Avis trouvé imbriqué dans le document du produit:`, embeddedReview);
          }
        }
      } catch (e) {
        console.error("[API] Erreur lors de la recherche d'avis imbriqué:", e.message);
      }
    }
    
    if (!reviewFound) {
      return res.status(404).json({
        success: false,
        message: "Avis non trouvé dans la base de données",
        debug: {
          collections: collections.map(c => c.name),
          productId,
          reviewId
        }
      });
    }
    
    // L'avis a été trouvé, procéder à l'approbation
    console.log(`[API] Approbation de l'avis trouvé dans ${collectionWithReview}`);
    
    // Différentes stratégies d'approbation selon où l'avis a été trouvé
    let updateResult;
    
    if (collectionWithReview === 'reviews') {
      // Si l'avis est dans sa propre collection
      updateResult = await db.collection('reviews').updateOne(
        { _id: reviewFound._id },
        { 
          $set: { 
            status: 'approved',
            approvedAt: new Date()
          } 
        }
      );
    } else if (collectionWithReview === 'products.reviews') {
      // Si l'avis est imbriqué dans le document du produit
      updateResult = await db.collection('products').updateOne(
        { 
          _id: new ObjectId(productId),
          "reviews._id": reviewFound._id 
        },
        { 
          $set: { 
            "reviews.$.status": 'approved',
            "reviews.$.approvedAt": new Date()
          } 
        }
      );
    } else if (collectionWithReview && collectionWithReview.endsWith('.reviews')) {
      // Si l'avis est dans une sous-collection d'une autre collection
      const mainCollection = collectionWithReview.split('.')[0];
      updateResult = await db.collection(mainCollection).updateOne(
        { "reviews._id": reviewFound._id },
        { 
          $set: { 
            "reviews.$.status": 'approved',
            "reviews.$.approvedAt": new Date()
          } 
        }
      );
    }
    
    console.log("[API] Résultat de la mise à jour:", updateResult);
    
    if (!updateResult || updateResult.modifiedCount === 0) {
      return res.status(400).json({
        success: false,
        message: "Impossible de mettre à jour l'avis",
        debug: {
          collectionWithReview,
          reviewFound
        }
      });
    }
    
    await client.close();
    
    return res.status(200).json({
      success: true,
      message: "Avis approuvé avec succès",
      data: {
        productId,
        reviewId,
        status: 'approved'
      }
    });
    
  } catch (error) {
    console.error("[API] Erreur lors de l'approbation de l'avis:", error);
    return res.status(500).json({
      success: false,
      message: "Erreur lors de l'approbation de l'avis",
      error: error.message
    });
  }
}
