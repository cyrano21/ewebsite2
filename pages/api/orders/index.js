import connectDB from "../../../config/db";
import Order from "../../../models/Order";
import User from "../../../models/User";
import Product from "../../../models/Product";
// import { verifyToken } from '../../../src/middleware/auth';

export default async function handler(req, res) {
  try {
    // Connexion à MongoDB
    const conn = await connectDB();
    if (!conn) {
      return res
        .status(500)
        .json({ error: "Erreur de connexion à la base de données" });
    }

    switch (req.method) {
      case "GET": {
        // Récupérer toutes les commandes ou filtrer par utilsateur
        const { userId, status: statusFilter, limit = 10, page = 1 } = req.query;
        let query = {};

        if (userId) {
          query.user = userId;
        }

        if (statusFilter) {
          query.status = statusFilter;
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const orders = await Order.find(query)
          .populate("user", "name email")
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit));

        const totalCount = await Order.countDocuments(query);

        return res.status(200).json({
          orders,
          pagination: {
            total: totalCount,
            page: parseInt(page),
            pages: Math.ceil(totalCount / parseInt(limit)),
          },
        });
      }
      case "POST": {
        // Créer une nouvelle commande
        const { user, items, total: orderTotal, status: orderStatus, shippingAddress, paymentMethod } =
          req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
          return res
            .status(400)
            .json({ error: "Les articles de la commande sont requis" });
        }

        // Créer la commande
        const newOrder = new Order({
          user, // Maintenant compatible avec MongoDB ObjectId
          items,
          total: orderTotal,
          status: orderStatus || "pending",
          shippingAddress,
          paymentMethod,
          orderNumber: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          createdAt: new Date(),
        });

        const savedOrder = await newOrder.save();

        // Si l'utilsateur est connecté, ajouter la commande à son profil
        if (user) {
          await User.findByIdAndUpdate(user, {
            $push: { orders: savedOrder._id },
          });

          // Vider le panier de l'utilsateur après la commande
          await User.findByIdAndUpdate(user, { $set: { cart: [] } });
        }

        // Mettre à jour le stock des produits (optionnel)
        // for (const item of items) {
        //   await Product.findByIdAndUpdate(
        //     item.id,
        //     { $inc: { stock: -item.quantity } }
        //   );
        // }

        return res.status(201).json(savedOrder);
      }
      default: {
        return res.status(405).json({ error: "Méthode non autorisée" });
      }
    }
  } catch (error) {
    console.error("Erreur API commandes:", error);
    return res
      .status(500)
      .json({ error: "Erreur serveur", details: error.message });
  }
}
