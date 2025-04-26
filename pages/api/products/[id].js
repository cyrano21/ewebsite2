import connectDB from "../../../config/db";
import mongoose from "mongoose";
import { deleteImage } from "../../../config/cloudinary";
import { topDealsProducts, topElectronicProducts, bestOfferProducts, allProducts } from "../../../data/e-commerce/products";

// Définition du schéma Product pour MongoDB
const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discountPrice: {
      type: Number,
      required: false,
    },
    category: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: false,
    },
    cloudinaryId: {
      type: String,
      required: false,
    },
    rating: {
      type: Number,
      default: 0,
    },
    stock: {
      type: Number,
      default: 0,
    },
    isNew: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Vérifier si le modèle existe déjà pour éviter les erreurs de redéfinition
const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "ID du produit manquant" });
  }

  try {
    // Connexion à MongoDB
    const conn = await connectDB();

    if (!conn) {
      return res
        .status(500)
        .json({ error: "Erreur de connexion à la base de données" });
    }

    // Vérifier si l'ID est au format ObjectId MongoDB
    const isValidObjectId = mongoose.isValidObjectId(id);

    switch (req.method) {
      case "GET":
        // Retourne un produit mock
        const allProductData = [
          ...topDealsProducts,
          ...topElectronicProducts,
          ...bestOfferProducts,
          ...allProducts,
        ];
        const product = allProductData.find((p) => String(p.id) === String(id));
        if (!product) {
          return res.status(404).json({ error: "Produit non trouvé" });
        }
        return res.status(200).json(product);

      case "PUT":
        let updatedProduct;

        if (isValidObjectId) {
          // Si l'ID est un ObjectId valide
          updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
          });
        } else {
          return res.status(400).json({
            error: "Format d'ID non valide pour la mise à jour",
            message: "L'ID du produit doit être un ObjectId MongoDB valide",
          });
        }

        if (!updatedProduct) {
          return res.status(404).json({ error: "Produit non trouvé" });
        }
        return res.status(200).json(updatedProduct);

      case "DELETE":
        if (!isValidObjectId) {
          return res.status(400).json({
            error: "Format d'ID non valide pour la suppression",
            message: "L'ID du produit doit être un ObjectId MongoDB valide",
          });
        }

        // Supprimer un produit
        const productToDelete = await Product.findById(id);
        if (!productToDelete) {
          return res.status(404).json({ error: "Produit non trouvé" });
        }

        // Si le produit a une image Cloudinary, la supprimer également
        if (productToDelete.cloudinaryId) {
          try {
            await deleteImage(productToDelete.cloudinaryId);
          } catch (error) {
            console.error("Erreur lors de la suppression de l'image:", error);
            // Continuer malgré l'erreur de suppression d'image
          }
        }

        await Product.findByIdAndDelete(id);
        return res
          .status(200)
          .json({ message: "Produit supprimé avec succès" });

      default:
        return res.status(405).json({ error: "Méthode non autorisée" });
    }
  } catch (error) {
    console.error("Erreur API produit:", error);
    return res
      .status(500)
      .json({ error: "Erreur serveur", details: error.message });
  }
}
