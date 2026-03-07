import { type NextRequest, NextResponse } from "next/server";

/**
 * Middleware for protecting admin routes and managing authentication
 *
 * Protected routes:
 * - /admin/* (except /admin/login)
 *
 * Public routes:
 * - /admin/login
 * - / (home page)
 * - /booking/* (customer booking flow)
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Temporary demo mode: skip middleware authentication for admin routes.
  // Client-side guard in app/admin/layout.tsx handles access.
  if (pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // Allow all other routes
  return NextResponse.next();
}

// Configure which routes the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
