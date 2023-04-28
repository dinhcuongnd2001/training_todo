import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.endsWith('/') || request.nextUrl.pathname.startsWith('/todo')) {
    const token = request.cookies.get('token')?.value as string;
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', request.nextUrl.origin));
    }
  }
  if (request.nextUrl.pathname.startsWith('/auth/login')) {
    const token = request.cookies.get('token')?.value as string;
    if (token) {
      return NextResponse.redirect(new URL('/', request.nextUrl.origin));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/todo/:path*', '/auth/login'],
};
