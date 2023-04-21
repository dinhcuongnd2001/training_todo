import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import { checkToken } from './utils/auth.util';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value as string;

  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', request.nextUrl.origin));
  }
  return NextResponse.next();
}
export const config = {
  matcher: ['/'],
};
