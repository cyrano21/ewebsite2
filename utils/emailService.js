import nodemailer from 'nodemailer';

// Configuration du transporteur d'email
const getEmailTransporter = () => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    }
  });
  
  return transporter;
};

// Envoyer un email de notification pour un nouvel avis
export const sendReviewNotificationEmail = async (review, product) => {
  try {
    const transporter = getEmailTransporter();
    const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
    
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || `"Notifications E-Commerce" <${process.env.SMTP_USER}>`,
      to: adminEmail,
      subject: '✅ Nouvel avis en attente de validation',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px;">Nouvel avis en attente de validation</h2>
          
          <div style="background-color: #f9f9f9; padding: 15px; margin: 15px 0; border-radius: 4px;">
            <p><strong>Produit :</strong> ${product.name}</p>
            <p><strong>Note :</strong> 
              <span style="color: ${
                review.rating >= 4 ? '#28a745' : 
                review.rating >= 3 ? '#ffc107' : '#dc3545'
              };">
                ${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}
              </span>
              (${review.rating}/5)
            </p>
            <p><strong>Commentaire :</strong> ${review.comment}</p>
            <p><strong>Client :</strong> ${review.user?.name || 'Client anonyme'}</p>
            <p><strong>Date :</strong> ${new Date(review.date).toLocaleString('fr-FR')}</p>
          </div>
          
          <div style="margin-top: 20px; text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/reviews?productId=${product._id}&reviewId=${review._id}" 
              style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
              Valider cet avis
            </a>
          </div>
          
          <p style="margin-top: 20px; font-size: 12px; color: #666; text-align: center;">
            Cet email a été envoyé automatiquement depuis votre site e-commerce. Veuillez ne pas répondre à cet email.
          </p>
        </div>
      `
    });
    
    console.log('Email de notification d\'avis envoyé avec succès:', info.messageId);
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email de notification:', error);
    return false;
  }
};

export default {
  sendReviewNotificationEmail
};