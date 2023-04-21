import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value as string;
  // console.log('request header ::', request.headers);
  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', request.nextUrl.origin));
  }
  return NextResponse.next();
}
export const config = {
  matcher: ['/'],
};
