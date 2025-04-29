import connectDB from "../../../config/db";
import Order from "../../../models/Order";
import User from "../../../models/User";
import Product from "../../../models/Product"; // Garder si utilisé pour le stock
import { Parser } from "json2csv";

export default async function handler(req, res) {
  try {
    const conn = await connectDB();
    if (!conn) {
      return res.status(500).json({ error: "Erreur de connexion à la base de données" });
    }

    switch (req.method) {
      case "GET": {
        const {
          userId, status: statusFilter, limit = 10, page = 1, search,
          dateFrom, dateTo, minTotal, maxTotal, export: exportType, paymentMethod, clientId // Ajouter les nouveaux filtres ici
        } = req.query;

        // Conversion propre des paramètres de pagination
        const pageNum = parseInt(page, 10) || 1;
        const limitNum = parseInt(limit, 10) || 10;
        const skip = (pageNum - 1) * limitNum;


        let query = {};
        if (userId) query.user = userId;
        // Combiner clientId et userId car ils semblent viser la même chose
        if (clientId && !userId) query.user = clientId;
        if (statusFilter) query.status = statusFilter;
        if (paymentMethod) query.paymentMethod = paymentMethod; // Ajouter filtre méthode paiement


        if (search) {
          query.$or = [
            { orderNumber: { $regex: search, $options: "i" } },
            { "shippingAddress.fullName": { $regex: search, $options: "i" } },
            { paymentMethod: { $regex: search, $options: "i" } },
          ];
          // Ajouter recherche par email utilisateur si possible
          try {
            // Trouver les IDs des utilisateurs correspondant à la recherche email/nom
             const usersFound = await User.find({
                 $or: [
                     { name: { $regex: search, $options: 'i' } },
                     { email: { $regex: search, $options: 'i' } }
                 ]
             }, '_id'); // Ne récupérer que l'ID

             if (usersFound.length > 0) {
                 // Ajouter la condition pour que le champ 'user' soit dans les IDs trouvés
                 query.$or.push({ user: { $in: usersFound.map(u => u._id) } });
             }
          } catch (userSearchError) {
              console.error("Erreur recherche utilisateur pour filtre commande:", userSearchError);
              // Continuer sans le filtre utilisateur si la recherche échoue
          }
        }

        if (dateFrom || dateTo) {
          query.createdAt = {};
          if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
          if (dateTo) { const endDate = new Date(dateTo); endDate.setHours(23, 59, 59, 999); query.createdAt.$lte = endDate; }
        }

        if (minTotal) query.total = { ...query.total, $gte: parseFloat(minTotal) };
        if (maxTotal) query.total = { ...query.total, $lte: parseFloat(maxTotal) };

        // --- Export CSV (logique conservée, mais après le calcul du total) ---
        if (exportType === "csv") {
          // Exécuter la requête SANS limit/skip pour l'export complet
          const ordersToExport = await Order.find(query)
            .populate("user", "name email")
            .sort({ createdAt: -1 });

          const fields = [ /* ... champs CSV ... */ ];
          const dataForCsv = ordersToExport.map(o => { /* ... formatage ... */ });
          const json2csvParser = new Parser({ fields, delimiter: ';', header: true });
          const csv = json2csvParser.parse(dataForCsv);

          res.setHeader('Content-Type', 'text/csv; charset=utf-8');
          res.setHeader('Content-Disposition', `attachment; filename="commandes-${new Date().toISOString().slice(0,10)}.csv"`);
          return res.status(200).send(Buffer.from(csv, 'utf-8'));
        }

        // --- Récupération pour Pagination ---
        // Obtenir le nombre total AVANT d'appliquer skip/limit
        const totalCount = await Order.countDocuments(query);

        // Obtenir les commandes pour la page actuelle
        const orders = await Order.find(query)
          .populate("user", "name email") // Peupler les infos utilisateur
          .sort({ createdAt: -1 }) // Trier
          .skip(skip) // Appliquer skip
          .limit(limitNum); // Appliquer limit

        // --- UN SEUL RETURN pour le cas GET avec pagination ---
        return res.status(200).json({
          orders,
          pagination: {
            total: totalCount,
            page: pageNum,
            pages: Math.ceil(totalCount / limitNum), // Calcul correct des pages totales
            limit: limitNum
          },
        });
        // --- FIN DU BLOC RETURN ---

        // <<< Les lignes redondantes et mal formées ont été SUPPRIMÉES d'ici >>>

      } // Fin case GET

      case "POST": {
         // --- Bloc POST (logique conservée de la correction précédente) ---
        if (!req.body.user) {
          return res.status(400).json({ error: "Un client (user) est obligatoire pour chaque commande." });
        }
        const { user, items, total, status, shippingAddress, paymentMethod } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) { return res.status(400).json({ error: "Les articles sont requis." }); }
        if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode || !shippingAddress.country) { return res.status(400).json({ error: "Adresse complète requise." }); }
        if (!total || typeof total !== 'number' || total <= 0) { return res.status(400).json({ error: "Total invalide." }); }
        if (user) { try { const userExists = await User.findById(user); if (!userExists) { return res.status(400).json({ error: "Utilisateur inexistant." }); } } catch (e) { return res.status(400).json({ error: "ID utilisateur invalide." }); } }

        const newOrderData = { user: user || null, items, total, status: status || "En attente", shippingAddress, paymentMethod: paymentMethod || 'Non spécifié', orderNumber: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}` };
        const newOrder = new Order(newOrderData);
        const savedOrder = await newOrder.save();

        if (user) { try { await User.findByIdAndUpdate(user, { $push: { orders: savedOrder._id }, $set: { cart: [] } }); } catch(e) { console.error("Erreur MAJ user:", e); } }

        try { for (const item of items) { if(item.product && item.quantity > 0) { await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } }); } } }
        catch (e) { console.error("Erreur MAJ stock:", e); }

        const populatedOrder = await Order.findById(savedOrder._id).populate('user', 'name email');
        return res.status(201).json(populatedOrder || savedOrder);
      } // Fin case POST

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ error: `Méthode ${req.method} non autorisée` });
    } // Fin switch

  } catch (error) {
    console.error("Erreur API commandes (catch global):", error);
    const errorMessage = process.env.NODE_ENV === 'production' ? "Erreur serveur interne." : error.message;
    return res.status(500).json({ error: "Erreur serveur", details: errorMessage });
  } // Fin try/catch global
} // Fin handler