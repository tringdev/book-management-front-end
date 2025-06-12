// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('auth_token')?.value;

  // If accessing the dashboard page without a token, redirect to login
  if (request.nextUrl.pathname.startsWith('/dashboard') && !authToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// Apply middleware only to specific routes
export const config = {
  matcher: ['/dashboard/:path*', '/profile'],
};