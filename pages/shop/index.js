import React from "react";
import Link from "next/link";
import mongoose from 'mongoose';
import connectDB from '../../src/config/db';

const fallbackImg = "/assets/images/category/01.jpg";

// Cette fonction s'exécute côté serveur à la compilation
export async function getStaticProps() {
  try {
    // Connexion à MongoDB
    await connectDB();
    
    // Définition du schéma Category pour MongoDB si nécessaire
    const CategorySchema = new mongoose.Schema({
      name: { type: String, required: true, trim: true, unique: true },
      slug: { type: String, required: true, unique: true },
      description: { type: String, required: false },
      imageUrl: { type: String, required: false },
      cloudinaryId: { type: String, required: false },
      isActive: { type: Boolean, default: true },
      order: { type: Number, default: 0 }
    }, {
      timestamps: true
    });
    
    // Récupération du modèle Category
    const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
    
    // Récupération des catégories actives
    const categories = await Category.find({ isActive: true }).sort({ order: 1, name: 1 });
    
    return {
      props: {
        categories: JSON.parse(JSON.stringify(categories)),
      },
      // Revalidation toutes les 60 secondes (ISR - Incremental Static Regeneration)
      revalidate: 60,
    };
  } catch (error) {
    console.error("Erreur lors du chargement des catégories:", error);
    return {
      props: {
        categories: [],
      },
      revalidate: 60,
    };
  }
}

const ShopIndex = ({ categories }) => {
  return (
    <div className="container py-5">
      <h2 className="mb-4">Toutes les catégories</h2>
      <div className="row g-4">
        {categories.length === 0 ? (
          <div className="text-center">Aucune catégorie trouvée.</div>
        ) : (
          categories.map((cat) => (
            <div className="col-md-3 col-6" key={cat._id}>
              <Link href={`/shop/${cat.slug}`}>
                <div className="card h-100">
                  <img src={cat.imageUrl || fallbackImg} className="card-img-top" alt={cat.name} />
                  <div className="card-body">
                    <h6 className="card-title">{cat.name}</h6>
                  </div>
                </div>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ShopIndex;
