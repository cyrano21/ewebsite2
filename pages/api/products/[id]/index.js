import connectDB from "../../../../src/config/db";
import Product from "../../../../src/models/Product";

export default async function handler(req, res) {
  try {
    // Connexion à MongoDB
    const conn = await connectDB();
    if (!conn) {
      return res
        .status(500)
        .json({ error: "Erreur de connexion à la base de données" });
    }

    // Récupérer l'ID du produit depuis l'URL
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ error: "ID produit manquant" });
    }

    switch (req.method) {
      case "GET":
        // Récupérer un produit spécifique par son ID
        const product = await Product.findById(id);

        if (!product) {
          return res.status(404).json({ error: "Produit non trouvé" });
        }

        return res.status(200).json(product);

      case "PUT":
        // Mettre à jour un produit (nécessite une autorisation)
        if (!req.body) {
          return res
            .status(400)
            .json({ error: "Données manquantes pour la mise à jour" });
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });

        if (!updatedProduct) {
          return res.status(404).json({ error: "Produit non trouvé" });
        }

        return res.status(200).json(updatedProduct);

      case "DELETE":
        // Supprimer un produit (nécessite une autorisation)
        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
          return res.status(404).json({ error: "Produit non trouvé" });
        }

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
