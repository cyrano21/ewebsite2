import nodemailer from 'nodemailer';

// Configure transporter using SMTP credentials from env
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Vérifie la connexion au serveur SMTP au démarrage
transporter.verify((error, success) => {
  if (error) console.error('SMTP transporter verify failed:', error);
  else console.log('SMTP transporter is ready');
});

// Fonction générique d'envoi d'email
export async function sendEmail(to, subject, text, html) {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM || 'no-reply@example.com',
      to,
      subject,
      text,
      html,
    };
    const info = await transporter.sendMail(mailOptions);
    console.log('Email envoyé avec succès:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    return { success: false, error: error.message };
  }
}

// Send password reset email
export async function sendPasswordResetEmail(to, resetUrl) {
  console.log('sendPasswordResetEmail to:', to, 'resetUrl:', resetUrl);
  const mailOptions = {
    from: process.env.SMTP_FROM || 'no-reply@example.com',
    to,
    subject: 'Réinitialisation de votre mot de passe',
    text: `Cliquez sur ce lien pour réinitialiser votre mot de passe : ${resetUrl}`,
    html: `<p>Cliquez sur ce lien pour réinitialiser votre mot de passe :</p><p><a href="${resetUrl}">${resetUrl}</a></p>`,
  };
  const info = await transporter.sendMail(mailOptions);
  console.log('sendMail info:', info);
  return info;
}

// Envoyer un email de notification au vendeur lors d'un changement de statut
export async function sendSellerStatusEmail(to, sellerName, status, message = '') {
  let subject, text, html;

  switch (status) {
    case 'approved':
      subject = 'Félicitations ! Votre compte vendeur a été approuvé';
      text = `Bonjour ${sellerName},\n\nNous sommes heureux de vous informer que votre demande de compte vendeur a été approuvée. Vous pouvez maintenant vous connecter à votre espace vendeur et commencer à ajouter vos produits.\n\n${message}`;
      html = `
        <h2>Félicitations !</h2>
        <p>Bonjour ${sellerName},</p>
        <p>Nous sommes heureux de vous informer que votre demande de compte vendeur a été approuvée.</p>
        <p>Vous pouvez maintenant vous connecter à votre espace vendeur et commencer à ajouter vos produits.</p>
        ${message ? `<p><strong>Message de l'administrateur :</strong> ${message}</p>` : ''}
        <p>Merci de votre confiance !</p>
      `;
      break;
    case 'rejected':
      subject = 'Votre demande de compte vendeur n\'a pas été approuvée';
      text = `Bonjour ${sellerName},\n\nNous regrettons de vous informer que votre demande de compte vendeur n'a pas été approuvée.\n\n${message ? `Motif du rejet : ${message}` : 'Pour plus d\'informations, n\'hésitez pas à nous contacter.'}`;
      html = `
        <h2>Demande non approuvée</h2>
        <p>Bonjour ${sellerName},</p>
        <p>Nous regrettons de vous informer que votre demande de compte vendeur n'a pas été approuvée.</p>
        ${message ? `<p><strong>Motif du rejet :</strong> ${message}</p>` : '<p>Pour plus d\'informations, n\'hésitez pas à nous contacter.</p>'}
      `;
      break;
    case 'suspended':
      subject = 'Votre compte vendeur a été suspendu';
      text = `Bonjour ${sellerName},\n\nNous vous informons que votre compte vendeur a été temporairement suspendu.\n\n${message ? `Motif de la suspension : ${message}` : 'Pour plus d\'informations ou pour contester cette décision, veuillez nous contacter.'}`;
      html = `
        <h2>Compte suspendu</h2>
        <p>Bonjour ${sellerName},</p>
        <p>Nous vous informons que votre compte vendeur a été temporairement suspendu.</p>
        ${message ? `<p><strong>Motif de la suspension :</strong> ${message}</p>` : '<p>Pour plus d\'informations ou pour contester cette décision, veuillez nous contacter.</p>'}
      `;
      break;
    default:
      subject = 'Mise à jour de votre compte vendeur';
      text = `Bonjour ${sellerName},\n\nNous vous informons que le statut de votre compte vendeur a été mis à jour.\n\n${message}`;
      html = `
        <h2>Mise à jour de compte</h2>
        <p>Bonjour ${sellerName},</p>
        <p>Nous vous informons que le statut de votre compte vendeur a été mis à jour.</p>
        ${message ? `<p><strong>Message :</strong> ${message}</p>` : ''}
      `;
  }

  return await sendEmail(to, subject, text, html);
}
