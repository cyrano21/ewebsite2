import { NextResponse } from 'next/server';

export function middleware(request) {
  // Ajouter des logs pour identifier les problèmes
  console.log(`Requête vers: ${request.nextUrl.pathname}`);
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Appliquer ce middleware à toutes les pages
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
