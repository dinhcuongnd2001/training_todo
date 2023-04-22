import nc from 'next-connect';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Todo } from '@/interfaces';
import { PrismaClient } from '@prisma/client';
import { checkAuth } from '@/utils/middleware';
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
  onError: (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).end('Something broke!');
  },
  onNoMatch: (req, res) => {
    res.status(404).end('Page is not found');
  },
});

handler.put(checkAuth, async (req: TodoChangeRequest, res: NextApiResponse<Todo>, next) => {
  const id = Number(req.query.id);
  const newTodo = await handleUpdate(id, req.body);
  res.status(200).json(newTodo);
});

handler.delete(checkAuth, async (req, res: NextApiResponse<Todo>, next) => {
  const id = Number(req.query.id);
  const result = await handleRemove(id);
  res.status(200).json(result);
});

export default handler;
