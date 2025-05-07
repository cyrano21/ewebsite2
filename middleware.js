// middleware.js - Gestion centralisée des middlewares de l'application
import { NextResponse } from 'next/server';

// Vérifier si l'environnement est de développement
const isDev = process.env.NODE_ENV === 'development';

export function middleware(request) {
  // Extraire le chemin de la requête
  const { pathname } = request.nextUrl;
  
  // En développement, ignorer les requêtes liées au hot reload pour ne pas perturber Fast Refresh
  if (isDev && (
    pathname.includes('/_next/webpack-hmr') || 
    pathname.includes('/_next/static/webpack') || 
    pathname.endsWith('.hot-update.json') ||
    pathname.endsWith('.hot-update.js')
  )) {
    return NextResponse.next();
  }
  
  // Ajouter des en-têtes de sécurité globaux
  const response = NextResponse.next();
  
  // Configuration des en-têtes de sécurité
  const securityHeaders = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  };
  
  // Ajouter les en-têtes de sécurité à toutes les réponses
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  // Optimiser la mise en cache pour les assets statiques
  if (
    pathname.includes('/_next/') || 
    pathname.includes('/assets/') || 
    pathname.startsWith('/images/') ||
    pathname.match(/\.(jpg|jpeg|png|gif|svg|ico|css|js)$/)
  ) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }
  
  // Optimiser les requêtes API
  if (pathname.startsWith('/api/')) {
    // Ajouter des en-têtes spécifiques aux API
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT');
    response.headers.set(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
    );
  }
  
  return response;
}

// Configuration mise à jour pour éviter les conflits avec Fast Refresh
export const config = {
  matcher: [
    // Ne pas appliquer le middleware aux requêtes webpack et HMR en développement
    '/((?!_next/static|_next/image|_next/webpack-hmr|favicon.ico|.*\\.hot-update\\.json|.*\\.hot-update\\.js).*)',
    '/api/:path*',
  ]
};
