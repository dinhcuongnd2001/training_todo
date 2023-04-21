import jwt from 'jsonwebtoken';
import { SignJWT, jwtVerify } from 'jose';
const secret = process.env.PRIVATE_KEY as string;

export const generationToken = (payload: { email: string }) => {
  const token = jwt.sign(payload, secret, { expiresIn: '1h' });
  return token;
};

export class AuthError extends Error {}

export const checkToken = async (token: string) => {
  try {
    const verified = await jwtVerify(token, new TextEncoder().encode(secret));
    return verified ? true : false;
  } catch (error) {
    throw new AuthError('Your token has expired.');
  }
};
