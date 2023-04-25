import nc from 'next-connect';
import type { NextApiRequest, NextApiResponse } from 'next';
import { AuthenticatedRequest, CheckAssigneeRequest, Todo } from '@/interfaces';
import { PrismaClient } from '@prisma/client';
import { checkAssignee, checkAuth } from '@/utils/middleware';
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
    const { message, statusCode } = err;
    return message && statusCode ? res.status(statusCode).json(message) : res.status(500).json('Something broke!');
  },
  onNoMatch: (req, res) => {
    res.status(404).end('Page is not found');
  },
});

handler.get(checkAuth, checkAssignee, async (req: CheckAssigneeRequest, res: NextApiResponse<Todo | {}>, next) => {
  const todo = req.todo;
  res.status(200).json(todo);
});

export default handler;
