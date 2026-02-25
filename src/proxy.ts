import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const response = NextResponse.next();
  const { pathname } = request.nextUrl;

  // Cache images aggressively (images are preloaded for faster loading)
  // Note: _next/image and _next/static are excluded from matcher, so they're handled by Next.js automatically
  if (
    pathname.match(/\.(jpg|jpeg|png|gif|webp|avif|svg|ico)$/i) ||
    pathname.startsWith('/tshirt/') ||
    pathname.startsWith('/logo/')
  ) {
    response.headers.set(
      'Cache-Control',
      'public, max-age=31536000, immutable'
    );
  }

  // Cache fonts
  if (pathname.match(/\.(woff|woff2|ttf|otf|eot)$/i)) {
    response.headers.set(
      'Cache-Control',
      'public, max-age=31536000, immutable'
    );
  }

  // Explicitly prevent caching of videos
  if (
    pathname.match(/\.(mp4|webm|mov)$/i) ||
    pathname.startsWith('/video/')
  ) {
    response.headers.set(
      'Cache-Control',
      'no-cache, no-store, must-revalidate'
    );
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files - handled by Next.js automatically)
     * - _next/image (image optimization files - handled by Next.js automatically)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
