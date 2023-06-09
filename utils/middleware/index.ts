import { PayloadToken } from './../auth.util';
import type { NextApiRequest, NextApiResponse } from 'next';
import { AuthenticatedRequest, CheckAssigneeRequest, CreateTodoRequest } from '@/interfaces';
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
    return next({ message: 'token expired', statusCode: 401 });
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

export const checkPermission = async (req: AuthenticatedRequest, res: NextApiResponse, next: any) => {
  const id = Number(req.query.id);
  try {
    const todo = await prisma.todo.findUnique({
      where: {
        id: id,
      },
    });

    console.log('todo', todo);

    if (!todo || todo.authorId !== req.authorId) {
      return next({ message: 'Permission Denied', statusCode: 403 });
    }
    return next();
  } catch (error) {
    return next({ message: 'Not Found', statusCode: 400 });
  }
};

export const checkAssignee = async (req: CheckAssigneeRequest, res: NextApiResponse, next: any) => {
  const userId = req.authorId;
  const nameTodo = req.query.slug;
  try {
    const todo = await prisma.todo.findMany({
      where: {
        AND: [
          {
            name: nameTodo,
          },
          {
            OR: [{ authorId: userId }, { assignees_todo: { some: { userId: userId } } }],
          },
        ],
      },
    });
    if (!todo.length) return next({ message: 'permission denied', statusCode: '403' });
    req.todo = todo[0];
    next();
  } catch (err) {
    return next({ message: 'Something went wrong', statusCode: 500 });
  }
};
