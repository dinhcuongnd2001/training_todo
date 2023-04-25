import nc from 'next-connect';
import type { NextApiRequest, NextApiResponse } from 'next';
import { AuthenticatedRequest, Todo, DNC_Error } from '@/interfaces';
import { PrismaClient } from '@prisma/client';
import { checkAuth, checkPermission } from '@/utils/middleware';
const prisma = new PrismaClient();

const handleUpdate = async (idTodo: number, data: Todo) => {
  const newTodo = await prisma.todo.update({
    where: { id: idTodo },
    data: {
      ...data,
    },
  });
  return newTodo;
};

const handleRemove = async (id: number) => {
  const res = await prisma.todo.delete({
    where: {
      id: id,
    },
  });
  return res;
};

interface TodoChangeRequest extends NextApiRequest {
  body: Todo;
}

const handler = nc<NextApiRequest, NextApiResponse>({
  onError: (err: DNC_Error, req, res, next) => {
    const { message, statusCode } = err;
    return message && statusCode ? res.status(statusCode).json(message) : res.status(500).json('Something broken');
  },
  onNoMatch: (req, res) => {
    return res.status(404).end('Page is not found');
  },
});

handler.put(checkAuth, async (req: NextApiRequest, res: NextApiResponse<Todo>, next) => {
  const id = Number(req.query.id);
  const newTodo = await handleUpdate(id, req.body);
  res.status(200).json(newTodo);
});

handler.delete(checkAuth, checkPermission, async (req: AuthenticatedRequest, res: NextApiResponse, next) => {
  const id = Number(req.query.id);
  const data = await handleRemove(id);
  if (data) res.status(200).json({ message: 'success' });
  else res.status(409).json({ message: 'Error' });
});

export default handler;
