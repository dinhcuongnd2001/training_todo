import nc from 'next-connect';
import type { NextApiRequest, NextApiResponse } from 'next';
import { AuthenticatedRequest, Todo } from '@/interfaces';
import { PrismaClient } from '@prisma/client';
import { checkAuth } from '@/utils/middleware';
import { PayloadToken } from '@/utils/auth.util';
const prisma = new PrismaClient();

const findTodo = async (name: string, authorId: number) => {
  const todo = await prisma.todo.findUnique({
    where: {
      name,
    },
  });
  if (todo?.authorId == authorId) return todo;
  return;
};

const handler = nc<NextApiRequest, NextApiResponse>({
  onError: (err, req, res, next) => {
    res.status(500).end('Something broke!');
  },
  onNoMatch: (req, res) => {
    res.status(404).end('Page is not found');
  },
});

handler.get(checkAuth, async (req: AuthenticatedRequest, res: NextApiResponse<Todo | {}>, next) => {
  const authortId = Number(req.authorId);
  const nameTodo = String(req.query.slug);
  const result = await findTodo(nameTodo, authortId);
  // console.log('result ::', result);
  result ? res.status(200).json(result) : res.status(401).json({ message: 'permission denied' });
});

export default handler;
