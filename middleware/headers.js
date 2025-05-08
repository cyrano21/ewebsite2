import { NextResponse } from 'next/server';

export function middleware(request) {
  // Clone the request headers
  const requestHeaders = new Headers(request.headers);
  
  // Récupérer la réponse
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Ajouter les en-têtes de sécurité pour permettre le chargement correct des styles
  response.headers.set('Content-Security-Policy', 
    "default-src 'self'; " +
    "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
    "img-src 'self' data: https: http:; " +
    "font-src 'self' https://cdn.jsdelivr.net; " + 
    "connect-src 'self' https://*.vercel.app"
  );
  
  // Ajouter d'autres en-têtes utiles
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  return response;
}

// Définir sur quels chemins s'applique ce middleware
export const config = {
  matcher: [
    // Appliquer à toutes les pages sauf les ressources statiques et les API
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
import { NextResponse } from 'next/server';

export function middleware(request) {
  // Clone the request headers
  const requestHeaders = new Headers(request.headers);
  
  // Récupérer la réponse
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Ajouter les en-têtes de sécurité pour permettre le chargement correct des styles
  response.headers.set('Content-Security-Policy', 
    "default-src 'self'; " +
    "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
    "img-src 'self' data: https: http:; " +
    "font-src 'self' https://cdn.jsdelivr.net; " + 
    "connect-src 'self' https://*.vercel.app https://extensions.aitopia.ai"
  );
  
  // Ajouter d'autres en-têtes utiles
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  return response;
}

// Définir sur quels chemins s'applique ce middleware
export const config = {
  matcher: [
    // Appliquer à toutes les pages sauf les ressources statiques et les API
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
