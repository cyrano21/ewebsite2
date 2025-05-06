// pages/api/auth/[...nextauth].js
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from '../../../utils/dbConnect';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';

// Export des options pour réutilisation
export const authOptions = {
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
            throw new Error('Email ou mot de passe incorrect');
          }

          // Vérifier le mot de passe
          const isMatch = await bcrypt.compare(credentials.password, user.password);
          if (!isMatch) {
            throw new Error('Email ou mot de passe incorrect');
          }

          // Retourner les données de l'utilisateur
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
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.image = user.profileImage || null; // Utilise profileImage
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id,
          role: token.role,
          image: token.image // Utilise l'image mappée
        };
      }
      return session;
    }
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 jours
    updateAge: 24 * 60 * 60, // Revalidate session every 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET || 'ce_secret_est_temporaire',
  debug: process.env.NODE_ENV === 'development',
};

// Export par défaut pour NextAuth
export default NextAuth(authOptions);