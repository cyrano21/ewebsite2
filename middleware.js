import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Middleware function
export async function middleware(req) {
  const path = req.nextUrl.pathname

  // Définir quelles routes sont publiques (accessibles sans authentification)
  const publicPaths = [
    '/',
    '/login',
    '/sign-up',
    '/forgetpass',
    '/reset-password',
    '/api/auth/signin',
    '/api/auth/signup',
    '/api/auth/forgetpass',
    '/api/auth/reset-password',
    '/about',
    '/contact',
    '/shop',
    '/blog',
  ]

  // Vérifier si la route actuelle est une route publique ou commence par /shop/, /api/, /assets/, /blog/
  const isPublicPath = publicPaths.includes(path) || 
                       path.startsWith('/shop/') || 
                       path.startsWith('/api/') || 
                       path.startsWith('/assets/') || 
                       path.startsWith('/_next/') || 
                       path.startsWith('/blog/') ||
                       path.endsWith('.png') || 
                       path.endsWith('.jpg') || 
                       path.endsWith('.jpeg') || 
                       path.endsWith('.svg') || 
                       path.endsWith('.css') || 
                       path.endsWith('.js')

  // Récupérer le token (session)
  const token = await getToken({ req })
  const isAuthenticated = !!token

  // Enregistrer l'activité pour l'analyse (appeler une API interne)
  try {
    // Ne pas bloquer le middleware avec cette opération
    // Journaliser l'activité de manière asynchrone
    if (!path.startsWith('/_next/') && !path.includes('/api/admin/activity')) {
      const logData = {
        url: path,
        method: req.method,
        userAgent: req.headers.get('user-agent') || 'Unknown',
        referrer: req.headers.get('referer') || '',
        userId: token?.id || null,
        userType: token?.role || 'visitor',
        userName: token?.name || 'Anonymous'
      };

      // Faire une requête asynchrone à l'API d'activité
      fetch(`${req.nextUrl.origin}/api/admin/activity-log`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logData),
      }).catch(err => {
        // Ignorer les erreurs de journalisation pour ne pas bloquer l'utilisateur
        console.error('Erreur de journalisation:', err);
      });
    }
  } catch (error) {
    // Ne pas bloquer le processus en cas d'erreur de journalisation
    console.error('Erreur dans le middleware de journalisation:', error);
  }

  // 1. Routes à accès restreint : rediriger si l'utilisateur n'est pas authentifié
  if (!isPublicPath && !isAuthenticated) {
    return NextResponse.redirect(new URL(`/login?callbackUrl=${encodeURIComponent(path)}`, req.url))
  }

  // 2. Routes admin : vérifier si l'utilisateur est administrateur
  if (path.startsWith('/admin') && (!isAuthenticated || token.role !== 'admin')) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  // 3. Routes vendeur : vérifier si l'utilisateur est vendeur
  if (path.startsWith('/seller') && 
      (!isAuthenticated || (token.role !== 'seller' && token.role !== 'admin'))) {
    return NextResponse.redirect(new URL('/become-seller', req.url))
  }

  // Continuer si tout est en ordre
  return NextResponse.next()
}

// Configurer les routes sur lesquelles le middleware doit s'exécuter
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api/auth/* (authentication routes)
     * 2. /_next/* (Next.js internals)
     * 3. /static/* (static files)
     * 4. /favicon.ico, /sitemap.xml (common system files)
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml).*)',
  ],
}