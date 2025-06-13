// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  exp: number; // Expiration time (Epoch time)
}

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;

  console.log('Auth Token:', authToken ? 'Present' : 'Not Present', 'Path:', pathname);

  let tokenExpired = false;

  if (authToken) {
    try {
      const decoded: DecodedToken = jwtDecode(authToken);
      // Token expiration time (in seconds from Epoch)
      const expirationTime = decoded.exp;
      // Current time (in seconds from Epoch)
      const currentTime = Math.floor(Date.now() / 1000);

      if (expirationTime < currentTime) {
        tokenExpired = true;
        console.log('Auth Token has expired.');
      }
    } catch (error) {
      console.error('Error decoding token or invalid token:', error);
      tokenExpired = true; // Treat the token as invalid or expired
    }
  }

  // --- Redirect logic ---
  if ((authToken && tokenExpired) || (authToken && !tokenExpired && (pathname === '/login' || pathname === '/register'))) {
    console.log('Redirecting to dashboard (or login if token expired)');
    // If the token has expired, redirect to login
    if (tokenExpired) {
        console.log('Token expired, redirecting to login from middleware.');
        // Delete expired token cookie if present
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('auth_token'); // Delete expired token
        return response;
    }
    console.log('Token valid, redirecting from login/register to dashboard.');
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  if (!authToken && pathname !== '/login' && pathname !== '/register') {
    console.log('No token, redirecting to login from middleware.');
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};