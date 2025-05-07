// Middleware Next.js pour gérer l'authentification et la journalisation
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

// Configurer les chemins qui ne nécessitent pas d'authentification
const publicPaths = [
  '/',
  '/login',
  '/sign-up',
  '/forgetpass',
  '/api/auth/signin',
  '/api/auth/signup',
  '/api/auth/signout',
  '/api/auth/session',
  '/api/auth/providers',
  '/api/auth/callback',
  '/shop',
  '/blog',
  '/about',
  '/contact',
  '/products',
];

// Vérifier si un chemin est public en comparant avec les chemins publics définis
const isPublic = (path) => {
  return publicPaths.find((p) => 
    path === p || 
    path.startsWith('/api/') || 
    path.startsWith('/shop/') ||
    path.startsWith('/_next/') ||
    path.startsWith('/assets/') ||
    path.startsWith('/images/') ||
    path.startsWith('/category/') ||
    path.endsWith('.jpg') ||
    path.endsWith('.png') ||
    path.endsWith('.svg') ||
    path.endsWith('.css') ||
    path.endsWith('.js') ||
    path.endsWith('.ico')
  );
};

// Middleware principal
export default async function middleware(req) {
  const path = req.nextUrl.pathname;

  try {
    // Récupérer le token d'authentification si disponible
    const token = await getToken({ 
      req, 
      secret: process.env.NEXTAUTH_SECRET 
    });

    // Journaliser les activités importantes
    if (path &&
        !path.startsWith('/_next/') && 
        !path.startsWith('/api/auth/') && 
        !path.endsWith('.jpg') && 
        !path.endsWith('.png') && 
        !path.endsWith('.ico')) {

        // Ici, nous nous contentons de logger les informations sans faire d'appel API
        // car les appels fetch dans le middleware Next.js peuvent être problématiques
        console.log(`[Activity] ${req.method} ${path} - User: ${token?.id || 'Anonymous'} (${token?.role || 'visitor'})`);

        // Les logs sont collectés via l'analytics client-side
        // voir utils/client-analytics.js pour l'implémentation complète
      }
  } catch (error) {
    // Ne pas bloquer le processus en cas d'erreur de journalisation
    console.error('Erreur dans le middleware de journalisation:', error);
  }

  // Vérifier si l'accès aux routes admin est autorisé
  if (path.startsWith('/admin')) {
    // Si l'utilisateur n'est pas connecté ou n'a pas le rôle admin
    if (!token || token.role !== 'admin') {
      // Rediriger vers la page de connexion
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  // Vérifier si l'accès aux routes vendeur est autorisé
  if (path.startsWith('/seller')) {
    // Si l'utilisateur n'est pas connecté ou n'a pas le rôle seller
    if (!token || (token.role !== 'seller' && token.role !== 'admin')) {
      // Rediriger vers la page de connexion
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  // Continuer le traitement normal pour tous les autres cas
  return NextResponse.next();
}

// Configurer les chemins sur lesquels le middleware doit s'exécuter
export const config = {
  matcher: [
    /*
     * Correspond à tous les chemins sauf ceux commençant par:
     * - _next/static (fichiers statiques)
     * - _next/image (optimisation d'images)
     * - favicon.ico (icône du site)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};