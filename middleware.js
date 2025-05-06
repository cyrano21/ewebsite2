import { NextResponse } from 'next/server';

export function middleware(request) {
  const path = request.nextUrl.pathname;
  
  // Journaliser tous les types de requêtes
  if (path.startsWith('/api')) {
    console.log(`API appelée: ${path}`);
  } else {
    console.log(`Requête vers: ${path}`);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Appliquer ce middleware à toutes les pages et APIs
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
