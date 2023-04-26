import jwt from 'jsonwebtoken';
import { SignJWT, jwtVerify } from 'jose';
const secret = process.env.PRIVATE_KEY as string;

export interface PayloadToken {
  id: Number;
}

export const generationToken = (payload: PayloadToken) => {
  const token = jwt.sign(payload, secret, { expiresIn: '6h' });
  return token;
};
