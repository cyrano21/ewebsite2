// Fichier: pages/api/create-checkout-session.js
import Stripe from "stripe";

// Vérifier et afficher la clé Stripe (en masquant la partie privée)
const stripeKey = process.env.STRIPE_SECRET_KEY;
console.log(
  "Clé Stripe utilisée:",
  stripeKey
    ? `${stripeKey.substring(0, 7)}...${stripeKey.substring(
        stripeKey.length - 4
      )}`
    : "MANQUANTE"
);

// Initialiser Stripe avec gestion d'erreur
let stripe;
try {
  stripe = new Stripe(stripeKey);
  console.log("Stripe initialisé avec succès");
} catch (error) {
  console.error("Erreur lors de l'initialisation de Stripe:", error);
  stripe = null;
}

// Fonction pour nettoyer et vérifier les URLs d'images
const getValidImageUrl = (imgUrl) => {
  if (!imgUrl) return null;

  // Si c'est déjà une URL absolue https, on la retourne
  if (imgUrl.startsWith("https://")) {
    return imgUrl;
  }

  // Si c'est une URL data, on la retourne
  if (imgUrl.startsWith("data:image")) {
    return null; // Stripe n'accepte pas les data URLs
  }

  // Si c'est un chemin relatif, on ignore
  if (imgUrl.startsWith("/")) {
    return null;
  }

  return null; // Par défaut, retourner null si l'URL n'est pas valide
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Méthode non autorisée" });
  }

  // Vérifier si Stripe a été correctement initialisé
  if (!stripe) {
    console.error("Stripe n'a pas été initialisé correctement");
    return res.status(500).json({
      message: "Configuration Stripe incorrecte",
      error: "Impossible d'initialiser Stripe. Vérifiez la clé API.",
    });
  }

  try {
    // Journaliser les données de la requête pour le débogage
    console.log("Corps de la requête:", JSON.stringify(req.body, null, 2));

    const { items, orderId, customerEmail } = req.body;

    // Vérification de base des données
    if (!items || !items.length) {
      return res.status(400).json({ message: "Panier vide ou invalide" });
    }

    // Vérifier que les items ont une structure valide
    const hasValidItems = items.every(
      (item) =>
        item &&
        typeof item === "object" &&
        item.price !== undefined &&
        !isNaN(parseFloat(item.price)) &&
        item.quantity !== undefined &&
        !isNaN(parseInt(item.quantity))
    );

    if (!hasValidItems) {
      console.error("Structure d'items invalide:", items);
      return res.status(400).json({
        message: "Format d'articles invalide",
        details: "Certains articles ont un prix ou une quantité invalide",
      });
    }

    // Formater les items pour Stripe avec validation des données
    const lineItems = items.map((item) => {
      // Vérification et conversion des champs requis
      const name = item.name || "Produit sans nom";
      const price = parseFloat(item.price) || 0;
      const quantity = parseInt(item.quantity) || 1;

      // Renvoyer l'erreur si le prix est égal à 0
      if (price <= 0) {
        throw new Error(`Prix invalide pour l'article "${name}": ${price}`);
      }

      // Obtenir une URL d'image valide si disponible
      let images = [];
      if (item.img && item.img.startsWith("https://")) {
        images = [item.img];
      }

      return {
        price_data: {
          currency: "eur",
          product_data: {
            name: name,
            images: images,
            description: item.description || "",
            metadata: {
              id: item.id || `id-${Date.now()}`,
            },
          },
          unit_amount: Math.round(price * 100), // Conversion en centimes
        },
        quantity: quantity,
      };
    });

    console.log("LineItems préparés:", JSON.stringify(lineItems, null, 2));

    // Vérifier les URLs
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    console.log("URL de base:", baseUrl);

    // Paramètres de session simplifiés
    const sessionParams = {
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/panier`,
      locale: "fr",
    };

    // Ajouter l'email client si disponible
    if (customerEmail) {
      sessionParams.customer_email = customerEmail;
    }

    // Ajouter les métadonnées pour l'ID de commande
    if (orderId) {
      sessionParams.metadata = {
        orderId: orderId,
      };
    }

    console.log(
      "Paramètres de session:",
      JSON.stringify(sessionParams, null, 2)
    );

    // Créer une session de checkout Stripe avec des paramètres simplifiés
    try {
      const session = await stripe.checkout.sessions.create(sessionParams);
      console.log("Session Stripe créée avec succès:", session.id);

      return res.status(200).json({ id: session.id, url: session.url });
    } catch (stripeError) {
      console.error("Erreur Stripe spécifique:", stripeError);
      return res.status(500).json({
        message: "Erreur lors de la création de la session Stripe",
        error: stripeError.message,
        code: stripeError.code || "unknown",
      });
    }
  } catch (error) {
    console.error("Erreur détaillée:", error);

    // Réponse d'erreur plus détaillée
    return res.status(500).json({
      message: "Erreur lors de la création de la session de checkout",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
}
