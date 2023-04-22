import { PayloadToken } from './../auth.util';
import type { NextApiRequest, NextApiResponse } from 'next';
import { AuthenticatedRequest, CreateTodoRequest } from '@/interfaces';
import { PrismaClient, TodoStatus } from '@prisma/client';
import jwt from 'jsonwebtoken';
interface payloadData {
  id: number;
}
const prisma = new PrismaClient();

export const checkAuth = async (req: AuthenticatedRequest, res: NextApiResponse, next: any) => {
  const secret = process.env.PRIVATE_KEY as string;
  const token = req.cookies.token as string;
  try {
    const data = jwt.verify(token, secret) as payloadData;
    req.authorId = data.id;
    next();
  } catch (error) {
    next({ message: 'token expired' });
  }
};

export const checkUnique = async (req: CreateTodoRequest, res: NextApiResponse, next: any) => {
  const data = req.body;
  const todo = await prisma.todo.findUnique({
    where: {
      name: data.name,
    },
  });
  if (todo) throw new Error('Todo Name has been existen');
  next();
};
