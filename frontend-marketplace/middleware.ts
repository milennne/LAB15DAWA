import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const user = request.cookies.get('user')?.value;
  const { pathname } = request.nextUrl;

  const publicRoutes = ['/login', '/register'];

  if (publicRoutes.includes(pathname)) {
    if (token) return NextResponse.redirect(new URL('/', request.url));
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (pathname.startsWith('/admin')) {
    const userData = user ? JSON.parse(user) : null;
    if (!userData || userData.rol !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/admin', '/products/:path*', '/login', '/register'],
};