import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicRoutes = ['/', '/login', '/register', '/verify-email'];

const protectedRoutes = ['/dashboard', '/profile'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const hasToken = request.cookies.get('refresh')?.value;
  
  if (publicRoutes.includes(pathname) && pathname !== '/' && hasToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  if (protectedRoutes.some(route => pathname.startsWith(route)) && !hasToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};