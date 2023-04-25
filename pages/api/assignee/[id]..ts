import nc, { NextHandler } from 'next-connect';
import type { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse, Assignee, AuthenticatedRequest, CreateTodoRequest, Todo } from '@/interfaces';
import { PrismaClient, TodoStatus } from '@prisma/client';
const prisma = new PrismaClient();

interface DetailAssigneeRequest extends NextApiRequest {
  body: {
    id: number;
  };
}
const handler = nc<NextApiRequest, NextApiResponse>({
  onError: (err, req, res, next) => {
    const { message } = err;
    message ? res.status(401).end(message) : res.status(500).end('something broken');
  },
  onNoMatch: (req, res) => {
    res.status(404).end('Page is not found');
  },
});

handler.get(async (res: DetailAssigneeRequest, req: NextApiResponse, next) => {
  try {
    const result = prisma.assignee_Todo.findMany({
      where: {
        todoId: res.body.id,
      },
    });
  } catch (error) {}
});

export default handler;
