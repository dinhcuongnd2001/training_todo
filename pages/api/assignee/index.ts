import nc, { NextHandler } from 'next-connect';
import type { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse, Assignee, AuthenticatedRequest, CreateTodoRequest, Todo } from '@/interfaces';
import { PrismaClient, TodoStatus } from '@prisma/client';
const prisma = new PrismaClient();

const createData = async (data: Assignee) => {
  const res = await prisma.assignee_Todo.create({
    data,
  });
  return res;
};

const deleteAssignee = async (userId: number, todoId: number) => {
  try {
    const res = await prisma.assignee_Todo.delete({
      where: {
        userId_todoId: {
          userId: userId,
          todoId: todoId,
        },
      },
    });
  } catch (err) {
    throw new Error('Error');
  }
};

interface AssgineeRequest extends NextApiRequest {
  body: Assignee;
  query: {
    todoId: string;
    userId: string;
  };
}

const handler = nc<NextApiRequest, NextApiResponse>({
  onError: (err, req, res, next) => {
    const { message } = err;
    message ? res.status(409).end(message) : res.status(500).end('something broken');
  },
  onNoMatch: (req, res) => {
    res.status(404).end('Page is not found');
  },
});

handler.post(async (req: AssgineeRequest, res: NextApiResponse, next) => {
  const newAssignee = await createData(req.body);
  res.status(201).json(newAssignee);
});

handler.delete(async (req: AssgineeRequest, res: NextApiResponse, next) => {
  const { todoId, userId } = req.query;
  await deleteAssignee(Number(userId), Number(todoId));
  res.status(200).json({ message: 'successfull' });
});

export default handler;
