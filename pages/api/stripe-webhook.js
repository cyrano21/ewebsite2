// Fichier: pages/api/stripe-webhook.js
import Stripe from 'stripe';
import { buffer } from 'micro';

// Désactiver le parsing du body par Next.js pour les webhooks
export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  let event;
  const rawBody = await buffer(req);
  const signature = req.headers['stripe-signature'];

  try {
    // Vérifier la signature du webhook
    event = stripe.webhooks.constructEvent(
      rawBody.toString(),
      signature,
      webhookSecret
    );
  } catch (err) {
    console.error(`Erreur de signature webhook: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Traiter les différents types d'événements
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log(`PaymentIntent pour ${paymentIntent.amount} a été complété!`);
      
      // Mettre à jour le statut de la commande en base de données
      try {
        await updateOrderStatus(paymentIntent.metadata.orderId, 'paid');
      } catch (error) {
        console.error('Erreur lors de la mise à jour du statut de la commande:', error);
      }
      break;

    case 'payment_intent.payment_failed':
      const failedPaymentIntent = event.data.object;
      console.log(`Paiement échoué pour ${failedPaymentIntent.metadata.orderId}`);
      
      // Mettre à jour le statut de la commande en base de données
      try {
        await updateOrderStatus(failedPaymentIntent.metadata.orderId, 'payment_failed');
      } catch (error) {
        console.error('Erreur lors de la mise à jour du statut de la commande:', error);
      }
      break;

    // Vous pouvez ajouter d'autres cas selon vos besoins
    
    default:
      console.log(`Type d'événement non géré: ${event.type}`);
  }

  // Renvoyer une réponse 200 pour confirmer la réception
  res.status(200).json({ received: true });
}

// Fonction pour mettre à jour le statut de la commande
async function updateOrderStatus(orderId, status) {
  try {
    // Vérifier si l'orderId est valide
    if (!orderId || orderId === 'cart_order') {
      console.log('ID de commande invalide ou temporaire, aucune mise à jour nécessaire');
      return;
    }

    // Appeler l'API pour mettre à jour le statut de la commande
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    console.log(`Statut de la commande ${orderId} mis à jour: ${status}`);
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du statut de la commande: ${error.message}`);
    // Ne pas relancer l'erreur pour éviter de casser le webhook
  }
}