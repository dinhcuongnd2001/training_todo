import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value as string;
  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  } else {
    console.log('call in else');
    try {
      console.log('call in try');
      console.log('token ::', token);
      const secret = process.env.PRIVATE_KEY as string;
      const check = await jwt.verify(token, '123456');
      console.log('check ::', check);
      return NextResponse.next();
    } catch (error) {
      console.log('call in catch with', error);
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }
}
export const config = {
  matcher: '/',
};
