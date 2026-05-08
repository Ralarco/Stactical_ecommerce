import { NextResponse, type NextRequest } from 'next/server';

/**
 * Root middleware — handles auth + RBAC.
 * Spec: Section 15 — role-based access control.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protected routes that require authentication
  const protectedPaths = ['/dashboard', '/orders', '/profile', '/addresses'];
  const adminPaths = ['/admin'];

  const isProtected = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );
  const isAdmin = adminPaths.some((path) =>
    pathname.startsWith(path)
  );

  // TODO: Validate session via BetterAuth
  // const session = await validateSession(request);

  if (isProtected || isAdmin) {
    // TODO: Check authentication and redirect if needed
    // if (!session) return NextResponse.redirect(new URL('/login', request.url));
    // if (isAdmin && session.role !== 'ADMIN') return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/health).*)',
  ],
};
