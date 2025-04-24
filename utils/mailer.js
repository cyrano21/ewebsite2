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
