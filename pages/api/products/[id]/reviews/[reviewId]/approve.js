import { MongoClient, ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'PUT')
    return res.status(405).json({ success: false, message: 'Méthode non autorisée' });

  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri, {});
  await client.connect();
  const db = client.db();

  const { id: productId, reviewId } = req.query;
  const collections = await db.listCollections().toArray();

  let collectionName = null;

  // Cherche d'abord l'avis comme document séparé...
  for (const coll of collections) {
    try {
      // Si _id match dans la collection
      await db.collection(coll.name).findOne({ _id: new ObjectId(reviewId) });
      collectionName = coll.name;
      break;
    } catch {}
    // Puis comme sous-document dans 'products.reviews'
    const sub = await db.collection(coll.name).findOne({ 'reviews._id': reviewId });
    if (sub) {
      collectionName = coll.name;
      break;
    }
  }

  if (!collectionName) {
    await client.close();
    return res.status(404).json({ success: false, message: 'Avis non trouvé' });
  }

  // Mise à jour selon l’emplacement
  let result;
  if (collectionName === 'reviews') {
    result = await db.collection('reviews')
      .updateOne({ _id: new ObjectId(reviewId) }, { $set: { approved: true, approvedAt: new Date() } });
  } else {
    // Dans le tableau reviews de products
    result = await db.collection('products').updateOne(
      { _id: new ObjectId(productId), 'reviews._id': new ObjectId(reviewId) },
      { $set: { 'reviews.$.approved': true, 'reviews.$.approvedAt': new Date() } }
    );
  }

  await client.close();
  if (!result || result.modifiedCount === 0) {
    return res.status(400).json({ success: false, message: 'Impossible de mettre à jour l\'avis' });
  }

  return res.status(200).json({ success: true, message: 'Avis approuvé' });
}
