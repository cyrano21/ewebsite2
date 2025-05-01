import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from '../../../utils/dbConnect';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" }
      },
      async authorize(credentials) {
        await dbConnect();

        try {
          // Trouver l'utilisateur par email
          const user = await User.findOne({ email: credentials.email }).select('+password');
          if (!user) {
            throw new Error('Aucun utilisateur trouvé avec cet email');
          }

          // Vérifier le mot de passe
          const isMatch = await bcrypt.compare(credentials.password, user.password);
          if (!isMatch) {
            throw new Error('Mot de passe incorrect');
          }

          // Retourner les données de l'utilisateur (sans le mot de passe)
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role
          };
        } catch (error) {
          throw new Error(error.message || 'Échec de l\'authentification');
        }
      }
    })
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    }
  },
  pages: {
    // Ne pas spécifier de pages personnalisées pour l'instant pour éviter les redirections incorrectes
    // signIn: '/login',
    // signOut: '/',
    // error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 jours
  },
  secret: process.env.NEXTAUTH_SECRET || 'ce_secret_est_temporaire_et_doit_etre_change_en_production',
  debug: process.env.NODE_ENV === 'development',
});
