// Fichier: pages/api/verify-payment.js
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Méthode non autorisée" });
  }

  const { session_id } = req.query;

  if (!session_id) {
    return res.status(400).json({ message: "ID de session requis" });
  }

  try {
    // Récupérer la session depuis Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);

    // Vérifier le statut de paiement
    if (session.payment_status !== "paid") {
      return res.status(400).json({
        message: "Paiement non complété",
        status: session.payment_status,
      });
    }

    // Récupérer les métadonnées pour l'ID de commande
    const orderId = session.metadata.orderId;

    if (orderId === "cart_order") {
      // Si c'était un paiement direct depuis le panier sans orderId enregistré
      return res.status(200).json({
        success: true,
        paid: true,
        session: {
          id: session.id,
          amount_total: session.amount_total / 100, // Convertir de centimes à euros
          customer_email: session.customer_details?.email,
        },
      });
    }

    // Mettre à jour le statut de la commande en base de données
    try {
      // Remplacer cette partie avec votre propre logique pour récupérer la commande
      const orderResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "paid",
            paymentMethod: "stripe",
            paymentId: session.payment_intent,
            updatedAt: new Date().toISOString(),
          }),
        }
      );

      if (!orderResponse.ok) {
        throw new Error(
          "Erreur lors de la mise à jour du statut de la commande"
        );
      }

      // Récupérer les détails de la commande mise à jour
      const orderDetailsResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}`
      );
      const orderDetails = await orderDetailsResponse.json();

      return res.status(200).json({
        success: true,
        paid: true,
        order: orderDetails,
        session: {
          id: session.id,
          amount_total: session.amount_total / 100,
          customer_email: session.customer_details?.email,
        },
      });
    } catch (orderError) {
      console.error(
        "Erreur lors de la mise à jour de la commande:",
        orderError
      );

      // Même en cas d'erreur de mise à jour, on renvoie un succès car le paiement a été effectué
      return res.status(200).json({
        success: true,
        paid: true,
        order: { _id: orderId },
        error:
          "Impossible de récupérer les détails complets de la commande, mais le paiement a bien été reçu.",
        session: {
          id: session.id,
          amount_total: session.amount_total / 100,
          customer_email: session.customer_details?.email,
        },
      });
    }
  } catch (error) {
    console.error("Erreur lors de la vérification du paiement:", error);
    res.status(500).json({
      message: "Erreur lors de la vérification du paiement",
      error: error.message,
    });
  }
}
