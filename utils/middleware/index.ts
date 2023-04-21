import { PayloadToken } from './../auth.util';
import type { NextApiRequest, NextApiResponse } from 'next';
import { AuthenticatedRequest } from '@/interfaces';

interface payloadData {
  id: number;
}

import jwt from 'jsonwebtoken';
export const checkAuth = async (req: AuthenticatedRequest, res: NextApiResponse, next: any) => {
  const secret = process.env.PRIVATE_KEY as string;
  const token = req.cookies.token as string;
  try {
    const data = jwt.verify(token, secret) as payloadData;
    req.authorId = data.id;
    next();
  } catch (error) {
    next(error);
  }
};

export const checkPermission = async (req: AuthenticatedRequest, res: NextApiResponse, next: any) => {
  const slug = req.query.slug;
  console.log('slug ::', slug);
  next();
};
