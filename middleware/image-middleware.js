import { NextResponse } from 'next/server';
import { ImageResponse } from 'next/og';

// Configuration du middleware pour optimiser le chargement des images
export function middleware(request) {
  // Gestion des en-têtes pour les images
  if (request.nextUrl.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg|ico)$/)) {
    // Ajouter des en-têtes pour améliorer le cache des images
    const headers = new Headers(request.headers);
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    
    // Retourner la requête avec les en-têtes optimisés
    return NextResponse.next({
      request: {
        headers
      }
    });
  }
  
  // Pour toutes les autres requêtes, continuer normalement
  return NextResponse.next();
}

// Configuration pour indiquer sur quels chemins ce middleware doit s'appliquer
export const config = {
  matcher: [
    // S'applique à toutes les routes d'images dans /public
    '/assets/:path*',
    '/images/:path*',
    // S'applique aux images gérées par Next Image
    '/_next/image/:path*'
  ],
};