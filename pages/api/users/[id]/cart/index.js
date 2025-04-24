import connectDB from "../../../../../src/config/db";
import User from "../../../../../src/models/User";
import { verifyToken } from "../../../../../middleware/authMiddleware";

export default async function handler(req, res) {
  // Vérifier si la méthode est autorisée
  if (!["GET", "PUT"].includes(req.method)) {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    // Connexion à MongoDB
    const conn = await connectDB();
    if (!conn) {
      return res
        .status(500)
        .json({ error: "Erreur de connexion à la base de données" });
    }

    // Récupérer l'ID de l'utilsateur depuis l'URL
    const { id } = req.query; // Changé de 'uid' à 'id' pour correspondre au nom du paramètre

    // Vérifier si l'ID est valide (pas undefined ou invalide)
    if (!id || id === "undefined") {
      // Renvoyer un panier vide plutôt qu'une erreur pour les utilisateurs non authentifiés
      return res.status(200).json({ items: [] });
    }

    // Vérifier l'authentification (Optionnel, en fonction de votre système)
    try {
      // Pour une implémentation plus robuste, vérifiez que l'utilsateur qui fait la requête
      // est bien l'utilsateur propriétaire du panier ou un administrateur
      // const authUser = await verifyToken(req);
      // if (authUser.id !== id && !authUser.isAdmin) {
      //   return res.status(403).json({ error: 'Non autorisé' });
      // }
    } catch (authError) {
      // Si vous préférez autoriser l'accès anonyme au panier, vous pouvez commenter cette section
      // return res.status(401).json({ error: 'Non authentifié' });
    }

    // Traitement selon la méthode HTTP
    switch (req.method) {
      case "GET":
        try {
          // Rechercher l'utilsateur dans la base de données
          const user = await User.findOne({ _id: id });

          // Si l'utilsateur n'existe pas, renvoyer un panier vide
          if (!user) {
            return res.status(200).json({ items: [] });
          }

          // Renvoyer le panier de l'utilsateur
          return res.status(200).json({
            items: user.cart || [],
          });
        } catch (findError) {
          console.error(
            "Erreur lors de la recherche de l'utilisateur:",
            findError
          );
          // En cas d'erreur de requête (comme un format invalid d'ObjectId)
          return res.status(200).json({ items: [] });
        }

      case "PUT":
        // Récupérer les articles du panier depuis le corps de la requête
        const { items } = req.body;

        if (!Array.isArray(items)) {
          return res.status(400).json({ error: "Format de panier invalide" });
        }

        try {
          // Rechercher l'utilsateur dans la base de données
          let user = await User.findOne({ _id: id });

          // Si l'utilsateur n'existe pas, créer un nouvel utilsateur avec ce panier
          if (!user) {
            user = new User({
              _id: id,
              cart: items,
              // Vous pouvez ajouter d'autres champs par défaut ici
              createdAt: new Date(),
            });
          } else {
            // Sinon, mettre à jour le panier de l'utilsateur existant
            user.cart = items;
            user.updatedAt = new Date();
          }

          // Sauvegarder les modifications
          await user.save();

          return res.status(200).json({
            success: true,
            message: "Panier mis à jour avec succès",
            items: user.cart,
          });
        } catch (userError) {
          console.error("Erreur lors de la mise à jour du panier:", userError);
          return res.status(400).json({
            error: "Impossible de mettre à jour le panier",
            details: "ID utilisateur invalide ou problème de base de données",
          });
        }

      default:
        return res.status(405).json({ error: "Méthode non autorisée" });
    }
  } catch (error) {
    console.error("Erreur API panier:", error);
    return res
      .status(500)
      .json({ error: "Erreur serveur", details: error.message });
  }
}
